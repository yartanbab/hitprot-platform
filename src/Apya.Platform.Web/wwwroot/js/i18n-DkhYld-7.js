let u = null;
function c() {
  var t, e;
  if (u) return u;
  const n = (e = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.localization) == null ? void 0 : e.getResource;
  return typeof n == "function" && (u = n("Platform")), u;
}
function i(n, t, ...e) {
  const r = c(), o = r ? r(n, ...e) : null;
  return o != null && o !== n ? o : l(t ?? n, e);
}
function l(n, t) {
  return t.length ? String(n).replace(/\{(\d+)\}/g, (e, r) => t[r] ?? e) : n;
}
function a() {
  var n, t, e, r;
  return ((e = (t = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.localization) == null ? void 0 : t.currentCulture) == null ? void 0 : e.name) || ((r = document == null ? void 0 : document.documentElement) == null ? void 0 : r.lang) || "tr-TR";
}
export {
  a as c,
  i as t
};
