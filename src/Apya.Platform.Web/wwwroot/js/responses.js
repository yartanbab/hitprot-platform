import { b as W, j as e, r as d } from "./react-vendor-D57GAUXd.js";
import { a as N } from "./httpClient-CRlyQ1eg.js";
import { H as X } from "./Hint-CNW95h3H.js";
/* empty css               */
const ee = (s) => {
  var a, l;
  return (l = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : l.isGranted(s);
}, h = { Select: 2, MultiSelect: 3, Rating: 12, Nps: 13, Dropdown: 18 }, te = /* @__PURE__ */ new Set([h.Select, h.MultiSelect, h.Rating, h.Nps, h.Dropdown]), v = {
  0: { label: "Bekliyor", cls: "bg-warning-100 text-warning-700" },
  1: { label: "İnceleniyor", cls: "bg-brand-100 text-brand-700" },
  2: { label: "İncelendi", cls: "bg-positive-100 text-positive-700" }
}, se = [
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
}, k = (s) => {
  try {
    return new Date(s).toLocaleString("tr-TR");
  } catch {
    return s;
  }
}, U = (s) => s == null ? "—" : s < 60 ? `${s}sn` : `${Math.floor(s / 60)}dk ${s % 60}sn`;
function R({ label: s, value: a, accent: l }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-default bg-surface-raised p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-text-tertiary", children: s }),
    /* @__PURE__ */ e.jsx("p", { className: `mt-1 text-2xl font-bold ${l || "text-text-primary"}`, children: a })
  ] });
}
function H(s) {
  return s == null || s === "" ? /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "—" }) : Array.isArray(s) ? s.join(", ") : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function ae({ formId: s }) {
  const [a, l] = d.useState(null), [x, m] = d.useState([]), [n, i] = d.useState([]), [c, S] = d.useState(""), [z, P] = d.useState(!0), [u, C] = d.useState(null), [B, O] = d.useState(!1), [$, L] = d.useState(""), [w, A] = d.useState("list"), G = d.useMemo(() => Object.fromEntries(x.map((t) => [t.id, t])), [x]), p = d.useMemo(() => x.filter((t) => t.type !== 16 && t.type !== 17), [x]), T = d.useMemo(() => p.filter((t) => te.has(t.type)), [p]), Y = async (t) => {
    let r = `/api/app/response-management?DocumentId=${s}&MaxResultCount=200&SkipCount=0`;
    t !== "" && (r += `&Status=${t}`);
    const o = await N.get(r);
    i(o.items || []);
  };
  d.useEffect(() => {
    (async () => {
      try {
        const [t, r] = await Promise.all([
          N.get(`/api/app/form/${s}/statistics`),
          N.get(`/api/app/form/${s}`)
        ]);
        l(t), m((r.blocks || []).slice().sort((o, j) => o.order - j.order)), await Y("");
      } catch (t) {
        g("error", (t == null ? void 0 : t.message) || "Yanıtlar yüklenemedi.");
      } finally {
        P(!1);
      }
    })();
  }, [s]);
  const J = async (t) => {
    S(t);
    try {
      await Y(t);
    } catch (r) {
      g("error", r == null ? void 0 : r.message);
    }
  }, D = async (t) => {
    O(!0);
    try {
      const r = await N.get(`/api/app/response-management/${t}`);
      C(r);
    } catch (r) {
      g("error", (r == null ? void 0 : r.message) || "Detay açılamadı.");
    } finally {
      O(!1);
    }
  }, V = (t) => {
    C(t), i((r) => r.map((o) => o.id === t.id ? { ...o, status: t.status, tagsJson: t.tagsJson } : o));
  }, _ = async (t) => {
    try {
      const r = await N.post(`/api/app/response-management/${u.id}/set-status`, { status: Number(t) });
      V(r), g("success", "Durum güncellendi.");
    } catch (r) {
      g("error", r == null ? void 0 : r.message);
    }
  }, M = async () => {
    if ($.trim())
      try {
        await N.post(`/api/app/response-management/${u.id}/comment`, { text: $.trim() }), L(""), await D(u.id), g("success", "Yorum eklendi.");
      } catch (t) {
        g("error", t == null ? void 0 : t.message);
      }
  }, I = () => {
    const t = ["Tarih", "Durum", "Süre (sn)", ...p.map((f) => f.content)], r = n.map((f) => {
      var F;
      const Z = b(f.answers);
      return [
        k(f.creationTime),
        ((F = v[f.status]) == null ? void 0 : F.label) || "",
        f.completionSeconds ?? "",
        ...p.map((q) => le(Z[q.id]))
      ];
    }), o = [t, ...r].map((f) => f.map(ie).join(",")).join(`\r
`), j = new Blob(["\uFEFF" + o], { type: "text/csv;charset=utf-8;" }), y = document.createElement("a");
    y.href = URL.createObjectURL(j), y.download = `yanitlar-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, y.click(), URL.revokeObjectURL(y.href);
  }, K = `/DynamicAssets/Responses?handler=Excel&formId=${s}${c !== "" ? `&status=${c}` : ""}`, Q = ee("Platform.DynamicAssets.Export");
  return z ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ e.jsx(R, { label: "Toplam Yanıt", value: (a == null ? void 0 : a.responseCount) ?? 0, accent: "text-accent" }),
      /* @__PURE__ */ e.jsx(R, { label: "Bugün", value: (a == null ? void 0 : a.todayResponseCount) ?? 0 }),
      /* @__PURE__ */ e.jsx(R, { label: "Bekleyen", value: (a == null ? void 0 : a.pendingResponseCount) ?? 0, accent: "text-warning" }),
      /* @__PURE__ */ e.jsx(R, { label: "Görüntülenme", value: (a == null ? void 0 : a.viewCount) ?? 0 })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-5 flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("h3", { className: "text-sm font-bold text-text-secondary", children: [
        "Yanıtlar (",
        n.length,
        ")"
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex rounded-xl border border-default bg-surface-raised p-0.5", children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => A("list"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${w === "list" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Liste" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => A("table"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${w === "table" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Tablo" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => A("analytics"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${w === "analytics" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Analiz" })
        ] }),
        /* @__PURE__ */ e.jsx("select", { value: c, onChange: (t) => J(t.target.value), className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm", children: se.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.v, children: t.label }, t.v)) }),
        /* @__PURE__ */ e.jsx("button", { onClick: I, disabled: n.length === 0, className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm font-medium hover:bg-surface-sunken disabled:opacity-50", children: "⬇ CSV" }),
        /* @__PURE__ */ e.jsx(X, { placement: "bottom", text: "CSV dosyası tarayıcıda, ekranda yüklü yanıtlardan üretilir — en fazla 200 kayıt. Tüm yanıtlar için Excel'i kullanın." }),
        Q && /* @__PURE__ */ e.jsx("a", { href: K, className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm font-medium hover:bg-surface-sunken", children: "⬇ Excel" })
      ] })
    ] }),
    w === "analytics" ? /* @__PURE__ */ e.jsxs("div", { className: "mt-3", children: [
      T.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-default bg-surface-raised py-16 text-center text-text-tertiary", children: "Grafik gösterilebilecek soru yok (seçmeli veya derecelendirme tipi bir soru gerekir)." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: T.map((t) => /* @__PURE__ */ e.jsx(re, { block: t, rows: n }, t.id)) }),
      p.length > T.length && /* @__PURE__ */ e.jsxs("p", { className: "mt-3 text-xs text-text-tertiary", children: [
        p.length - T.length,
        " soru grafik için uygun değil (metin, tarih, dosya vb. tipte)."
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "mt-3 overflow-x-auto rounded-2xl border border-default bg-surface-raised", children: n.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Henüz yanıt yok." }) : w === "list" ? /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-surface-sunken text-left text-xs font-semibold uppercase text-text-tertiary", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Tarih" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Süre" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-subtle", children: n.map((t) => {
        var r, o;
        return /* @__PURE__ */ e.jsxs("tr", { className: "hover:bg-surface-sunken", children: [
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: k(t.creationTime) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(r = v[t.status]) == null ? void 0 : r.cls}`, children: (o = v[t.status]) == null ? void 0 : o.label }) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-text-secondary", children: U(t.completionSeconds) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ e.jsx("button", { onClick: () => D(t.id), className: "rounded-lg border border-default px-3 py-1 text-xs font-medium hover:bg-surface-sunken", children: "Detay" }) })
        ] }, t.id);
      }) })
    ] }) : /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-surface-sunken text-left text-xs font-semibold uppercase text-text-tertiary", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: "Tarih" }),
        p.map((t) => /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: t.content }, t.id)),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-subtle", children: n.map((t) => {
        var o, j;
        const r = b(t.answers);
        return /* @__PURE__ */ e.jsxs("tr", { className: "cursor-pointer hover:bg-surface-sunken", onClick: () => D(t.id), children: [
          /* @__PURE__ */ e.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-text-secondary", children: k(t.creationTime) }),
          p.map((y) => /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: H(r[y.id]) }, y.id)),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(o = v[t.status]) == null ? void 0 : o.cls}`, children: (j = v[t.status]) == null ? void 0 : j.label }) })
        ] }, t.id);
      }) })
    ] }) }),
    (u || B) && /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex justify-end bg-surface-overlay", onClick: () => C(null), children: /* @__PURE__ */ e.jsx("div", { className: "h-full w-full max-w-lg overflow-y-auto bg-surface-raised p-6 shadow-xl", onClick: (t) => t.stopPropagation(), children: B || !u ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Yükleniyor…" }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold", children: "Yanıt Detayı" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => C(null), className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center gap-2 text-sm text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { children: k(u.creationTime) }),
        "·",
        /* @__PURE__ */ e.jsx("span", { children: U(u.completionSeconds) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Durum" }),
        /* @__PURE__ */ e.jsx("select", { value: u.status, onChange: (t) => _(t.target.value), className: "w-full rounded-xl border border-default px-3 py-2 text-sm", children: Object.entries(v).map(([t, r]) => /* @__PURE__ */ e.jsx("option", { value: t, children: r.label }, t)) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Cevaplar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: Object.entries(b(u.answers)).map(([t, r]) => {
          var o;
          return /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-sunken p-3", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold text-text-secondary", children: ((o = G[t]) == null ? void 0 : o.content) || "Soru" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-primary", children: H(r) })
          ] }, t);
        }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Yorumlar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (u.comments || []).map((t) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl bg-surface-sunken p-2.5 text-sm", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-text-primary", children: t.text }),
          /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 text-[11px] text-text-tertiary", children: k(t.creationTime) })
        ] }, t.id)) }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { value: $, onChange: (t) => L(t.target.value), placeholder: "Yorum ekle…", className: "flex-1 rounded-xl border border-default px-3 py-2 text-sm", onKeyDown: (t) => t.key === "Enter" && M() }),
          /* @__PURE__ */ e.jsx("button", { onClick: M, className: "rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-600", children: "Ekle" })
        ] })
      ] })
    ] }) }) })
  ] });
}
function re({ block: s, rows: a }) {
  const l = d.useRef(null), x = d.useRef(null);
  d.useEffect(() => {
    if (!window.Chart || !l.current) return;
    const { type: n, labels: i, data: c } = ne(s, a);
    return x.current = new window.Chart(l.current, {
      type: n,
      data: { labels: i, datasets: [{ label: "Yanıt", data: c, backgroundColor: ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b", "#a3e635"] }] },
      options: {
        responsive: !0,
        plugins: { legend: { display: n === "pie", position: "bottom" } },
        scales: n === "bar" ? { y: { beginAtZero: !0, ticks: { precision: 0 } } } : void 0
      }
    }), () => {
      var S;
      return (S = x.current) == null ? void 0 : S.destroy();
    };
  }, [s, a]);
  const m = a.filter((n) => {
    const i = b(n.answers)[s.id];
    return i != null && i !== "" && !(Array.isArray(i) && i.length === 0);
  }).length;
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-default bg-surface-raised p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-sm font-bold text-text-primary", children: s.content }),
    /* @__PURE__ */ e.jsxs("p", { className: "mb-3 text-xs text-text-tertiary", children: [
      m,
      " yanıt"
    ] }),
    /* @__PURE__ */ e.jsx("canvas", { ref: l, height: "200" })
  ] });
}
function ne(s, a) {
  const x = b(s.settings).options || [];
  if (s.type === h.Rating) {
    const n = [0, 0, 0, 0, 0];
    return a.forEach((i) => {
      const c = Number(b(i.answers)[s.id]);
      c >= 1 && c <= 5 && n[c - 1]++;
    }), { type: "bar", labels: ["1★", "2★", "3★", "4★", "5★"], data: n };
  }
  if (s.type === h.Nps) {
    const n = Array(11).fill(0);
    return a.forEach((i) => {
      const c = Number(b(i.answers)[s.id]);
      c >= 0 && c <= 10 && n[c]++;
    }), { type: "bar", labels: n.map((i, c) => String(c)), data: n };
  }
  const m = Object.fromEntries(x.map((n) => [n, 0]));
  return a.forEach((n) => {
    const i = b(n.answers)[s.id];
    Array.isArray(i) ? i.forEach((c) => {
      c in m && m[c]++;
    }) : i != null && i in m && m[i]++;
  }), { type: s.type === h.MultiSelect ? "bar" : "pie", labels: x, data: x.map((n) => m[n]) };
}
function le(s) {
  return s == null ? "" : Array.isArray(s) ? s.join("; ") : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function ie(s) {
  const a = String(s ?? "");
  return /[",\r\n]/.test(a) ? '"' + a.replace(/"/g, '""') + '"' : a;
}
function g(s, a) {
  const l = window.abp;
  l != null && l.notify && s === "success" ? l.notify.success(a) : l != null && l.message ? l.message[s === "error" ? "error" : "info"](a) : console.log(`[${s}] ${a}`);
}
const E = document.getElementById("responses-root");
E && W(E).render(/* @__PURE__ */ e.jsx(ae, { formId: E.getAttribute("data-form-id") }));
