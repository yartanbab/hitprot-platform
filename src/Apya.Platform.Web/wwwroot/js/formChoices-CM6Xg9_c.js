const c = "open-grant-calls", a = "grant";
function i(e) {
  return e && typeof e == "object" && !Array.isArray(e) && typeof e.label == "string" ? e.label : null;
}
function u(e, n, t = a) {
  const o = new URLSearchParams(n).get(t);
  if (!o) return null;
  const l = (e || []).find((r) => r.value.toLowerCase() === o.toLowerCase());
  return l ? { value: l.value, label: l.label } : null;
}
function s(e, n, t = a) {
  return `${e}${e.includes("?") ? "&" : "?"}${t}=${encodeURIComponent(n)}`;
}
export {
  c as O,
  i as c,
  u as p,
  s as w
};
