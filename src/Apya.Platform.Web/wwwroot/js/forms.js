import { j as e, r as i } from "./react-vendor-D7YDiBbi.js";
import { m as T, u as R, E as I } from "./index-DgpuJ91w.js";
import { a as g } from "./httpClient-BNoyY5yK.js";
import { H as M } from "./Hint-BhMztyJX.js";
import { p as _ } from "./publicFormLink-CJ_6ABDU.js";
import { s as F, a as K, C as P } from "./formChoices-CDoZfRj7.js";
const $ = {
  0: { label: "Taslak", cls: "bg-neutral-100 text-neutral-700" },
  1: { label: "Yayında", cls: "bg-positive-100 text-positive-700" },
  2: { label: "Arşiv", cls: "bg-warning-100 text-warning-700" }
}, H = (s) => {
  try {
    return new Date(s).toLocaleDateString("tr-TR");
  } catch {
    return s;
  }
}, D = (s) => {
  var n, a;
  return (a = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.auth) == null ? void 0 : a.isGranted(s);
}, z = (s, n) => (getComputedStyle(document.documentElement).getPropertyValue(s) || "").trim() || n, S = () => z("--apya-neutral-400", "#9CA3AF"), L = () => z("--apya-accent-500", "#4F46E5");
function Y() {
  const s = i.useRef(null), [n, a] = i.useState(!1), c = async (l) => {
    var m;
    if (l) {
      a(!0);
      try {
        const f = new FormData();
        f.append("file", l), f.append("__RequestVerificationToken", ((m = document.querySelector('input[name="__RequestVerificationToken"]')) == null ? void 0 : m.value) || "");
        const y = await fetch("/DynamicAssets?handler=Import", { method: "POST", body: f, credentials: "same-origin" }), d = y.ok ? await y.json() : { ok: !1, message: "Dosya işlenemedi. Lütfen tekrar deneyin." };
        d.ok ? (h("success", d.message), window.location.href = `/DynamicAssets/Builder?id=${d.id}`) : h("error", d.message);
      } catch {
        h("error", "Dosya işlenemedi. Lütfen tekrar deneyin.");
      } finally {
        a(!1), s.current && (s.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: s,
        type: "file",
        accept: ".json,application/json",
        className: "hidden",
        "aria-hidden": "true",
        tabIndex: -1,
        onChange: (l) => {
          var m;
          return c((m = l.target.files) == null ? void 0 : m[0]);
        }
      }
    ),
    /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        disabled: n,
        onClick: () => {
          var l;
          return (l = s.current) == null ? void 0 : l.click();
        },
        title: "Başka bir yerden indirilmiş form .json dosyasını yeni taslak form olarak aç",
        className: "rounded-xl border border-default px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-surface-sunken disabled:opacity-50",
        children: n ? "Yükleniyor…" : "İçe aktar (JSON)"
      }
    )
  ] });
}
function q() {
  const [s, n] = i.useState([]), [a, c] = i.useState(!0), [l, m] = i.useState(null), [f, y] = i.useState([]), [d, o] = i.useState(""), [b, k] = i.useState(!1), [w, N] = i.useState(!1), C = D("Platform.DynamicAssets.ManageCategories"), j = i.useRef(0), r = async (t) => {
    const u = ++j.current;
    c(!0);
    try {
      const p = new URLSearchParams({ MaxResultCount: "200", SkipCount: "0" });
      t && p.set("CategoryId", t);
      const v = await g.get(`/api/app/form?${p.toString()}`);
      if (u !== j.current) return;
      n(v.items || []), m(null);
    } catch (p) {
      if (u !== j.current) return;
      m(p);
    } finally {
      u === j.current && c(!1);
    }
  }, x = () => {
    g.get("/api/app/form-category?MaxResultCount=100").then((t) => y(t.items || [])).catch(() => {
    });
  };
  i.useEffect(() => {
    x();
  }, []), i.useEffect(() => {
    r(d);
  }, [d]);
  const E = R(!a && !l), O = (t) => f.find((u) => u.id === t), B = async (t) => {
    if (await G(t.title))
      try {
        await g.delete(`/api/app/form/${t.id}`), n((p) => p.filter((v) => v.id !== t.id)), h("success", "Form silindi.");
      } catch (p) {
        h("error", (p == null ? void 0 : p.message) || "Silme başarısız.");
      }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-text-primary", children: "Formlarım" }),
        /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary", children: a || l ? "—" : `${s.length} form` })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        D("Platform.DynamicAssets.Create") && /* @__PURE__ */ e.jsx(Y, {}),
        /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-accent-600", children: "+ Yeni Form" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mb-5 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          onClick: () => o(""),
          className: `rounded-full px-3 py-1.5 text-xs font-semibold transition ${d === "" ? "bg-accent text-white" : "bg-surface-sunken text-text-secondary hover:opacity-80"}`,
          children: "Tümü"
        }
      ),
      f.map((t) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: () => o(t.id),
          className: `rounded-full px-3 py-1.5 text-xs font-semibold transition ${d === t.id ? "text-white" : "text-text-secondary hover:opacity-80"}`,
          style: d === t.id ? { backgroundColor: t.color || L() } : { backgroundColor: `${t.color || S()}20` },
          children: [
            t.icon ? `${t.icon} ` : "",
            t.name
          ]
        },
        t.id
      )),
      C && /* @__PURE__ */ e.jsx("button", { onClick: () => k(!0), className: "ml-1 rounded-full border border-dashed border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-strong hover:text-text-primary", children: "⚙ Kategoriler" }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => N(!0), className: "rounded-full border border-dashed border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-strong hover:text-text-primary", children: "⚡ Veri kaynakları" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { ref: E.contentRef, tabIndex: -1, children: a && !l ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Formlar yükleniyor…" }) : l ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border-2 border-dashed border-default py-12", children: /* @__PURE__ */ e.jsx(I, { variant: "error", title: "Formlar yüklenemedi", error: l, onRetry: E.retry(() => r(d)), retrying: a }) }) : s.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border-2 border-dashed border-default py-20 text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-3xl", children: "📝" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-bold text-text-primary", children: d ? "Bu kategoride form yok" : "Henüz formun yok" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-tertiary", children: d ? "Başka bir kategori seç veya yeni form oluştur." : "İlk formunu oluşturmak için başla." }),
      /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "mt-4 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600", children: "+ Yeni Form Oluştur" })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", children: s.map((t) => {
      var p, v;
      const u = t.categoryId ? O(t.categoryId) : null;
      return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-default bg-surface-raised p-5 transition hover:shadow-md", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "mb-2 flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("h3", { className: "line-clamp-2 font-bold text-text-primary", children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: `shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${(p = $[t.status]) == null ? void 0 : p.cls}`, children: (v = $[t.status]) == null ? void 0 : v.label })
        ] }),
        u && /* @__PURE__ */ e.jsxs("span", { className: "mb-2 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", style: { backgroundColor: `${u.color || S()}20`, color: u.color || "var(--apya-text-secondary)" }, children: [
          u.icon ? `${u.icon} ` : "",
          u.name
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
          /* @__PURE__ */ e.jsx("span", { className: "ml-auto whitespace-nowrap", children: H(t.creationTime) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Builder?id=${t.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-default px-3 py-1.5 text-center text-xs font-semibold text-text-secondary hover:bg-surface-sunken", children: "Düzenle" }),
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${t.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-default px-3 py-1.5 text-center text-xs font-semibold text-text-secondary hover:bg-surface-sunken", children: "Yanıtlar" }),
          t.status === 1 && /* @__PURE__ */ e.jsx("a", { href: _(t.slug), target: "_blank", rel: "noreferrer", className: "shrink-0 rounded-lg border border-default px-2.5 py-1.5 text-xs hover:bg-surface-sunken", title: "Formu aç", children: "↗" }),
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets?handler=Export&id=${t.id}`, download: !0, className: "shrink-0 rounded-lg border border-default px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-sunken", title: "Form tanımını .json olarak indir (yanıtlar dahil değil)", children: "JSON" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => B(t), className: "shrink-0 rounded-lg border border-negative-100 px-2.5 py-1.5 text-xs text-negative-500 hover:bg-negative-50", children: "🗑" }),
          /* @__PURE__ */ e.jsx(M, { placement: "left", text: "Formu siler ama mevcut yanıtları SİLMEZ — yanıtlar veritabanında kalır, sahipsiz kalır ve bir daha hiçbir ekrandan erişilemez." })
        ] })
      ] }, t.id);
    }) }) }),
    w && /* @__PURE__ */ e.jsx(V, { onClose: () => N(!1) }),
    b && /* @__PURE__ */ e.jsx(
      U,
      {
        categories: f,
        onClose: () => k(!1),
        onChanged: x
      }
    )
  ] });
}
function V({ onClose: s }) {
  const [n, a] = i.useState(null), [c, l] = i.useState(null), [m, f] = i.useState(!0), y = () => {
    f(!0), a(null), g.get("/api/app/form/choice-sources").then((o) => {
      a(o || []), l(null);
    }).catch((o) => l(o)).finally(() => f(!1));
  };
  i.useEffect(() => {
    y();
  }, []);
  const d = R(!m && !c);
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: s, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-lg rounded-2xl border border-default bg-surface-elevated p-6 shadow-xl", onClick: (o) => o.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-1 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Veri kaynakları" }),
      /* @__PURE__ */ e.jsx("button", { onClick: s, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "mb-4 text-sm text-text-secondary", children: "Açılır liste alanını bu listelerden birine bağlayabilirsiniz; seçenekler form her açıldığında güncel veriden gelir." }),
    /* @__PURE__ */ e.jsx("div", { ref: d.contentRef, tabIndex: -1, children: c ? /* @__PURE__ */ e.jsx(I, { compact: !0, variant: "error", title: "Veri kaynakları yüklenemedi", error: c, onRetry: d.retry(y), retrying: m }) : n == null ? /* @__PURE__ */ e.jsx("p", { className: "py-8 text-center text-sm text-text-tertiary", children: "Yükleniyor…" }) : n.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-8 text-center text-sm text-text-tertiary", children: "Tanımlı veri kaynağı yok." }) : /* @__PURE__ */ e.jsx("div", { className: "flex max-h-80 flex-col gap-2 overflow-y-auto", children: n.map((o) => {
      var b;
      return /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle px-3 py-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: F(o.key) }),
          /* @__PURE__ */ e.jsx("span", { className: "rounded-full bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold text-text-secondary", children: K[o.scope] || "Kapsam belirsiz" }),
          o.dependsOnSourceKey && /* @__PURE__ */ e.jsxs("span", { className: "rounded-full bg-primary-subtle px-2 py-0.5 text-[11px] font-semibold text-text-primary", children: [
            "⛓ ",
            F(o.dependsOnSourceKey),
            " alanına bağlı"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-xs text-text-secondary", children: ((b = P[o.key]) == null ? void 0 : b.hint) || "" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-xs text-text-secondary", children: [
          o.recordCount == null ? "Kayıt sayısı firmaya göre değişir" : `${o.recordCount} kayıt`,
          " · ",
          o.usedInFormCount > 0 ? `${o.usedInFormCount} formda kullanılıyor` : "Henüz hiçbir formda kullanılmıyor"
        ] })
      ] }, o.key);
    }) }) })
  ] }) });
}
function U({ categories: s, onClose: n, onChanged: a }) {
  const [c, l] = i.useState(""), [m, f] = i.useState(L()), [y, d] = i.useState(!1), [o, b] = i.useState(null), [k, w] = i.useState(""), N = async () => {
    if (c.trim()) {
      d(!0);
      try {
        await g.post("/api/app/form-category", { name: c.trim(), color: m, icon: null, order: s.length }), l(""), a();
      } catch (r) {
        h("error", (r == null ? void 0 : r.message) || "Kategori eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, C = async (r) => {
    if (k.trim())
      try {
        await g.put(`/api/app/form-category/${r.id}`, { name: k.trim(), color: r.color, icon: r.icon, order: r.order }), b(null), a();
      } catch (x) {
        h("error", (x == null ? void 0 : x.message) || "Güncellenemedi.");
      }
  }, j = async (r) => {
    if (window.confirm(`"${r.name}" kategorisini silmek istediğinize emin misiniz?`))
      try {
        await g.delete(`/api/app/form-category/${r.id}`), a();
      } catch (x) {
        h("error", (x == null ? void 0 : x.message) || "Silinemedi.");
      }
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: n, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl border border-default bg-surface-elevated p-6 shadow-xl", onClick: (r) => r.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Kategoriler" }),
      /* @__PURE__ */ e.jsx("button", { onClick: n, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex max-h-64 flex-col gap-2 overflow-y-auto", children: [
      s.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz kategori yok." }),
      s.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-subtle px-3 py-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-3 w-3 shrink-0 rounded-full", style: { backgroundColor: r.color || S() } }),
        o === r.id ? /* @__PURE__ */ e.jsx("input", { autoFocus: !0, value: k, onChange: (x) => w(x.target.value), onKeyDown: (x) => x.key === "Enter" && C(r), className: "min-w-0 flex-1 rounded border border-default bg-surface-base px-2 py-1 text-sm text-text-primary" }) : /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate text-sm font-medium text-text-secondary", children: r.name }),
        o === r.id ? /* @__PURE__ */ e.jsx("button", { onClick: () => C(r), className: "shrink-0 text-xs font-semibold text-accent hover:text-accent-600", children: "Kaydet" }) : /* @__PURE__ */ e.jsx("button", { onClick: () => {
          b(r.id), w(r.name);
        }, className: "shrink-0 text-xs text-text-tertiary hover:text-text-primary", children: "Düzenle" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => j(r), className: "shrink-0 text-xs text-negative hover:opacity-80", children: "Sil" })
      ] }, r.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center gap-2 border-t border-subtle pt-4", children: [
      /* @__PURE__ */ e.jsx("input", { type: "color", value: m, onChange: (r) => f(r.target.value), className: "h-9 w-9 shrink-0 cursor-pointer rounded border border-default" }),
      /* @__PURE__ */ e.jsx("input", { value: c, onChange: (r) => l(r.target.value), onKeyDown: (r) => r.key === "Enter" && N(), placeholder: "Yeni kategori adı…", className: "min-w-0 flex-1 rounded-lg border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus:border-border-focus focus:outline-none" }),
      /* @__PURE__ */ e.jsx("button", { onClick: N, disabled: y || !c.trim(), className: "shrink-0 rounded-lg bg-accent px-3 py-2 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: "Ekle" })
    ] })
  ] }) });
}
function h(s, n) {
  const a = window.abp;
  a != null && a.notify && s === "success" ? a.notify.success(n) : a != null && a.message ? a.message[s === "error" ? "error" : "info"](n) : console.log(`[${s}] ${n}`);
}
function G(s) {
  var a;
  const n = window.abp;
  return (a = n == null ? void 0 : n.message) != null && a.confirm ? new Promise((c) => {
    n.message.confirm(`"${s}" formunu silmek istediğinize emin misiniz?`, "Onay", (l) => c(!!l));
  }) : Promise.resolve(window.confirm(`"${s}" formunu sil?`));
}
const A = document.getElementById("forms-list-root");
A && T(A, "forms", /* @__PURE__ */ e.jsx(q, {}));
export {
  Y as FormImportButton
};
