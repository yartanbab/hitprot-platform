import { r as p, j as a, b as K } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { B as M, g as D } from "./Dialog-CkwGYc9B.js";
import { S as _ } from "./SkeletonShape-DJE-K0js.js";
import { E as W } from "./EmptyState-CUE7sfrU.js";
const w = (t, n) => {
  var l, d, c;
  return (c = (d = (l = window == null ? void 0 : window.abp) == null ? void 0 : l.notify) == null ? void 0 : d[t]) == null ? void 0 : c.call(d, n);
}, C = () => {
  var t;
  return ((t = window == null ? void 0 : window.abp) == null ? void 0 : t.appPath) ?? "/";
}, H = () => {
  var t, n, l;
  return (l = (n = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : n.documents) == null ? void 0 : l.document;
};
function R(t) {
  return new Promise((n, l) => {
    window.abp.ajax(t).done(n).fail(l);
  });
}
const E = (t, n = {}) => {
  const l = new URLSearchParams();
  Object.entries(n).forEach(([c, u]) => {
    u != null && u !== "" && l.append(c, u);
  });
  const d = l.toString();
  return `${C()}Documents/Upload?handler=${t}${d ? "&" + d : ""}`;
}, J = () => R({ url: E("DocumentTypes"), type: "GET" }), Y = (t, n) => R({
  url: E("SetMeta", { id: t }),
  type: "POST",
  contentType: "application/json",
  data: JSON.stringify(n)
}), X = 25 * 1024 * 1024, I = [
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
function Q(t) {
  const n = t.name.lastIndexOf("."), l = n < 0 ? "" : t.name.slice(n).toLowerCase();
  return !l || !I.includes(l) ? "Desteklenmeyen dosya türü" : t.size > X ? "Dosya 25 MB sınırını aşıyor" : null;
}
function V(t, n, { onProgress: l, signal: d } = {}) {
  return new Promise((c, u) => {
    var y, x, k, v, b;
    const j = new FormData();
    j.append("documentId", t), j.append("file", n);
    const o = new XMLHttpRequest();
    o.open("POST", E("Upload"), !0);
    const h = ((v = (k = (x = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.security) == null ? void 0 : x.antiForgery) == null ? void 0 : k.getToken) == null ? void 0 : v.call(k)) ?? ((b = document.querySelector('input[name="__RequestVerificationToken"]')) == null ? void 0 : b.value);
    h && o.setRequestHeader("RequestVerificationToken", h), o.upload.onprogress = (g) => {
      g.lengthComputable && l && l(Math.round(g.loaded / g.total * 100));
    }, o.onload = () => {
      if (o.status >= 200 && o.status < 300)
        try {
          c(JSON.parse(o.responseText));
        } catch {
          c(null);
        }
      else
        u(new Error(ae(o)));
    }, o.onerror = () => u(new Error("Ağ hatası")), o.onabort = () => u(new Error("İptal edildi")), d && d.addEventListener("abort", () => o.abort(), { once: !0 }), o.send(j);
  });
}
const Z = /(^|[\s.])[A-Z][\w.]*(Exception|Error)\b/, q = {
  400: "Dosya kabul edilmedi.",
  401: "Oturumunuz düşmüş — sayfayı yenileyin.",
  403: "Bu klasöre yükleme yetkiniz yok.",
  404: "Hedef klasör bulunamadı.",
  413: "Dosya sunucu sınırını aşıyor."
};
function G(t) {
  if (!t) return null;
  const n = String(t).replace(/\s+/g, " ").trim();
  return !n || Z.test(n) || n.includes("--->") || n.includes(" at ") ? null : n.length > 160 ? `${n.slice(0, 157)}…` : n;
}
function ee(t) {
  return q[t] ? q[t] : t >= 500 ? "Sunucu hatası — tekrar deneyebilirsiniz." : `Sunucu ${t} döndü`;
}
function ae(t) {
  var l, d;
  let n = null;
  try {
    const c = JSON.parse(t.responseText);
    n = ((l = c == null ? void 0 : c.error) == null ? void 0 : l.message) || ((d = c == null ? void 0 : c.error) == null ? void 0 : d.details) || null;
  } catch {
    n = t.responseText || null;
  }
  return n && console.error("[Upload] sunucu hatası:", n), G(n) ?? ee(t.status);
}
const te = (t) => t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${(t / 1024).toFixed(0)} KB` : `${(t / (1024 * 1024)).toFixed(1)} MB`, ne = 3, se = {
  queued: { label: "sırada", variant: "neutral" },
  uploading: { label: "yükleniyor", variant: "accent" },
  done: { label: "tamam", variant: "positive" },
  failed: { label: "hata", variant: "negative" },
  rejected: { label: "reddedildi", variant: "warning" }
};
let re = 0;
function le() {
  const t = new URLSearchParams(window.location.search), [n, l] = p.useState([]), [d, c] = p.useState([]), [u, j] = p.useState((t.get("documentId") || "").toLowerCase()), [o, h] = p.useState([]), [y, x] = p.useState(!1), [k, v] = p.useState(!0), [b, g] = p.useState(!1), [N, $] = p.useState(""), [z, A] = p.useState(""), T = p.useRef(null);
  p.useEffect(() => {
    (async () => {
      try {
        const [e, s] = await Promise.all([
          H().getList({ maxResultCount: 1e3, sorting: "title asc" }),
          J()
        ]);
        l((e == null ? void 0 : e.items) ?? []), c(s ?? []);
      } catch (e) {
        w("error", "Klasörler yüklenemedi."), console.error("[Upload] load", e);
      } finally {
        v(!1);
      }
    })();
  }, []);
  const L = p.useCallback((e) => {
    const s = Array.from(e).map((r) => {
      const f = Q(r);
      return {
        key: `f${++re}`,
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
    i > 0 && w("warn", `${i} dosya kabul edilmedi (tür veya boyut).`);
  }, []), S = (e, s) => h((i) => i.map((r) => r.key === e ? { ...r, ...s } : r)), F = async () => {
    if (!u) {
      w("warn", "Önce hedef klasör seçin.");
      return;
    }
    x(!0);
    const s = [...o.filter((r) => r.status === "queued" || r.status === "failed")], i = async () => {
      for (; s.length > 0; ) {
        const r = s.shift();
        if (!r) return;
        S(r.key, { status: "uploading", percent: 0, error: null });
        try {
          const f = await V(u, r.file, {
            onProgress: (U) => S(r.key, { percent: U })
          });
          S(r.key, {
            status: "done",
            percent: 100,
            documentFileId: (f == null ? void 0 : f.documentFileId) ?? null
          });
        } catch (f) {
          S(r.key, { status: "failed", error: f.message });
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(ne, s.length) }, i)), x(!1);
  }, O = async () => {
    const e = o.filter((i) => i.status === "done" && i.documentFileId);
    if (e.length === 0) return;
    x(!0);
    let s = 0;
    for (const i of e)
      try {
        await Y(i.documentFileId, {
          displayName: i.name,
          documentTypeId: N || null,
          periodCode: z || null
        }), s++;
      } catch (r) {
        console.error("[Upload] setMeta", i.name, r);
      }
    x(!1), w(s === e.length ? "success" : "warn", `${s}/${e.length} belgeye künye atandı.`);
  }, m = p.useMemo(() => {
    const e = { queued: 0, uploading: 0, done: 0, failed: 0, rejected: 0 };
    return o.forEach((s) => {
      e[s.status] = (e[s.status] ?? 0) + 1;
    }), e;
  }, [o]), P = (e) => {
    var s, i;
    e.preventDefault(), g(!1), (i = (s = e.dataTransfer) == null ? void 0 : s.files) != null && i.length && L(e.dataTransfer.files);
  };
  return k ? /* @__PURE__ */ a.jsx("div", { className: "p-4", children: /* @__PURE__ */ a.jsx(_, { rows: 6 }) }) : /* @__PURE__ */ a.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ a.jsxs("div", { className: "d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4", children: [
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Yükleme kuyruğu" }),
        /* @__PURE__ */ a.jsx("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: "Dosyaları sürükleyin; sıra tek tek yükler, hatalı olanı tekrar denersiniz" })
      ] }),
      /* @__PURE__ */ a.jsx("a", { className: "apya-doc-linkbtn", href: `${C()}Documents`, children: "Dokümanlar'a dön" })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "apya-doc-uploadgrid", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ a.jsx("div", { className: "apya-md-overline", children: "Hedef klasör" }),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "apya-doc-select w-100 mb-3",
            value: u,
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
            className: `apya-doc-dropzone${b ? " is-over" : ""}`,
            onDragOver: (e) => {
              e.preventDefault(), g(!0);
            },
            onDragLeave: () => g(!1),
            onDrop: P,
            onClick: () => {
              var e;
              return (e = T.current) == null ? void 0 : e.click();
            },
            role: "button",
            tabIndex: 0,
            onKeyDown: (e) => {
              var s;
              (e.key === "Enter" || e.key === " ") && ((s = T.current) == null || s.click());
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
            ref: T,
            type: "file",
            multiple: !0,
            hidden: !0,
            accept: I.join(","),
            onChange: (e) => {
              L(e.target.files), e.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ a.jsxs("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", marginTop: 8 }, children: [
          "Kabul edilen: ",
          I.join(" ")
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
              value: N,
              onChange: (e) => $(e.target.value),
              "aria-label": "Belge türü",
              children: [
                /* @__PURE__ */ a.jsx("option", { value: "", children: "Tür seçin…" }),
                d.map((e) => /* @__PURE__ */ a.jsx("option", { value: e.id, children: e.name }, e.id))
              ]
            }
          ),
          /* @__PURE__ */ a.jsx(
            "input",
            {
              className: "apya-doc-input w-100 mb-2",
              placeholder: "Dönem (örn. 2026-Q1)",
              value: z,
              onChange: (e) => A(e.target.value),
              "aria-label": "Dönem kodu"
            }
          ),
          /* @__PURE__ */ a.jsx(
            M,
            {
              variant: "outline",
              size: "sm",
              className: "w-100",
              disabled: y || !N && !z,
              onClick: O,
              children: "Yüklenenlere uygula"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ a.jsxs("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: [
            "Sıra (",
            o.length,
            ")"
          ] }),
          /* @__PURE__ */ a.jsxs("span", { className: "d-flex align-items-center gap-2", children: [
            m.done > 0 && /* @__PURE__ */ a.jsxs(D, { variant: "positive", size: "sm", children: [
              m.done,
              " tamam"
            ] }),
            m.failed > 0 && /* @__PURE__ */ a.jsxs(D, { variant: "negative", size: "sm", children: [
              m.failed,
              " hata"
            ] }),
            o.length > 0 && /* @__PURE__ */ a.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: y,
                onClick: () => h((e) => e.filter((s) => s.status !== "done")),
                children: "Bitenleri temizle"
              }
            ),
            /* @__PURE__ */ a.jsx(
              M,
              {
                variant: "primary",
                size: "sm",
                disabled: y || !u || m.queued + m.failed === 0,
                onClick: F,
                children: y ? "Yükleniyor…" : `Yükle (${m.queued + m.failed})`
              }
            )
          ] })
        ] }),
        o.length === 0 ? /* @__PURE__ */ a.jsx(
          W,
          {
            icon: /* @__PURE__ */ a.jsx("i", { className: "fa fa-inbox" }),
            title: "Sıra boş",
            description: "Soldaki alana dosya bırakarak başlayın."
          }
        ) : o.map((e) => {
          const s = se[e.status];
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
                /* @__PURE__ */ a.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: te(e.size) }),
                /* @__PURE__ */ a.jsx("span", { children: /* @__PURE__ */ a.jsx(D, { variant: s.variant, size: "sm", children: s.label }) }),
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
const B = document.getElementById("upload-queue-island");
B && K(B).render(/* @__PURE__ */ a.jsx(le, {}));
