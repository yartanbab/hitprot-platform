import { b as _, j as e, r as c } from "./react-vendor.js";
import { a as p } from "./httpClient.js";
/* empty css      */
const h = {
  0: { label: "Bekliyor", cls: "bg-warning-100 text-warning-700" },
  1: { label: "İnceleniyor", cls: "bg-brand-100 text-brand-700" },
  2: { label: "İncelendi", cls: "bg-positive-100 text-positive-700" }
}, q = [
  { v: "", label: "Tüm durumlar" },
  { v: "0", label: "Bekleyenler" },
  { v: "1", label: "İncelenenler" },
  { v: "2", label: "İncelendi" }
], k = (s) => {
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
function g({ label: s, value: n, accent: l }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-default bg-surface-raised p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-text-tertiary", children: s }),
    /* @__PURE__ */ e.jsx("p", { className: `mt-1 text-2xl font-bold ${l || "text-text-primary"}`, children: n })
  ] });
}
function E(s) {
  return s == null || s === "" ? /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "—" }) : Array.isArray(s) ? s.join(", ") : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function Q({ formId: s }) {
  const [n, l] = c.useState(null), [f, Y] = c.useState([]), [m, C] = c.useState([]), [F, U] = c.useState(""), [M, J] = c.useState(!0), [i, y] = c.useState(null), [T, $] = c.useState(!1), [N, D] = c.useState(""), [v, R] = c.useState("list"), P = c.useMemo(() => Object.fromEntries(f.map((t) => [t.id, t])), [f]), j = c.useMemo(() => f.filter((t) => t.type !== 16 && t.type !== 17), [f]), O = async (t) => {
    let a = `/api/app/response-management?DocumentId=${s}&MaxResultCount=200&SkipCount=0`;
    t !== "" && (a += `&Status=${t}`);
    const r = await p.get(a);
    C(r.items || []);
  };
  c.useEffect(() => {
    (async () => {
      try {
        const [t, a] = await Promise.all([
          p.get(`/api/app/form/${s}/statistics`),
          p.get(`/api/app/form/${s}`)
        ]);
        l(t), Y((a.blocks || []).slice().sort((r, u) => r.order - u.order)), await O("");
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
  }, w = async (t) => {
    $(!0);
    try {
      const a = await p.get(`/api/app/response-management/${t}`);
      y(a);
    } catch (a) {
      x("error", (a == null ? void 0 : a.message) || "Detay açılamadı.");
    } finally {
      $(!1);
    }
  }, V = (t) => {
    y(t), C((a) => a.map((r) => r.id === t.id ? { ...r, status: t.status, tagsJson: t.tagsJson } : r));
  }, G = async (t) => {
    try {
      const a = await p.post(`/api/app/response-management/${i.id}/set-status`, { status: Number(t) });
      V(a), x("success", "Durum güncellendi.");
    } catch (a) {
      x("error", a == null ? void 0 : a.message);
    }
  }, L = async () => {
    if (N.trim())
      try {
        await p.post(`/api/app/response-management/${i.id}/comment`, { text: N.trim() }), D(""), await w(i.id), x("success", "Yorum eklendi.");
      } catch (t) {
        x("error", t == null ? void 0 : t.message);
      }
  }, H = () => {
    const t = ["Tarih", "Durum", "Süre (sn)", ...j.map((o) => o.content)], a = m.map((o) => {
      var A;
      const I = k(o.answers);
      return [
        b(o.creationTime),
        ((A = h[o.status]) == null ? void 0 : A.label) || "",
        o.completionSeconds ?? "",
        ...j.map((K) => W(I[K.id]))
      ];
    }), r = [t, ...a].map((o) => o.map(X).join(",")).join(`\r
`), u = new Blob(["\uFEFF" + r], { type: "text/csv;charset=utf-8;" }), d = document.createElement("a");
    d.href = URL.createObjectURL(u), d.download = `yanitlar-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, d.click(), URL.revokeObjectURL(d.href);
  };
  return M ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ e.jsx(g, { label: "Toplam Yanıt", value: (n == null ? void 0 : n.responseCount) ?? 0, accent: "text-accent" }),
      /* @__PURE__ */ e.jsx(g, { label: "Bugün", value: (n == null ? void 0 : n.todayResponseCount) ?? 0 }),
      /* @__PURE__ */ e.jsx(g, { label: "Bekleyen", value: (n == null ? void 0 : n.pendingResponseCount) ?? 0, accent: "text-warning" }),
      /* @__PURE__ */ e.jsx(g, { label: "Görüntülenme", value: (n == null ? void 0 : n.viewCount) ?? 0 })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-5 flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("h3", { className: "text-sm font-bold text-text-secondary", children: [
        "Yanıtlar (",
        m.length,
        ")"
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex rounded-xl border border-default bg-surface-raised p-0.5", children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => R("list"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${v === "list" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Liste" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => R("table"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${v === "table" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Tablo" })
        ] }),
        /* @__PURE__ */ e.jsx("select", { value: F, onChange: (t) => z(t.target.value), className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm", children: q.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.v, children: t.label }, t.v)) }),
        /* @__PURE__ */ e.jsx("button", { onClick: H, disabled: m.length === 0, className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm font-medium hover:bg-surface-sunken disabled:opacity-50", children: "⬇ CSV" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "mt-3 overflow-x-auto rounded-2xl border border-default bg-surface-raised", children: m.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Henüz yanıt yok." }) : v === "list" ? /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-surface-sunken text-left text-xs font-semibold uppercase text-text-tertiary", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Tarih" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Süre" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-subtle", children: m.map((t) => {
        var a, r;
        return /* @__PURE__ */ e.jsxs("tr", { className: "hover:bg-surface-sunken", children: [
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: b(t.creationTime) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(a = h[t.status]) == null ? void 0 : a.cls}`, children: (r = h[t.status]) == null ? void 0 : r.label }) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-text-secondary", children: B(t.completionSeconds) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ e.jsx("button", { onClick: () => w(t.id), className: "rounded-lg border border-default px-3 py-1 text-xs font-medium hover:bg-surface-sunken", children: "Detay" }) })
        ] }, t.id);
      }) })
    ] }) : /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-surface-sunken text-left text-xs font-semibold uppercase text-text-tertiary", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: "Tarih" }),
        j.map((t) => /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: t.content }, t.id)),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-subtle", children: m.map((t) => {
        var r, u;
        const a = k(t.answers);
        return /* @__PURE__ */ e.jsxs("tr", { className: "cursor-pointer hover:bg-surface-sunken", onClick: () => w(t.id), children: [
          /* @__PURE__ */ e.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-text-secondary", children: b(t.creationTime) }),
          j.map((d) => /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: E(a[d.id]) }, d.id)),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(r = h[t.status]) == null ? void 0 : r.cls}`, children: (u = h[t.status]) == null ? void 0 : u.label }) })
        ] }, t.id);
      }) })
    ] }) }),
    (i || T) && /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex justify-end bg-surface-overlay", onClick: () => y(null), children: /* @__PURE__ */ e.jsx("div", { className: "h-full w-full max-w-lg overflow-y-auto bg-surface-raised p-6 shadow-xl", onClick: (t) => t.stopPropagation(), children: T || !i ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Yükleniyor…" }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold", children: "Yanıt Detayı" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => y(null), className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center gap-2 text-sm text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { children: b(i.creationTime) }),
        "·",
        /* @__PURE__ */ e.jsx("span", { children: B(i.completionSeconds) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Durum" }),
        /* @__PURE__ */ e.jsx("select", { value: i.status, onChange: (t) => G(t.target.value), className: "w-full rounded-xl border border-default px-3 py-2 text-sm", children: Object.entries(h).map(([t, a]) => /* @__PURE__ */ e.jsx("option", { value: t, children: a.label }, t)) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Cevaplar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: Object.entries(k(i.answers)).map(([t, a]) => {
          var r;
          return /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-sunken p-3", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold text-text-secondary", children: ((r = P[t]) == null ? void 0 : r.content) || "Soru" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-primary", children: E(a) })
          ] }, t);
        }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Yorumlar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (i.comments || []).map((t) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl bg-surface-sunken p-2.5 text-sm", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-text-primary", children: t.text }),
          /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 text-[11px] text-text-tertiary", children: b(t.creationTime) })
        ] }, t.id)) }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { value: N, onChange: (t) => D(t.target.value), placeholder: "Yorum ekle…", className: "flex-1 rounded-xl border border-default px-3 py-2 text-sm", onKeyDown: (t) => t.key === "Enter" && L() }),
          /* @__PURE__ */ e.jsx("button", { onClick: L, className: "rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-600", children: "Ekle" })
        ] })
      ] })
    ] }) }) })
  ] });
}
function W(s) {
  return s == null ? "" : Array.isArray(s) ? s.join("; ") : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function X(s) {
  const n = String(s ?? "");
  return /[",\r\n]/.test(n) ? '"' + n.replace(/"/g, '""') + '"' : n;
}
function x(s, n) {
  const l = window.abp;
  l != null && l.notify && s === "success" ? l.notify.success(n) : l != null && l.message ? l.message[s === "error" ? "error" : "info"](n) : console.log(`[${s}] ${n}`);
}
const S = document.getElementById("responses-root");
S && _(S).render(/* @__PURE__ */ e.jsx(Q, { formId: S.getAttribute("data-form-id") }));
