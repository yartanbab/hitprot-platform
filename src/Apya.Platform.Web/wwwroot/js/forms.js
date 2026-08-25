import { b as F, j as e, r as i } from "./react-vendor-D57GAUXd.js";
import { a as m } from "./httpClient-CRlyQ1eg.js";
import { H as A } from "./Hint-CNW95h3H.js";
/* empty css               */
const N = {
  0: { label: "Taslak", cls: "bg-neutral-100 text-neutral-700" },
  1: { label: "Yayında", cls: "bg-positive-100 text-positive-700" },
  2: { label: "Arşiv", cls: "bg-warning-100 text-warning-700" }
}, E = (a) => {
  try {
    return new Date(a).toLocaleDateString("tr-TR");
  } catch {
    return a;
  }
}, D = (a) => {
  var o, n;
  return (n = (o = window == null ? void 0 : window.abp) == null ? void 0 : o.auth) == null ? void 0 : n.isGranted(a);
}, S = (a, o) => (getComputedStyle(document.documentElement).getPropertyValue(a) || "").trim() || o, w = () => S("--apya-neutral-400", "#9CA3AF"), $ = () => S("--apya-accent-500", "#4F46E5");
function z() {
  const [a, o] = i.useState([]), [n, l] = i.useState(!0), [d, h] = i.useState([]), [c, b] = i.useState(""), [y, u] = i.useState(!1), g = D("Platform.DynamicAssets.ManageCategories"), p = async (r) => {
    l(!0);
    try {
      const t = new URLSearchParams({ MaxResultCount: "200", SkipCount: "0" });
      r && t.set("CategoryId", r);
      const s = await m.get(`/api/app/form?${t.toString()}`);
      o(s.items || []);
    } catch (t) {
      x("error", (t == null ? void 0 : t.message) || "Formlar yüklenemedi.");
    } finally {
      l(!1);
    }
  }, f = () => {
    m.get("/api/app/form-category?MaxResultCount=100").then((r) => h(r.items || [])).catch(() => {
    });
  };
  i.useEffect(() => {
    f();
  }, []), i.useEffect(() => {
    p(c);
  }, [c]);
  const j = (r) => d.find((t) => t.id === r), v = async (r) => {
    if (await B(r.title))
      try {
        await m.delete(`/api/app/form/${r.id}`), o((s) => s.filter((k) => k.id !== r.id)), x("success", "Form silindi.");
      } catch (s) {
        x("error", (s == null ? void 0 : s.message) || "Silme başarısız.");
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
          onClick: () => b(""),
          className: `rounded-full px-3 py-1.5 text-xs font-semibold transition ${c === "" ? "bg-accent text-white" : "bg-surface-sunken text-text-secondary hover:opacity-80"}`,
          children: "Tümü"
        }
      ),
      d.map((r) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: () => b(r.id),
          className: `rounded-full px-3 py-1.5 text-xs font-semibold transition ${c === r.id ? "text-white" : "text-text-secondary hover:opacity-80"}`,
          style: c === r.id ? { backgroundColor: r.color || $() } : { backgroundColor: `${r.color || w()}20` },
          children: [
            r.icon ? `${r.icon} ` : "",
            r.name
          ]
        },
        r.id
      )),
      g && /* @__PURE__ */ e.jsx("button", { onClick: () => u(!0), className: "ml-1 rounded-full border border-dashed border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-strong hover:text-text-primary", children: "⚙ Kategoriler" })
    ] }),
    n ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Formlar yükleniyor…" }) : a.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border-2 border-dashed border-default py-20 text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-3xl", children: "📝" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-bold text-text-primary", children: c ? "Bu kategoride form yok" : "Henüz formun yok" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-tertiary", children: c ? "Başka bir kategori seç veya yeni form oluştur." : "İlk formunu oluşturmak için başla." }),
      /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "mt-4 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600", children: "+ Yeni Form Oluştur" })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", children: a.map((r) => {
      var s, k;
      const t = r.categoryId ? j(r.categoryId) : null;
      return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-default bg-surface-raised p-5 transition hover:shadow-md", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "mb-2 flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("h3", { className: "line-clamp-2 font-bold text-text-primary", children: r.title }),
          /* @__PURE__ */ e.jsx("span", { className: `shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${(s = N[r.status]) == null ? void 0 : s.cls}`, children: (k = N[r.status]) == null ? void 0 : k.label })
        ] }),
        t && /* @__PURE__ */ e.jsxs("span", { className: "mb-2 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", style: { backgroundColor: `${t.color || w()}20`, color: t.color || "var(--apya-text-secondary)" }, children: [
          t.icon ? `${t.icon} ` : "",
          t.name
        ] }),
        r.description && /* @__PURE__ */ e.jsx("p", { className: "mb-3 line-clamp-2 text-sm text-text-secondary", children: r.description }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-auto flex items-center gap-3 border-t border-subtle pt-3 text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsxs("span", { className: "whitespace-nowrap", children: [
            "📊 ",
            r.responseCount,
            " yanıt"
          ] }),
          /* @__PURE__ */ e.jsxs("span", { className: "whitespace-nowrap", children: [
            "👁 ",
            r.viewCount
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "ml-auto whitespace-nowrap", children: E(r.creationTime) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Builder?id=${r.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-default px-3 py-1.5 text-center text-xs font-semibold text-text-secondary hover:bg-surface-sunken", children: "Düzenle" }),
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${r.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-default px-3 py-1.5 text-center text-xs font-semibold text-text-secondary hover:bg-surface-sunken", children: "Yanıtlar" }),
          r.status === 1 && /* @__PURE__ */ e.jsx("a", { href: `/f/${r.slug}`, target: "_blank", rel: "noreferrer", className: "shrink-0 rounded-lg border border-default px-2.5 py-1.5 text-xs hover:bg-surface-sunken", title: "Formu aç", children: "↗" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => v(r), className: "shrink-0 rounded-lg border border-negative-100 px-2.5 py-1.5 text-xs text-negative-500 hover:bg-negative-50", children: "🗑" }),
          /* @__PURE__ */ e.jsx(A, { placement: "left", text: "Formu siler ama mevcut yanıtları SİLMEZ — yanıtlar veritabanında kalır, sahipsiz kalır ve bir daha hiçbir ekrandan erişilemez." })
        ] })
      ] }, r.id);
    }) }),
    y && /* @__PURE__ */ e.jsx(
      L,
      {
        categories: d,
        onClose: () => u(!1),
        onChanged: f
      }
    )
  ] });
}
function L({ categories: a, onClose: o, onChanged: n }) {
  const [l, d] = i.useState(""), [h, c] = i.useState($()), [b, y] = i.useState(!1), [u, g] = i.useState(null), [p, f] = i.useState(""), j = async () => {
    if (l.trim()) {
      y(!0);
      try {
        await m.post("/api/app/form-category", { name: l.trim(), color: h, icon: null, order: a.length }), d(""), n();
      } catch (t) {
        x("error", (t == null ? void 0 : t.message) || "Kategori eklenemedi.");
      } finally {
        y(!1);
      }
    }
  }, v = async (t) => {
    if (p.trim())
      try {
        await m.put(`/api/app/form-category/${t.id}`, { name: p.trim(), color: t.color, icon: t.icon, order: t.order }), g(null), n();
      } catch (s) {
        x("error", (s == null ? void 0 : s.message) || "Güncellenemedi.");
      }
  }, r = async (t) => {
    if (window.confirm(`"${t.name}" kategorisini silmek istediğinize emin misiniz?`))
      try {
        await m.delete(`/api/app/form-category/${t.id}`), n();
      } catch (s) {
        x("error", (s == null ? void 0 : s.message) || "Silinemedi.");
      }
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: o, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl border border-default bg-surface-elevated p-6 shadow-xl", onClick: (t) => t.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Kategoriler" }),
      /* @__PURE__ */ e.jsx("button", { onClick: o, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex max-h-64 flex-col gap-2 overflow-y-auto", children: [
      a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz kategori yok." }),
      a.map((t) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-subtle px-3 py-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-3 w-3 shrink-0 rounded-full", style: { backgroundColor: t.color || w() } }),
        u === t.id ? /* @__PURE__ */ e.jsx("input", { autoFocus: !0, value: p, onChange: (s) => f(s.target.value), onKeyDown: (s) => s.key === "Enter" && v(t), className: "min-w-0 flex-1 rounded border border-default bg-surface-base px-2 py-1 text-sm text-text-primary" }) : /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate text-sm font-medium text-text-secondary", children: t.name }),
        u === t.id ? /* @__PURE__ */ e.jsx("button", { onClick: () => v(t), className: "shrink-0 text-xs font-semibold text-accent hover:text-accent-600", children: "Kaydet" }) : /* @__PURE__ */ e.jsx("button", { onClick: () => {
          g(t.id), f(t.name);
        }, className: "shrink-0 text-xs text-text-tertiary hover:text-text-primary", children: "Düzenle" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => r(t), className: "shrink-0 text-xs text-negative hover:opacity-80", children: "Sil" })
      ] }, t.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center gap-2 border-t border-subtle pt-4", children: [
      /* @__PURE__ */ e.jsx("input", { type: "color", value: h, onChange: (t) => c(t.target.value), className: "h-9 w-9 shrink-0 cursor-pointer rounded border border-default" }),
      /* @__PURE__ */ e.jsx("input", { value: l, onChange: (t) => d(t.target.value), onKeyDown: (t) => t.key === "Enter" && j(), placeholder: "Yeni kategori adı…", className: "min-w-0 flex-1 rounded-lg border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus:border-border-focus focus:outline-none" }),
      /* @__PURE__ */ e.jsx("button", { onClick: j, disabled: b || !l.trim(), className: "shrink-0 rounded-lg bg-accent px-3 py-2 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: "Ekle" })
    ] })
  ] }) });
}
function x(a, o) {
  const n = window.abp;
  n != null && n.notify && a === "success" ? n.notify.success(o) : n != null && n.message ? n.message[a === "error" ? "error" : "info"](o) : console.log(`[${a}] ${o}`);
}
function B(a) {
  var n;
  const o = window.abp;
  return (n = o == null ? void 0 : o.message) != null && n.confirm ? new Promise((l) => {
    o.message.confirm(`"${a}" formunu silmek istediğinize emin misiniz?`, "Onay", (d) => l(!!d));
  }) : Promise.resolve(window.confirm(`"${a}" formunu sil?`));
}
const C = document.getElementById("forms-list-root");
C && F(C).render(/* @__PURE__ */ e.jsx(z, {}));
