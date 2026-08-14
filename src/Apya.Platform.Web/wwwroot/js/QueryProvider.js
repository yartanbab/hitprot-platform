import { r as s, j as t } from "./react-vendor.js";
import { Q as r, c as o } from "./query-vendor.js";
import { A as i } from "./httpClient.js";
function d() {
  return new r({
    defaultOptions: {
      queries: {
        staleTime: 3e4,
        gcTime: 5 * 6e4,
        refetchOnWindowFocus: !0,
        refetchOnReconnect: !0,
        retry: (e, a) => a instanceof i && a.status >= 400 && a.status < 500 ? !1 : e < 2
      },
      mutations: {
        /* Mutation default'ta retry YAPMAZ — duplicate finansal işlem riski. */
        retry: !1
      }
    }
  });
}
const l = {
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
function p({ children: e }) {
  const [a] = s.useState(() => d());
  return /* @__PURE__ */ t.jsx(o, { client: a, children: e });
}
export {
  l as Q,
  p as a
};
