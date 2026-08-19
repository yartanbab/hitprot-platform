import { r as p, j as a, b as U } from "./react-vendor.js";
/* empty css      */
import { B as C, g as D } from "./Dialog.js";
import { S as K } from "./SkeletonShape.js";
import { E as W } from "./EmptyState.js";
const S = (t, o) => {
  var l, d, c;
  return (c = (d = (l = window == null ? void 0 : window.abp) == null ? void 0 : l.notify) == null ? void 0 : d[t]) == null ? void 0 : c.call(d, o);
}, F = () => {
  var t;
  return ((t = window == null ? void 0 : window.abp) == null ? void 0 : t.appPath) ?? "/";
}, _ = () => {
  var t, o, l;
  return (l = (o = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : o.documents) == null ? void 0 : l.document;
};
function $(t) {
  return new Promise((o, l) => {
    window.abp.ajax(t).done(o).fail(l);
  });
}
const I = (t, o = {}) => {
  const l = new URLSearchParams();
  Object.entries(o).forEach(([c, u]) => {
    u != null && u !== "" && l.append(c, u);
  });
  const d = l.toString();
  return `${F()}Documents/Upload?handler=${t}${d ? "&" + d : ""}`;
}, H = () => $({ url: I("DocumentTypes"), type: "GET" }), Y = (t, o) => $({
  url: I("SetMeta", { id: t }),
  type: "POST",
  contentType: "application/json",
  data: JSON.stringify(o)
}), J = 25 * 1024 * 1024, E = [
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
function X(t) {
  const o = t.name.lastIndexOf("."), l = o < 0 ? "" : t.name.slice(o).toLowerCase();
  return !l || !E.includes(l) ? "Desteklenmeyen dosya türü" : t.size > J ? "Dosya 25 MB sınırını aşıyor" : null;
}
function Q(t, o, { onProgress: l, signal: d } = {}) {
  return new Promise((c, u) => {
    var y, x, k, v, b;
    const j = new FormData();
    j.append("documentId", t), j.append("file", o);
    const r = new XMLHttpRequest();
    r.open("POST", I("Upload"), !0);
    const h = ((v = (k = (x = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.security) == null ? void 0 : x.antiForgery) == null ? void 0 : k.getToken) == null ? void 0 : v.call(k)) ?? ((b = document.querySelector('input[name="__RequestVerificationToken"]')) == null ? void 0 : b.value);
    h && r.setRequestHeader("RequestVerificationToken", h), r.upload.onprogress = (g) => {
      g.lengthComputable && l && l(Math.round(g.loaded / g.total * 100));
    }, r.onload = () => {
      if (r.status >= 200 && r.status < 300)
        try {
          c(JSON.parse(r.responseText));
        } catch {
          c(null);
        }
      else
        u(new Error(V(r) || `Sunucu ${r.status} döndü`));
    }, r.onerror = () => u(new Error("Ağ hatası")), r.onabort = () => u(new Error("İptal edildi")), d && d.addEventListener("abort", () => r.abort(), { once: !0 }), r.send(j);
  });
}
function V(t) {
  var o, l, d;
  try {
    const c = JSON.parse(t.responseText);
    return ((o = c == null ? void 0 : c.error) == null ? void 0 : o.message) || ((l = c == null ? void 0 : c.error) == null ? void 0 : l.details) || null;
  } catch {
    return ((d = t.responseText) == null ? void 0 : d.slice(0, 160)) || null;
  }
}
const G = (t) => t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${(t / 1024).toFixed(0)} KB` : `${(t / (1024 * 1024)).toFixed(1)} MB`, Z = 3, ee = {
  queued: { label: "sırada", variant: "neutral" },
  uploading: { label: "yükleniyor", variant: "accent" },
  done: { label: "tamam", variant: "positive" },
  failed: { label: "hata", variant: "negative" },
  rejected: { label: "reddedildi", variant: "warning" }
};
let ae = 0;
function te() {
  const t = new URLSearchParams(window.location.search), [o, l] = p.useState([]), [d, c] = p.useState([]), [u, j] = p.useState((t.get("documentId") || "").toLowerCase()), [r, h] = p.useState([]), [y, x] = p.useState(!1), [k, v] = p.useState(!0), [b, g] = p.useState(!1), [N, B] = p.useState(""), [T, R] = p.useState(""), z = p.useRef(null);
  p.useEffect(() => {
    (async () => {
      try {
        const [e, n] = await Promise.all([
          _().getList({ maxResultCount: 1e3, sorting: "title asc" }),
          H()
        ]);
        l((e == null ? void 0 : e.items) ?? []), c(n ?? []);
      } catch (e) {
        S("error", "Klasörler yüklenemedi."), console.error("[Upload] load", e);
      } finally {
        v(!1);
      }
    })();
  }, []);
  const q = p.useCallback((e) => {
    const n = Array.from(e).map((s) => {
      const f = X(s);
      return {
        key: `f${++ae}`,
        file: s,
        name: s.name,
        size: s.size,
        status: f ? "rejected" : "queued",
        error: f,
        percent: 0,
        documentFileId: null
      };
    });
    h((s) => [...s, ...n]);
    const i = n.filter((s) => s.status === "rejected").length;
    i > 0 && S("warn", `${i} dosya kabul edilmedi (tür veya boyut).`);
  }, []), w = (e, n) => h((i) => i.map((s) => s.key === e ? { ...s, ...n } : s)), M = async () => {
    if (!u) {
      S("warn", "Önce hedef klasör seçin.");
      return;
    }
    x(!0);
    const n = [...r.filter((s) => s.status === "queued" || s.status === "failed")], i = async () => {
      for (; n.length > 0; ) {
        const s = n.shift();
        if (!s) return;
        w(s.key, { status: "uploading", percent: 0, error: null });
        try {
          const f = await Q(u, s.file, {
            onProgress: (A) => w(s.key, { percent: A })
          });
          w(s.key, {
            status: "done",
            percent: 100,
            documentFileId: (f == null ? void 0 : f.documentFileId) ?? null
          });
        } catch (f) {
          w(s.key, { status: "failed", error: f.message });
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(Z, n.length) }, i)), x(!1);
  }, P = async () => {
    const e = r.filter((i) => i.status === "done" && i.documentFileId);
    if (e.length === 0) return;
    x(!0);
    let n = 0;
    for (const i of e)
      try {
        await Y(i.documentFileId, {
          displayName: i.name,
          documentTypeId: N || null,
          periodCode: T || null
        }), n++;
      } catch (s) {
        console.error("[Upload] setMeta", i.name, s);
      }
    x(!1), S(n === e.length ? "success" : "warn", `${n}/${e.length} belgeye künye atandı.`);
  }, m = p.useMemo(() => {
    const e = { queued: 0, uploading: 0, done: 0, failed: 0, rejected: 0 };
    return r.forEach((n) => {
      e[n.status] = (e[n.status] ?? 0) + 1;
    }), e;
  }, [r]), O = (e) => {
    var n, i;
    e.preventDefault(), g(!1), (i = (n = e.dataTransfer) == null ? void 0 : n.files) != null && i.length && q(e.dataTransfer.files);
  };
  return k ? /* @__PURE__ */ a.jsx("div", { className: "p-4", children: /* @__PURE__ */ a.jsx(K, { rows: 6 }) }) : /* @__PURE__ */ a.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ a.jsxs("div", { className: "d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4", children: [
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Yükleme kuyruğu" }),
        /* @__PURE__ */ a.jsx("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: "Dosyaları sürükleyin; sıra tek tek yükler, hatalı olanı tekrar denersiniz" })
      ] }),
      /* @__PURE__ */ a.jsx("a", { className: "apya-doc-linkbtn", href: `${F()}Documents`, children: "Dokümanlar'a dön" })
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
              o.map((e) => /* @__PURE__ */ a.jsx("option", { value: e.id, children: e.title }, e.id))
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
            onDrop: O,
            onClick: () => {
              var e;
              return (e = z.current) == null ? void 0 : e.click();
            },
            role: "button",
            tabIndex: 0,
            onKeyDown: (e) => {
              var n;
              (e.key === "Enter" || e.key === " ") && ((n = z.current) == null || n.click());
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
            ref: z,
            type: "file",
            multiple: !0,
            hidden: !0,
            accept: E.join(","),
            onChange: (e) => {
              q(e.target.files), e.target.value = "";
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
              value: N,
              onChange: (e) => B(e.target.value),
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
              value: T,
              onChange: (e) => R(e.target.value),
              "aria-label": "Dönem kodu"
            }
          ),
          /* @__PURE__ */ a.jsx(
            C,
            {
              variant: "outline",
              size: "sm",
              className: "w-100",
              disabled: y || !N && !T,
              onClick: P,
              children: "Yüklenenlere uygula"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ a.jsxs("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: [
            "Sıra (",
            r.length,
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
            r.length > 0 && /* @__PURE__ */ a.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: y,
                onClick: () => h((e) => e.filter((n) => n.status !== "done")),
                children: "Bitenleri temizle"
              }
            ),
            /* @__PURE__ */ a.jsx(
              C,
              {
                variant: "primary",
                size: "sm",
                disabled: y || !u || m.queued + m.failed === 0,
                onClick: M,
                children: y ? "Yükleniyor…" : `Yükle (${m.queued + m.failed})`
              }
            )
          ] })
        ] }),
        r.length === 0 ? /* @__PURE__ */ a.jsx(
          W,
          {
            icon: /* @__PURE__ */ a.jsx("i", { className: "fa fa-inbox" }),
            title: "Sıra boş",
            description: "Soldaki alana dosya bırakarak başlayın."
          }
        ) : r.map((e) => {
          const n = ee[e.status];
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
                /* @__PURE__ */ a.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: G(e.size) }),
                /* @__PURE__ */ a.jsx("span", { children: /* @__PURE__ */ a.jsx(D, { variant: n.variant, size: "sm", children: n.label }) }),
                /* @__PURE__ */ a.jsx("span", { className: "text-end", children: e.status !== "uploading" && /* @__PURE__ */ a.jsx(
                  "button",
                  {
                    type: "button",
                    className: "apya-doc-linkbtn",
                    disabled: y,
                    onClick: () => h((i) => i.filter((s) => s.key !== e.key)),
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
const L = document.getElementById("upload-queue-island");
L && U(L).render(/* @__PURE__ */ a.jsx(te, {}));
