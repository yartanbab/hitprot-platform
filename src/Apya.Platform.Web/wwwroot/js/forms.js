import { b as p, j as e, r as c } from "./react-vendor.js";
import { a as m } from "./httpClient.js";
/* empty css      */
const x = {
  0: { label: "Taslak", cls: "bg-neutral-100 text-neutral-700" },
  1: { label: "Yayında", cls: "bg-positive-100 text-positive-700" },
  2: { label: "Arşiv", cls: "bg-warning-100 text-warning-700" }
}, b = (s) => {
  try {
    return new Date(s).toLocaleDateString("tr-TR");
  } catch {
    return s;
  }
};
function g() {
  const [s, a] = c.useState([]), [r, i] = c.useState(!0), l = async () => {
    try {
      const t = await m.get("/api/app/form?MaxResultCount=200&SkipCount=0");
      a(t.items || []);
    } catch (t) {
      d("error", (t == null ? void 0 : t.message) || "Formlar yüklenemedi.");
    } finally {
      i(!1);
    }
  };
  c.useEffect(() => {
    l();
  }, []);
  const f = async (t) => {
    if (await y(t.title))
      try {
        await m.delete(`/api/app/form/${t.id}`), a((n) => n.filter((h) => h.id !== t.id)), d("success", "Form silindi.");
      } catch (n) {
        d("error", (n == null ? void 0 : n.message) || "Silme başarısız.");
      }
  };
  return r ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Formlar yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-text-primary", children: "Formlarım" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-text-secondary", children: [
          s.length,
          " form"
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-accent-600", children: "+ Yeni Form" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border-2 border-dashed border-default py-20 text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-3xl", children: "📝" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-bold text-text-primary", children: "Henüz formun yok" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-tertiary", children: "İlk formunu oluşturmak için başla." }),
      /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "mt-4 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600", children: "+ Yeni Form Oluştur" })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", children: s.map((t) => {
      var o, n;
      return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-default bg-surface-raised p-5 transition hover:shadow-md", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "mb-2 flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("h3", { className: "line-clamp-2 font-bold text-text-primary", children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: `shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${(o = x[t.status]) == null ? void 0 : o.cls}`, children: (n = x[t.status]) == null ? void 0 : n.label })
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
          /* @__PURE__ */ e.jsx("span", { className: "ml-auto whitespace-nowrap", children: b(t.creationTime) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Builder?id=${t.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-default px-3 py-1.5 text-center text-xs font-semibold text-text-secondary hover:bg-surface-sunken", children: "Düzenle" }),
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${t.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-default px-3 py-1.5 text-center text-xs font-semibold text-text-secondary hover:bg-surface-sunken", children: "Yanıtlar" }),
          t.status === 1 && /* @__PURE__ */ e.jsx("a", { href: `/f/${t.slug}`, target: "_blank", rel: "noreferrer", className: "shrink-0 rounded-lg border border-default px-2.5 py-1.5 text-xs hover:bg-surface-sunken", title: "Formu aç", children: "↗" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => f(t), className: "shrink-0 rounded-lg border border-negative-100 px-2.5 py-1.5 text-xs text-negative-500 hover:bg-negative-50", title: "Sil", children: "🗑" })
        ] })
      ] }, t.id);
    }) })
  ] });
}
function d(s, a) {
  const r = window.abp;
  r != null && r.notify && s === "success" ? r.notify.success(a) : r != null && r.message ? r.message[s === "error" ? "error" : "info"](a) : console.log(`[${s}] ${a}`);
}
function y(s) {
  var r;
  const a = window.abp;
  return (r = a == null ? void 0 : a.message) != null && r.confirm ? new Promise((i) => {
    a.message.confirm(`"${s}" formunu silmek istediğinize emin misiniz?`, "Onay", (l) => i(!!l));
  }) : Promise.resolve(window.confirm(`"${s}" formunu sil?`));
}
const u = document.getElementById("forms-list-root");
u && p(u).render(/* @__PURE__ */ e.jsx(g, {}));
