const l = (e) => {
  var t, s;
  return (s = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.auth) == null ? void 0 : s.isGranted(e);
}, u = (e, t) => {
  var s, o, r;
  return (r = (o = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.notify) == null ? void 0 : o[e]) == null ? void 0 : r.call(o, t);
}, i = () => {
  var e;
  return ((e = window == null ? void 0 : window.abp) == null ? void 0 : e.appPath) ?? "/";
};
function n(e) {
  return new Promise((t, s) => {
    window.abp.ajax(e).done(t).fail(s);
  });
}
const a = (e, t = {}) => {
  const s = new URLSearchParams();
  Object.entries(t).forEach(([r, c]) => {
    c != null && c !== "" && s.append(r, c);
  });
  const o = s.toString();
  return `${i()}Documents/Deliveries?handler=${e}${o ? "&" + o : ""}`;
}, p = (e, t) => n({ url: e, type: "POST", contentType: "application/json", data: JSON.stringify(t) }), d = (e) => n({ url: a("Packages", { projectId: e }), type: "GET" }), g = (e) => n({ url: a("Package", { id: e }), type: "GET" }), h = (e) => p(a("CreatePackage"), e), P = (e) => n({ url: a("DeletePackage", { id: e }), type: "POST" }), k = (e, t) => p(a("AddItems"), { packageId: e, documentFileIds: t }), y = (e) => n({ url: a("RemoveItem", { itemId: e }), type: "POST" }), m = (e) => n({ url: a("Preflight", { packageId: e }), type: "GET" }), T = (e) => n({ url: a("Generate", { packageId: e }), type: "POST" }), S = () => n({ url: a("Templates"), type: "GET" }), f = (e) => n({ url: a("Runs", { projectId: e }), type: "GET" }), b = (e) => n({ url: a("ShareLinks", { packageId: e }), type: "GET" }), w = (e) => p(a("CreateShareLink"), e), G = (e) => n({ url: a("RevokeShareLink", { id: e }), type: "POST" }), E = (e, t) => n({
  url: `${i()}Documents?handler=Files&projectId=${e}&maxResultCount=50&skipCount=0` + (t ? `&filterText=${encodeURIComponent(t)}` : ""),
  type: "GET"
});
export {
  l as a,
  S as b,
  f as c,
  u as d,
  g as e,
  i as f,
  d as g,
  b as h,
  m as i,
  w as j,
  P as k,
  h as l,
  k as m,
  y as n,
  T as o,
  G as r,
  E as s
};
