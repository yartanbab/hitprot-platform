const d = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest"
};
class l extends Error {
  constructor(t, { status: e, code: r, details: s, validationErrors: a } = {}) {
    super(t), this.name = "ApiError", this.status = e, this.code = r, this.details = s, this.validationErrors = a;
  }
}
function p() {
  if (typeof document > "u") return null;
  const n = document.querySelector('meta[name="__RequestVerificationToken"]');
  if (n) return n.getAttribute("content");
  const t = document.querySelector('input[name="__RequestVerificationToken"]');
  return t ? t.value : null;
}
async function f(n) {
  let t = null;
  try {
    t = await n.json();
  } catch {
  }
  const e = t == null ? void 0 : t.error;
  return new l(
    (e == null ? void 0 : e.message) || `HTTP ${n.status}`,
    {
      status: n.status,
      code: e == null ? void 0 : e.code,
      details: e == null ? void 0 : e.details,
      validationErrors: e == null ? void 0 : e.validationErrors
    }
  );
}
async function o(n, { method: t = "GET", body: e, signal: r, headers: s = {} } = {}) {
  const a = t !== "GET" && t !== "HEAD", c = { ...d, ...s };
  if (a) {
    const u = p();
    u && (c.RequestVerificationToken = u);
  }
  const i = await fetch(n, {
    method: t,
    credentials: "include",
    /* ABP cookie session */
    signal: r,
    headers: c,
    body: e !== void 0 ? JSON.stringify(e) : void 0
  });
  if (!i.ok) throw await f(i);
  return i.status === 204 ? null : (i.headers.get("content-type") || "").includes("application/json") ? i.json() : i.text();
}
const h = {
  get: (n, t) => o(n, { ...t, method: "GET" }),
  post: (n, t, e) => o(n, { ...e, method: "POST", body: t }),
  put: (n, t, e) => o(n, { ...e, method: "PUT", body: t }),
  patch: (n, t, e) => o(n, { ...e, method: "PATCH", body: t }),
  delete: (n, t) => o(n, { ...t, method: "DELETE" })
};
export {
  l as A,
  h as a,
  p as r
};
