import { b as ee, j as e, r as d } from "./react-vendor-D57GAUXd.js";
import { a as v } from "./httpClient-DePjXdo1.js";
import { H as te } from "./Hint-CNW95h3H.js";
import { c as T } from "./formChoices-CM6Xg9_c.js";
/* empty css               */
const se = (s) => {
  var a, c;
  return (c = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : c.isGranted(s);
}, y = { Select: 2, MultiSelect: 3, Rating: 12, Nps: 13, Dropdown: 18 }, ae = /* @__PURE__ */ new Set([y.Select, y.MultiSelect, y.Rating, y.Nps, y.Dropdown]), k = {
  0: { label: "Bekliyor", cls: "bg-warning-100 text-warning-700" },
  1: { label: "İnceleniyor", cls: "bg-brand-100 text-brand-700" },
  2: { label: "İncelendi", cls: "bg-positive-100 text-positive-700" }
}, ne = [
  { v: "", label: "Tüm durumlar" },
  { v: "0", label: "Bekleyenler" },
  { v: "1", label: "İncelenenler" },
  { v: "2", label: "İncelendi" }
], h = (s) => {
  try {
    return typeof s == "string" ? JSON.parse(s) : s || {};
  } catch {
    return {};
  }
}, C = (s) => {
  try {
    return new Date(s).toLocaleString("tr-TR");
  } catch {
    return s;
  }
}, z = (s) => s == null ? "—" : s < 60 ? `${s}sn` : `${Math.floor(s / 60)}dk ${s % 60}sn`;
function $({ label: s, value: a, accent: c }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-default bg-surface-raised p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-text-tertiary", children: s }),
    /* @__PURE__ */ e.jsx("p", { className: `mt-1 text-2xl font-bold ${c || "text-text-primary"}`, children: a })
  ] });
}
function P(s) {
  return s == null || s === "" ? /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "—" }) : Array.isArray(s) ? s.join(", ") : T(s) != null ? T(s) : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function re({ formId: s }) {
  const [a, c] = d.useState(null), [m, p] = d.useState([]), [n, i] = d.useState([]), [l, u] = d.useState(""), [G, J] = d.useState(!0), [x, R] = d.useState(null), [B, F] = d.useState(!1), [A, Y] = d.useState(""), [S, D] = d.useState("list"), V = d.useMemo(() => Object.fromEntries(m.map((t) => [t.id, t])), [m]), b = d.useMemo(() => m.filter((t) => t.type !== 16 && t.type !== 17), [m]), E = d.useMemo(() => b.filter((t) => ae.has(t.type)), [b]), M = async (t) => {
    let r = `/api/app/response-management?DocumentId=${s}&MaxResultCount=200&SkipCount=0`;
    t !== "" && (r += `&Status=${t}`);
    const o = await v.get(r);
    i(o.items || []);
  };
  d.useEffect(() => {
    (async () => {
      try {
        const [t, r] = await Promise.all([
          v.get(`/api/app/form/${s}/statistics`),
          v.get(`/api/app/form/${s}`)
        ]);
        c(t), p((r.blocks || []).slice().sort((o, w) => o.order - w.order)), await M("");
      } catch (t) {
        j("error", (t == null ? void 0 : t.message) || "Yanıtlar yüklenemedi.");
      } finally {
        J(!1);
      }
    })();
  }, [s]);
  const _ = async (t) => {
    u(t);
    try {
      await M(t);
    } catch (r) {
      j("error", r == null ? void 0 : r.message);
    }
  }, L = async (t) => {
    F(!0);
    try {
      const r = await v.get(`/api/app/response-management/${t}`);
      R(r);
    } catch (r) {
      j("error", (r == null ? void 0 : r.message) || "Detay açılamadı.");
    } finally {
      F(!1);
    }
  }, I = (t) => {
    R(t), i((r) => r.map((o) => o.id === t.id ? { ...o, status: t.status, tagsJson: t.tagsJson } : o));
  }, K = async (t) => {
    try {
      const r = await v.post(`/api/app/response-management/${x.id}/set-status`, { status: Number(t) });
      I(r), j("success", "Durum güncellendi.");
    } catch (r) {
      j("error", r == null ? void 0 : r.message);
    }
  }, U = async () => {
    if (A.trim())
      try {
        await v.post(`/api/app/response-management/${x.id}/comment`, { text: A.trim() }), Y(""), await L(x.id), j("success", "Yorum eklendi.");
      } catch (t) {
        j("error", t == null ? void 0 : t.message);
      }
  }, N = n.some((t) => t.tenantName), Q = () => {
    const t = ["Tarih", ...N ? ["Firma"] : [], "Durum", "Süre (sn)", ...b.map((f) => f.content)], r = n.map((f) => {
      var H;
      const W = h(f.answers);
      return [
        C(f.creationTime),
        ...N ? [f.tenantName || ""] : [],
        ((H = k[f.status]) == null ? void 0 : H.label) || "",
        f.completionSeconds ?? "",
        ...b.map((X) => ce(W[X.id]))
      ];
    }), o = [t, ...r].map((f) => f.map(oe).join(",")).join(`\r
`), w = new Blob(["\uFEFF" + o], { type: "text/csv;charset=utf-8;" }), g = document.createElement("a");
    g.href = URL.createObjectURL(w), g.download = `yanitlar-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, g.click(), URL.revokeObjectURL(g.href);
  }, Z = `/DynamicAssets/Responses?handler=Excel&formId=${s}${l !== "" ? `&status=${l}` : ""}`, q = se("Platform.DynamicAssets.Export");
  return G ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ e.jsx($, { label: "Toplam Yanıt", value: (a == null ? void 0 : a.responseCount) ?? 0, accent: "text-accent" }),
      /* @__PURE__ */ e.jsx($, { label: "Bugün", value: (a == null ? void 0 : a.todayResponseCount) ?? 0 }),
      /* @__PURE__ */ e.jsx($, { label: "Bekleyen", value: (a == null ? void 0 : a.pendingResponseCount) ?? 0, accent: "text-warning" }),
      /* @__PURE__ */ e.jsx($, { label: "Görüntülenme", value: (a == null ? void 0 : a.viewCount) ?? 0 })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-5 flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("h3", { className: "text-sm font-bold text-text-secondary", children: [
        "Yanıtlar (",
        n.length,
        ")"
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex rounded-xl border border-default bg-surface-raised p-0.5", children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => D("list"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${S === "list" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Liste" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => D("table"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${S === "table" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Tablo" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => D("analytics"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${S === "analytics" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Analiz" })
        ] }),
        /* @__PURE__ */ e.jsx("select", { value: l, onChange: (t) => _(t.target.value), className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm", children: ne.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.v, children: t.label }, t.v)) }),
        /* @__PURE__ */ e.jsx("button", { onClick: Q, disabled: n.length === 0, className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm font-medium hover:bg-surface-sunken disabled:opacity-50", children: "⬇ CSV" }),
        /* @__PURE__ */ e.jsx(te, { placement: "bottom", text: "CSV dosyası tarayıcıda, ekranda yüklü yanıtlardan üretilir — en fazla 200 kayıt. Tüm yanıtlar için Excel'i kullanın." }),
        q && /* @__PURE__ */ e.jsx("a", { href: Z, className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm font-medium hover:bg-surface-sunken", children: "⬇ Excel" })
      ] })
    ] }),
    S === "analytics" ? /* @__PURE__ */ e.jsxs("div", { className: "mt-3", children: [
      E.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-default bg-surface-raised py-16 text-center text-text-tertiary", children: "Grafik gösterilebilecek soru yok (seçmeli veya derecelendirme tipi bir soru gerekir)." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: E.map((t) => /* @__PURE__ */ e.jsx(le, { block: t, rows: n }, t.id)) }),
      b.length > E.length && /* @__PURE__ */ e.jsxs("p", { className: "mt-3 text-xs text-text-tertiary", children: [
        b.length - E.length,
        " soru grafik için uygun değil (metin, tarih, dosya vb. tipte)."
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "mt-3 overflow-x-auto rounded-2xl border border-default bg-surface-raised", children: n.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Henüz yanıt yok." }) : S === "list" ? /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-surface-sunken text-left text-xs font-semibold uppercase text-text-tertiary", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Tarih" }),
        N && /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Firma" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Süre" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-subtle", children: n.map((t) => {
        var r, o;
        return /* @__PURE__ */ e.jsxs("tr", { className: "hover:bg-surface-sunken", children: [
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: C(t.creationTime) }),
          N && /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 font-medium", children: t.tenantName || "—" }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(r = k[t.status]) == null ? void 0 : r.cls}`, children: (o = k[t.status]) == null ? void 0 : o.label }) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-text-secondary", children: z(t.completionSeconds) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ e.jsx("button", { onClick: () => L(t.id), className: "rounded-lg border border-default px-3 py-1 text-xs font-medium hover:bg-surface-sunken", children: "Detay" }) })
        ] }, t.id);
      }) })
    ] }) : /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-surface-sunken text-left text-xs font-semibold uppercase text-text-tertiary", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: "Tarih" }),
        N && /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: "Firma" }),
        b.map((t) => /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: t.content }, t.id)),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-subtle", children: n.map((t) => {
        var o, w;
        const r = h(t.answers);
        return /* @__PURE__ */ e.jsxs("tr", { className: "cursor-pointer hover:bg-surface-sunken", onClick: () => L(t.id), children: [
          /* @__PURE__ */ e.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-text-secondary", children: C(t.creationTime) }),
          N && /* @__PURE__ */ e.jsx("td", { className: "whitespace-nowrap px-4 py-3 font-medium", children: t.tenantName || "—" }),
          b.map((g) => /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: P(r[g.id]) }, g.id)),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(o = k[t.status]) == null ? void 0 : o.cls}`, children: (w = k[t.status]) == null ? void 0 : w.label }) })
        ] }, t.id);
      }) })
    ] }) }),
    (x || B) && /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex justify-end bg-surface-overlay", onClick: () => R(null), children: /* @__PURE__ */ e.jsx("div", { className: "h-full w-full max-w-lg overflow-y-auto bg-surface-raised p-6 shadow-xl", onClick: (t) => t.stopPropagation(), children: B || !x ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Yükleniyor…" }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold", children: "Yanıt Detayı" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => R(null), className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-2 text-sm text-text-secondary", children: [
        x.tenantName && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: x.tenantName }),
          "·"
        ] }),
        /* @__PURE__ */ e.jsx("span", { children: C(x.creationTime) }),
        "·",
        /* @__PURE__ */ e.jsx("span", { children: z(x.completionSeconds) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Durum" }),
        /* @__PURE__ */ e.jsx("select", { value: x.status, onChange: (t) => K(t.target.value), className: "w-full rounded-xl border border-default px-3 py-2 text-sm", children: Object.entries(k).map(([t, r]) => /* @__PURE__ */ e.jsx("option", { value: t, children: r.label }, t)) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Cevaplar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: Object.entries(h(x.answers)).map(([t, r]) => {
          var o;
          return /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-sunken p-3", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold text-text-secondary", children: ((o = V[t]) == null ? void 0 : o.content) || "Soru" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-primary", children: P(r) })
          ] }, t);
        }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Yorumlar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (x.comments || []).map((t) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl bg-surface-sunken p-2.5 text-sm", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-text-primary", children: t.text }),
          /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 text-[11px] text-text-tertiary", children: C(t.creationTime) })
        ] }, t.id)) }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { value: A, onChange: (t) => Y(t.target.value), placeholder: "Yorum ekle…", className: "flex-1 rounded-xl border border-default px-3 py-2 text-sm", onKeyDown: (t) => t.key === "Enter" && U() }),
          /* @__PURE__ */ e.jsx("button", { onClick: U, className: "rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-600", children: "Ekle" })
        ] })
      ] })
    ] }) }) })
  ] });
}
function le({ block: s, rows: a }) {
  const c = d.useRef(null), m = d.useRef(null);
  d.useEffect(() => {
    if (!window.Chart || !c.current) return;
    const { type: n, labels: i, data: l } = ie(s, a);
    return m.current = new window.Chart(c.current, {
      type: n,
      data: { labels: i, datasets: [{ label: "Yanıt", data: l, backgroundColor: ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b", "#a3e635"] }] },
      options: {
        responsive: !0,
        plugins: { legend: { display: n === "pie", position: "bottom" } },
        scales: n === "bar" ? { y: { beginAtZero: !0, ticks: { precision: 0 } } } : void 0
      }
    }), () => {
      var u;
      return (u = m.current) == null ? void 0 : u.destroy();
    };
  }, [s, a]);
  const p = a.filter((n) => {
    const i = h(n.answers)[s.id];
    return i != null && i !== "" && !(Array.isArray(i) && i.length === 0);
  }).length;
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-default bg-surface-raised p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-sm font-bold text-text-primary", children: s.content }),
    /* @__PURE__ */ e.jsxs("p", { className: "mb-3 text-xs text-text-tertiary", children: [
      p,
      " yanıt"
    ] }),
    /* @__PURE__ */ e.jsx("canvas", { ref: c, height: "200" })
  ] });
}
function ie(s, a) {
  const c = h(s.settings), m = c.options || [];
  if (s.type === y.Rating) {
    const n = [0, 0, 0, 0, 0];
    return a.forEach((i) => {
      const l = Number(h(i.answers)[s.id]);
      l >= 1 && l <= 5 && n[l - 1]++;
    }), { type: "bar", labels: ["1★", "2★", "3★", "4★", "5★"], data: n };
  }
  if (s.type === y.Nps) {
    const n = Array(11).fill(0);
    return a.forEach((i) => {
      const l = Number(h(i.answers)[s.id]);
      l >= 0 && l <= 10 && n[l]++;
    }), { type: "bar", labels: n.map((i, l) => String(l)), data: n };
  }
  if (c.source) {
    const n = {};
    a.forEach((l) => {
      const u = T(h(l.answers)[s.id]);
      u && (n[u] = (n[u] || 0) + 1);
    });
    const i = Object.keys(n).sort((l, u) => n[u] - n[l]);
    return { type: "pie", labels: i, data: i.map((l) => n[l]) };
  }
  const p = Object.fromEntries(m.map((n) => [n, 0]));
  return a.forEach((n) => {
    const i = h(n.answers)[s.id];
    Array.isArray(i) ? i.forEach((l) => {
      l in p && p[l]++;
    }) : i != null && i in p && p[i]++;
  }), { type: s.type === y.MultiSelect ? "bar" : "pie", labels: m, data: m.map((n) => p[n]) };
}
function ce(s) {
  return s == null ? "" : Array.isArray(s) ? s.join("; ") : T(s) != null ? T(s) : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function oe(s) {
  const a = String(s ?? "");
  return /[",\r\n]/.test(a) ? '"' + a.replace(/"/g, '""') + '"' : a;
}
function j(s, a) {
  const c = window.abp;
  c != null && c.notify && s === "success" ? c.notify.success(a) : c != null && c.message ? c.message[s === "error" ? "error" : "info"](a) : console.log(`[${s}] ${a}`);
}
const O = document.getElementById("responses-root");
O && ee(O).render(/* @__PURE__ */ e.jsx(re, { formId: O.getAttribute("data-form-id") }));
