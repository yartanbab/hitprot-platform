import { r as p, j as a, b as W } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { B as z, e as I } from "./Dialog-Bky2XNdc.js";
import { S as J } from "./SkeletonShape-BzeBQ1R3.js";
import { E as Y } from "./EmptyState-D5m5kdmR.js";
import { D as X, P as Q, E as V } from "./ProcessRibbon-BtZ1ri4F.js";
const N = (t, n) => {
  var o, u, c;
  return (c = (u = (o = window == null ? void 0 : window.abp) == null ? void 0 : o.notify) == null ? void 0 : u[t]) == null ? void 0 : c.call(u, n);
}, A = () => {
  var t;
  return ((t = window == null ? void 0 : window.abp) == null ? void 0 : t.appPath) ?? "/";
}, Z = () => {
  var t, n, o;
  return (o = (n = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : n.documents) == null ? void 0 : o.document;
};
function B(t) {
  return new Promise((n, o) => {
    window.abp.ajax(t).done(n).fail(o);
  });
}
const L = (t, n = {}) => {
  const o = new URLSearchParams();
  Object.entries(n).forEach(([c, d]) => {
    d != null && d !== "" && o.append(c, d);
  });
  const u = o.toString();
  return `${A()}Documents/Upload?handler=${t}${u ? "&" + u : ""}`;
}, G = () => B({ url: L("DocumentTypes"), type: "GET" }), ee = (t, n) => B({
  url: L("SetMeta", { id: t }),
  type: "POST",
  contentType: "application/json",
  data: JSON.stringify(n)
}), ae = 25 * 1024 * 1024, E = [
  ".pdf",
  ".docx",
  ".doc",
  ".xlsx",
  ".xls",
  ".pptx",
  ".ppt",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".txt",
  ".csv",
  ".zip",
  ".rar"
];
function te(t) {
  const n = t.name.lastIndexOf("."), o = n < 0 ? "" : t.name.slice(n).toLowerCase();
  return !o || !E.includes(o) ? "Desteklenmeyen dosya türü" : t.size > ae ? "Dosya 25 MB sınırını aşıyor" : null;
}
function ne(t, n, { onProgress: o, signal: u } = {}) {
  return new Promise((c, d) => {
    var y, g, k, b, v;
    const j = new FormData();
    j.append("documentId", t), j.append("file", n);
    const l = new XMLHttpRequest();
    l.open("POST", L("Upload"), !0);
    const h = ((b = (k = (g = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.security) == null ? void 0 : g.antiForgery) == null ? void 0 : k.getToken) == null ? void 0 : b.call(k)) ?? ((v = document.querySelector('input[name="__RequestVerificationToken"]')) == null ? void 0 : v.value);
    h && l.setRequestHeader("RequestVerificationToken", h), l.upload.onprogress = (x) => {
      x.lengthComputable && o && o(Math.round(x.loaded / x.total * 100));
    }, l.onload = () => {
      if (l.status >= 200 && l.status < 300)
        try {
          c(JSON.parse(l.responseText));
        } catch {
          c(null);
        }
      else
        d(new Error(oe(l)));
    }, l.onerror = () => d(new Error("Ağ hatası")), l.onabort = () => d(new Error("İptal edildi")), u && u.addEventListener("abort", () => l.abort(), { once: !0 }), l.send(j);
  });
}
const se = /(^|[\s.])[A-Z][\w.]*(Exception|Error)\b/, M = {
  400: "Dosya kabul edilmedi.",
  401: "Oturumunuz düşmüş — sayfayı yenileyin.",
  403: "Bu klasöre yükleme yetkiniz yok.",
  404: "Hedef klasör bulunamadı.",
  413: "Dosya sunucu sınırını aşıyor."
};
function re(t) {
  if (!t) return null;
  const n = String(t).replace(/\s+/g, " ").trim();
  return !n || se.test(n) || n.includes("--->") || n.includes(" at ") ? null : n.length > 160 ? `${n.slice(0, 157)}…` : n;
}
function le(t) {
  return M[t] ? M[t] : t >= 500 ? "Sunucu hatası — tekrar deneyebilirsiniz." : `Sunucu ${t} döndü`;
}
function oe(t) {
  var o, u;
  let n = null;
  try {
    const c = JSON.parse(t.responseText);
    n = ((o = c == null ? void 0 : c.error) == null ? void 0 : o.message) || ((u = c == null ? void 0 : c.error) == null ? void 0 : u.details) || null;
  } catch {
    n = t.responseText || null;
  }
  return n && console.error("[Upload] sunucu hatası:", n), re(n) ?? le(t.status);
}
const ie = (t) => t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${(t / 1024).toFixed(0)} KB` : `${(t / (1024 * 1024)).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB`, ce = 3, de = {
  queued: { label: "sırada", variant: "neutral" },
  uploading: { label: "yükleniyor", variant: "accent" },
  done: { label: "tamam", variant: "positive" },
  failed: { label: "hata", variant: "negative" },
  rejected: { label: "reddedildi", variant: "warning" }
};
let ue = 0;
function pe() {
  var C;
  const t = new URLSearchParams(window.location.search), [n, o] = p.useState([]), [u, c] = p.useState([]), [d, j] = p.useState((t.get("documentId") || "").toLowerCase()), [l, h] = p.useState([]), [y, g] = p.useState(!1), [k, b] = p.useState(!0), [v, x] = p.useState(!1), [D, F] = p.useState(""), [T, P] = p.useState(""), S = p.useRef(null);
  p.useEffect(() => {
    (async () => {
      try {
        const [e, s] = await Promise.all([
          Z().getList({ maxResultCount: 1e3, sorting: "title asc" }),
          G()
        ]);
        o((e == null ? void 0 : e.items) ?? []), c(s ?? []);
      } catch (e) {
        N("error", "Klasörler yüklenemedi."), console.error("[Upload] load", e);
      } finally {
        b(!1);
      }
    })();
  }, []);
  const R = p.useCallback((e) => {
    const s = Array.from(e).map((r) => {
      const f = te(r);
      return {
        key: `f${++ue}`,
        file: r,
        name: r.name,
        size: r.size,
        status: f ? "rejected" : "queued",
        error: f,
        percent: 0,
        documentFileId: null
      };
    });
    h((r) => [...r, ...s]);
    const i = s.filter((r) => r.status === "rejected").length;
    i > 0 && N("warn", `${i} dosya kabul edilmedi (tür veya boyut).`);
  }, []), w = (e, s) => h((i) => i.map((r) => r.key === e ? { ...r, ...s } : r)), O = async () => {
    if (!d) {
      N("warn", "Önce hedef klasör seçin.");
      return;
    }
    g(!0);
    const s = [...l.filter((r) => r.status === "queued" || r.status === "failed")], i = async () => {
      for (; s.length > 0; ) {
        const r = s.shift();
        if (!r) return;
        w(r.key, { status: "uploading", percent: 0, error: null });
        try {
          const f = await ne(d, r.file, {
            onProgress: (_) => w(r.key, { percent: _ })
          });
          w(r.key, {
            status: "done",
            percent: 100,
            documentFileId: (f == null ? void 0 : f.documentFileId) ?? null
          });
        } catch (f) {
          w(r.key, { status: "failed", error: f.message });
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(ce, s.length) }, i)), g(!1);
  }, U = async () => {
    const e = l.filter((i) => i.status === "done" && i.documentFileId);
    if (e.length === 0) return;
    g(!0);
    let s = 0;
    for (const i of e)
      try {
        await ee(i.documentFileId, {
          displayName: i.name,
          documentTypeId: D || null,
          periodCode: T || null
        }), s++;
      } catch (r) {
        console.error("[Upload] setMeta", i.name, r);
      }
    g(!1), N(s === e.length ? "success" : "warn", `${s}/${e.length} belgeye künye atandı.`);
  }, m = p.useMemo(() => {
    const e = { queued: 0, uploading: 0, done: 0, failed: 0, rejected: 0 };
    return l.forEach((s) => {
      e[s.status] = (e[s.status] ?? 0) + 1;
    }), e;
  }, [l]), H = (e) => {
    var s, i;
    e.preventDefault(), x(!1), (i = (s = e.dataTransfer) == null ? void 0 : s.files) != null && i.length && R(e.dataTransfer.files);
  };
  if (k) return /* @__PURE__ */ a.jsx("div", { className: "p-4", children: /* @__PURE__ */ a.jsx(J, { rows: 6 }) });
  const $ = `${A()}Documents${d ? `?folder=${d}` : ""}`, K = ((C = n.find((e) => e.id === d)) == null ? void 0 : C.projectId) ?? null;
  return /* @__PURE__ */ a.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ a.jsx(
      X,
      {
        title: "Yükleme kuyruğu",
        description: "Dosyaları sürükleyin; sıra tek tek yükler, hatalı olanı tekrar denersiniz",
        menuItems: [{ key: "back", label: "Dokümanlar'a dön", icon: "fa-arrow-left", href: $ }]
      }
    ),
    /* @__PURE__ */ a.jsx(Q, { active: "docs", projectId: K }),
    /* @__PURE__ */ a.jsxs("div", { className: "apya-doc-uploadgrid", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ a.jsx("div", { className: "apya-md-overline", children: "Hedef klasör" }),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "apya-doc-select w-100 mb-3",
            value: d,
            onChange: (e) => j(e.target.value),
            "aria-label": "Hedef klasör",
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "Klasör seçin…" }),
              n.map((e) => /* @__PURE__ */ a.jsx("option", { value: e.id, children: e.title }, e.id))
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "div",
          {
            className: `apya-doc-dropzone${v ? " is-over" : ""}`,
            onDragOver: (e) => {
              e.preventDefault(), x(!0);
            },
            onDragLeave: () => x(!1),
            onDrop: H,
            onClick: () => {
              var e;
              return (e = S.current) == null ? void 0 : e.click();
            },
            role: "button",
            tabIndex: 0,
            onKeyDown: (e) => {
              var s;
              (e.key === "Enter" || e.key === " ") && ((s = S.current) == null || s.click());
            },
            children: [
              /* @__PURE__ */ a.jsx("i", { className: "fa fa-cloud-arrow-up", style: { fontSize: 22, color: "var(--apya-text-tertiary)" } }),
              /* @__PURE__ */ a.jsx("div", { style: { fontSize: 13, fontWeight: 500, marginTop: 6 }, children: "Dosyaları buraya bırakın" }),
              /* @__PURE__ */ a.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)", marginTop: 2 }, children: "veya tıklayıp seçin · en fazla 25 MB" })
            ]
          }
        ),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            ref: S,
            type: "file",
            multiple: !0,
            hidden: !0,
            accept: E.join(","),
            onChange: (e) => {
              R(e.target.files), e.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ a.jsxs("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", marginTop: 8 }, children: [
          "Kabul edilen: ",
          E.join(" ")
        ] }),
        m.done > 0 && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
          /* @__PURE__ */ a.jsxs("div", { className: "apya-md-overline mt-3", children: [
            "Toplu künye (",
            m.done,
            " belge)"
          ] }),
          /* @__PURE__ */ a.jsxs(
            "select",
            {
              className: "apya-doc-select w-100 mb-2",
              value: D,
              onChange: (e) => F(e.target.value),
              "aria-label": "Belge türü",
              children: [
                /* @__PURE__ */ a.jsx("option", { value: "", children: "Tür seçin…" }),
                u.map((e) => /* @__PURE__ */ a.jsx("option", { value: e.id, children: e.name }, e.id))
              ]
            }
          ),
          /* @__PURE__ */ a.jsx(
            "input",
            {
              className: "apya-doc-input w-100 mb-2",
              placeholder: "Dönem (örn. 2026-Q1)",
              value: T,
              onChange: (e) => P(e.target.value),
              "aria-label": "Dönem kodu"
            }
          ),
          /* @__PURE__ */ a.jsx(
            z,
            {
              variant: "outline",
              size: "sm",
              className: "w-100",
              disabled: y || !D && !T,
              onClick: U,
              children: "Yüklenenlere uygula"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ a.jsxs("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: [
            "Sıra (",
            l.length,
            ")"
          ] }),
          /* @__PURE__ */ a.jsxs("span", { className: "d-flex align-items-center gap-2", children: [
            m.done > 0 && /* @__PURE__ */ a.jsxs(I, { variant: "positive", size: "sm", children: [
              m.done,
              " tamam"
            ] }),
            m.failed > 0 && /* @__PURE__ */ a.jsxs(I, { variant: "negative", size: "sm", children: [
              m.failed,
              " hata"
            ] }),
            l.length > 0 && /* @__PURE__ */ a.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: y,
                onClick: () => h((e) => e.filter((s) => s.status !== "done")),
                children: "Bitenleri temizle"
              }
            ),
            l.length > 0 && /* @__PURE__ */ a.jsx(
              z,
              {
                variant: "primary",
                size: "sm",
                disabled: y || !d || m.queued + m.failed === 0,
                onClick: O,
                children: y ? "Yükleniyor…" : `Yükle (${m.queued + m.failed})`
              }
            )
          ] })
        ] }),
        l.length === 0 ? /* @__PURE__ */ a.jsx(
          Y,
          {
            icon: /* @__PURE__ */ a.jsx("i", { className: "fa fa-inbox" }),
            title: "Sıra boş",
            description: "Soldaki alana dosya bırakarak başlayın.",
            action: /* @__PURE__ */ a.jsx(
              V,
              {
                primary: /* @__PURE__ */ a.jsx(z, { size: "sm", onClick: () => {
                  var e;
                  return (e = S.current) == null ? void 0 : e.click();
                }, children: "Dosya seç" }),
                link: { label: "veya Dokümanlar'a dön", href: $ }
              }
            )
          }
        ) : l.map((e) => {
          const s = de[e.status];
          return /* @__PURE__ */ a.jsxs(
            "div",
            {
              className: "apya-doc-check-row",
              style: { gridTemplateColumns: "minmax(0,1fr) 80px 90px 60px" },
              children: [
                /* @__PURE__ */ a.jsxs("span", { style: { minWidth: 0 }, children: [
                  /* @__PURE__ */ a.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: e.name }),
                  e.error && /* @__PURE__ */ a.jsx("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-negative-500)" }, children: e.error }),
                  e.status === "uploading" && /* @__PURE__ */ a.jsx("span", { className: "apya-doc-progress d-block mt-1", style: { height: 3 }, children: /* @__PURE__ */ a.jsx("span", { style: {
                    display: "block",
                    width: `${e.percent}%`,
                    height: "100%",
                    background: "var(--apya-accent-500)"
                  } }) })
                ] }),
                /* @__PURE__ */ a.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: ie(e.size) }),
                /* @__PURE__ */ a.jsx("span", { children: /* @__PURE__ */ a.jsx(I, { variant: s.variant, size: "sm", children: s.label }) }),
                /* @__PURE__ */ a.jsx("span", { className: "text-end", children: e.status !== "uploading" && /* @__PURE__ */ a.jsx(
                  "button",
                  {
                    type: "button",
                    className: "apya-doc-linkbtn",
                    disabled: y,
                    onClick: () => h((i) => i.filter((r) => r.key !== e.key)),
                    children: "Kaldır"
                  }
                ) })
              ]
            },
            e.key
          );
        })
      ] })
    ] })
  ] });
}
const q = document.getElementById("upload-queue-island");
q && W(q).render(/* @__PURE__ */ a.jsx(pe, {}));
