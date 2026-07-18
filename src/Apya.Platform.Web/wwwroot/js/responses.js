import { c as W, j as e, r as d } from "./vendor.js";
import { a as N } from "./vendor2.js";
const X = (s) => {
  var a, r;
  return (r = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : r.isGranted(s);
}, b = { Select: 2, MultiSelect: 3, Rating: 12, Nps: 13, Dropdown: 18 }, ee = /* @__PURE__ */ new Set([b.Select, b.MultiSelect, b.Rating, b.Nps, b.Dropdown]), w = {
  0: { label: "Bekliyor", cls: "bg-amber-100 text-amber-700" },
  1: { label: "İnceleniyor", cls: "bg-blue-100 text-blue-700" },
  2: { label: "İncelendi", cls: "bg-emerald-100 text-emerald-700" }
}, te = [
  { v: "", label: "Tüm durumlar" },
  { v: "0", label: "Bekleyenler" },
  { v: "1", label: "İncelenenler" },
  { v: "2", label: "İncelendi" }
], f = (s) => {
  try {
    return typeof s == "string" ? JSON.parse(s) : s || {};
  } catch {
    return {};
  }
}, S = (s) => {
  try {
    return new Date(s).toLocaleString("tr-TR");
  } catch {
    return s;
  }
}, U = (s) => s == null ? "—" : s < 60 ? `${s}sn` : `${Math.floor(s / 60)}dk ${s % 60}sn`;
function T({ label: s, value: a, accent: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-slate-400", children: s }),
    /* @__PURE__ */ e.jsx("p", { className: `mt-1 text-2xl font-bold ${r || "text-slate-800"}`, children: a })
  ] });
}
function P(s) {
  return s == null || s === "" ? /* @__PURE__ */ e.jsx("span", { className: "text-slate-300", children: "—" }) : Array.isArray(s) ? s.join(", ") : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function se({ formId: s }) {
  const [a, r] = d.useState(null), [x, p] = d.useState([]), [n, i] = d.useState([]), [c, C] = d.useState(""), [z, G] = d.useState(!0), [m, k] = d.useState(null), [B, O] = d.useState(!1), [$, L] = d.useState(""), [v, A] = d.useState("list"), H = d.useMemo(() => Object.fromEntries(x.map((t) => [t.id, t])), [x]), u = d.useMemo(() => x.filter((t) => t.type !== 16 && t.type !== 17), [x]), R = d.useMemo(() => u.filter((t) => ee.has(t.type)), [u]), Y = async (t) => {
    let l = `/api/app/response-management?DocumentId=${s}&MaxResultCount=200&SkipCount=0`;
    t !== "" && (l += `&Status=${t}`);
    const o = await N.get(l);
    i(o.items || []);
  };
  d.useEffect(() => {
    (async () => {
      try {
        const [t, l] = await Promise.all([
          N.get(`/api/app/form/${s}/statistics`),
          N.get(`/api/app/form/${s}`)
        ]);
        r(t), p((l.blocks || []).slice().sort((o, j) => o.order - j.order)), await Y("");
      } catch (t) {
        y("error", (t == null ? void 0 : t.message) || "Yanıtlar yüklenemedi.");
      } finally {
        G(!1);
      }
    })();
  }, [s]);
  const J = async (t) => {
    C(t);
    try {
      await Y(t);
    } catch (l) {
      y("error", l == null ? void 0 : l.message);
    }
  }, D = async (t) => {
    O(!0);
    try {
      const l = await N.get(`/api/app/response-management/${t}`);
      k(l);
    } catch (l) {
      y("error", (l == null ? void 0 : l.message) || "Detay açılamadı.");
    } finally {
      O(!1);
    }
  }, V = (t) => {
    k(t), i((l) => l.map((o) => o.id === t.id ? { ...o, status: t.status, tagsJson: t.tagsJson } : o));
  }, _ = async (t) => {
    try {
      const l = await N.post(`/api/app/response-management/${m.id}/set-status`, { status: Number(t) });
      V(l), y("success", "Durum güncellendi.");
    } catch (l) {
      y("error", l == null ? void 0 : l.message);
    }
  }, M = async () => {
    if ($.trim())
      try {
        await N.post(`/api/app/response-management/${m.id}/comment`, { text: $.trim() }), L(""), await D(m.id), y("success", "Yorum eklendi.");
      } catch (t) {
        y("error", t == null ? void 0 : t.message);
      }
  }, I = () => {
    const t = ["Tarih", "Durum", "Süre (sn)", ...u.map((h) => h.content)], l = n.map((h) => {
      var F;
      const Z = f(h.answers);
      return [
        S(h.creationTime),
        ((F = w[h.status]) == null ? void 0 : F.label) || "",
        h.completionSeconds ?? "",
        ...u.map((q) => ne(Z[q.id]))
      ];
    }), o = [t, ...l].map((h) => h.map(re).join(",")).join(`\r
`), j = new Blob(["\uFEFF" + o], { type: "text/csv;charset=utf-8;" }), g = document.createElement("a");
    g.href = URL.createObjectURL(j), g.download = `yanitlar-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, g.click(), URL.revokeObjectURL(g.href);
  }, K = `/DynamicAssets/Responses?handler=Excel&formId=${s}${c !== "" ? `&status=${c}` : ""}`, Q = X("Platform.DynamicAssets.Export");
  return z ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-slate-400", children: "Yanıtlar yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "text-slate-800", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ e.jsx(T, { label: "Toplam Yanıt", value: (a == null ? void 0 : a.responseCount) ?? 0, accent: "text-indigo-600" }),
      /* @__PURE__ */ e.jsx(T, { label: "Bugün", value: (a == null ? void 0 : a.todayResponseCount) ?? 0 }),
      /* @__PURE__ */ e.jsx(T, { label: "Bekleyen", value: (a == null ? void 0 : a.pendingResponseCount) ?? 0, accent: "text-amber-600" }),
      /* @__PURE__ */ e.jsx(T, { label: "Görüntülenme", value: (a == null ? void 0 : a.viewCount) ?? 0 })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-5 flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("h3", { className: "text-sm font-bold text-slate-600", children: [
        "Yanıtlar (",
        n.length,
        ")"
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex rounded-xl border border-slate-200 bg-white p-0.5", children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => A("list"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${v === "list" ? "bg-indigo-600 text-white" : "text-slate-500"}`, children: "Liste" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => A("table"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${v === "table" ? "bg-indigo-600 text-white" : "text-slate-500"}`, children: "Tablo" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => A("analytics"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${v === "analytics" ? "bg-indigo-600 text-white" : "text-slate-500"}`, children: "Analiz" })
        ] }),
        /* @__PURE__ */ e.jsx("select", { value: c, onChange: (t) => J(t.target.value), className: "rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm", children: te.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.v, children: t.label }, t.v)) }),
        /* @__PURE__ */ e.jsx("button", { onClick: I, disabled: n.length === 0, className: "rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50", children: "⬇ CSV" }),
        Q && /* @__PURE__ */ e.jsx("a", { href: K, className: "rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50", children: "⬇ Excel" })
      ] })
    ] }),
    v === "analytics" ? /* @__PURE__ */ e.jsxs("div", { className: "mt-3", children: [
      R.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-slate-200 bg-white py-16 text-center text-slate-400", children: "Grafik gösterilebilecek soru yok (seçmeli veya derecelendirme tipi bir soru gerekir)." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: R.map((t) => /* @__PURE__ */ e.jsx(ae, { block: t, rows: n }, t.id)) }),
      u.length > R.length && /* @__PURE__ */ e.jsxs("p", { className: "mt-3 text-xs text-slate-400", children: [
        u.length - R.length,
        " soru grafik için uygun değil (metin, tarih, dosya vb. tipte)."
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white", children: n.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-slate-400", children: "Henüz yanıt yok." }) : v === "list" ? /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-slate-50 text-left text-xs font-semibold uppercase text-slate-400", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Tarih" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Süre" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-slate-100", children: n.map((t) => {
        var l, o;
        return /* @__PURE__ */ e.jsxs("tr", { className: "hover:bg-slate-50", children: [
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: S(t.creationTime) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(l = w[t.status]) == null ? void 0 : l.cls}`, children: (o = w[t.status]) == null ? void 0 : o.label }) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-slate-500", children: U(t.completionSeconds) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ e.jsx("button", { onClick: () => D(t.id), className: "rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium hover:bg-slate-50", children: "Detay" }) })
        ] }, t.id);
      }) })
    ] }) : /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-slate-50 text-left text-xs font-semibold uppercase text-slate-400", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: "Tarih" }),
        u.map((t) => /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: t.content }, t.id)),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-slate-100", children: n.map((t) => {
        var o, j;
        const l = f(t.answers);
        return /* @__PURE__ */ e.jsxs("tr", { className: "cursor-pointer hover:bg-slate-50", onClick: () => D(t.id), children: [
          /* @__PURE__ */ e.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-slate-500", children: S(t.creationTime) }),
          u.map((g) => /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: P(l[g.id]) }, g.id)),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(o = w[t.status]) == null ? void 0 : o.cls}`, children: (j = w[t.status]) == null ? void 0 : j.label }) })
        ] }, t.id);
      }) })
    ] }) }),
    (m || B) && /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex justify-end bg-slate-900/40", onClick: () => k(null), children: /* @__PURE__ */ e.jsx("div", { className: "h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl", onClick: (t) => t.stopPropagation(), children: B || !m ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-slate-400", children: "Yükleniyor…" }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold", children: "Yanıt Detayı" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => k(null), className: "rounded p-1 text-slate-400 hover:bg-slate-100", children: "✕" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center gap-2 text-sm text-slate-500", children: [
        /* @__PURE__ */ e.jsx("span", { children: S(m.creationTime) }),
        "·",
        /* @__PURE__ */ e.jsx("span", { children: U(m.completionSeconds) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-slate-400", children: "Durum" }),
        /* @__PURE__ */ e.jsx("select", { value: m.status, onChange: (t) => _(t.target.value), className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm", children: Object.entries(w).map(([t, l]) => /* @__PURE__ */ e.jsx("option", { value: t, children: l.label }, t)) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-slate-400", children: "Cevaplar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: Object.entries(f(m.answers)).map(([t, l]) => {
          var o;
          return /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-slate-100 bg-slate-50 p-3", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold text-slate-500", children: ((o = H[t]) == null ? void 0 : o.content) || "Soru" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-slate-800", children: P(l) })
          ] }, t);
        }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-slate-400", children: "Yorumlar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (m.comments || []).map((t) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl bg-slate-50 p-2.5 text-sm", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-slate-700", children: t.text }),
          /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 text-[11px] text-slate-400", children: S(t.creationTime) })
        ] }, t.id)) }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { value: $, onChange: (t) => L(t.target.value), placeholder: "Yorum ekle…", className: "flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm", onKeyDown: (t) => t.key === "Enter" && M() }),
          /* @__PURE__ */ e.jsx("button", { onClick: M, className: "rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700", children: "Ekle" })
        ] })
      ] })
    ] }) }) })
  ] });
}
function ae({ block: s, rows: a }) {
  const r = d.useRef(null), x = d.useRef(null);
  d.useEffect(() => {
    if (!window.Chart || !r.current) return;
    const { type: n, labels: i, data: c } = le(s, a);
    return x.current = new window.Chart(r.current, {
      type: n,
      data: { labels: i, datasets: [{ label: "Yanıt", data: c, backgroundColor: ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b", "#a3e635"] }] },
      options: {
        responsive: !0,
        plugins: { legend: { display: n === "pie", position: "bottom" } },
        scales: n === "bar" ? { y: { beginAtZero: !0, ticks: { precision: 0 } } } : void 0
      }
    }), () => {
      var C;
      return (C = x.current) == null ? void 0 : C.destroy();
    };
  }, [s, a]);
  const p = a.filter((n) => {
    const i = f(n.answers)[s.id];
    return i != null && i !== "" && !(Array.isArray(i) && i.length === 0);
  }).length;
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-sm font-bold text-slate-700", children: s.content }),
    /* @__PURE__ */ e.jsxs("p", { className: "mb-3 text-xs text-slate-400", children: [
      p,
      " yanıt"
    ] }),
    /* @__PURE__ */ e.jsx("canvas", { ref: r, height: "200" })
  ] });
}
function le(s, a) {
  const x = f(s.settings).options || [];
  if (s.type === b.Rating) {
    const n = [0, 0, 0, 0, 0];
    return a.forEach((i) => {
      const c = Number(f(i.answers)[s.id]);
      c >= 1 && c <= 5 && n[c - 1]++;
    }), { type: "bar", labels: ["1★", "2★", "3★", "4★", "5★"], data: n };
  }
  if (s.type === b.Nps) {
    const n = Array(11).fill(0);
    return a.forEach((i) => {
      const c = Number(f(i.answers)[s.id]);
      c >= 0 && c <= 10 && n[c]++;
    }), { type: "bar", labels: n.map((i, c) => String(c)), data: n };
  }
  const p = Object.fromEntries(x.map((n) => [n, 0]));
  return a.forEach((n) => {
    const i = f(n.answers)[s.id];
    Array.isArray(i) ? i.forEach((c) => {
      c in p && p[c]++;
    }) : i != null && i in p && p[i]++;
  }), { type: s.type === b.MultiSelect ? "bar" : "pie", labels: x, data: x.map((n) => p[n]) };
}
function ne(s) {
  return s == null ? "" : Array.isArray(s) ? s.join("; ") : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function re(s) {
  const a = String(s ?? "");
  return /[",\r\n]/.test(a) ? '"' + a.replace(/"/g, '""') + '"' : a;
}
function y(s, a) {
  const r = window.abp;
  r != null && r.notify && s === "success" ? r.notify.success(a) : r != null && r.message ? r.message[s === "error" ? "error" : "info"](a) : console.log(`[${s}] ${a}`);
}
const E = document.getElementById("responses-root");
E && W(E).render(/* @__PURE__ */ e.jsx(se, { formId: E.getAttribute("data-form-id") }));
