import { r as t, j as m } from "./react-vendor-D57GAUXd.js";
const n = {
  triage: "(min-width: 768px)",
  analysis: "(min-width: 1280px)",
  command: "(min-width: 1920px)"
};
function u() {
  return typeof window > "u" || !window.matchMedia ? "analysis" : window.matchMedia(n.command).matches ? "command" : window.matchMedia(n.analysis).matches ? "analysis" : window.matchMedia(n.triage).matches ? "triage" : "decision";
}
const f = t.createContext(null);
function h({ children: d, override: r }) {
  const c = t.useCallback((a) => {
    if (typeof window > "u" || !window.matchMedia) return () => {
    };
    const o = Object.values(n).map((e) => window.matchMedia(e));
    return o.forEach((e) => e.addEventListener("change", a)), () => o.forEach((e) => e.removeEventListener("change", a));
  }, []), s = t.useSyncExternalStore(c, u, () => "analysis"), i = r ?? s;
  return t.useEffect(() => {
    typeof document > "u" || (document.documentElement.dataset.deviceMode = i);
  }, [i]), /* @__PURE__ */ m.jsx(f.Provider, { value: i, children: d });
}
export {
  h as D
};
