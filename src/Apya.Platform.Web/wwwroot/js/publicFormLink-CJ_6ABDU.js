function c(t, n = ((o) => (o = ((a) => (a = window.abp) == null ? void 0 : a.currentTenant)()) == null ? void 0 : o.id)()) {
  const e = `/f/${encodeURIComponent(t)}`;
  return n ? `${e}?tenant=${encodeURIComponent(n)}` : e;
}
const r = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function f(t) {
  const n = new URLSearchParams(t).get("tenant");
  return n && r.test(n) ? n : null;
}
export {
  f,
  c as p
};
