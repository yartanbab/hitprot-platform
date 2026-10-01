import { j as e, r as o } from "./react-vendor-D7YDiBbi.js";
import { m as me, u as W, E as X } from "./index-DgpuJ91w.js";
import { a as w } from "./httpClient-BNoyY5yK.js";
import { H as pe } from "./Hint-BhMztyJX.js";
import { d as E } from "./formChoices-CDoZfRj7.js";
const fe = (s) => {
  var a, c;
  return (c = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : c.isGranted(s);
}, g = { Select: 2, MultiSelect: 3, Rating: 12, Nps: 13, Dropdown: 18 }, he = /* @__PURE__ */ new Set([g.Select, g.MultiSelect, g.Rating, g.Nps, g.Dropdown]), v = {
  0: { label: "Bekliyor", cls: "bg-warning-100 text-warning-700" },
  1: { label: "İnceleniyor", cls: "bg-brand-100 text-brand-700" },
  2: { label: "İncelendi", cls: "bg-positive-100 text-positive-700" }
}, ye = [
  { v: "", label: "Tüm durumlar" },
  { v: "0", label: "Bekleyenler" },
  { v: "1", label: "İncelenenler" },
  { v: "2", label: "İncelendi" }
], y = (s) => {
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
}, ee = (s) => s == null ? "—" : s < 60 ? `${s}sn` : `${Math.floor(s / 60)}dk ${s % 60}sn`;
function F({ label: s, value: a, accent: c }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-default bg-surface-raised p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-text-tertiary", children: s }),
    /* @__PURE__ */ e.jsx("p", { className: `mt-1 text-2xl font-bold ${c || "text-text-primary"}`, children: a })
  ] });
}
function te(s) {
  return s == null || s === "" ? /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "—" }) : Array.isArray(s) ? s.join(", ") : E(s) != null ? E(s) : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function be({ formId: s }) {
  const [a, c] = o.useState(null), [u, f] = o.useState([]), [r, i] = o.useState([]), [l, m] = o.useState(""), [O, z] = o.useState(!0), [T, I] = o.useState(null), [$, P] = o.useState(null), [S, G] = o.useState(!1), [se, ae] = o.useState(0), A = o.useRef(0), [x, D] = o.useState(null), [J, K] = o.useState(!1), [B, V] = o.useState(""), [k, Y] = o.useState("list"), re = o.useMemo(() => Object.fromEntries(u.map((t) => [t.id, t])), [u]), b = o.useMemo(() => u.filter((t) => t.type !== 16 && t.type !== 17), [u]), L = o.useMemo(() => b.filter((t) => he.has(t.type)), [b]), M = async (t) => {
    const n = ++A.current;
    G(!0);
    let d = `/api/app/response-management?DocumentId=${s}&MaxResultCount=200&SkipCount=0`;
    t !== "" && (d += `&Status=${t}`);
    try {
      const p = await w.get(d);
      if (n !== A.current) return;
      i(p.items || []), P(null);
    } catch (p) {
      if (n !== A.current) return;
      i([]), P(p);
    } finally {
      n === A.current && G(!1);
    }
  };
  o.useEffect(() => {
    (async () => {
      try {
        const [t, n] = await Promise.all([
          w.get(`/api/app/form/${s}/statistics`),
          w.get(`/api/app/form/${s}`)
        ]);
        c(t), f((n.blocks || []).slice().sort((d, p) => d.order - p.order)), I(null), await M("");
      } catch (t) {
        I(t);
      } finally {
        z(!1);
      }
    })();
  }, [s, se]);
  const ne = (t) => {
    m(t), M(t);
  }, U = async (t) => {
    K(!0);
    try {
      const n = await w.get(`/api/app/response-management/${t}`);
      D(n);
    } catch (n) {
      R("error", (n == null ? void 0 : n.message) || "Detay açılamadı.");
    } finally {
      K(!1);
    }
  }, le = (t) => {
    D(t), i((n) => n.map((d) => d.id === t.id ? { ...d, status: t.status, tagsJson: t.tagsJson } : d));
  }, ie = async (t) => {
    try {
      const n = await w.post(`/api/app/response-management/${x.id}/set-status`, { status: Number(t) });
      le(n), R("success", "Durum güncellendi.");
    } catch (n) {
      R("error", n == null ? void 0 : n.message);
    }
  }, q = async () => {
    if (B.trim())
      try {
        await w.post(`/api/app/response-management/${x.id}/comment`, { text: B.trim() }), V(""), await U(x.id), R("success", "Yorum eklendi.");
      } catch (t) {
        R("error", t == null ? void 0 : t.message);
      }
  }, N = r.some((t) => t.tenantName), ce = () => {
    const t = ["Tarih", ...N ? ["Firma"] : [], "Durum", "Süre (sn)", ...b.map((h) => h.content)], n = r.map((h) => {
      var Z;
      const xe = y(h.answers);
      return [
        C(h.creationTime),
        ...N ? [h.tenantName || ""] : [],
        ((Z = v[h.status]) == null ? void 0 : Z.label) || "",
        h.completionSeconds ?? "",
        ...b.map((ue) => Ne(xe[ue.id]))
      ];
    }), d = [t, ...n].map((h) => h.map(we).join(",")).join(`\r
`), p = new Blob(["\uFEFF" + d], { type: "text/csv;charset=utf-8;" }), j = document.createElement("a");
    j.href = URL.createObjectURL(p), j.download = `yanitlar-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, j.click(), URL.revokeObjectURL(j.href);
  }, oe = `/DynamicAssets/Responses?handler=Excel&formId=${s}${l !== "" ? `&status=${l}` : ""}`, de = fe("Platform.DynamicAssets.Export"), _ = W(!O && !T), Q = W(!S && !$);
  return O && !T ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : T ? /* @__PURE__ */ e.jsx(
    X,
    {
      variant: "error",
      title: "Yanıtlar yüklenemedi",
      error: T,
      onRetry: _.retry(() => {
        z(!0), ae((t) => t + 1);
      }),
      retrying: O
    }
  ) : /* @__PURE__ */ e.jsxs("div", { ref: _.contentRef, tabIndex: -1, className: "text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ e.jsx(F, { label: "Toplam Yanıt", value: (a == null ? void 0 : a.responseCount) ?? 0, accent: "text-accent" }),
      /* @__PURE__ */ e.jsx(F, { label: "Bugün", value: (a == null ? void 0 : a.todayResponseCount) ?? 0 }),
      /* @__PURE__ */ e.jsx(F, { label: "Bekleyen", value: (a == null ? void 0 : a.pendingResponseCount) ?? 0, accent: "text-warning" }),
      /* @__PURE__ */ e.jsx(F, { label: "Görüntülenme", value: (a == null ? void 0 : a.viewCount) ?? 0 })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-5 flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("h3", { className: "text-sm font-bold text-text-secondary", children: [
        "Yanıtlar (",
        S || $ ? "—" : r.length,
        ")"
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex rounded-xl border border-default bg-surface-raised p-0.5", children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => Y("list"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${k === "list" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Liste" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => Y("table"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${k === "table" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Tablo" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => Y("analytics"), className: `rounded-lg px-3 py-1 text-xs font-semibold ${k === "analytics" ? "bg-accent text-white" : "text-text-secondary"}`, children: "Analiz" })
        ] }),
        /* @__PURE__ */ e.jsx("select", { value: l, onChange: (t) => ne(t.target.value), className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm", children: ye.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.v, children: t.label }, t.v)) }),
        /* @__PURE__ */ e.jsx("button", { onClick: ce, disabled: S || r.length === 0, className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm font-medium hover:bg-surface-sunken disabled:opacity-50", children: "⬇ CSV" }),
        /* @__PURE__ */ e.jsx(pe, { placement: "bottom", text: "CSV dosyası tarayıcıda, ekranda yüklü yanıtlardan üretilir — en fazla 200 kayıt. Tüm yanıtlar için Excel'i kullanın." }),
        de && /* @__PURE__ */ e.jsx("a", { href: oe, className: "rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm font-medium hover:bg-surface-sunken", children: "⬇ Excel" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { ref: Q.contentRef, tabIndex: -1, children: $ ? /* @__PURE__ */ e.jsx("div", { className: "mt-3 rounded-2xl border border-default bg-surface-raised", children: /* @__PURE__ */ e.jsx(X, { variant: "error", title: "Yanıtlar yüklenemedi", error: $, onRetry: Q.retry(() => M(l)), retrying: S }) }) : S ? /* @__PURE__ */ e.jsx("div", { className: "mt-3 rounded-2xl border border-default bg-surface-raised py-16 text-center text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : k === "analytics" ? /* @__PURE__ */ e.jsxs("div", { className: "mt-3", children: [
      L.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-default bg-surface-raised py-16 text-center text-text-tertiary", children: "Grafik gösterilebilecek soru yok (seçmeli veya derecelendirme tipi bir soru gerekir)." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: L.map((t) => /* @__PURE__ */ e.jsx(ge, { block: t, rows: r }, t.id)) }),
      b.length > L.length && /* @__PURE__ */ e.jsxs("p", { className: "mt-3 text-xs text-text-tertiary", children: [
        b.length - L.length,
        " soru grafik için uygun değil (metin, tarih, dosya vb. tipte)."
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "mt-3 overflow-x-auto rounded-2xl border border-default bg-surface-raised", children: r.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Henüz yanıt yok." }) : k === "list" ? /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-surface-sunken text-left text-xs font-semibold uppercase text-text-tertiary", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Tarih" }),
        N && /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Firma" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Süre" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-subtle", children: r.map((t) => {
        var n, d;
        return /* @__PURE__ */ e.jsxs("tr", { className: "hover:bg-surface-sunken", children: [
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: C(t.creationTime) }),
          N && /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 font-medium", children: t.tenantName || "—" }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(n = v[t.status]) == null ? void 0 : n.cls}`, children: (d = v[t.status]) == null ? void 0 : d.label }) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-text-secondary", children: ee(t.completionSeconds) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ e.jsx("button", { onClick: () => U(t.id), className: "rounded-lg border border-default px-3 py-1 text-xs font-medium hover:bg-surface-sunken", children: "Detay" }) })
        ] }, t.id);
      }) })
    ] }) : /* @__PURE__ */ e.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-surface-sunken text-left text-xs font-semibold uppercase text-text-tertiary", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: "Tarih" }),
        N && /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: "Firma" }),
        b.map((t) => /* @__PURE__ */ e.jsx("th", { className: "whitespace-nowrap px-4 py-3", children: t.content }, t.id)),
        /* @__PURE__ */ e.jsx("th", { className: "px-4 py-3", children: "Durum" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-subtle", children: r.map((t) => {
        var d, p;
        const n = y(t.answers);
        return /* @__PURE__ */ e.jsxs("tr", { className: "cursor-pointer hover:bg-surface-sunken", onClick: () => U(t.id), children: [
          /* @__PURE__ */ e.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-text-secondary", children: C(t.creationTime) }),
          N && /* @__PURE__ */ e.jsx("td", { className: "whitespace-nowrap px-4 py-3 font-medium", children: t.tenantName || "—" }),
          b.map((j) => /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: te(n[j.id]) }, j.id)),
          /* @__PURE__ */ e.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ e.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${(d = v[t.status]) == null ? void 0 : d.cls}`, children: (p = v[t.status]) == null ? void 0 : p.label }) })
        ] }, t.id);
      }) })
    ] }) }) }),
    (x || J) && /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex justify-end bg-surface-overlay", onClick: () => D(null), children: /* @__PURE__ */ e.jsx("div", { className: "h-full w-full max-w-lg overflow-y-auto bg-surface-raised p-6 shadow-xl", onClick: (t) => t.stopPropagation(), children: J || !x ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Yükleniyor…" }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold", children: "Yanıt Detayı" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => D(null), className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-2 text-sm text-text-secondary", children: [
        x.tenantName && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: x.tenantName }),
          "·"
        ] }),
        /* @__PURE__ */ e.jsx("span", { children: C(x.creationTime) }),
        "·",
        /* @__PURE__ */ e.jsx("span", { children: ee(x.completionSeconds) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Durum" }),
        /* @__PURE__ */ e.jsx("select", { value: x.status, onChange: (t) => ie(t.target.value), className: "w-full rounded-xl border border-default px-3 py-2 text-sm", children: Object.entries(v).map(([t, n]) => /* @__PURE__ */ e.jsx("option", { value: t, children: n.label }, t)) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase text-text-tertiary", children: "Cevaplar" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: Object.entries(y(x.answers)).map(([t, n]) => {
          var d;
          return /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-sunken p-3", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-xs font-semibold text-text-secondary", children: ((d = re[t]) == null ? void 0 : d.content) || "Soru" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-primary", children: te(n) })
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
          /* @__PURE__ */ e.jsx("input", { value: B, onChange: (t) => V(t.target.value), placeholder: "Yorum ekle…", className: "flex-1 rounded-xl border border-default px-3 py-2 text-sm", onKeyDown: (t) => t.key === "Enter" && q() }),
          /* @__PURE__ */ e.jsx("button", { onClick: q, className: "rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-600", children: "Ekle" })
        ] })
      ] })
    ] }) }) })
  ] });
}
function ge({ block: s, rows: a }) {
  const c = o.useRef(null), u = o.useRef(null);
  o.useEffect(() => {
    if (!window.Chart || !c.current) return;
    const { type: r, labels: i, data: l } = je(s, a);
    return u.current = new window.Chart(c.current, {
      type: r,
      data: { labels: i, datasets: [{ label: "Yanıt", data: l, backgroundColor: ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b", "#a3e635"] }] },
      options: {
        responsive: !0,
        plugins: { legend: { display: r === "pie", position: "bottom" } },
        scales: r === "bar" ? { y: { beginAtZero: !0, ticks: { precision: 0 } } } : void 0
      }
    }), () => {
      var m;
      return (m = u.current) == null ? void 0 : m.destroy();
    };
  }, [s, a]);
  const f = a.filter((r) => {
    const i = y(r.answers)[s.id];
    return i != null && i !== "" && !(Array.isArray(i) && i.length === 0);
  }).length;
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-default bg-surface-raised p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-sm font-bold text-text-primary", children: s.content }),
    /* @__PURE__ */ e.jsxs("p", { className: "mb-3 text-xs text-text-tertiary", children: [
      f,
      " yanıt"
    ] }),
    /* @__PURE__ */ e.jsx("canvas", { ref: c, height: "200" })
  ] });
}
function je(s, a) {
  const c = y(s.settings), u = c.options || [];
  if (s.type === g.Rating) {
    const r = [0, 0, 0, 0, 0];
    return a.forEach((i) => {
      const l = Number(y(i.answers)[s.id]);
      l >= 1 && l <= 5 && r[l - 1]++;
    }), { type: "bar", labels: ["1★", "2★", "3★", "4★", "5★"], data: r };
  }
  if (s.type === g.Nps) {
    const r = Array(11).fill(0);
    return a.forEach((i) => {
      const l = Number(y(i.answers)[s.id]);
      l >= 0 && l <= 10 && r[l]++;
    }), { type: "bar", labels: r.map((i, l) => String(l)), data: r };
  }
  if (c.source) {
    const r = {};
    a.forEach((l) => {
      const m = E(y(l.answers)[s.id]);
      m && (r[m] = (r[m] || 0) + 1);
    });
    const i = Object.keys(r).sort((l, m) => r[m] - r[l]);
    return { type: "pie", labels: i, data: i.map((l) => r[l]) };
  }
  const f = Object.fromEntries(u.map((r) => [r, 0]));
  return a.forEach((r) => {
    const i = y(r.answers)[s.id];
    Array.isArray(i) ? i.forEach((l) => {
      l in f && f[l]++;
    }) : i != null && i in f && f[i]++;
  }), { type: s.type === g.MultiSelect ? "bar" : "pie", labels: u, data: u.map((r) => f[r]) };
}
function Ne(s) {
  return s == null ? "" : Array.isArray(s) ? s.join("; ") : E(s) != null ? E(s) : typeof s == "object" ? Object.values(s).filter(Boolean).join(" ") : String(s);
}
function we(s) {
  const a = String(s ?? "");
  return /[",\r\n]/.test(a) ? '"' + a.replace(/"/g, '""') + '"' : a;
}
function R(s, a) {
  const c = window.abp;
  c != null && c.notify && s === "success" ? c.notify.success(a) : c != null && c.message ? c.message[s === "error" ? "error" : "info"](a) : console.log(`[${s}] ${a}`);
}
const H = document.getElementById("responses-root");
H && me(H, "responses", /* @__PURE__ */ e.jsx(be, { formId: H.getAttribute("data-form-id") }));
