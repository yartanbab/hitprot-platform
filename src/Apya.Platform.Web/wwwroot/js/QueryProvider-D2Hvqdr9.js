import { r as o, j as i } from "./react-vendor-D7YDiBbi.js";
import { c as d, Q as u, d as c, P as l } from "./query-vendor-Db2mwxYI.js";
import { A as p } from "./httpClient-BNoyY5yK.js";
import { Q as f, P as m } from "./index-DgpuJ91w.js";
import { a as h } from "./dataChanged-CDwwWMH8.js";
const n = 60 * 60 * 1e3;
function b() {
  try {
    const e = window.sessionStorage, t = "__apya_probe__";
    return e.setItem(t, "1"), e.removeItem(t), e;
  } catch {
    return null;
  }
}
function y() {
  var s;
  const e = b();
  if (!e) return null;
  const t = typeof window < "u" ? (s = window.abp) == null ? void 0 : s.currentUser : null;
  return t != null && t.id ? {
    persister: d({
      storage: e,
      key: f,
      /* Her mutasyonda değil, saniyede bir yaz — ana iş parçacığını meşgul etme. */
      throttleTime: m
    }),
    maxAge: n,
    buster: `${t.tenantId ?? "host"}:${t.id}`,
    dehydrateOptions: {
      /* Hatalı ya da yüklenmekte olan sorgu saklanmaz: bir sonraki açılışta
         hata ekranını "önbellekten" göstermenin anlamı yok.
         meta.persist:false → canlı/düzenlenebilir kayıt; açılışlar ve sayfalar
         arasında taşınmaz (başka ekranın yazmasından habersiz eski hâli
         göstermesin, kullanıcı o eski hâlin üzerine yazmasın). */
      shouldDehydrateQuery: (r) => {
        var a;
        return r.state.status === "success" && ((a = r.meta) == null ? void 0 : a.persist) !== !1;
      }
    }
  } : null;
}
function g() {
  return new u({
    defaultOptions: {
      queries: {
        staleTime: 3e4,
        /* gcTime, persister'ın maxAge'inden KÜÇÜK OLAMAZ: sessionStorage'dan
           geri yüklenen sorgular gcTime dolduğu anda çöpe gider ve
           kalıcılaştırma sessizce etkisiz kalırdı. İkisi tek yerden
           (PERSIST_MAX_AGE_MS) besleniyor ki ayrışmasınlar. */
        gcTime: n,
        refetchOnWindowFocus: !0,
        refetchOnReconnect: !0,
        /* Yalnız httpClient hatası (ApiError) yeniden denenir: ABP proxy reddi (zarf
           nesnesi ya da jqXHR) ApiError değildir ve her denemede ABP hata penceresini
           yeniden açar. Ağ hatası artık ApiError(0) → yeniden denenir. */
        retry: (e, t) => !(t instanceof p) || t.status >= 400 && t.status < 500 ? !1 : e < 2
      },
      mutations: {
        /* Mutation default'ta retry YAPMAZ — duplicate finansal işlem riski. */
        retry: !1
      }
    }
  });
}
const T = {
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
    effortDistribution: (e) => ["dashboard", "effort-distribution", e],
    layout: (e) => ["dashboard", "layout", e],
    aiSuggestions: (e) => e ? ["dashboard", "ai-suggestions", e] : ["dashboard", "ai-suggestions"]
  }
};
function P({ children: e }) {
  const [t] = o.useState(() => g()), [s] = o.useState(() => y());
  return s ? /* @__PURE__ */ i.jsx(
    l,
    {
      client: t,
      persistOptions: s,
      onSuccess: () => {
        h(t);
      },
      children: e
    }
  ) : /* @__PURE__ */ i.jsx(c, { client: t, children: e });
}
export {
  T as Q,
  P as a
};
