import { r, j as e } from "./react-vendor.js";
import { Q as t, c as o } from "./query-vendor.js";
import { A as i } from "./httpClient.js";
function n() {
  return new t({
    defaultOptions: {
      queries: {
        staleTime: 3e4,
        gcTime: 5 * 6e4,
        refetchOnWindowFocus: !0,
        refetchOnReconnect: !0,
        retry: (a, s) => s instanceof i && s.status >= 400 && s.status < 500 ? !1 : a < 2
      },
      mutations: {
        /* Mutation default'ta retry YAPMAZ — duplicate finansal işlem riski. */
        retry: !1
      }
    }
  });
}
const c = {
  dashboard: {
    budget: () => ["dashboard", "budget"],
    cashflow: () => ["dashboard", "cashflow"],
    kpiSummary: () => ["dashboard", "kpi-summary"],
    incomeExpense: () => ["dashboard", "income-expense"],
    approvals: (a) => a ? ["dashboard", "approvals", a] : ["dashboard", "approvals"],
    approvalDetail: (a) => ["dashboard", "approval-detail", a],
    risks: () => ["dashboard", "risks"],
    aiSuggestions: (a) => a ? ["dashboard", "ai-suggestions", a] : ["dashboard", "ai-suggestions"]
  }
};
function l({ children: a }) {
  const [s] = r.useState(() => n());
  return /* @__PURE__ */ e.jsx(o, { client: s, children: a });
}
export {
  c as Q,
  l as a
};
