import { b as _, j as e, r as i } from "./react-vendor.js";
import { a as u } from "./httpClient.js";
/* empty css      */
const h = {
  0: { label: "Bekliyor", cls: "bg-amber-100 text-amber-700" },
  1: { label: "İnceleniyor", cls: "bg-blue-100 text-blue-700" },
  2: { label: "İncelendi", cls: "bg-emerald-100 text-emerald-700" }
}, q = [
  { v: "", label: "Tüm durumlar" },
  { v: "0", label: "Bekleyenler" },
  { v: "1", label: "İncelenenler" },
  { v: "2", label: "İncelendi" }
], S = (s) => {
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
}, B = (s) => s == null ? "—" : s < 60 ? `${s}sn` : `${Math.floor(s / 60)}dk ${s % 60}sn`;
function y({ label: s, value: l, accent: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-slate-400", children: s }),
    /* @__PURE__ */ e.jsx("p", { className: `mt-1 text-2xl font-bold ${r || "text-slate-800"}`, children: l })
  ] });
}
function E(s) {
  return s == null || s === "" ? /* @__PURE__ */ e.jsx("span", { className: "text-slate-300", children: "—" }) : Array.isArray(s) ? s.join(", ") : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function Q({ formId: s }) {
  const [l, r] = i.useState(null), [j, Y] = i.useState([]), [m, C] = i.useState([]), [F, U] = i.useState(""), [M, J] = i.useState(!0), [c, f] = i.useState(null), [T, $] = i.useState(!1), [N, D] = i.useState(""), [w, R] = i.useState("list"), P = i.useMemo(() => Object.fromEntries(j.map((t) => [t.id, t])), [j]), g = i.useMemo(() => j.filter((t) => t.type !== 16 && t.type !== 17), [j]), O = async (t) => {
    let a = `/api/app/response-management?DocumentId=${s}&MaxResultCount=200&SkipCount=0`;
    t !== "" && (a += `&Status=${t}`);
    const n = await u.get(a);
    C(n.items || []);
  };
  i.useEffect(() => {
    (async () => {
      try {
        const [t, a] = await Promise.all([
          u.get(`/api/app/form/${s}/statistics`),
          u.get(`/api/app/form/${s}`)
        ]);
        r(t), Y((a.blocks || []).slice().sort((n, p) => n.order - p.order)), await O("");
      } catch (t) {
        x("error", (t == null ? void 0 : t.message) || "Yanıtlar yüklenemedi.");
      } finally {
        J(!1);
      }
    })();
  }, [s]);
  const z = async (t) => {
    U(t);
    try {
      await O(t);
    } catch (a) {
      x("error", a == null ? void 0 : a.message);
    }
  }, v = async (t) => {
    $(!0);
    try {
      const a = await u.get(`/api/app/response-management/${t}`);
      f(a);
    } catch (a) {
      x("error", (a == null ? void 0 : a.message) || "Detay açılamadı.");
    } finally {
      $(!1);
    }
  }, V = (t) => {
    f(t), C((a) => a.map((n) => n.id === t.id ? { ...n, status: t.status, tagsJson: t.tagsJson } : n));
  }, G = async (t) => {
    try {
      const a = await u.post(`/api/app/response-management/${c.id}/set-status`, { status: Number(t) });
      V(a), x("success", "Durum güncellendi.");
    } catch (a) {
      x("error", a == null ? void 0 : a.message);
    }
  }, L = async () => {
    if (N.trim())
      try {
        await u.post(`/api/app/response-management/${c.id}/comment`, { text: N.trim() }), D(""), await v(c.id), x("success", "Yorum eklendi.");
      } catch (t) {
        x("error", t == null ? void 0 : t.message);
      }
  }, H = () => {
    const t = ["Tarih", "Durum", "Süre (sn)", ...g.map((o) => o.content)], a = m.map((o) => {
      var A;
      const I = S(o.answers);
      return [
        b(o.creationTime),
        ((A = h[o.status]) == null ? void 0 : A.label) || "",
        o.completionSeconds ?? "",
        ...g.map((K) => W(I[K.id]))
      ];
    }), n = [t, ...a].map((o) => o.map(X).join(",")).join(`\r
`), p = new Blob(["\uFEFF" + n], { type: "text/csv;charset=utf-8;" }), d = document.createElement("a");
    d.href = URL.createObjectURL(p), d.download = `yanitlar-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, d.click(), URL.revokeObjectURL(d.href);
  };
  return M ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-slate-400", children: "Yanıtlar yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "text-slate-800", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ e.jsx(y, { label: "Toplam Yanıt", value: (l == null ? void 0 : l.responseCount) ?? 0, accent: "text-indigo-600" }),
      /* @__PURE__ */ e.jsx(y, { label: "Bugün", value: (l == null ? void 0 : l.todayResponseCount) ?? 0 }),
      /* @__PURE__ */ e.jsx(y, { label: "Bekleyen", value: (l == null ? void 0 : l.pendingResponseCount) ?? 0, accent: "text-amber-600" }),
      /* @__PURE__ */ e.jsx(y, { label: "Görüntülenme", value: (l == null ? void 0 : l.viewCount) ?? 0 })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-5 flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("h3", { className: "text-sm font-bold text-slate-600", children: [
        "Yanıtlar (",
        m.length,
        ")"
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex rounded-xl border border-slate-200 bg-white p-0.5", children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => R("list"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${w === "list" ? "bg-indigo-600 text-white" : "text-slate-500"}`, children: "Liste" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => R("table"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${w === "table" ? "bg-indigo-600 text-white" : "text-slate-500"}`, children: "Tablo" })
        ] }),
        /* @__PURE__ */ e.jsx("select", { value: F, onChange: (t) => z(t.target.value), className: "rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm", children: q.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.v, children: t.label }, t.v)) }),
        /* @__PURE__ */ e.jsx("button", { onClick: H, disabled: m.length === 0, className: "rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50", children: "⬇ CSV" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white", children: m.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-slate-400", children: "Henüz yanıt yok." }) : w === "list" ? /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-slate-50 text-left text-xs font-semibold uppercase text-slate-400", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Tarih" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Süre" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-slate-100", children: m.map((t) => {
        var a, n;
        return /* @__PURE__ */ e.jsxs("tr", { className: "hover:bg-slate-50", children: [
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: b(t.creationTime) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(a = h[t.status]) == null ? void 0 : a.cls}`, children: (n = h[t.status]) == null ? void 0 : n.label }) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-slate-500", children: B(t.completionSeconds) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ e.jsx("button", { onClick: () => v(t.id), className: "rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium hover:bg-slate-50", children: "Detay" }) })
        ] }, t.id);
      }) })
    ] }) : /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-slate-50 text-left text-xs font-semibold uppercase text-slate-400", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: "Tarih" }),
        g.map((t) => /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: t.content }, t.id)),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-slate-100", children: m.map((t) => {
        var n, p;
        const a = S(t.answers);
        return /* @__PURE__ */ e.jsxs("tr", { className: "cursor-pointer hover:bg-slate-50", onClick: () => v(t.id), children: [
          /* @__PURE__ */ e.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-slate-500", children: b(t.creationTime) }),
          g.map((d) => /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: E(a[d.id]) }, d.id)),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(n = h[t.status]) == null ? void 0 : n.cls}`, children: (p = h[t.status]) == null ? void 0 : p.label }) })
        ] }, t.id);
      }) })
    ] }) }),
    (c || T) && /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex justify-end bg-slate-900/40", onClick: () => f(null), children: /* @__PURE__ */ e.jsx("div", { className: "h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl", onClick: (t) => t.stopPropagation(), children: T || !c ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-slate-400", children: "Yükleniyor…" }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold", children: "Yanıt Detayı" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => f(null), className: "rounded p-1 text-slate-400 hover:bg-slate-100", children: "✕" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center gap-2 text-sm text-slate-500", children: [
        /* @__PURE__ */ e.jsx("span", { children: b(c.creationTime) }),
        "·",
        /* @__PURE__ */ e.jsx("span", { children: B(c.completionSeconds) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-slate-400", children: "Durum" }),
        /* @__PURE__ */ e.jsx("select", { value: c.status, onChange: (t) => G(t.target.value), className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm", children: Object.entries(h).map(([t, a]) => /* @__PURE__ */ e.jsx("option", { value: t, children: a.label }, t)) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-slate-400", children: "Cevaplar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: Object.entries(S(c.answers)).map(([t, a]) => {
          var n;
          return /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-slate-100 bg-slate-50 p-3", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold text-slate-500", children: ((n = P[t]) == null ? void 0 : n.content) || "Soru" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-slate-800", children: E(a) })
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
          /* @__PURE__ */ e.jsx("input", { value: N, onChange: (t) => D(t.target.value), placeholder: "Yorum ekle…", className: "flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm", onKeyDown: (t) => t.key === "Enter" && L() }),
          /* @__PURE__ */ e.jsx("button", { onClick: L, className: "rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700", children: "Ekle" })
        ] })
      ] })
    ] }) }) })
  ] });
}
function W(s) {
  return s == null ? "" : Array.isArray(s) ? s.join("; ") : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function X(s) {
  const l = String(s ?? "");
  return /[",\r\n]/.test(l) ? '"' + l.replace(/"/g, '""') + '"' : l;
}
function x(s, l) {
  const r = window.abp;
  r != null && r.notify && s === "success" ? r.notify.success(l) : r != null && r.message ? r.message[s === "error" ? "error" : "info"](l) : console.log(`[${s}] ${l}`);
}
const k = document.getElementById("responses-root");
k && _(k).render(/* @__PURE__ */ e.jsx(Q, { formId: k.getAttribute("data-form-id") }));
