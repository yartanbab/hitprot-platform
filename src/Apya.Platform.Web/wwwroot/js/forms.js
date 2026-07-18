import { c as C, j as e, r as n } from "./vendor.js";
import { a as m } from "./vendor2.js";
const k = {
  0: { label: "Taslak", cls: "bg-slate-100 text-slate-600" },
  1: { label: "Yayında", cls: "bg-emerald-100 text-emerald-700" },
  2: { label: "Arşiv", cls: "bg-amber-100 text-amber-700" }
}, S = (o) => {
  try {
    return new Date(o).toLocaleDateString("tr-TR");
  } catch {
    return o;
  }
}, $ = (o) => {
  var l, a;
  return (a = (l = window == null ? void 0 : window.abp) == null ? void 0 : l.auth) == null ? void 0 : a.isGranted(o);
};
function D() {
  const [o, l] = n.useState([]), [a, i] = n.useState(!0), [c, p] = n.useState([]), [d, b] = n.useState(""), [f, u] = n.useState(!1), y = $("Platform.DynamicAssets.ManageCategories"), h = async (s) => {
    i(!0);
    try {
      const t = new URLSearchParams({ MaxResultCount: "200", SkipCount: "0" });
      s && t.set("CategoryId", s);
      const r = await m.get(`/api/app/form?${t.toString()}`);
      l(r.items || []);
    } catch (t) {
      x("error", (t == null ? void 0 : t.message) || "Formlar yüklenemedi.");
    } finally {
      i(!1);
    }
  }, g = () => {
    m.get("/api/app/form-category?MaxResultCount=100").then((s) => p(s.items || [])).catch(() => {
    });
  };
  n.useEffect(() => {
    g();
  }, []), n.useEffect(() => {
    h(d);
  }, [d]);
  const j = (s) => c.find((t) => t.id === s), w = async (s) => {
    if (await z(s.title))
      try {
        await m.delete(`/api/app/form/${s.id}`), l((r) => r.filter((N) => N.id !== s.id)), x("success", "Form silindi.");
      } catch (r) {
        x("error", (r == null ? void 0 : r.message) || "Silme başarısız.");
      }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "text-slate-800", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "Formlarım" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-slate-500", children: [
          o.length,
          " form"
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700", children: "+ Yeni Form" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mb-5 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          onClick: () => b(""),
          className: `rounded-full px-3 py-1.5 text-xs font-semibold transition ${d === "" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
          children: "Tümü"
        }
      ),
      c.map((s) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: () => b(s.id),
          className: `rounded-full px-3 py-1.5 text-xs font-semibold transition ${d === s.id ? "text-white" : "text-slate-600 hover:opacity-80"}`,
          style: d === s.id ? { backgroundColor: s.color || "#4f46e5" } : { backgroundColor: `${s.color || "#94a3b8"}20` },
          children: [
            s.icon ? `${s.icon} ` : "",
            s.name
          ]
        },
        s.id
      )),
      y && /* @__PURE__ */ e.jsx("button", { onClick: () => u(!0), className: "ml-1 rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-700", children: "⚙ Kategoriler" })
    ] }),
    a ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-slate-400", children: "Formlar yükleniyor…" }) : o.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-3xl", children: "📝" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-bold text-slate-700", children: d ? "Bu kategoride form yok" : "Henüz formun yok" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-slate-400", children: d ? "Başka bir kategori seç veya yeni form oluştur." : "İlk formunu oluşturmak için başla." }),
      /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700", children: "+ Yeni Form Oluştur" })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", children: o.map((s) => {
      var r, N;
      const t = s.categoryId ? j(s.categoryId) : null;
      return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "mb-2 flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("h3", { className: "line-clamp-2 font-bold text-slate-800", children: s.title }),
          /* @__PURE__ */ e.jsx("span", { className: `shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${(r = k[s.status]) == null ? void 0 : r.cls}`, children: (N = k[s.status]) == null ? void 0 : N.label })
        ] }),
        t && /* @__PURE__ */ e.jsxs("span", { className: "mb-2 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", style: { backgroundColor: `${t.color || "#94a3b8"}20`, color: t.color || "#475569" }, children: [
          t.icon ? `${t.icon} ` : "",
          t.name
        ] }),
        s.description && /* @__PURE__ */ e.jsx("p", { className: "mb-3 line-clamp-2 text-sm text-slate-500", children: s.description }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-auto flex items-center gap-3 border-t border-slate-100 pt-3 text-xs text-slate-400", children: [
          /* @__PURE__ */ e.jsxs("span", { className: "whitespace-nowrap", children: [
            "📊 ",
            s.responseCount,
            " yanıt"
          ] }),
          /* @__PURE__ */ e.jsxs("span", { className: "whitespace-nowrap", children: [
            "👁 ",
            s.viewCount
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "ml-auto whitespace-nowrap", children: S(s.creationTime) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Builder?id=${s.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-slate-200 px-3 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50", children: "Düzenle" }),
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${s.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-slate-200 px-3 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50", children: "Yanıtlar" }),
          s.status === 1 && /* @__PURE__ */ e.jsx("a", { href: `/f/${s.slug}`, target: "_blank", rel: "noreferrer", className: "shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs hover:bg-slate-50", title: "Formu aç", children: "↗" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => w(s), className: "shrink-0 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50", title: "Sil", children: "🗑" })
        ] })
      ] }, s.id);
    }) }),
    f && /* @__PURE__ */ e.jsx(
      F,
      {
        categories: c,
        onClose: () => u(!1),
        onChanged: g
      }
    )
  ] });
}
function F({ categories: o, onClose: l, onChanged: a }) {
  const [i, c] = n.useState(""), [p, d] = n.useState("#6366f1"), [b, f] = n.useState(!1), [u, y] = n.useState(null), [h, g] = n.useState(""), j = async () => {
    if (i.trim()) {
      f(!0);
      try {
        await m.post("/api/app/form-category", { name: i.trim(), color: p, icon: null, order: o.length }), c(""), a();
      } catch (t) {
        x("error", (t == null ? void 0 : t.message) || "Kategori eklenemedi.");
      } finally {
        f(!1);
      }
    }
  }, w = async (t) => {
    if (h.trim())
      try {
        await m.put(`/api/app/form-category/${t.id}`, { name: h.trim(), color: t.color, icon: t.icon, order: t.order }), y(null), a();
      } catch (r) {
        x("error", (r == null ? void 0 : r.message) || "Güncellenemedi.");
      }
  }, s = async (t) => {
    if (window.confirm(`"${t.name}" kategorisini silmek istediğinize emin misiniz?`))
      try {
        await m.delete(`/api/app/form-category/${t.id}`), a();
      } catch (r) {
        x("error", (r == null ? void 0 : r.message) || "Silinemedi.");
      }
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4", onClick: l, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-white p-6 shadow-xl", onClick: (t) => t.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-slate-800", children: "Kategoriler" }),
      /* @__PURE__ */ e.jsx("button", { onClick: l, className: "rounded p-1 text-slate-400 hover:bg-slate-100", children: "✕" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex max-h-64 flex-col gap-2 overflow-y-auto", children: [
      o.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "text-sm text-slate-400", children: "Henüz kategori yok." }),
      o.map((t) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-3 w-3 shrink-0 rounded-full", style: { backgroundColor: t.color || "#94a3b8" } }),
        u === t.id ? /* @__PURE__ */ e.jsx("input", { autoFocus: !0, value: h, onChange: (r) => g(r.target.value), onKeyDown: (r) => r.key === "Enter" && w(t), className: "min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-sm" }) : /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate text-sm font-medium text-slate-700", children: t.name }),
        u === t.id ? /* @__PURE__ */ e.jsx("button", { onClick: () => w(t), className: "shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-700", children: "Kaydet" }) : /* @__PURE__ */ e.jsx("button", { onClick: () => {
          y(t.id), g(t.name);
        }, className: "shrink-0 text-xs text-slate-400 hover:text-slate-600", children: "Düzenle" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => s(t), className: "shrink-0 text-xs text-red-400 hover:text-red-600", children: "Sil" })
      ] }, t.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center gap-2 border-t border-slate-100 pt-4", children: [
      /* @__PURE__ */ e.jsx("input", { type: "color", value: p, onChange: (t) => d(t.target.value), className: "h-9 w-9 shrink-0 cursor-pointer rounded border border-slate-200" }),
      /* @__PURE__ */ e.jsx("input", { value: i, onChange: (t) => c(t.target.value), onKeyDown: (t) => t.key === "Enter" && j(), placeholder: "Yeni kategori adı…", className: "min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" }),
      /* @__PURE__ */ e.jsx("button", { onClick: j, disabled: b || !i.trim(), className: "shrink-0 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50", children: "Ekle" })
    ] })
  ] }) });
}
function x(o, l) {
  const a = window.abp;
  a != null && a.notify && o === "success" ? a.notify.success(l) : a != null && a.message ? a.message[o === "error" ? "error" : "info"](l) : console.log(`[${o}] ${l}`);
}
function z(o) {
  var a;
  const l = window.abp;
  return (a = l == null ? void 0 : l.message) != null && a.confirm ? new Promise((i) => {
    l.message.confirm(`"${o}" formunu silmek istediğinize emin misiniz?`, "Onay", (c) => i(!!c));
  }) : Promise.resolve(window.confirm(`"${o}" formunu sil?`));
}
const v = document.getElementById("forms-list-root");
v && C(v).render(/* @__PURE__ */ e.jsx(D, {}));
