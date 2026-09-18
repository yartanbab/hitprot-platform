const L = "visibleWhen", o = { EQ: "eq", NEQ: "neq", ANSWERED: "answered", FLAG: "flag" }, v = "requiresConsortium", k = {
  [o.EQ]: "şu cevabı verirse",
  [o.NEQ]: "şu cevabı vermezse",
  [o.ANSWERED]: "yanıtlanırsa",
  [o.FLAG]: "seçilen kayıt şu şartı taşıyorsa"
}, y = {
  [v]: "ortaklık istiyorsa"
}, A = (t) => y[t] || t, S = (t) => {
  const e = t == null ? void 0 : t.settings;
  if (!e) return {};
  if (typeof e != "string") return e;
  try {
    return JSON.parse(e) || {};
  } catch {
    return {};
  }
};
function h(t) {
  const e = S(t)[L];
  return e && typeof e == "object" && e.blockId && e.op ? e : null;
}
function l(t) {
  if (t == null) return [];
  if (Array.isArray(t)) return t.flatMap(l);
  if (typeof t == "object") return l(t.value);
  const e = String(t);
  return e.trim() === "" ? [] : [e];
}
const E = (t, e) => e != null && t.some((i) => i.toLowerCase() === String(e).toLowerCase());
function g(t, e, i = () => []) {
  const s = /* @__PURE__ */ new Set();
  for (const r of t) {
    const n = h(r);
    if (!n) continue;
    if (s.has(n.blockId)) {
      s.add(r.id);
      continue;
    }
    const u = l(e == null ? void 0 : e[n.blockId]);
    let a;
    switch (n.op) {
      case o.ANSWERED:
        a = u.length > 0;
        break;
      case o.EQ:
        a = E(u, n.value);
        break;
      case o.NEQ:
        a = !E(u, n.value);
        break;
      case o.FLAG: {
        const f = u[0], c = f ? (i(n.blockId) || []).find((b) => {
          var d;
          return ((d = b.value) == null ? void 0 : d.toLowerCase()) === f.toLowerCase();
        }) : null;
        a = !!(c != null && c.flags && c.flags[n.value]);
        break;
      }
      default:
        a = !0;
    }
    a || s.add(r.id);
  }
  return s;
}
function I(t, e) {
  const i = Object.keys(t || {}).filter((r) => e.has(r));
  if (i.length === 0) return t;
  const s = { ...t };
  for (const r of i) delete s[r];
  return s;
}
export {
  o as O,
  L as V,
  k as a,
  A as f,
  g as h,
  I as w
};
