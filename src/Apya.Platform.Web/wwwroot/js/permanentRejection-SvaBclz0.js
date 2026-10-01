function a(t) {
  var o;
  const n = typeof window < "u" ? (o = window.abp) == null ? void 0 : o.currentUser : null;
  return `${t}:${(n == null ? void 0 : n.tenantId) ?? "host"}:${(n == null ? void 0 : n.id) ?? "anon"}`;
}
function e(t) {
  const n = t == null ? void 0 : t.status;
  return !(!(n >= 400 && n < 500) || n === 401 || n === 408 || n === 429 || n === 400 && !t.code && !t.validationErrors && !t.details);
}
export {
  e as i,
  a as s
};
