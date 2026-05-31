import { c as F, j as e, r as i } from "./vendor.js";
import { a as d } from "./vendor2.js";
const h = {
  0: { label: "Bekliyor", cls: "bg-amber-100 text-amber-700" },
  1: { label: "İnceleniyor", cls: "bg-blue-100 text-blue-700" },
  2: { label: "İncelendi", cls: "bg-emerald-100 text-emerald-700" }
}, M = [
  { v: "", label: "Tüm durumlar" },
  { v: "0", label: "Bekleyenler" },
  { v: "1", label: "İncelenenler" },
  { v: "2", label: "İncelendi" }
], J = (s) => {
  try {
    return typeof s == "string" ? JSON.parse(s) : s || {};
  } catch {
    return {};
  }
}, b = (s) => {
  try {
    return new Date(s).toLocaleString("tr-TR");
  } catch {
    return s;
  }
}, C = (s) => s == null ? "—" : s < 60 ? `${s}sn` : `${Math.floor(s / 60)}dk ${s % 60}sn`;
function m({ label: s, value: l, accent: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-slate-400", children: s }),
    /* @__PURE__ */ e.jsx("p", { className: `mt-1 text-2xl font-bold ${r || "text-slate-800"}`, children: l })
  ] });
}
function P(s) {
  return s == null || s === "" ? /* @__PURE__ */ e.jsx("span", { className: "text-slate-300", children: "—" }) : Array.isArray(s) ? s.join(", ") : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function z({ formId: s }) {
  const [l, r] = i.useState(null), [j, T] = i.useState([]), [u, g] = i.useState([]), [$, D] = i.useState(""), [R, Y] = i.useState(!0), [c, x] = i.useState(null), [y, N] = i.useState(!1), [p, v] = i.useState(""), A = i.useMemo(() => Object.fromEntries(j.map((t) => [t.id, t])), [j]), w = async (t) => {
    let a = `/api/app/response-management?DocumentId=${s}&MaxResultCount=200&SkipCount=0`;
    t !== "" && (a += `&Status=${t}`);
    const n = await d.get(a);
    g(n.items || []);
  };
  i.useEffect(() => {
    (async () => {
      try {
        const [t, a] = await Promise.all([
          d.get(`/api/app/form/${s}/statistics`),
          d.get(`/api/app/form/${s}`)
        ]);
        r(t), T((a.blocks || []).slice().sort((n, L) => n.order - L.order)), await w("");
      } catch (t) {
        o("error", (t == null ? void 0 : t.message) || "Yanıtlar yüklenemedi.");
      } finally {
        Y(!1);
      }
    })();
  }, [s]);
  const B = async (t) => {
    D(t);
    try {
      await w(t);
    } catch (a) {
      o("error", a == null ? void 0 : a.message);
    }
  }, S = async (t) => {
    N(!0);
    try {
      const a = await d.get(`/api/app/response-management/${t}`);
      x(a);
    } catch (a) {
      o("error", (a == null ? void 0 : a.message) || "Detay açılamadı.");
    } finally {
      N(!1);
    }
  }, E = (t) => {
    x(t), g((a) => a.map((n) => n.id === t.id ? { ...n, status: t.status, tagsJson: t.tagsJson } : n));
  }, O = async (t) => {
    try {
      const a = await d.post(`/api/app/response-management/${c.id}/set-status`, { status: Number(t) });
      E(a), o("success", "Durum güncellendi.");
    } catch (a) {
      o("error", a == null ? void 0 : a.message);
    }
  }, k = async () => {
    if (p.trim())
      try {
        await d.post(`/api/app/response-management/${c.id}/comment`, { text: p.trim() }), v(""), await S(c.id), o("success", "Yorum eklendi.");
      } catch (t) {
        o("error", t == null ? void 0 : t.message);
      }
  };
  return R ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-slate-400", children: "Yanıtlar yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "text-slate-800", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ e.jsx(m, { label: "Toplam Yanıt", value: (l == null ? void 0 : l.responseCount) ?? 0, accent: "text-indigo-600" }),
      /* @__PURE__ */ e.jsx(m, { label: "Bugün", value: (l == null ? void 0 : l.todayResponseCount) ?? 0 }),
      /* @__PURE__ */ e.jsx(m, { label: "Bekleyen", value: (l == null ? void 0 : l.pendingResponseCount) ?? 0, accent: "text-amber-600" }),
      /* @__PURE__ */ e.jsx(m, { label: "Görüntülenme", value: (l == null ? void 0 : l.viewCount) ?? 0 })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-5 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsxs("h3", { className: "text-sm font-bold text-slate-600", children: [
        "Yanıtlar (",
        u.length,
        ")"
      ] }),
      /* @__PURE__ */ e.jsx("select", { value: $, onChange: (t) => B(t.target.value), className: "rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm", children: M.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.v, children: t.label }, t.v)) })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white", children: u.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-slate-400", children: "Henüz yanıt yok." }) : /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-slate-50 text-left text-xs font-semibold uppercase text-slate-400", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Tarih" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Süre" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-slate-100", children: u.map((t) => {
        var a, n;
        return /* @__PURE__ */ e.jsxs("tr", { className: "hover:bg-slate-50", children: [
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: b(t.creationTime) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(a = h[t.status]) == null ? void 0 : a.cls}`, children: (n = h[t.status]) == null ? void 0 : n.label }) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-slate-500", children: C(t.completionSeconds) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ e.jsx("button", { onClick: () => S(t.id), className: "rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium hover:bg-slate-50", children: "Detay" }) })
        ] }, t.id);
      }) })
    ] }) }),
    (c || y) && /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex justify-end bg-slate-900/40", onClick: () => x(null), children: /* @__PURE__ */ e.jsx("div", { className: "h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl", onClick: (t) => t.stopPropagation(), children: y || !c ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-slate-400", children: "Yükleniyor…" }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold", children: "Yanıt Detayı" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => x(null), className: "rounded p-1 text-slate-400 hover:bg-slate-100", children: "✕" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center gap-2 text-sm text-slate-500", children: [
        /* @__PURE__ */ e.jsx("span", { children: b(c.creationTime) }),
        "·",
        /* @__PURE__ */ e.jsx("span", { children: C(c.completionSeconds) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-slate-400", children: "Durum" }),
        /* @__PURE__ */ e.jsx("select", { value: c.status, onChange: (t) => O(t.target.value), className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm", children: Object.entries(h).map(([t, a]) => /* @__PURE__ */ e.jsx("option", { value: t, children: a.label }, t)) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-slate-400", children: "Cevaplar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: Object.entries(J(c.answers)).map(([t, a]) => {
          var n;
          return /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-slate-100 bg-slate-50 p-3", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold text-slate-500", children: ((n = A[t]) == null ? void 0 : n.content) || "Soru" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-slate-800", children: P(a) })
          ] }, t);
        }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-slate-400", children: "Yorumlar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (c.comments || []).map((t) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl bg-slate-50 p-2.5 text-sm", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-slate-700", children: t.text }),
          /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 text-[11px] text-slate-400", children: b(t.creationTime) })
        ] }, t.id)) }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { value: p, onChange: (t) => v(t.target.value), placeholder: "Yorum ekle…", className: "flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm", onKeyDown: (t) => t.key === "Enter" && k() }),
          /* @__PURE__ */ e.jsx("button", { onClick: k, className: "rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700", children: "Ekle" })
        ] })
      ] })
    ] }) }) })
  ] });
}
function o(s, l) {
  const r = window.abp;
  r != null && r.notify && s === "success" ? r.notify.success(l) : r != null && r.message ? r.message[s === "error" ? "error" : "info"](l) : console.log(`[${s}] ${l}`);
}
const f = document.getElementById("responses-root");
f && F(f).render(/* @__PURE__ */ e.jsx(z, { formId: f.getAttribute("data-form-id") }));
