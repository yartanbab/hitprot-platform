const S = "visibleWhen", o = { EQ: "eq", NEQ: "neq", ANSWERED: "answered", FLAG: "flag" }, v = "requiresConsortium", A = {
  [o.EQ]: "şu cevabı verirse",
  [o.NEQ]: "şu cevabı vermezse",
  [o.ANSWERED]: "yanıtlanırsa",
  [o.FLAG]: "seçilen kayıt şu şartı taşıyorsa"
}, y = {
  [v]: "ortaklık istiyorsa"
}, g = (t) => y[t] || t, h = (t) => {
  const e = t == null ? void 0 : t.settings;
  if (!e) return {};
  if (typeof e != "string") return e;
  try {
    return JSON.parse(e) || {};
  } catch {
    return {};
  }
};
function k(t) {
  const e = h(t)[S];
  return e && typeof e == "object" && e.blockId && e.op ? e : null;
}
function f(t) {
  if (t == null) return [];
  if (Array.isArray(t)) return t.flatMap(f);
  if (typeof t == "object") return f(t.value);
  const e = String(t);
  return e.trim() === "" ? [] : [e];
}
const b = (t, e) => e != null && t.some((r) => r.toLowerCase() === String(e).toLowerCase());
function I(t, e, r = () => []) {
  const s = /* @__PURE__ */ new Set(), a = new Set(t.map((u) => u.id));
  for (const u of t) {
    const n = k(u);
    if (!n || !a.has(n.blockId)) continue;
    if (s.has(n.blockId)) {
      s.add(u.id);
      continue;
    }
    const c = f(e == null ? void 0 : e[n.blockId]);
    let i;
    switch (n.op) {
      case o.ANSWERED:
        i = c.length > 0;
        break;
      case o.EQ:
        i = b(c, n.value);
        break;
      case o.NEQ:
        i = !b(c, n.value);
        break;
      case o.FLAG: {
        const d = c[0], l = d ? (r(n.blockId) || []).find((L) => {
          var E;
          return ((E = L.value) == null ? void 0 : E.toLowerCase()) === d.toLowerCase();
        }) : null;
        i = !!(l != null && l.flags && l.flags[n.value]);
        break;
      }
      default:
        i = !0;
    }
    i || s.add(u.id);
  }
  return s;
}
function N(t, e) {
  const r = Object.keys(t || {}).filter((a) => e.has(a));
  if (r.length === 0) return t;
  const s = { ...t };
  for (const a of r) delete s[a];
  return s;
}
export {
  o as O,
  S as V,
  A as a,
  g as f,
  I as h,
  N as w
};
