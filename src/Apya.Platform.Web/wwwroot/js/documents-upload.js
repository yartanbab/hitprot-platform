import { r as u, j as a } from "./react-vendor-D7YDiBbi.js";
import { E as W, m as J } from "./index-DgpuJ91w.js";
import { B as T, e as z } from "./Dialog-BdrRxZcw.js";
import { S as Y } from "./SkeletonShape-Ds5M097Q.js";
import { D as X, P as Q, E as V } from "./ProcessRibbon-D9pM1s89.js";
const v = (t, s) => {
  var o, d, i;
  return (i = (d = (o = window == null ? void 0 : window.abp) == null ? void 0 : o.notify) == null ? void 0 : d[t]) == null ? void 0 : i.call(d, s);
}, M = () => {
  var t;
  return ((t = window == null ? void 0 : window.abp) == null ? void 0 : t.appPath) ?? "/";
}, Z = () => {
  var t, s, o;
  return (o = (s = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : s.documents) == null ? void 0 : o.document;
};
function R(t) {
  return new Promise((s, o) => {
    window.abp.ajax(t).done(s).fail(o);
  });
}
const B = (t, s = {}) => {
  const o = new URLSearchParams();
  Object.entries(s).forEach(([i, c]) => {
    c != null && c !== "" && o.append(i, c);
  });
  const d = o.toString();
  return `${M()}Documents/Upload?handler=${t}${d ? "&" + d : ""}`;
}, G = () => R({ url: B("DocumentTypes"), type: "GET" }), ee = (t) => R({
  url: B("ApplyBulkMeta"),
  type: "POST",
  contentType: "application/json",
  data: JSON.stringify(t)
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
  const s = t.name.lastIndexOf("."), o = s < 0 ? "" : t.name.slice(s).toLowerCase();
  return !o || !E.includes(o) ? "Desteklenmeyen dosya türü" : t.size > ae ? "Dosya 25 MB sınırını aşıyor" : null;
}
function ne(t, s, { onProgress: o, signal: d } = {}) {
  return new Promise((i, c) => {
    var y, g, x, b, S;
    const j = new FormData();
    j.append("documentId", t), j.append("file", s);
    const l = new XMLHttpRequest();
    l.open("POST", B("Upload"), !0);
    const h = ((b = (x = (g = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.security) == null ? void 0 : g.antiForgery) == null ? void 0 : x.getToken) == null ? void 0 : b.call(x)) ?? ((S = document.querySelector('input[name="__RequestVerificationToken"]')) == null ? void 0 : S.value);
    h && l.setRequestHeader("RequestVerificationToken", h), l.upload.onprogress = (k) => {
      k.lengthComputable && o && o(Math.round(k.loaded / k.total * 100));
    }, l.onload = () => {
      if (l.status >= 200 && l.status < 300)
        try {
          i(JSON.parse(l.responseText));
        } catch {
          i(null);
        }
      else
        c(new Error(oe(l)));
    }, l.onerror = () => c(new Error("Ağ hatası")), l.onabort = () => c(new Error("İptal edildi")), d && d.addEventListener("abort", () => l.abort(), { once: !0 }), l.send(j);
  });
}
const se = /(^|[\s.])[A-Z][\w.]*(Exception|Error)\b/, C = {
  400: "Dosya kabul edilmedi.",
  401: "Oturumunuz düşmüş — sayfayı yenileyin.",
  403: "Bu klasöre yükleme yetkiniz yok.",
  404: "Hedef klasör bulunamadı.",
  413: "Dosya sunucu sınırını aşıyor."
};
function re(t) {
  if (!t) return null;
  const s = String(t).replace(/\s+/g, " ").trim();
  return !s || se.test(s) || s.includes("--->") || s.includes(" at ") ? null : s.length > 160 ? `${s.slice(0, 157)}…` : s;
}
function le(t) {
  return C[t] ? C[t] : t >= 500 ? "Sunucu hatası — tekrar deneyebilirsiniz." : `Sunucu ${t} döndü`;
}
function oe(t) {
  var o, d;
  let s = null;
  try {
    const i = JSON.parse(t.responseText);
    s = ((o = i == null ? void 0 : i.error) == null ? void 0 : o.message) || ((d = i == null ? void 0 : i.error) == null ? void 0 : d.details) || null;
  } catch {
    s = t.responseText || null;
  }
  return s && console.error("[Upload] sunucu hatası:", s), re(s) ?? le(t.status);
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
  var A;
  const t = new URLSearchParams(window.location.search), [s, o] = u.useState([]), [d, i] = u.useState([]), [c, j] = u.useState((t.get("documentId") || "").toLowerCase()), [l, h] = u.useState([]), [y, g] = u.useState(!1), [x, b] = u.useState(!0), [S, k] = u.useState(!1), [D, q] = u.useState(""), [I, P] = u.useState(""), w = u.useRef(null);
  u.useEffect(() => {
    (async () => {
      try {
        const [e, n] = await Promise.all([
          Z().getList({ maxResultCount: 1e3, sorting: "title asc" }),
          G()
        ]);
        o((e == null ? void 0 : e.items) ?? []), i(n ?? []);
      } catch (e) {
        v("error", "Klasörler yüklenemedi."), console.error("[Upload] load", e);
      } finally {
        b(!1);
      }
    })();
  }, []);
  const L = u.useCallback((e) => {
    const n = Array.from(e).map((r) => {
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
    h((r) => [...r, ...n]);
    const p = n.filter((r) => r.status === "rejected").length;
    p > 0 && v("warn", `${p} dosya kabul edilmedi (tür veya boyut).`);
  }, []), N = (e, n) => h((p) => p.map((r) => r.key === e ? { ...r, ...n } : r)), O = async () => {
    if (!c) {
      v("warn", "Önce hedef klasör seçin.");
      return;
    }
    g(!0);
    const n = [...l.filter((r) => r.status === "queued" || r.status === "failed")], p = async () => {
      for (; n.length > 0; ) {
        const r = n.shift();
        if (!r) return;
        N(r.key, { status: "uploading", percent: 0, error: null });
        try {
          const f = await ne(c, r.file, {
            onProgress: (_) => N(r.key, { percent: _ })
          });
          N(r.key, {
            status: "done",
            percent: 100,
            documentFileId: (f == null ? void 0 : f.documentFileId) ?? null
          });
        } catch (f) {
          N(r.key, { status: "failed", error: f.message });
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(ce, n.length) }, p)), g(!1);
  }, U = async () => {
    const e = [...new Set(l.filter((n) => n.status === "done" && n.documentFileId).map((n) => n.documentFileId))];
    if (e.length !== 0) {
      g(!0);
      try {
        const n = await ee({
          documentFileIds: e,
          documentTypeId: D || null,
          periodCode: I.trim() || null
        });
        v(n === e.length ? "success" : "warn", `${n}/${e.length} belgeye künye atandı.`);
      } catch (n) {
        v("error", "Künye atanamadı."), console.error("[Upload] setBulkMeta", n);
      } finally {
        g(!1);
      }
    }
  }, m = u.useMemo(() => {
    const e = { queued: 0, uploading: 0, done: 0, failed: 0, rejected: 0 };
    return l.forEach((n) => {
      e[n.status] = (e[n.status] ?? 0) + 1;
    }), e;
  }, [l]), K = (e) => {
    var n, p;
    e.preventDefault(), k(!1), (p = (n = e.dataTransfer) == null ? void 0 : n.files) != null && p.length && L(e.dataTransfer.files);
  };
  if (x) return /* @__PURE__ */ a.jsx("div", { className: "p-4", children: /* @__PURE__ */ a.jsx(Y, { rows: 6 }) });
  const $ = `${M()}Documents${c ? `?folder=${c}` : ""}`, H = ((A = s.find((e) => e.id === c)) == null ? void 0 : A.projectId) ?? null;
  return /* @__PURE__ */ a.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ a.jsx(
      X,
      {
        title: "Yükleme kuyruğu",
        description: "Dosyaları sürükleyin; sıra tek tek yükler, hatalı olanı tekrar denersiniz",
        menuItems: [{ key: "back", label: "Dokümanlar'a dön", icon: "fa-arrow-left", href: $ }]
      }
    ),
    /* @__PURE__ */ a.jsx(Q, { active: "docs", projectId: H }),
    /* @__PURE__ */ a.jsxs("div", { className: "apya-doc-uploadgrid", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ a.jsx("div", { className: "apya-md-overline", children: "Hedef klasör" }),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "apya-doc-select w-100 mb-3",
            value: c,
            onChange: (e) => j(e.target.value),
            "aria-label": "Hedef klasör",
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "Klasör seçin…" }),
              s.map((e) => /* @__PURE__ */ a.jsx("option", { value: e.id, children: e.title }, e.id))
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "div",
          {
            className: `apya-doc-dropzone${S ? " is-over" : ""}`,
            onDragOver: (e) => {
              e.preventDefault(), k(!0);
            },
            onDragLeave: () => k(!1),
            onDrop: K,
            onClick: () => {
              var e;
              return (e = w.current) == null ? void 0 : e.click();
            },
            role: "button",
            tabIndex: 0,
            onKeyDown: (e) => {
              var n;
              (e.key === "Enter" || e.key === " ") && ((n = w.current) == null || n.click());
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
            ref: w,
            type: "file",
            multiple: !0,
            hidden: !0,
            accept: E.join(","),
            onChange: (e) => {
              L(e.target.files), e.target.value = "";
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
              onChange: (e) => q(e.target.value),
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
              value: I,
              onChange: (e) => P(e.target.value),
              "aria-label": "Dönem kodu"
            }
          ),
          /* @__PURE__ */ a.jsx(
            T,
            {
              variant: "outline",
              size: "sm",
              className: "w-100",
              disabled: y || !D && !I.trim(),
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
            m.done > 0 && /* @__PURE__ */ a.jsxs(z, { variant: "positive", size: "sm", children: [
              m.done,
              " tamam"
            ] }),
            m.failed > 0 && /* @__PURE__ */ a.jsxs(z, { variant: "negative", size: "sm", children: [
              m.failed,
              " hata"
            ] }),
            l.length > 0 && /* @__PURE__ */ a.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: y,
                onClick: () => h((e) => e.filter((n) => n.status !== "done")),
                children: "Bitenleri temizle"
              }
            ),
            l.length > 0 && /* @__PURE__ */ a.jsx(
              T,
              {
                variant: "primary",
                size: "sm",
                disabled: y || !c || m.queued + m.failed === 0,
                onClick: O,
                children: y ? "Yükleniyor…" : `Yükle (${m.queued + m.failed})`
              }
            )
          ] })
        ] }),
        l.length === 0 ? /* @__PURE__ */ a.jsx(
          W,
          {
            icon: /* @__PURE__ */ a.jsx("i", { className: "fa fa-inbox" }),
            title: "Sıra boş",
            description: "Soldaki alana dosya bırakarak başlayın.",
            action: /* @__PURE__ */ a.jsx(
              V,
              {
                primary: /* @__PURE__ */ a.jsx(T, { size: "sm", onClick: () => {
                  var e;
                  return (e = w.current) == null ? void 0 : e.click();
                }, children: "Dosya seç" }),
                link: { label: "veya Dokümanlar'a dön", href: $ }
              }
            )
          }
        ) : l.map((e) => {
          const n = de[e.status];
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
                /* @__PURE__ */ a.jsx("span", { children: /* @__PURE__ */ a.jsx(z, { variant: n.variant, size: "sm", children: n.label }) }),
                /* @__PURE__ */ a.jsx("span", { className: "text-end", children: e.status !== "uploading" && /* @__PURE__ */ a.jsx(
                  "button",
                  {
                    type: "button",
                    className: "apya-doc-linkbtn",
                    disabled: y,
                    onClick: () => h((p) => p.filter((r) => r.key !== e.key)),
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
const F = document.getElementById("upload-queue-island");
F && J(F, "documents-upload", /* @__PURE__ */ a.jsx(pe, {}));
