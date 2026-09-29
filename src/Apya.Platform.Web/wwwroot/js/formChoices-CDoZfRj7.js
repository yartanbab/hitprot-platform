const c = "open-grant-calls", u = "tenant-projects", s = "tenant-project-tasks", m = "firms", o = "grant", i = {
  [c]: {
    label: "Yayındaki hibe çağrıları",
    hint: "Başvuruya açık çağrılar. Çağrı kapanınca listeden kendiliğinden düşer, yeni yayınlanan eklenir.",
    empty: "Şu an başvuruya açık çağrı yok"
  },
  [u]: {
    label: "Firmanın projeleri",
    hint: "Formu dolduran firmanın süren projeleri. Her firma yalnız kendi projelerini görür.",
    empty: "Süren proje yok"
  },
  [s]: {
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
], y = (e) => {
  var a;
  return ((a = i[e]) == null ? void 0 : a.label) || e;
}, d = (e) => {
  var a;
  return ((a = i[e]) == null ? void 0 : a.empty) || "Listede kayıt yok";
};
function f(e) {
  return e && typeof e == "object" && !Array.isArray(e) && typeof e.label == "string" ? e.label : null;
}
function k(e, a, t = o) {
  const n = new URLSearchParams(a).get(t);
  if (!n) return null;
  const r = (e || []).find((l) => l.value.toLowerCase() === n.toLowerCase());
  return r ? { value: r.value, label: r.label } : null;
}
function b(e, a, t) {
  const n = e == null ? void 0 : e[a];
  if (!n || typeof n != "object" || (t || []).some((l) => l.value === n.value)) return e;
  const r = { ...e };
  return delete r[a], r;
}
function C(e, a, t = o) {
  return `${e}${e.includes("?") ? "&" : "?"}${t}=${encodeURIComponent(a)}`;
}
export {
  i as C,
  c as O,
  p as a,
  d as b,
  b as c,
  f as d,
  k as p,
  y as s,
  C as w
};
