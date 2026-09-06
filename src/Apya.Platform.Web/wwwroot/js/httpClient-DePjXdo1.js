import { t as i } from "./i18n-DkhYld-7.js";
const l = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest"
};
class p extends Error {
  constructor(t, { status: e, code: o, details: s, validationErrors: u } = {}) {
    super(t), this.name = "ApiError", this.status = e, this.code = o, this.details = s, this.validationErrors = u;
  }
}
function f() {
  if (typeof document > "u") return null;
  const r = document.querySelector('meta[name="__RequestVerificationToken"]');
  if (r) return r.getAttribute("content");
  const t = document.querySelector('input[name="__RequestVerificationToken"]');
  return t ? t.value : null;
}
function m(r) {
  switch (r) {
    case 400:
      return i(
        "Api:Error:BadRequest",
        "İstek doğrulanamadı. Sayfayı yenileyip tekrar deneyin."
      );
    case 401:
      return i(
        "Api:Error:Unauthorized",
        "Oturumunuz sona ermiş. Sayfayı yenileyip tekrar giriş yapın."
      );
    case 403:
      return i(
        "Api:Error:Forbidden",
        "Bu işlem için yetkiniz yok."
      );
    case 404:
      return i(
        "Api:Error:NotFound",
        "Aradığınız kayıt bulunamadı."
      );
    default:
      return i(
        "Api:Error:Generic",
        "İşlem tamamlanamadı, lütfen tekrar deneyin."
      );
  }
}
async function y(r) {
  let t = null;
  try {
    t = await r.json();
  } catch {
  }
  const e = t == null ? void 0 : t.error;
  return new p(
    (e == null ? void 0 : e.message) || m(r.status),
    {
      status: r.status,
      code: e == null ? void 0 : e.code,
      details: e == null ? void 0 : e.details,
      validationErrors: e == null ? void 0 : e.validationErrors
    }
  );
}
async function a(r, { method: t = "GET", body: e, signal: o, headers: s = {} } = {}) {
  const u = t !== "GET" && t !== "HEAD", c = { ...l, ...s };
  if (u) {
    const d = f();
    d && (c.RequestVerificationToken = d);
  }
  const n = await fetch(r, {
    method: t,
    credentials: "include",
    /* ABP cookie session */
    signal: o,
    headers: c,
    body: e !== void 0 ? JSON.stringify(e) : void 0
  });
  if (!n.ok) throw await y(n);
  return n.status === 204 ? null : (n.headers.get("content-type") || "").includes("application/json") ? n.json() : n.text();
}
const A = {
  get: (r, t) => a(r, { ...t, method: "GET" }),
  post: (r, t, e) => a(r, { ...e, method: "POST", body: t }),
  put: (r, t, e) => a(r, { ...e, method: "PUT", body: t }),
  patch: (r, t, e) => a(r, { ...e, method: "PATCH", body: t }),
  delete: (r, t) => a(r, { ...t, method: "DELETE" })
};
export {
  p as A,
  A as a,
  f as r
};
