const s = "open-grant-calls", c = "tenant-projects", u = "tenant-project-tasks", m = "firms", t = "grant", o = {
  [s]: {
    label: "Yayındaki hibe çağrıları",
    hint: "Başvuruya açık çağrılar. Çağrı kapanınca listeden kendiliğinden düşer, yeni yayınlanan eklenir.",
    empty: "Şu an başvuruya açık çağrı yok"
  },
  [c]: {
    label: "Firmanın projeleri",
    hint: "Formu dolduran firmanın süren projeleri. Her firma yalnız kendi projelerini görür.",
    empty: "Süren proje yok"
  },
  [u]: {
    label: "Seçilen projenin görevleri",
    hint: "Yukarıdaki proje alanında seçilen projenin görevleri; proje seçilmeden liste boş kalır.",
    empty: "Önce proje seçin"
  },
  [m]: {
    label: "Firmalar",
    hint: "Platformdaki firma kayıtları. Yalnız host formlarında listelenir.",
    empty: "Firma yok"
  }
}, p = [
  "Ortak katalog — her firmada aynı liste",
  "Formu dolduran firmanın kayıtları",
  "Yalnız host formlarında"
], y = (a) => {
  var e;
  return ((e = o[a]) == null ? void 0 : e.label) || a;
}, d = (a) => {
  var e;
  return ((e = o[a]) == null ? void 0 : e.empty) || "Listede kayıt yok";
};
function k(a) {
  return a && typeof a == "object" && !Array.isArray(a) && typeof a.label == "string" ? a.label : null;
}
function b(a, e, n = t) {
  const l = new URLSearchParams(e).get(n);
  if (!l) return null;
  const r = (a || []).find((i) => i.value.toLowerCase() === l.toLowerCase());
  return r ? { value: r.value, label: r.label } : null;
}
function f(a, e, n = t) {
  return `${a}${a.includes("?") ? "&" : "?"}${n}=${encodeURIComponent(e)}`;
}
export {
  o as C,
  s as O,
  p as a,
  d as b,
  k as c,
  b as p,
  y as s,
  f as w
};
