import { r as d } from "./react-vendor-D7YDiBbi.js";
import { a as u } from "./query-vendor-Db2mwxYI.js";
const r = "apya:data-changed", s = "apya-data-changed-at";
function c() {
  try {
    window.sessionStorage.setItem(s, String(Date.now()));
  } catch {
  }
}
function y(t = {}) {
  c(), document.dispatchEvent(new CustomEvent(r, { detail: t }));
}
function m(t, e) {
  const a = (n) => {
    const i = (n == null ? void 0 : n.detail) ?? {};
    i.entity === e && t(i);
  };
  return document.addEventListener(r, a), () => document.removeEventListener(r, a);
}
function o(t) {
  const [e, a] = t ?? [];
  return e === "dashboard" ? a !== "layout" : e === "calendar" && (a === "feed" || a === "team-load");
}
function f() {
  try {
    return Number(window.sessionStorage.getItem(s)) || 0;
  } catch {
    return 0;
  }
}
function g(t) {
  const e = f();
  e && t.invalidateQueries({
    predicate: (a) => o(a.queryKey) && a.state.dataUpdatedAt < e
  });
}
function p() {
  const t = u();
  d.useEffect(() => m(() => {
    t.invalidateQueries({ predicate: (e) => o(e.queryKey) });
  }, "task"), [t]);
}
export {
  g as a,
  y as e,
  o as i,
  c as m,
  m as o,
  p as u
};
