import { t as s } from "./index-DgpuJ91w.js";
const f = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest"
};
class c extends Error {
  constructor(r, { status: n, code: t, details: i, validationErrors: a } = {}) {
    super(r), this.name = "ApiError", this.status = n, this.code = t, this.details = i, this.validationErrors = a;
  }
}
function k() {
  var t, i, a, d;
  if (typeof document > "u") return null;
  const e = (d = (a = (i = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.security) == null ? void 0 : i.antiForgery) == null ? void 0 : a.getToken) == null ? void 0 : d.call(a);
  if (e) return e;
  const r = document.querySelector('meta[name="__RequestVerificationToken"]');
  if (r) return r.getAttribute("content");
  const n = document.querySelector('input[name="__RequestVerificationToken"]');
  return n ? n.value : null;
}
function y(e) {
  switch (e) {
    case 0:
      return s(
        "Api:Error:Network",
        "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin; bu sayfada girdiğiniz bilgiler korunuyor."
      );
    case 400:
      return s(
        "Api:Error:BadRequest",
        "İstek işlenemedi. Girdiğiniz bilgileri kontrol edip tekrar deneyin."
      );
    case 401:
      return s(
        "Api:Error:Unauthorized",
        "Oturumunuz sona erdi. Yeniden giriş yaptıktan sonra tekrar deneyin; bu sayfada girdiğiniz bilgiler korunuyor."
      );
    case 403:
      return s(
        "Api:Error:Forbidden",
        "Bu işlem için yetkiniz yok."
      );
    case 404:
      return s(
        "Api:Error:NotFound",
        "Aradığınız kayıt bulunamadı."
      );
    case 413:
      return s(
        "Api:Error:PayloadTooLarge",
        "Gönderilen dosya ya da veri izin verilen boyutu aşıyor. Daha küçük bir dosyayla tekrar deneyin."
      );
    case 502:
    case 503:
    case 504:
      return s(
        "Api:Error:ServerUnavailable",
        "Sunucu geçici olarak kullanılamıyor. Birkaç dakika sonra tekrar deneyin; bu sayfada girdiğiniz bilgiler korunuyor."
      );
    default:
      return e >= 500 ? s(
        "Api:Error:Server",
        "Sunucuda beklenmeyen bir hata oluştu. Biraz sonra tekrar deneyin; sorun sürerse Geri bildirim ile bize iletin."
      ) : s(
        "Api:Error:Generic",
        "İşlem tamamlanamadı, lütfen tekrar deneyin."
      );
  }
}
const m = 300;
async function E(e) {
  var d;
  let r = "";
  try {
    r = await e.text() || "";
  } catch {
  }
  const n = r.trim();
  let t = null;
  if (n.startsWith("{"))
    try {
      t = ((d = JSON.parse(n)) == null ? void 0 : d.error) ?? null;
    } catch {
    }
  const i = !t && e.status < 500 && n && n.length <= m && !/^[<{[]/.test(n) ? n : null;
  return { error: new c(
    (t == null ? void 0 : t.message) || i || y(e.status),
    {
      status: e.status,
      code: t == null ? void 0 : t.code,
      details: t == null ? void 0 : t.details,
      validationErrors: t == null ? void 0 : t.validationErrors
    }
  ), empty: n === "" };
}
function h(e, r, n) {
  var i;
  const t = typeof window > "u" ? null : (i = window.apya) == null ? void 0 : i.session;
  t && (e.status === 401 ? t.expired({ background: !r }) && (e.apyaShown = e.apyaCentral = !0) : e.status === 400 && r && n && (t.verify(), e.message = s("Api:Error:Antiforgery:Title", "İşlem doğrulanamadı"), e.apyaShown = e.apyaCentral = !0));
}
async function l(e, { method: r = "GET", body: n, signal: t, headers: i = {} } = {}) {
  const a = r !== "GET" && r !== "HEAD", d = { ...f, ...i };
  if (a) {
    const o = k();
    o && (d.RequestVerificationToken = o);
  }
  let u;
  try {
    u = await fetch(e, {
      method: r,
      credentials: "include",
      /* ABP cookie session */
      signal: t,
      headers: d,
      body: n !== void 0 ? JSON.stringify(n) : void 0
    });
  } catch (o) {
    throw (o == null ? void 0 : o.name) === "AbortError" ? o : new c(y(0), { status: 0, code: "Network" });
  }
  if (!u.ok) {
    const { error: o, empty: p } = await E(u);
    throw h(o, a, p), o;
  }
  return u.status === 204 ? null : (u.headers.get("content-type") || "").includes("application/json") ? u.json() : u.text();
}
const b = {
  get: (e, r) => l(e, { ...r, method: "GET" }),
  post: (e, r, n) => l(e, { ...n, method: "POST", body: r }),
  put: (e, r, n) => l(e, { ...n, method: "PUT", body: r }),
  patch: (e, r, n) => l(e, { ...n, method: "PATCH", body: r }),
  delete: (e, r) => l(e, { ...r, method: "DELETE" })
};
export {
  c as A,
  b as a,
  k as r
};
