import { r, j as a } from "./react-vendor-D57GAUXd.js";
import { c as i, Q as d, d as u, P as c } from "./query-vendor-Bf69L2iP.js";
import { A as l } from "./httpClient-CRlyQ1eg.js";
const p = "apya-rq-cache", o = 60 * 60 * 1e3;
function h() {
  try {
    const e = window.sessionStorage, t = "__apya_probe__";
    return e.setItem(t, "1"), e.removeItem(t), e;
  } catch {
    return null;
  }
}
function y() {
  var s;
  const e = h();
  if (!e) return null;
  const t = typeof window < "u" ? (s = window.abp) == null ? void 0 : s.currentUser : null;
  return t != null && t.id ? {
    persister: i({
      storage: e,
      key: p,
      /* Her mutasyonda değil, saniyede bir yaz — ana iş parçacığını meşgul etme. */
      throttleTime: 1e3
    }),
    maxAge: o,
    buster: `${t.tenantId ?? "host"}:${t.id}`,
    dehydrateOptions: {
      /* Hatalı ya da yüklenmekte olan sorgu saklanmaz: bir sonraki açılışta
         hata ekranını "önbellekten" göstermenin anlamı yok. */
      shouldDehydrateQuery: (n) => n.state.status === "success"
    }
  } : null;
}
function m() {
  return new d({
    defaultOptions: {
      queries: {
        staleTime: 3e4,
        /* gcTime, persister'ın maxAge'inden KÜÇÜK OLAMAZ: sessionStorage'dan
           geri yüklenen sorgular gcTime dolduğu anda çöpe gider ve
           kalıcılaştırma sessizce etkisiz kalırdı. İkisi tek yerden
           (PERSIST_MAX_AGE_MS) besleniyor ki ayrışmasınlar. */
        gcTime: o,
        refetchOnWindowFocus: !0,
        refetchOnReconnect: !0,
        retry: (e, t) => t instanceof l && t.status >= 400 && t.status < 500 ? !1 : e < 2
      },
      mutations: {
        /* Mutation default'ta retry YAPMAZ — duplicate finansal işlem riski. */
        retry: !1
      }
    }
  });
}
const v = {
  dashboard: {
    /* Desen: ['dashboard', <bölüm>, { range, projectId }] — filtre değişince
       yeni key, eski veri cache'te kalır (sekme geçişi anında). */
    summary: (e) => ["dashboard", "summary", e],
    deliveries: (e) => ["dashboard", "deliveries", e],
    projectHealth: (e) => ["dashboard", "project-health", e],
    approvals: () => ["dashboard", "pending-approvals"],
    blockedTasks: () => ["dashboard", "blocked-tasks"],
    statistics: (e) => ["dashboard", "statistics", e],
    incomeExpense: (e) => ["dashboard", "income-expense", e],
    deliveryHeatmap: (e) => ["dashboard", "delivery-heatmap", e],
    layout: (e) => ["dashboard", "layout", e],
    aiSuggestions: (e) => e ? ["dashboard", "ai-suggestions", e] : ["dashboard", "ai-suggestions"]
  }
};
function S({ children: e }) {
  const [t] = r.useState(() => m()), [s] = r.useState(() => y());
  return s ? /* @__PURE__ */ a.jsx(c, { client: t, persistOptions: s, children: e }) : /* @__PURE__ */ a.jsx(u, { client: t, children: e });
}
export {
  v as Q,
  S as a
};
