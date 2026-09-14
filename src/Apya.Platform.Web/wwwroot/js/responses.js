import { b as X, j as e, r as d } from "./react-vendor-D57GAUXd.js";
import { a as v } from "./httpClient-DePjXdo1.js";
import { H as ee } from "./Hint-CNW95h3H.js";
/* empty css               */
const te = (s) => {
  var a, l;
  return (l = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : l.isGranted(s);
}, h = { Select: 2, MultiSelect: 3, Rating: 12, Nps: 13, Dropdown: 18 }, se = /* @__PURE__ */ new Set([h.Select, h.MultiSelect, h.Rating, h.Nps, h.Dropdown]), w = {
  0: { label: "Bekliyor", cls: "bg-warning-100 text-warning-700" },
  1: { label: "İnceleniyor", cls: "bg-brand-100 text-brand-700" },
  2: { label: "İncelendi", cls: "bg-positive-100 text-positive-700" }
}, ae = [
  { v: "", label: "Tüm durumlar" },
  { v: "0", label: "Bekleyenler" },
  { v: "1", label: "İncelenenler" },
  { v: "2", label: "İncelendi" }
], b = (s) => {
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
}, H = (s) => s == null ? "—" : s < 60 ? `${s}sn` : `${Math.floor(s / 60)}dk ${s % 60}sn`;
function $({ label: s, value: a, accent: l }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-default bg-surface-raised p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-text-tertiary", children: s }),
    /* @__PURE__ */ e.jsx("p", { className: `mt-1 text-2xl font-bold ${l || "text-text-primary"}`, children: a })
  ] });
}
function z(s) {
  return s == null || s === "" ? /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "—" }) : Array.isArray(s) ? s.join(", ") : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function ne({ formId: s }) {
  const [a, l] = d.useState(null), [m, u] = d.useState([]), [r, i] = d.useState([]), [c, C] = d.useState(""), [P, G] = d.useState(!0), [x, T] = d.useState(null), [F, O] = d.useState(!1), [A, L] = d.useState(""), [k, D] = d.useState("list"), J = d.useMemo(() => Object.fromEntries(m.map((t) => [t.id, t])), [m]), f = d.useMemo(() => m.filter((t) => t.type !== 16 && t.type !== 17), [m]), R = d.useMemo(() => f.filter((t) => se.has(t.type)), [f]), Y = async (t) => {
    let n = `/api/app/response-management?DocumentId=${s}&MaxResultCount=200&SkipCount=0`;
    t !== "" && (n += `&Status=${t}`);
    const o = await v.get(n);
    i(o.items || []);
  };
  d.useEffect(() => {
    (async () => {
      try {
        const [t, n] = await Promise.all([
          v.get(`/api/app/form/${s}/statistics`),
          v.get(`/api/app/form/${s}`)
        ]);
        l(t), u((n.blocks || []).slice().sort((o, N) => o.order - N.order)), await Y("");
      } catch (t) {
        g("error", (t == null ? void 0 : t.message) || "Yanıtlar yüklenemedi.");
      } finally {
        G(!1);
      }
    })();
  }, [s]);
  const V = async (t) => {
    C(t);
    try {
      await Y(t);
    } catch (n) {
      g("error", n == null ? void 0 : n.message);
    }
  }, E = async (t) => {
    O(!0);
    try {
      const n = await v.get(`/api/app/response-management/${t}`);
      T(n);
    } catch (n) {
      g("error", (n == null ? void 0 : n.message) || "Detay açılamadı.");
    } finally {
      O(!1);
    }
  }, _ = (t) => {
    T(t), i((n) => n.map((o) => o.id === t.id ? { ...o, status: t.status, tagsJson: t.tagsJson } : o));
  }, I = async (t) => {
    try {
      const n = await v.post(`/api/app/response-management/${x.id}/set-status`, { status: Number(t) });
      _(n), g("success", "Durum güncellendi.");
    } catch (n) {
      g("error", n == null ? void 0 : n.message);
    }
  }, M = async () => {
    if (A.trim())
      try {
        await v.post(`/api/app/response-management/${x.id}/comment`, { text: A.trim() }), L(""), await E(x.id), g("success", "Yorum eklendi.");
      } catch (t) {
        g("error", t == null ? void 0 : t.message);
      }
  }, j = r.some((t) => t.tenantName), K = () => {
    const t = ["Tarih", ...j ? ["Firma"] : [], "Durum", "Süre (sn)", ...f.map((p) => p.content)], n = r.map((p) => {
      var U;
      const q = b(p.answers);
      return [
        S(p.creationTime),
        ...j ? [p.tenantName || ""] : [],
        ((U = w[p.status]) == null ? void 0 : U.label) || "",
        p.completionSeconds ?? "",
        ...f.map((W) => ie(q[W.id]))
      ];
    }), o = [t, ...n].map((p) => p.map(ce).join(",")).join(`\r
`), N = new Blob(["\uFEFF" + o], { type: "text/csv;charset=utf-8;" }), y = document.createElement("a");
    y.href = URL.createObjectURL(N), y.download = `yanitlar-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, y.click(), URL.revokeObjectURL(y.href);
  }, Q = `/DynamicAssets/Responses?handler=Excel&formId=${s}${c !== "" ? `&status=${c}` : ""}`, Z = te("Platform.DynamicAssets.Export");
  return P ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ e.jsx($, { label: "Toplam Yanıt", value: (a == null ? void 0 : a.responseCount) ?? 0, accent: "text-accent" }),
      /* @__PURE__ */ e.jsx($, { label: "Bugün", value: (a == null ? void 0 : a.todayResponseCount) ?? 0 }),
      /* @__PURE__ */ e.jsx($, { label: "Bekleyen", value: (a == null ? void 0 : a.pendingResponseCount) ?? 0, accent: "text-warning" }),
      /* @__PURE__ */ e.jsx($, { label: "Görüntülenme", value: (a == null ? void 0 : a.viewCount) ?? 0 })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-5 flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("h3", { className: "text-sm font-bold text-text-secondary", children: [
        "Yanıtlar (",
        r.length,
        ")"
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex rounded-xl border border-default bg-surface-raised p-0.5", children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => D("list"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${k === "list" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Liste" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => D("table"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${k === "table" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Tablo" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => D("analytics"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${k === "analytics" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Analiz" })
        ] }),
        /* @__PURE__ */ e.jsx("select", { value: c, onChange: (t) => V(t.target.value), className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm", children: ae.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.v, children: t.label }, t.v)) }),
        /* @__PURE__ */ e.jsx("button", { onClick: K, disabled: r.length === 0, className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm font-medium hover:bg-surface-sunken disabled:opacity-50", children: "⬇ CSV" }),
        /* @__PURE__ */ e.jsx(ee, { placement: "bottom", text: "CSV dosyası tarayıcıda, ekranda yüklü yanıtlardan üretilir — en fazla 200 kayıt. Tüm yanıtlar için Excel'i kullanın." }),
        Z && /* @__PURE__ */ e.jsx("a", { href: Q, className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm font-medium hover:bg-surface-sunken", children: "⬇ Excel" })
      ] })
    ] }),
    k === "analytics" ? /* @__PURE__ */ e.jsxs("div", { className: "mt-3", children: [
      R.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-default bg-surface-raised py-16 text-center text-text-tertiary", children: "Grafik gösterilebilecek soru yok (seçmeli veya derecelendirme tipi bir soru gerekir)." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: R.map((t) => /* @__PURE__ */ e.jsx(re, { block: t, rows: r }, t.id)) }),
      f.length > R.length && /* @__PURE__ */ e.jsxs("p", { className: "mt-3 text-xs text-text-tertiary", children: [
        f.length - R.length,
        " soru grafik için uygun değil (metin, tarih, dosya vb. tipte)."
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "mt-3 overflow-x-auto rounded-2xl border border-default bg-surface-raised", children: r.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Henüz yanıt yok." }) : k === "list" ? /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-surface-sunken text-left text-xs font-semibold uppercase text-text-tertiary", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Tarih" }),
        j && /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Firma" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Süre" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-subtle", children: r.map((t) => {
        var n, o;
        return /* @__PURE__ */ e.jsxs("tr", { className: "hover:bg-surface-sunken", children: [
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: S(t.creationTime) }),
          j && /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 font-medium", children: t.tenantName || "—" }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(n = w[t.status]) == null ? void 0 : n.cls}`, children: (o = w[t.status]) == null ? void 0 : o.label }) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-text-secondary", children: H(t.completionSeconds) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ e.jsx("button", { onClick: () => E(t.id), className: "rounded-lg border border-default px-3 py-1 text-xs font-medium hover:bg-surface-sunken", children: "Detay" }) })
        ] }, t.id);
      }) })
    ] }) : /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-surface-sunken text-left text-xs font-semibold uppercase text-text-tertiary", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: "Tarih" }),
        j && /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: "Firma" }),
        f.map((t) => /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: t.content }, t.id)),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-subtle", children: r.map((t) => {
        var o, N;
        const n = b(t.answers);
        return /* @__PURE__ */ e.jsxs("tr", { className: "cursor-pointer hover:bg-surface-sunken", onClick: () => E(t.id), children: [
          /* @__PURE__ */ e.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-text-secondary", children: S(t.creationTime) }),
          j && /* @__PURE__ */ e.jsx("td", { className: "whitespace-nowrap px-4 py-3 font-medium", children: t.tenantName || "—" }),
          f.map((y) => /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: z(n[y.id]) }, y.id)),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(o = w[t.status]) == null ? void 0 : o.cls}`, children: (N = w[t.status]) == null ? void 0 : N.label }) })
        ] }, t.id);
      }) })
    ] }) }),
    (x || F) && /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex justify-end bg-surface-overlay", onClick: () => T(null), children: /* @__PURE__ */ e.jsx("div", { className: "h-full w-full max-w-lg overflow-y-auto bg-surface-raised p-6 shadow-xl", onClick: (t) => t.stopPropagation(), children: F || !x ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Yükleniyor…" }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold", children: "Yanıt Detayı" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => T(null), className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-2 text-sm text-text-secondary", children: [
        x.tenantName && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: x.tenantName }),
          "·"
        ] }),
        /* @__PURE__ */ e.jsx("span", { children: S(x.creationTime) }),
        "·",
        /* @__PURE__ */ e.jsx("span", { children: H(x.completionSeconds) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Durum" }),
        /* @__PURE__ */ e.jsx("select", { value: x.status, onChange: (t) => I(t.target.value), className: "w-full rounded-xl border border-default px-3 py-2 text-sm", children: Object.entries(w).map(([t, n]) => /* @__PURE__ */ e.jsx("option", { value: t, children: n.label }, t)) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Cevaplar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: Object.entries(b(x.answers)).map(([t, n]) => {
          var o;
          return /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-sunken p-3", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold text-text-secondary", children: ((o = J[t]) == null ? void 0 : o.content) || "Soru" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-primary", children: z(n) })
          ] }, t);
        }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Yorumlar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (x.comments || []).map((t) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl bg-surface-sunken p-2.5 text-sm", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-text-primary", children: t.text }),
          /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 text-[11px] text-text-tertiary", children: S(t.creationTime) })
        ] }, t.id)) }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { value: A, onChange: (t) => L(t.target.value), placeholder: "Yorum ekle…", className: "flex-1 rounded-xl border border-default px-3 py-2 text-sm", onKeyDown: (t) => t.key === "Enter" && M() }),
          /* @__PURE__ */ e.jsx("button", { onClick: M, className: "rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-600", children: "Ekle" })
        ] })
      ] })
    ] }) }) })
  ] });
}
function re({ block: s, rows: a }) {
  const l = d.useRef(null), m = d.useRef(null);
  d.useEffect(() => {
    if (!window.Chart || !l.current) return;
    const { type: r, labels: i, data: c } = le(s, a);
    return m.current = new window.Chart(l.current, {
      type: r,
      data: { labels: i, datasets: [{ label: "Yanıt", data: c, backgroundColor: ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b", "#a3e635"] }] },
      options: {
        responsive: !0,
        plugins: { legend: { display: r === "pie", position: "bottom" } },
        scales: r === "bar" ? { y: { beginAtZero: !0, ticks: { precision: 0 } } } : void 0
      }
    }), () => {
      var C;
      return (C = m.current) == null ? void 0 : C.destroy();
    };
  }, [s, a]);
  const u = a.filter((r) => {
    const i = b(r.answers)[s.id];
    return i != null && i !== "" && !(Array.isArray(i) && i.length === 0);
  }).length;
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-default bg-surface-raised p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-sm font-bold text-text-primary", children: s.content }),
    /* @__PURE__ */ e.jsxs("p", { className: "mb-3 text-xs text-text-tertiary", children: [
      u,
      " yanıt"
    ] }),
    /* @__PURE__ */ e.jsx("canvas", { ref: l, height: "200" })
  ] });
}
function le(s, a) {
  const m = b(s.settings).options || [];
  if (s.type === h.Rating) {
    const r = [0, 0, 0, 0, 0];
    return a.forEach((i) => {
      const c = Number(b(i.answers)[s.id]);
      c >= 1 && c <= 5 && r[c - 1]++;
    }), { type: "bar", labels: ["1★", "2★", "3★", "4★", "5★"], data: r };
  }
  if (s.type === h.Nps) {
    const r = Array(11).fill(0);
    return a.forEach((i) => {
      const c = Number(b(i.answers)[s.id]);
      c >= 0 && c <= 10 && r[c]++;
    }), { type: "bar", labels: r.map((i, c) => String(c)), data: r };
  }
  const u = Object.fromEntries(m.map((r) => [r, 0]));
  return a.forEach((r) => {
    const i = b(r.answers)[s.id];
    Array.isArray(i) ? i.forEach((c) => {
      c in u && u[c]++;
    }) : i != null && i in u && u[i]++;
  }), { type: s.type === h.MultiSelect ? "bar" : "pie", labels: m, data: m.map((r) => u[r]) };
}
function ie(s) {
  return s == null ? "" : Array.isArray(s) ? s.join("; ") : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function ce(s) {
  const a = String(s ?? "");
  return /[",\r\n]/.test(a) ? '"' + a.replace(/"/g, '""') + '"' : a;
}
function g(s, a) {
  const l = window.abp;
  l != null && l.notify && s === "success" ? l.notify.success(a) : l != null && l.message ? l.message[s === "error" ? "error" : "info"](a) : console.log(`[${s}] ${a}`);
}
const B = document.getElementById("responses-root");
B && X(B).render(/* @__PURE__ */ e.jsx(ne, { formId: B.getAttribute("data-form-id") }));
