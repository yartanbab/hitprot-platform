function e(t) {
  var o;
  const n = typeof window < "u" ? (o = window.abp) == null ? void 0 : o.currentUser : null;
  return `${t}:${(n == null ? void 0 : n.tenantId) ?? "host"}:${(n == null ? void 0 : n.id) ?? "anon"}`;
}
export {
  e as s
};
