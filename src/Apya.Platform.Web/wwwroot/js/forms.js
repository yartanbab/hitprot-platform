import { c as b, j as e, r as c } from "./vendor.js";
import { a as m } from "./vendor2.js";
const x = {
  0: { label: "Taslak", cls: "bg-slate-100 text-slate-600" },
  1: { label: "Yayında", cls: "bg-emerald-100 text-emerald-700" },
  2: { label: "Arşiv", cls: "bg-amber-100 text-amber-700" }
}, f = (t) => {
  try {
    return new Date(t).toLocaleDateString("tr-TR");
  } catch {
    return t;
  }
};
function g() {
  const [t, a] = c.useState([]), [r, i] = c.useState(!0), n = async () => {
    try {
      const s = await m.get("/api/app/form?MaxResultCount=200&SkipCount=0");
      a(s.items || []);
    } catch (s) {
      d("error", (s == null ? void 0 : s.message) || "Formlar yüklenemedi.");
    } finally {
      i(!1);
    }
  };
  c.useEffect(() => {
    n();
  }, []);
  const h = async (s) => {
    if (await j(s.title))
      try {
        await m.delete(`/api/app/form/${s.id}`), a((l) => l.filter((p) => p.id !== s.id)), d("success", "Form silindi.");
      } catch (l) {
        d("error", (l == null ? void 0 : l.message) || "Silme başarısız.");
      }
  };
  return r ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-slate-400", children: "Formlar yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "text-slate-800", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "Formlarım" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-slate-500", children: [
          t.length,
          " form"
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700", children: "+ Yeni Form" })
    ] }),
    t.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-3xl", children: "📝" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-bold text-slate-700", children: "Henüz formun yok" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-slate-400", children: "İlk formunu oluşturmak için başla." }),
      /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700", children: "+ Yeni Form Oluştur" })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", children: t.map((s) => {
      var o, l;
      return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "mb-2 flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("h3", { className: "line-clamp-2 font-bold text-slate-800", children: s.title }),
          /* @__PURE__ */ e.jsx("span", { className: `shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${(o = x[s.status]) == null ? void 0 : o.cls}`, children: (l = x[s.status]) == null ? void 0 : l.label })
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
          /* @__PURE__ */ e.jsx("span", { className: "ml-auto whitespace-nowrap", children: f(s.creationTime) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Builder?id=${s.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-slate-200 px-3 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50", children: "Düzenle" }),
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${s.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-slate-200 px-3 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50", children: "Yanıtlar" }),
          s.status === 1 && /* @__PURE__ */ e.jsx("a", { href: `/f/${s.slug}`, target: "_blank", rel: "noreferrer", className: "shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs hover:bg-slate-50", title: "Formu aç", children: "↗" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => h(s), className: "shrink-0 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50", title: "Sil", children: "🗑" })
        ] })
      ] }, s.id);
    }) })
  ] });
}
function d(t, a) {
  const r = window.abp;
  r != null && r.notify && t === "success" ? r.notify.success(a) : r != null && r.message ? r.message[t === "error" ? "error" : "info"](a) : console.log(`[${t}] ${a}`);
}
function j(t) {
  var r;
  const a = window.abp;
  return (r = a == null ? void 0 : a.message) != null && r.confirm ? new Promise((i) => {
    a.message.confirm(`"${t}" formunu silmek istediğinize emin misiniz?`, "Onay", (n) => i(!!n));
  }) : Promise.resolve(window.confirm(`"${t}" formunu sil?`));
}
const u = document.getElementById("forms-list-root");
u && b(u).render(/* @__PURE__ */ e.jsx(g, {}));
