import { j as e, r as i, b as Ma } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { S as _e, B as I, g as L, h as La, I as K } from "./Dialog-BdNKdiS6.js";
import { M as ta } from "./ModalPortal-8QCz-DZi.js";
import { S as de } from "./SkeletonShape-CiCOe1YJ.js";
import { E as oe } from "./EmptyState-Bhcx2Wdd.js";
import { d as na } from "./draggableActivation-Ybw9Upbh.js";
import { H as Ce } from "./Hint-CNW95h3H.js";
const Oa = () => {
  var a, n, t;
  return (t = (n = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : n.documents) == null ? void 0 : t.document;
}, re = (a) => {
  var n, t;
  return (t = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.auth) == null ? void 0 : t.isGranted(a);
}, z = (a, n) => {
  var t, d, o;
  return (o = (d = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.notify) == null ? void 0 : d[a]) == null ? void 0 : o.call(d, n);
}, ce = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function B(a) {
  return new Promise((n, t) => {
    window.abp.ajax(a).done(n).fail(t);
  });
}
const S = (a, n = {}) => {
  const t = new URLSearchParams();
  Object.entries(n).forEach(([o, m]) => {
    if (!(m == null || m === "")) {
      if (Array.isArray(m)) {
        m.forEach((y) => t.append(o, y));
        return;
      }
      t.append(o, m);
    }
  });
  const d = t.toString();
  return `${ce()}Documents?handler=${a}${d ? "&" + d : ""}`;
}, M = (a, n) => B({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(n) }), ze = (a) => B({ url: S("Files", a), type: "GET" }), He = (a) => B({ url: S("File", { id: a }), type: "GET" }), Ka = (a, n) => M(S("UpdateFileMeta", { id: a }), n), Wa = (a, n) => B({ url: S("MoveFile", { id: a, targetDocumentId: n }), type: "POST" }), Ve = (a, n) => M(S("BulkMove"), { documentFileIds: a, targetDocumentId: n }), Ua = (a, n, t = !1) => M(S("BulkTag"), { documentFileIds: a, tags: n, remove: t }), Ga = (a) => B({ url: S("DeleteFile", { id: a }), type: "POST" }), qa = (a) => B({ url: S("RestoreFile", { id: a }), type: "POST" }), Ya = () => B({ url: S("DocumentTypes"), type: "GET" }), _a = (a) => B({ url: S("WorkSteps", { projectId: a }), type: "GET" }), Ha = (a) => B({ url: S("CompliancePackages", { projectId: a }), type: "GET" }), la = (a, n) => B({ url: S("ComplianceOverview", { projectId: a, periodCode: n }), type: "GET" }), Va = (a, n, t) => M(S("ApplyCompliancePackage"), { projectId: a, packageId: n, periodCode: t }), Qa = (a) => B({ url: S("RemoveComplianceAssignment", { assignmentId: a }), type: "POST" }), Za = (a) => M(S("WaiveComplianceItem"), a), Ja = (a) => M(S("LinkComplianceDocument"), a), Xa = () => B({ url: S("SetupState"), type: "GET" }), es = (a) => M(S("ApplySetup"), a), as = () => B({ url: S("CompleteSetup"), type: "POST" }), ss = (a) => B({ url: S("Suggestions", { projectId: a }), type: "GET" }), Qe = (a) => M(S("ApplySuggestions"), { suggestions: a }), ts = (a) => M(S("DismissSuggestions"), { suggestions: a }), ns = (a) => B({ url: S("ProjectTasks", { projectId: a }), type: "GET" }), ls = (a) => B({ url: S("ComplianceRequirements", { packageId: a }), type: "GET" }), is = (a) => M(S("CreateCompliancePackage"), a), rs = (a, n) => M(S("UpdateCompliancePackage", { id: a }), n), os = (a) => B({ url: S("DeleteCompliancePackage", { id: a }), type: "POST" }), cs = (a, n) => M(S("AddComplianceRequirement", { packageId: a }), n), ds = (a, n) => M(S("UpdateComplianceRequirement", { id: a }), n), us = (a) => B({ url: S("DeleteComplianceRequirement", { id: a }), type: "POST" }), ms = (a) => B({ url: S("Activity", a), type: "GET" }), ps = (a, n) => {
  const t = new FormData();
  return t.append("documentId", a), t.append("file", n), B({
    url: S("UploadFile"),
    type: "POST",
    data: t,
    contentType: !1,
    processData: !1
  });
}, E = (...a) => a.filter(Boolean).join(" "), G = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  money: (a, n) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + (n ? " " + ys(n) : ""),
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
};
function ys(a) {
  return { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }[a] || a;
}
const se = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Kesin", chip: "apya-chip-positive" },
  3: { text: "Eşleşti", chip: "apya-chip-accent" },
  4: { text: "Süre dolan", chip: "apya-chip-negative" }
}, Ze = {
  1: { text: "Manuel", variant: "neutral" },
  2: { text: "OCR", variant: "brand" },
  3: { text: "AI", variant: "accent" },
  4: { text: "Kural", variant: "warning" }
}, xs = {
  1: "Yüklendi",
  2: "İndirildi",
  3: "Silindi",
  4: "Görüntülendi",
  5: "Meta değişti",
  6: "Taşındı"
};
function Ie(a, n) {
  var d;
  const t = ((d = (n || "").split(".").pop()) == null ? void 0 : d.toLowerCase()) || "";
  return a != null && a.includes("pdf") || t === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444", label: "PDF" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(t) ? { icon: "fa-file-excel", color: "#10B981", label: "XLS" } : a != null && a.includes("word") || ["docx", "doc"].includes(t) ? { icon: "fa-file-word", color: "#3B82F6", label: "DOC" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(t) ? { icon: "fa-file-powerpoint", color: "#F59E0B", label: "PPT" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(t) ? { icon: "fa-file-image", color: "#8B5CF6", label: "IMG" } : ["zip", "rar", "7z"].includes(t) ? { icon: "fa-file-zipper", color: "#6B7280", label: "ZIP" } : { icon: "fa-file", color: "#6B7280", label: "DOSYA" };
}
function hs(a) {
  const n = ["apya-chip-accent", "apya-chip-brand", "apya-chip-positive", "apya-chip-warning", "apya-chip-neutral"];
  let t = 0;
  for (let d = 0; d < a.length; d++) t = t * 31 + a.charCodeAt(d) >>> 0;
  return n[t % n.length];
}
const fs = [
  { key: "expiring", label: "Süresi dolanlar", icon: "fa-clock-rotate-left" },
  { key: "missing-meta", label: "Eksik meta", icon: "fa-triangle-exclamation" },
  { key: "suggested", label: "Öneri bekleyen", icon: "fa-wand-magic-sparkles" },
  { key: "trash", label: "Çöp kutusu", icon: "fa-trash-can" }
];
function ia({
  node: a,
  depth: n,
  activeKey: t,
  expanded: d,
  onToggle: o,
  onSelect: m,
  onDropFiles: y,
  dragTarget: h,
  setDragTarget: c
}) {
  var b;
  const j = ((b = a.children) == null ? void 0 : b.length) > 0, g = d.has(a.key), f = h === a.documentId && a.documentId;
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m(a),
        onDragOver: (k) => {
          a.documentId && (k.preventDefault(), c(a.documentId));
        },
        onDragLeave: () => c(null),
        onDrop: (k) => {
          a.documentId && (k.preventDefault(), c(null), y(a.documentId));
        },
        className: E("apya-md-item", t === a.key && "selected"),
        style: {
          paddingLeft: 10 + n * 14,
          borderRadius: 8,
          ...f ? { outline: "2px dashed var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
        },
        children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              role: "button",
              tabIndex: -1,
              onClick: (k) => {
                k.stopPropagation(), j && o(a.key);
              },
              className: "w-3 flex-shrink-0",
              style: { color: "var(--apya-text-tertiary)" },
              children: j && /* @__PURE__ */ e.jsx("i", { className: `fa fa-chevron-${g ? "down" : "right"}`, style: { fontSize: 9 } })
            }
          ),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${a.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: a.label }),
          typeof a.count == "number" && /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: a.count })
        ]
      }
    ),
    j && g && a.children.map((k) => /* @__PURE__ */ e.jsx(
      ia,
      {
        node: k,
        depth: n + 1,
        activeKey: t,
        expanded: d,
        onToggle: o,
        onSelect: m,
        onDropFiles: y,
        dragTarget: h,
        setDragTarget: c
      },
      k.key
    ))
  ] });
}
function gs({
  loading: a,
  tree: n,
  activeKey: t,
  expanded: d,
  onToggle: o,
  onSelect: m,
  onDropFiles: y,
  dragTarget: h,
  setDragTarget: c
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Bağlam" }),
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m({ key: "all", kind: "all" }),
        className: E("apya-md-item", t === "all" && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-tree", style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", style: { fontWeight: 600 }, children: "Tüm Dokümanlar" })
        ]
      }
    ),
    a ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(de, { rows: 5 }) }) : n.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör yok." }) : n.map((j) => /* @__PURE__ */ e.jsx(
      ia,
      {
        node: j,
        depth: 0,
        activeKey: t,
        expanded: d,
        onToggle: o,
        onSelect: m,
        onDropFiles: y,
        dragTarget: h,
        setDragTarget: c
      },
      j.key
    )),
    /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Akıllı klasörler" }),
    fs.map((j) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m({ key: j.key, kind: "smart", smart: j.key }),
        className: E("apya-md-item", t === j.key && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${j.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: j.label })
        ]
      },
      j.key
    ))
  ] });
}
const ra = [
  { key: "displayName", label: "Belge", sortable: !0, width: "minmax(0,1fr)" },
  { key: "workStep", label: "İş adımı", sortable: !1, width: "140px" },
  { key: "type", label: "Tür", sortable: !1, width: "96px" },
  { key: "amount", label: "Tutar", sortable: !0, width: "116px", align: "right" },
  { key: "documentDate", label: "Tarih", sortable: !0, width: "96px" },
  { key: "status", label: "Durum", sortable: !1, width: "110px" }
], Te = `34px ${ra.map((a) => a.width).join(" ")}`;
function vs({ column: a, sorting: n, onSort: t }) {
  if (!a.sortable)
    return /* @__PURE__ */ e.jsx("span", { style: { textAlign: a.align || "left" }, children: a.label });
  const [d, o] = (n || "").split(" "), m = d === a.key, y = m && o !== "desc" ? "desc" : "asc";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => t(`${a.key} ${y}`),
      className: "d-flex align-items-center gap-1",
      style: {
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        font: "inherit",
        color: m ? "var(--apya-accent-500)" : "inherit",
        justifyContent: a.align === "right" ? "flex-end" : "flex-start",
        width: "100%"
      },
      "aria-sort": m ? o === "desc" ? "descending" : "ascending" : "none",
      children: [
        a.label,
        /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${m ? o === "desc" ? "arrow-down" : "arrow-up" : "arrows-up-down"}`,
            style: { fontSize: 8, opacity: m ? 1 : 0.4 }
          }
        )
      ]
    }
  );
}
function ks({ item: a, onUpload: n, canUpload: t }) {
  const d = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || "Proje";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-missing-row", style: { gridTemplateColumns: Te }, children: [
    /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-warning-600, #B45309)", textAlign: "center", fontWeight: 700, fontSize: 12 }, children: "!" }),
    /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "d-grid place-items-center flex-shrink-0",
          style: {
            width: 26,
            height: 26,
            borderRadius: 7,
            fontSize: 11,
            border: "1px dashed var(--apya-border-default)",
            color: "var(--apya-text-tertiary)"
          },
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" })
        }
      ),
      /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 13, fontWeight: 500, color: "var(--apya-warning-700, #92400E)" }, children: [
        "Eksik: ",
        a.title
      ] }),
      a.isBlocking && /* @__PURE__ */ e.jsx(L, { variant: "warning", size: "sm", children: "teslimi bloke ediyor" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: d }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: a.documentTypeName || "—" }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right", color: "var(--apya-text-tertiary)" }, children: "—" }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-warning-700, #92400E)" }, children: "bekliyor" }),
    /* @__PURE__ */ e.jsx("span", { children: t ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-missing-upload", onClick: () => n(a), children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
      " Yükle"
    ] }) : /* @__PURE__ */ e.jsx("span", { className: "apya-chip apya-chip-warning", children: "Eksik" }) })
  ] });
}
function js({ file: a, selected: n, checked: t, onSelect: d, onToggleCheck: o, onDragStart: m, isTrash: y, onRestore: h }) {
  const c = Ie(a.contentType, a.fileName), j = se[a.status] || se[1], g = na(() => d(a));
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !y,
      onDragStart: y ? void 0 : () => m(a),
      onPointerDown: y ? void 0 : g.onPointerDown,
      onClick: y ? void 0 : g.onClick,
      className: E("apya-doc-row", n && "is-selected", y && "is-trashed"),
      style: { gridTemplateColumns: Te },
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            onClick: y ? void 0 : (f) => {
              f.stopPropagation(), o(a.id);
            },
            onPointerDown: y ? void 0 : (f) => f.stopPropagation(),
            style: { cursor: y ? "default" : "pointer" },
            children: y ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash-can", style: { fontSize: 12, color: "var(--apya-text-tertiary)" } }) : /* @__PURE__ */ e.jsx(
              "i",
              {
                className: `fa fa-${t ? "square-check" : "square"}`,
                style: { fontSize: 13, color: t ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
                role: "checkbox",
                "aria-checked": t
              }
            )
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 26, height: 26, borderRadius: 7, background: `${c.color}1a`, color: c.color, fontSize: 11 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${c.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.displayName }),
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(L, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] }),
          a.isLocked && /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock", style: { fontSize: 10, color: "var(--apya-text-tertiary)" }, title: "Kilitli" })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: a.documentTypeName || "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right" }, children: G.money(a.amount, a.currency) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: G.date(a.documentDate || a.creationTime) }),
        /* @__PURE__ */ e.jsx("span", { children: y ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => h(a), children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-rotate-left" }),
          " Geri al"
        ] }) : /* @__PURE__ */ e.jsx("span", { className: E("apya-chip", j.chip), children: j.text }) })
      ]
    }
  );
}
function bs({ file: a, selected: n, onSelect: t, onDragStart: d }) {
  const o = Ie(a.contentType, a.fileName), m = se[a.status] || se[1];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: !0,
      onDragStart: () => d(a),
      ...na(() => t(a)),
      className: "apya-tile",
      style: {
        textAlign: "left",
        cursor: "pointer",
        ...n ? { borderColor: "var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-head", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-2", style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "apya-tile-icon-box", style: { background: `${o.color}1a`, color: o.color }, children: /* @__PURE__ */ e.jsx("i", { className: `fa ${o.icon}` }) }),
            /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
              /* @__PURE__ */ e.jsx("div", { className: "apya-tile-title", children: a.displayName }),
              /* @__PURE__ */ e.jsx("div", { className: "apya-tile-sub", children: a.documentTypeName || "Sınıflandırılmamış" })
            ] })
          ] }),
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(L, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", style: { borderTop: "none", paddingTop: 0 }, children: [
          /* @__PURE__ */ e.jsx("span", { className: E("apya-chip", m.chip), children: m.text }),
          a.amount !== null && a.amount !== void 0 && /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: G.money(a.amount, a.currency) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", children: a.uploaderName || "Sistem" }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", children: G.date(a.documentDate || a.creationTime) })
        ] })
      ]
    }
  );
}
function Ns({
  loading: a,
  files: n,
  totalCount: t,
  view: d,
  sorting: o,
  onSort: m,
  selectedId: y,
  onSelect: h,
  checkedIds: c,
  onToggleCheck: j,
  onToggleAll: g,
  page: f,
  pageSize: b,
  onPageChange: k,
  onDragStart: x,
  emptyHint: R,
  missingItems: $ = [],
  onUploadMissing: l,
  canUpload: N = !1,
  isTrash: r = !1,
  onRestore: w
}) {
  const C = n.length > 0 && n.every((p) => c.has(p.id)), P = Math.max(1, Math.ceil(t / b)), W = f === 0 && d === "list" ? $ : [];
  return a ? d === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: Array.from({ length: 6 }).map((p, F) => /* @__PURE__ */ e.jsx(_e, { height: 120, rounded: "lg" }, F)) }) : /* @__PURE__ */ e.jsx("div", { className: "p-3 d-flex flex-column gap-2", children: Array.from({ length: 8 }).map((p, F) => /* @__PURE__ */ e.jsx(_e, { height: 40, rounded: "md" }, F)) }) : n.length === 0 && W.length === 0 ? /* @__PURE__ */ e.jsx(
    oe,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
      title: "Burada henüz belge yok",
      description: R
    }
  ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    d === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: n.map((p) => /* @__PURE__ */ e.jsx(
      bs,
      {
        file: p,
        selected: y === p.id,
        onSelect: h,
        onDragStart: x
      },
      p.id
    )) }) : /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-row-head", style: { gridTemplateColumns: Te }, children: [
        /* @__PURE__ */ e.jsx("span", { onClick: g, style: { cursor: "pointer" }, children: /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${C ? "square-check" : "square"}`,
            style: { fontSize: 13, color: C ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
            role: "checkbox",
            "aria-checked": C
          }
        ) }),
        ra.map((p) => /* @__PURE__ */ e.jsx(vs, { column: p, sorting: o, onSort: m }, p.key))
      ] }),
      W.map((p) => /* @__PURE__ */ e.jsx(
        ks,
        {
          item: p,
          onUpload: l,
          canUpload: N
        },
        `missing-${p.assignmentId}-${p.requirementId}-${p.workStepId || "none"}`
      )),
      n.map((p) => /* @__PURE__ */ e.jsx(
        js,
        {
          file: p,
          selected: y === p.id,
          checked: c.has(p.id),
          onSelect: h,
          onToggleCheck: j,
          onDragStart: x,
          isTrash: r,
          onRestore: w
        },
        p.id
      ))
    ] }),
    P > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            f * b + 1,
            "–",
            Math.min((f + 1) * b, t),
            " / ",
            t
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", disabled: f === 0, onClick: () => k(f - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              f + 1,
              " / ",
              P
            ] }),
            /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", disabled: f + 1 >= P, onClick: () => k(f + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
function Ss({ count: a, onClear: n, onMove: t, onTag: d, busy: o }) {
  return a === 0 ? null : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-bulkbar", children: [
    /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
      a,
      " belge seçildi"
    ] }),
    /* @__PURE__ */ e.jsx("span", { style: { width: 1, height: 18, background: "rgba(255,255,255,.18)" } }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: t, disabled: o, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-open" }),
      " Taşı"
    ] }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: d, disabled: o, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-tag" }),
      " Etiketle"
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
    /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: n, children: "Vazgeç" })
  ] });
}
function ws({ tags: a }) {
  return a != null && a.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1", children: a.map((n) => /* @__PURE__ */ e.jsx("span", { className: E("apya-chip", hs(n)), children: n }, n)) }) : null;
}
const Je = {
  1: { icon: "fa-diagram-project", label: "Proje" },
  2: { icon: "fa-list-check", label: "İş adımı" },
  3: { icon: "fa-receipt", label: "Harcama", href: (a) => a ? `${ce()}Expenses` : null },
  4: {
    icon: "fa-box-archive",
    label: "Teslim paketi",
    href: (a) => a ? `${ce()}Documents/Deliveries?packageId=${a}` : null
  },
  5: { icon: "fa-clipboard-check", label: "Kontrol listesi kalemi" }
};
function Cs({ field: a, value: n, onChange: t, disabled: d }) {
  const o = { size: "sm", disabled: d, value: n ?? "" };
  switch (a.fieldType) {
    case 2:
      return /* @__PURE__ */ e.jsx(K, { ...o, type: "date", onChange: (m) => t({ valueDate: m.target.value || null }) });
    case 3:
    case 4:
    case 5:
      return /* @__PURE__ */ e.jsx(
        K,
        {
          ...o,
          type: "number",
          step: a.fieldType === 3 ? "0.01" : "1",
          onChange: (m) => t({ valueNumber: m.target.value === "" ? null : Number(m.target.value) })
        }
      );
    default:
      return /* @__PURE__ */ e.jsx(K, { ...o, onChange: (m) => t({ valueText: m.target.value || null }) });
  }
}
function zs(a) {
  return a.fieldType === 2 ? a.valueDate ? a.valueDate.substring(0, 10) : "" : [3, 4, 5].includes(a.fieldType) ? a.valueNumber ?? "" : a.valueText ?? "";
}
function Ds({
  detail: a,
  loading: n,
  canEdit: t,
  onSave: d,
  onDelete: o,
  saving: m,
  documentTypes: y
}) {
  var x, R, $;
  const [h, c] = i.useState(null);
  if (i.useEffect(() => {
    c(a ? { ...a, fields: (a.fields || []).map((l) => ({ ...l })) } : null);
  }, [a == null ? void 0 : a.id]), n)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(de, { rows: 6 }) });
  if (!a || !h)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(
      oe,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir belge seçin",
        description: "Künye, özel alanlar ve versiyon geçmişi burada görünür."
      }
    ) });
  const j = Ie(a.contentType, a.fileName), g = se[h.status] || se[1], f = G.daysLeft(h.expiryDate), b = (l, N) => {
    c((r) => ({
      ...r,
      fields: r.fields.map((w) => w.fieldId === l ? { ...w, valueText: null, valueNumber: null, valueDate: null, ...N } : w)
    }));
  }, k = h.fields.filter(
    (l) => l.isRequired && !l.valueText && l.valueNumber === null && !l.valueDate
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-md-detail", style: { overflowY: "auto" }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
      /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "d-grid place-items-center flex-shrink-0",
          style: { width: 48, height: 48, borderRadius: 14, background: `${j.color}1a`, color: j.color, fontSize: 20 },
          children: /* @__PURE__ */ e.jsx("i", { className: `fa ${j.icon}` })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 14, fontWeight: 600, wordBreak: "break-word" }, children: a.displayName }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric mt-1", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
          G.size(a.fileSize),
          " · ",
          j.label,
          a.versionCount > 1 && ` · v${a.versionCount}`
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-1 mt-1 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: E("apya-chip", g.chip), children: g.text }),
          f !== null && f >= 0 && f <= 30 && /* @__PURE__ */ e.jsxs(L, { variant: "warning", size: "sm", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
            " ",
            f,
            " gün"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-3", children: [
      a.downloadUrl && /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: La({ variant: "primary" }), style: { flex: 1 }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }),
      t && !a.isLocked && /* @__PURE__ */ e.jsx(I, { variant: "outline", onClick: () => o(a), title: "Sil", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash", style: { color: "var(--apya-negative-500)" } }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "row g-2 mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Klasör" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12 }, children: a.folderName || "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "İş adımı" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12 }, children: a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Yükleyen" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12 }, children: a.uploaderName || "Sistem" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Yükleme" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: G.dateTime(a.creationTime) })
      ] }),
      a.retentionUntil && /* @__PURE__ */ e.jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Saklama" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: G.date(a.retentionUntil) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Özel alanlar",
        /* @__PURE__ */ e.jsx(Ce, { text: "Alan şeması belge tipine bağlıdır. Tip değiştirdiğinizde kaydettikten sonra o tipin alanları görünür." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tipi" }),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-select",
              disabled: !t || a.isLocked,
              value: h.documentTypeId || "",
              onChange: (l) => c({ ...h, documentTypeId: l.target.value || null }),
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "— Sınıflandırılmamış —" }),
                y.map((l) => /* @__PURE__ */ e.jsx("option", { value: l.id, children: l.name }, l.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Tutar" }),
          /* @__PURE__ */ e.jsx(
            K,
            {
              size: "sm",
              type: "number",
              step: "0.01",
              disabled: !t || a.isLocked,
              value: h.amount ?? "",
              onChange: (l) => c({ ...h, amount: l.target.value === "" ? null : Number(l.target.value) })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tarihi" }),
          /* @__PURE__ */ e.jsx(
            K,
            {
              size: "sm",
              type: "date",
              disabled: !t || a.isLocked,
              value: h.documentDate ? h.documentDate.substring(0, 10) : "",
              onChange: (l) => c({ ...h, documentDate: l.target.value || null })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Dönem" }),
          /* @__PURE__ */ e.jsx(
            K,
            {
              size: "sm",
              placeholder: "2026-Q2",
              disabled: !t || a.isLocked,
              value: h.periodCode ?? "",
              onChange: (l) => c({ ...h, periodCode: l.target.value || null })
            }
          )
        ] }),
        h.fields.map((l) => {
          var N, r;
          return /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              l.label,
              l.isRequired && /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-negative-500)" }, children: "*" }),
              /* @__PURE__ */ e.jsx(L, { variant: ((N = Ze[l.fillSource]) == null ? void 0 : N.variant) || "neutral", size: "sm", children: ((r = Ze[l.fillSource]) == null ? void 0 : r.text) || "—" }),
              l.confidence !== null && l.confidence !== void 0 && /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10 }, children: [
                "%",
                l.confidence
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              Cs,
              {
                field: l,
                value: zs(l),
                disabled: !t || a.isLocked,
                onChange: (w) => b(l.fieldId, w)
              }
            )
          ] }, l.fieldId);
        })
      ] }),
      k.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", style: { fontSize: 11, color: "var(--apya-warning-500)" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation" }),
        " ",
        k.length,
        " zorunlu alan boş."
      ] }),
      t && !a.isLocked && /* @__PURE__ */ e.jsx(
        I,
        {
          variant: "primary",
          size: "sm",
          className: "mt-3 w-100",
          isLoading: m,
          onClick: () => d(h),
          children: "Kaydet"
        }
      )
    ] }),
    ((x = a.tags) == null ? void 0 : x.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Etiketler" }),
      /* @__PURE__ */ e.jsx(ws, { tags: a.tags })
    ] }),
    ((R = a.related) == null ? void 0 : R.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "İlişkili kayıtlar",
        /* @__PURE__ */ e.jsx(Ce, { text: "Belgenin bağlandığı harcama, içinde gittiği teslim paketi ve karşıladığı kontrol listesi kalemleri." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.related.map((l, N) => {
        var P;
        const r = Je[l.kind] ?? Je[3], w = (P = r.href) == null ? void 0 : P.call(r, l.entityId), C = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 22, height: 22, borderRadius: 6, background: "var(--apya-surface-sunken)", color: "var(--apya-text-secondary)", fontSize: 10 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${r.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12 }, children: l.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "d-block text-truncate apya-numeric",
                style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" },
                children: [r.label, l.detail].filter(Boolean).join(" · ")
              }
            )
          ] })
        ] });
        return w ? /* @__PURE__ */ e.jsx(
          "a",
          {
            href: w,
            className: "d-flex align-items-center gap-2 text-decoration-none",
            style: { color: "inherit" },
            children: C
          },
          `${l.kind}-${l.entityId}-${N}`
        ) : /* @__PURE__ */ e.jsx("div", { className: "d-flex align-items-center gap-2", children: C }, `${l.kind}-${N}`);
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Versiyonlar",
        /* @__PURE__ */ e.jsx(Ce, { text: "Aynı klasöre aynı isimle yeniden yüklenen dosya yeni versiyon olur; önceki versiyonlar burada kalır." })
      ] }),
      ($ = a.versions) != null && $.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1", children: a.versions.map((l) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsxs(L, { variant: l.isLatest ? "brand" : "neutral", size: "sm", children: [
            "v",
            l.versionNumber
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { color: "var(--apya-text-secondary)" }, children: l.uploaderName })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { color: "var(--apya-text-tertiary)" }, children: G.date(l.creationTime) })
      ] }, l.id)) }) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Versiyon kaydı yok." })
    ] })
  ] });
}
const oa = [
  { value: 1, label: "Proje geneli" },
  { value: 2, label: "Her iş adımı için" },
  { value: 3, label: "Her dönem için" }
], ca = [
  { value: 2, label: "Klasör şeması" },
  { value: 3, label: "Task eki" }
], Is = {
  title: "",
  scope: 1,
  documentTypeId: "",
  isBlocking: !1,
  order: 0,
  source: 2,
  sourceEntityId: ""
};
function Ts({ draft: a, setDraft: n, documentTypes: t, tasks: d, onSubmit: o, onCancel: m, busy: y }) {
  const h = Number(a.source) === 3;
  return /* @__PURE__ */ e.jsxs(
    "form",
    {
      className: "d-flex flex-column gap-2 p-2",
      style: { background: "var(--apya-surface-sunken)", borderRadius: 10 },
      onSubmit: (c) => {
        c.preventDefault(), o();
      },
      children: [
        /* @__PURE__ */ e.jsx(
          K,
          {
            size: "sm",
            placeholder: "Kalem adı (ör. İmzalı hizmet sözleşmesi)",
            value: a.title,
            onChange: (c) => n({ ...a, title: c.target.value }),
            required: !0
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.source,
              onChange: (c) => n({ ...a, source: Number(c.target.value), sourceEntityId: "" }),
              "aria-label": "Kaynak",
              children: ca.map((c) => /* @__PURE__ */ e.jsx("option", { value: c.value, children: c.label }, c.value))
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.scope,
              onChange: (c) => n({ ...a, scope: Number(c.target.value) }),
              "aria-label": "Kapsam",
              children: oa.map((c) => /* @__PURE__ */ e.jsx("option", { value: c.value, children: c.label }, c.value))
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-doc-select",
              value: a.documentTypeId || "",
              onChange: (c) => n({ ...a, documentTypeId: c.target.value }),
              "aria-label": "Belge tipi",
              disabled: h,
              title: h ? "Göreve bağlı kalem otomatik eşleşmez" : void 0,
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "Belge tipi: yok (elle bağlanır)" }),
                t.map((c) => /* @__PURE__ */ e.jsx("option", { value: c.id, children: c.name }, c.id))
              ]
            }
          )
        ] }),
        h && /* @__PURE__ */ e.jsxs(
          "select",
          {
            className: "apya-doc-select",
            value: a.sourceEntityId || "",
            onChange: (c) => n({ ...a, sourceEntityId: c.target.value }),
            "aria-label": "Görev",
            required: !0,
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Görev seçin…" }),
              d.map((c) => /* @__PURE__ */ e.jsxs("option", { value: c.id, children: [
                "#",
                c.number,
                " · ",
                c.title
              ] }, c.id))
            ]
          }
        ),
        h && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-warning-700, #92400E)" }, children: "Göreve bağlı kalem otomatik karşılanmaz; belge elle bağlanır." }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex align-items-center gap-2", style: { fontSize: 12 }, children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: a.isBlocking,
              onChange: (c) => n({ ...a, isBlocking: c.target.checked })
            }
          ),
          "Eksikse teslim paketi üretimini bloke etsin"
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [
          /* @__PURE__ */ e.jsx(I, { type: "button", variant: "outline", size: "sm", onClick: m, children: "Vazgeç" }),
          /* @__PURE__ */ e.jsx(I, { type: "submit", size: "sm", isLoading: y, disabled: !a.title.trim(), children: "Kaydet" })
        ] })
      ]
    }
  );
}
function Es({ pkg: a, projectId: n, documentTypes: t, onClose: d, onChanged: o }) {
  const [m, y] = i.useState([]), [h, c] = i.useState([]), [j, g] = i.useState(!0), [f, b] = i.useState(!1), [k, x] = i.useState({
    name: a.name,
    issuer: a.issuer,
    description: a.description || "",
    order: a.order || 0
  }), [R, $] = i.useState(null), [l, N] = i.useState(null), r = i.useCallback(async () => {
    g(!0);
    try {
      const [p, F] = await Promise.all([
        ls(a.id),
        // Görev listesi yalnız proje bağlamında anlamlı; yoksa "task eki"
        // kaynağı seçilebilir ama liste boş kalır.
        n ? ns(n) : Promise.resolve([])
      ]);
      y(p ?? []), c(F ?? []);
    } catch (p) {
      z("error", "Paket kalemleri yüklenemedi."), console.error("[Documents] package requirements", p);
    } finally {
      g(!1);
    }
  }, [a.id, n]);
  i.useEffect(() => {
    r();
  }, [r]);
  const w = async () => {
    b(!0);
    try {
      await rs(a.id, {
        name: k.name,
        issuer: k.issuer,
        description: k.description || null,
        order: k.order
      }), z("success", "Paket güncellendi."), o == null || o();
    } catch (p) {
      z("error", "Paket güncellenemedi."), console.error("[Documents] update package", p);
    } finally {
      b(!1);
    }
  }, C = async () => {
    b(!0);
    try {
      const p = {
        title: R.title.trim(),
        scope: Number(R.scope),
        documentTypeId: R.documentTypeId || null,
        isBlocking: R.isBlocking,
        order: Number(R.order) || m.length,
        source: Number(R.source),
        sourceEntityId: R.sourceEntityId || null
      };
      l ? await ds(l, p) : await cs(a.id, p), $(null), N(null), await r(), o == null || o();
    } catch (p) {
      z("error", "Kalem kaydedilemedi."), console.error("[Documents] save requirement", p);
    } finally {
      b(!1);
    }
  }, P = async (p) => {
    b(!0);
    try {
      await us(p), await r(), o == null || o();
    } catch (F) {
      z("error", "Kalem silinemedi."), console.error("[Documents] delete requirement", F);
    } finally {
      b(!1);
    }
  }, W = async () => {
    var p, F;
    if (window.confirm(`"${a.name}" paketi silinecek. Emin misiniz?`)) {
      b(!0);
      try {
        await os(a.id), o == null || o(), d();
      } catch (A) {
        z("error", ((F = (p = A == null ? void 0 : A.responseJSON) == null ? void 0 : p.error) == null ? void 0 : F.message) || "Paket silinemedi."), console.error("[Documents] delete package", A);
      } finally {
        b(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Paketi düzenle" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: W, disabled: f, children: "Paketi sil" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: d, children: "Kapat" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx(
        K,
        {
          size: "sm",
          placeholder: "Paket adı",
          value: k.name,
          onChange: (p) => x({ ...k, name: p.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(
        K,
        {
          size: "sm",
          placeholder: "İsteyen taraf (ör. İç politika)",
          value: k.issuer,
          onChange: (p) => x({ ...k, issuer: p.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(I, { size: "sm", variant: "outline", isLoading: f, onClick: w, children: "Kaydet" })
    ] }),
    j ? /* @__PURE__ */ e.jsx(de, { rows: 4 }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-list", children: [
      m.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "p-2", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette henüz kalem yok." }),
      m.map((p) => {
        var F, A;
        return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", children: [
          /* @__PURE__ */ e.jsx("span", { className: E("apya-chip", p.isBlocking ? "apya-chip-warning" : "apya-chip-neutral"), children: p.isBlocking ? "bloke eden" : "normal" }),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: p.title }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              ((F = ca.find((te) => te.value === p.source)) == null ? void 0 : F.label) || "kurum şablonu",
              p.sourceEntityName && ` · ${p.sourceEntityName}`,
              " · ",
              (A = oa.find((te) => te.value === p.scope)) == null ? void 0 : A.label,
              p.documentTypeName && ` · ${p.documentTypeName}`
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("span", {}),
          /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2 justify-content-end", children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: f,
                onClick: () => {
                  N(p.id), $({
                    title: p.title,
                    scope: p.scope,
                    documentTypeId: p.documentTypeId || "",
                    isBlocking: p.isBlocking,
                    order: p.order,
                    source: p.source === 1 ? 2 : p.source,
                    sourceEntityId: p.sourceEntityId || ""
                  });
                },
                children: "Düzenle"
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: f,
                onClick: () => P(p.id),
                children: "Sil"
              }
            )
          ] })
        ] }, p.id);
      })
    ] }),
    R ? /* @__PURE__ */ e.jsx(
      Ts,
      {
        draft: R,
        setDraft: $,
        documentTypes: t,
        tasks: h,
        onSubmit: C,
        onCancel: () => {
          $(null), N(null);
        },
        busy: f
      }
    ) : /* @__PURE__ */ e.jsx(
      I,
      {
        size: "sm",
        variant: "outline",
        leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
        onClick: () => {
          N(null), $({ ...Is, order: m.length });
        },
        children: "Kalem ekle"
      }
    )
  ] });
}
function Ps({ packages: a, projectId: n, documentTypes: t, onChanged: d }) {
  const [o, m] = i.useState(null), [y, h] = i.useState(!1), [c, j] = i.useState(""), [g, f] = i.useState(!1), b = a.filter((x) => x.isEditable), k = async () => {
    f(!0);
    try {
      const x = await is({
        name: c.trim(),
        issuer: "İç politika",
        description: null,
        order: b.length
      });
      j(""), h(!1), d == null || d(), m(x);
    } catch (x) {
      z("error", "Paket oluşturulamadı."), console.error("[Documents] create package", x);
    } finally {
      f(!1);
    }
  };
  return o ? /* @__PURE__ */ e.jsx(
    Es,
    {
      pkg: o,
      projectId: n,
      documentTypes: t,
      onClose: () => m(null),
      onChanged: d
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Kendi paketleriniz" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      !y && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => h(!0), children: "+ Yeni paket" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Kurum paketleri (KOSGEB, TÜBİTAK) sistemde tanımlıdır ve değiştirilemez. Kendi klasör şemanız ve göreve bağlı ekleriniz için buradan paket kurun." }),
    y && /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        K,
        {
          size: "sm",
          autoFocus: !0,
          placeholder: "Paket adı (ör. Şirket klasör şeması)",
          value: c,
          onChange: (x) => j(x.target.value),
          onKeyDown: (x) => {
            x.key === "Enter" && c.trim() && k();
          }
        }
      ),
      /* @__PURE__ */ e.jsx(I, { size: "sm", isLoading: g, disabled: !c.trim(), onClick: k, children: "Oluştur" }),
      /* @__PURE__ */ e.jsx(I, { size: "sm", variant: "outline", onClick: () => {
        h(!1), j("");
      }, children: "Vazgeç" })
    ] }),
    b.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Henüz kendi paketiniz yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: b.map((x) => /* @__PURE__ */ e.jsxs(I, { variant: "outline", size: "sm", onClick: () => m(x), children: [
      x.name,
      /* @__PURE__ */ e.jsx(L, { variant: "neutral", size: "sm", children: x.requirementCount })
    ] }, x.id)) })
  ] });
}
const Xe = {
  1: { text: "Karşılandı", chip: "apya-chip-positive", icon: "fa-check" },
  2: { text: "Eksik", chip: "apya-chip-warning", icon: "fa-triangle-exclamation" },
  3: { text: "Feragat", chip: "apya-chip-neutral", icon: "fa-ban" }
}, Rs = { 1: "Proje", 2: "İş adımı", 3: "Dönem" }, ea = {
  1: "kurum şablonu",
  2: "klasör şeması",
  3: "task eki"
};
function Bs({ percent: a, blocking: n }) {
  const t = n > 0 ? "var(--apya-negative-500)" : a >= 90 ? "var(--apya-positive-500)" : "var(--apya-warning-500)";
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", role: "progressbar", "aria-valuenow": a, "aria-valuemin": 0, "aria-valuemax": 100, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a}%`, background: t } }) });
}
function $s({ item: a, canManage: n, onWaive: t, busy: d }) {
  const o = Xe[a.status] || Xe[2], m = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || Rs[a.scope];
  return /* @__PURE__ */ e.jsxs("div", { className: E("apya-doc-check-row", a.status === 2 && a.isBlocking && "is-blocking"), children: [
    /* @__PURE__ */ e.jsxs("span", { className: E("apya-chip", o.chip), children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa ${o.icon}` }),
      " ",
      o.text
    ] }),
    /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.title }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
        ea[a.source] || ea[1],
        a.sourceEntityName && ` · ${a.sourceEntityName}`,
        " · ",
        m,
        a.documentTypeName && ` · ${a.documentTypeName}`,
        a.waiveReason && ` · ${a.waiveReason}`
      ] }),
      a.requiresManualLink && a.status === 2 && /* @__PURE__ */ e.jsx("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-warning-700, #92400E)" }, children: "Otomatik eşleşmez — belgeyi elle bağlayın." })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: a.documentFileName || "—" }),
    /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2 justify-content-end", children: [
      a.isBlocking && a.status === 2 && /* @__PURE__ */ e.jsx(L, { variant: "negative", size: "sm", children: "Teslimi bloke ediyor" }),
      n && a.status !== 1 && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: d,
          onClick: () => t(a, a.status !== 3),
          children: a.status === 3 ? "Feragati kaldır" : "Feragat et"
        }
      )
    ] })
  ] });
}
function Fs({ projectId: a, periodCode: n, onSummaryChange: t, documentTypes: d = [] }) {
  const [o, m] = i.useState(null), [y, h] = i.useState([]), [c, j] = i.useState(!0), [g, f] = i.useState(!1), b = re("Platform.Documents.ManageCompliance"), k = i.useCallback(async () => {
    if (!a) {
      m(null), j(!1);
      return;
    }
    j(!0);
    try {
      const [r, w] = await Promise.all([
        la(a, n),
        Ha(a)
      ]);
      m(r), h(w ?? []), t == null || t((r == null ? void 0 : r.summary) ?? null);
    } catch (r) {
      z("error", "Uygunluk verisi yüklenemedi."), console.error("[Documents] compliance load", r);
    } finally {
      j(!1);
    }
  }, [a, n, t]);
  i.useEffect(() => {
    k();
  }, [k]);
  const x = async (r) => {
    f(!0);
    try {
      await Va(a, r, n || null), await k();
    } catch (w) {
      z("error", "Paket uygulanamadı."), console.error("[Documents] applyPackage", w);
    } finally {
      f(!1);
    }
  }, R = async (r) => {
    f(!0);
    try {
      await Qa(r), await k();
    } catch (w) {
      z("error", "Paket kaldırılamadı."), console.error("[Documents] removeAssignment", w);
    } finally {
      f(!1);
    }
  }, $ = async (r, w, C) => {
    const P = C ? window.prompt("Feragat gerekçesi:") : null;
    if (!(C && !P)) {
      f(!0);
      try {
        await Za({
          assignmentId: r.assignmentId,
          requirementId: w.requirementId,
          workStepId: w.workStepId,
          periodCode: w.periodCode,
          waive: C,
          reason: P
        }), await k();
      } catch (W) {
        z("error", "İşlem başarısız oldu."), console.error("[Documents] waive", W);
      } finally {
        f(!1);
      }
    }
  };
  if (!a)
    return /* @__PURE__ */ e.jsx(
      oe,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-check" }),
        title: "Önce bir proje bağlamı seçin",
        description: "Uygunluk, projeye uygulanan kurum paketleri üzerinden hesaplanır."
      }
    );
  if (c)
    return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(de, { rows: 6 }) });
  const l = (o == null ? void 0 : o.checklists) ?? [], N = y.filter((r) => !r.isApplied);
  return /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
    l.length === 0 ? /* @__PURE__ */ e.jsx(
      oe,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-list" }),
        title: "Bu projeye henüz kurum paketi uygulanmadı",
        description: "Aşağıdan bir paket seçerek kontrol listesini başlatın."
      }
    ) : l.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
        /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsx("div", { style: { fontSize: 13.5, fontWeight: 600 }, children: r.packageName }),
          /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            r.issuer,
            r.periodCode && ` · ${r.periodCode}`
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 15, fontWeight: 500 }, children: [
            "%",
            r.summary.percent
          ] }),
          r.summary.blockingMissingCount > 0 && /* @__PURE__ */ e.jsxs(L, { variant: "negative", size: "sm", children: [
            r.summary.blockingMissingCount,
            " bloke"
          ] }),
          b && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: g,
              onClick: () => R(r.assignmentId),
              children: "Kaldır"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(Bs, { percent: r.summary.percent, blocking: r.summary.blockingMissingCount }),
      /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
        r.summary.satisfiedCount,
        " / ",
        r.summary.totalCount - r.summary.waivedCount,
        " kalem tamam",
        r.summary.waivedCount > 0 && ` · ${r.summary.waivedCount} feragat`
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-list", children: r.items.map((w, C) => /* @__PURE__ */ e.jsx(
        $s,
        {
          item: w,
          canManage: b,
          busy: g,
          onWaive: (P, W) => $(r, P, W)
        },
        `${w.requirementId}-${w.workStepId || w.periodCode || C}`
      )) })
    ] }, r.assignmentId)),
    b && /* @__PURE__ */ e.jsx(
      Ps,
      {
        packages: y,
        projectId: a,
        documentTypes: d,
        onChanged: k
      }
    ),
    b && N.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Uygulanabilir paketler" }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: N.map((r) => /* @__PURE__ */ e.jsxs(
        I,
        {
          variant: "outline",
          size: "sm",
          disabled: g,
          leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          onClick: () => x(r.id),
          children: [
            r.name,
            " (",
            r.requirementCount,
            ")"
          ]
        },
        r.id
      )) })
    ] })
  ] });
}
const ie = 25, As = {
  1: "apya-chip-brand",
  // Yüklendi
  2: "apya-chip-positive",
  // İndirildi
  3: "apya-chip-negative",
  // Silindi
  4: "apya-chip-neutral",
  // Görüntülendi
  5: "apya-chip-accent",
  // Meta değişti
  6: "apya-chip-warning"
  // Taşındı
}, Ms = [
  { value: "", label: "Tümü" },
  { value: "1", label: "Yüklendi" },
  { value: "2", label: "İndirildi" },
  { value: "5", label: "Meta değişti" },
  { value: "3", label: "Silindi" }
];
function Ls({ projectId: a, documentFileId: n }) {
  const [t, d] = i.useState([]), [o, m] = i.useState(0), [y, h] = i.useState(0), [c, j] = i.useState(""), [g, f] = i.useState(!0), b = i.useCallback(async () => {
    f(!0);
    try {
      const x = await ms({
        maxResultCount: ie,
        skipCount: y * ie,
        projectId: a || void 0,
        documentFileId: n || void 0,
        action: c || void 0
      });
      d(x.items ?? []), m(x.totalCount ?? 0);
    } catch (x) {
      z("error", "Etkinlik kaydı yüklenemedi."), console.error("[Documents] activity load", x);
    } finally {
      f(!1);
    }
  }, [a, n, c, y]);
  i.useEffect(() => {
    b();
  }, [b]);
  const k = Math.max(1, Math.ceil(o / ie));
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center gap-2 flex-wrap px-3 py-2",
        style: { borderBottom: "1px solid var(--apya-border-subtle)" },
        children: [
          Ms.map((x) => /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: E("apya-doc-filterchip", c === x.value && "is-active"),
              onClick: () => {
                j(x.value), h(0);
              },
              children: x.label
            },
            x.value
          )),
          /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            o,
            " kayıt"
          ] })
        ]
      }
    ),
    g ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(de, { rows: 8 }) }) : t.length === 0 ? /* @__PURE__ */ e.jsx(
      oe,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left" }),
        title: "Henüz kayıtlı etkinlik yok",
        description: "Yükleme, indirme, meta değişikliği ve silme işlemleri burada iz bırakır."
      }
    ) : /* @__PURE__ */ e.jsx("div", { children: t.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", children: [
      /* @__PURE__ */ e.jsx("span", { className: E("apya-chip", As[x.action] || "apya-chip-neutral"), children: xs[x.action] || "—" }),
      /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: x.documentFileName || x.folderName || "—" }),
        x.detail && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: x.detail })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12 }, children: x.actorName }),
        x.actorRole && /* @__PURE__ */ e.jsx(L, { variant: "neutral", size: "sm", children: x.actorRole })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: G.dateTime(x.creationTime) })
    ] }, x.id)) }),
    k > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            y * ie + 1,
            "–",
            Math.min((y + 1) * ie, o),
            " / ",
            o
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", disabled: y === 0, onClick: () => h(y - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              y + 1,
              " / ",
              k
            ] }),
            /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", disabled: y + 1 >= k, onClick: () => h(y + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
const aa = {
  1: "klasör",
  2: "belge tipi",
  3: "iş adımı",
  4: "dönem",
  5: "harcama kalemi"
};
function Os(a) {
  return a >= 90 ? "positive" : a >= 70 ? "brand" : "warning";
}
function Ks({ summary: a, busy: n, onApplyAll: t, onApply: d, onDismiss: o, onReload: m }) {
  const [y, h] = i.useState(!1), c = (a == null ? void 0 : a.items) ?? [];
  if (c.length === 0) return null;
  const j = [...new Set(c.map((g) => aa[g.kind]).filter(Boolean))];
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-suggestion-banner", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-suggestion-icon", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-wand-magic-sparkles" }) }),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
          a.documentCount,
          " dosya için ",
          j.join(", "),
          " önerisi hazır"
        ] }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Kural motoru ve harcama eşleşmesinden üretildi — uygulanmadan önce onayınızı bekler." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", onClick: () => h((g) => !g), children: y ? "Gizle" : "İncele" }),
      /* @__PURE__ */ e.jsx(I, { size: "sm", isLoading: n, onClick: t, children: "Tümünü uygula" })
    ] }),
    y && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-suggestion-list", children: [
      c.map((g) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-doc-suggestion-row",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5, minWidth: 0 }, children: g.documentFileName }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: [
              aa[g.kind],
              " → ",
              /* @__PURE__ */ e.jsx("strong", { children: g.targetName || g.payload })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: g.reason }),
            /* @__PURE__ */ e.jsxs(L, { variant: Os(g.confidence), size: "sm", children: [
              "%",
              g.confidence
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex gap-2 justify-content-end", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: n,
                  onClick: () => d(g),
                  children: "Uygula"
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: n,
                  onClick: () => o(g),
                  title: "Bu öneri bir daha gösterilmez",
                  children: "Yoksay"
                }
              )
            ] })
          ]
        },
        `${g.documentFileId}-${g.kind}-${g.payload}`
      )),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: E("apya-doc-linkbtn", "mt-1"), onClick: m, children: "Yenile" })
    ] })
  ] });
}
const Ws = [
  {
    value: 3,
    label: "Karma",
    detail: "İş adımı klasörleri + Finans / Personel / Sözleşmeler"
  },
  {
    value: 1,
    label: "İş adımı bazlı",
    detail: "Projenin her iş adımı için bir klasör"
  },
  {
    value: 2,
    label: "Dönem bazlı",
    detail: "Yılın dört çeyreği için klasör"
  }
];
function Us(a, n) {
  const t = (n == null ? void 0 : n.workStepCount) ?? 0, d = Array.from({ length: t }, (o, m) => `${m + 1} · iş adımı`);
  if (a === 1) return d;
  if (a === 2) {
    const o = (/* @__PURE__ */ new Date()).getFullYear();
    return [1, 2, 3, 4].map((m) => `${o} Q${m}`);
  }
  return [...d, "Finans", "Personel / İK", "Sözleşmeler"];
}
function Gs({ state: a, onDone: n }) {
  var $;
  const [t, d] = i.useState(0), [o, m] = i.useState(""), [y, h] = i.useState((($ = a.projects[0]) == null ? void 0 : $.id) ?? ""), [c, j] = i.useState(3), [g, f] = i.useState(!1), b = a.projects.find((l) => l.id === y), k = Us(c, b), x = async () => {
    f(!0);
    try {
      await as(), n();
    } finally {
      f(!1);
    }
  }, R = async () => {
    f(!0);
    try {
      const l = await es({
        projectId: y,
        schema: c,
        compliancePackageId: o || null,
        periodCode: null
      });
      z("success", `${l.createdFolderCount} klasör kuruldu.`), n();
    } catch (l) {
      z("error", "Kurulum tamamlanamadı."), console.error("[Documents] setup", l);
    } finally {
      f(!1);
    }
  };
  return /* @__PURE__ */ e.jsx(ta, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-setup", onClick: (l) => l.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-setup-icon", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-wand-magic-sparkles" }) }),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: "Dokümanlar kurulumu" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Klasör şemasını kurumun beklediği yapıya göre kurun. Sonradan da değiştirebilirsiniz." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: x, disabled: g, children: "Atla" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-setup-steps", children: ["Kurum ve program", "Klasör şeması", "Ekip ve kutu"].map((l, N) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        className: E("apya-doc-setup-step", N === t && "is-active", N < t && "is-done"),
        onClick: () => d(N),
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-doc-setup-step-no", children: N + 1 }),
          l
        ]
      },
      l
    )) }),
    t === 0 && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
      /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: "Zorunlu belge listesi buradan gelir. Şimdi seçmeyip sonra Uygunluk sekmesinden de uygulayabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: E("apya-doc-filterchip", !o && "is-active"),
            onClick: () => m(""),
            children: "Şimdilik yok"
          }
        ),
        a.packages.map((l) => /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: E("apya-doc-filterchip", o === l.id && "is-active"),
            onClick: () => m(l.id),
            children: [
              l.name,
              /* @__PURE__ */ e.jsx(L, { variant: "neutral", size: "sm", children: l.requirementCount })
            ]
          },
          l.id
        ))
      ] })
    ] }),
    t === 1 && /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.projects.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kiracıda proje yok — klasör şeması bir projeye kurulur. Önce bir proje oluşturun." }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: y,
          onChange: (l) => h(l.target.value),
          "aria-label": "Proje",
          children: a.projects.map((l) => /* @__PURE__ */ e.jsxs("option", { value: l.id, children: [
            l.name,
            l.hasFolders ? " — zaten klasörü var" : ""
          ] }, l.id))
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: Ws.map((l) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: E("apya-doc-filterchip", c === l.value && "is-active"),
          onClick: () => j(l.value),
          title: l.detail,
          children: l.label
        },
        l.value
      )) }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-setup-preview", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Kurulacak klasörler" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12 }, children: b == null ? void 0 : b.name }),
        k.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Bu projede iş adımı tanımlı değil; yalnız proje klasörü kurulur." }) : k.map((l) => /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-secondary)", paddingLeft: 12 }, children: l }, l))
      ] })
    ] }) }),
    t === 2 && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", style: { fontSize: 12 }, children: [
      /* @__PURE__ */ e.jsx("div", { style: { color: "var(--apya-text-secondary)" }, children: "Ekip üyeleri ve alan bazlı izinler kimlik yönetiminden, alan izinleri ise Dokümanlar → Yönetim ekranından tanımlanır." }),
      /* @__PURE__ */ e.jsx("div", { style: { color: "var(--apya-text-tertiary)" }, children: "Belge e-posta kutusu (gelen ekleri otomatik klasörleme) henüz kullanıma açık değil; Entegrasyonlar ekranında yer ayrıldı." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end mt-3", children: [
      t > 0 && /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", onClick: () => d(t - 1), children: "Geri" }),
      t < 2 ? /* @__PURE__ */ e.jsx(I, { size: "sm", onClick: () => d(t + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(
        I,
        {
          size: "sm",
          isLoading: g,
          disabled: a.projects.length === 0 || !y,
          onClick: R,
          children: "Şemayı kur"
        }
      )
    ] })
  ] }) }) });
}
const De = 25, qs = "00000000-0000-0000-0000-000000000000";
function Ys({ message: a, onDone: n }) {
  return i.useEffect(() => {
    const t = setTimeout(n, 2800);
    return () => clearTimeout(t);
  }, [n]), /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-check", style: { fontSize: 11, color: "var(--apya-positive-500)" } }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: a })
  ] });
}
function _s({ title: a, message: n, onConfirm: t, onCancel: d }) {
  const [o, m] = i.useState(!1);
  return /* @__PURE__ */ e.jsx(ta, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: d, children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-dialog", onClick: (y) => y.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
      /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "d-grid place-items-center flex-shrink-0",
          style: { width: 36, height: 36, borderRadius: 12, background: "rgba(248,113,113,.12)", color: "var(--apya-negative-500)" },
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 14, fontWeight: 600 }, children: a }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: n })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [
      /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", onClick: d, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        I,
        {
          variant: "destructive",
          size: "sm",
          isLoading: o,
          onClick: async () => {
            m(!0), await t(), m(!1);
          },
          children: "Evet, sil"
        }
      )
    ] })
  ] }) }) });
}
function Hs({ uploadedThisMonth: a, expiring: n, compliance: t }) {
  const d = [
    {
      key: "compliance",
      label: "Uygunluk",
      value: t ? `%${t.percent}` : "—",
      icon: "fa-clipboard-check",
      tone: "positive",
      foot: t ? `${t.satisfiedCount} / ${t.totalCount - t.waivedCount} kalem tamam` : "Proje bağlamı seçin"
    },
    {
      key: "missing",
      label: "Eksik belge",
      value: t ? t.missingCount : "—",
      icon: "fa-triangle-exclamation",
      tone: "warning",
      foot: t && t.blockingMissingCount > 0 ? `${t.blockingMissingCount} tanesi teslimi bloke ediyor` : null
    },
    {
      key: "uploaded",
      label: "Bu ay yüklenen",
      value: a ?? "—",
      icon: "fa-arrow-up-from-bracket",
      tone: "accent",
      // "Dönem" bu ekranda seçili değil; ölçülebilir tek pencere takvim ayı.
      foot: "ayın 1'inden bugüne"
    },
    { key: "expiring", label: "Süresi dolan", value: n ?? "—", icon: "fa-clock-rotate-left", tone: "negative" }
  ];
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-kpis", children: d.map((o) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("span", { className: E("apya-doc-kpi-icon", `is-${o.tone}`), children: /* @__PURE__ */ e.jsx("i", { className: `fa ${o.icon}` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: o.label })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: o.value }),
    o.foot && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: o.foot })
  ] }, o.key)) });
}
function Vs() {
  const [a, n] = i.useState([]), [t, d] = i.useState([]), [o, m] = i.useState([]), [y, h] = i.useState(!0), [c, j] = i.useState([]), [g, f] = i.useState(0), [b, k] = i.useState(null), [x, R] = i.useState(null), [$, l] = i.useState(!0), N = i.useMemo(() => new URLSearchParams(window.location.search), []), [r, w] = i.useState(() => {
    const s = N.get("smart");
    return s ? { key: s, kind: "smart", smart: s } : { key: "all", kind: "all" };
  }), C = r.kind === "folder" ? r.documentId : null, P = r.projectId || null, W = r.kind === "smart" && r.smart === "trash", [p, F] = i.useState(/* @__PURE__ */ new Set()), [A, te] = i.useState(N.get("q") || ""), [X, da] = i.useState(N.get("sort") || "creationTime desc"), [ee, Ee] = i.useState(N.get("view") === "grid" ? "grid" : "list"), [ae, ue] = i.useState(Number(N.get("page")) || 0), [q, ua] = i.useState(() => {
    const s = N.get("tab");
    return ["files", "compliance", "activity"].includes(s) ? s : "files";
  }), [ma, pa] = i.useState(null), [Pe, Re] = i.useState(null), [ya, xe] = i.useState(null), [xa, Be] = i.useState(!1), [ha, $e] = i.useState(!1), [Y, V] = i.useState(/* @__PURE__ */ new Set()), [fa, ga] = i.useState(null), he = i.useRef([]), [ne, fe] = i.useState(null), [Fe, Ae] = i.useState(null), [Me, Le] = i.useState(!1), ge = i.useRef(null), Oe = i.useRef(null), [me, Ke] = i.useState(null), [_, We] = i.useState(null), [va, Ue] = i.useState(!1), [ka, ve] = i.useState([]), ke = i.useRef(null), Q = re("Platform.Documents.Create"), Ge = re("Platform.Documents.ManageMeta"), ja = re("Platform.Documents.BulkOperations"), ba = re("Platform.Documents.Delete"), U = i.useCallback((s) => Ae(s), []), Z = i.useCallback(async () => {
    h(!0);
    try {
      const [s, u, v] = await Promise.all([
        Oa().getList({ maxResultCount: 1e3, sorting: "title asc" }),
        _a(),
        Ya()
      ]);
      n(s.items ?? []), d(u ?? []), m(v ?? []);
    } catch (s) {
      z("error", "Klasör ağacı yüklenemedi."), console.error("[Documents] loadTree", s);
    } finally {
      h(!1);
    }
  }, []);
  i.useEffect(() => {
    Z();
  }, [Z]);
  const qe = i.useMemo(() => {
    const s = { maxResultCount: De, skipCount: ae * De, sorting: X };
    return A.trim() && (s.filterText = A.trim()), r.kind === "folder" ? (s.documentId = r.documentId, s.includeSubFolders = !0) : r.kind === "workstep" ? s.workStepId = r.workStepId : r.kind === "smart" && r.smart === "expiring" ? s.expiringWithinDays = 30 : r.kind === "smart" && r.smart === "missing-meta" ? s.missingRequiredFields = !0 : r.kind === "smart" && r.smart === "trash" ? s.onlyDeleted = !0 : r.kind === "smart" && r.smart === "suggested" && (s.documentFileIds = [...new Set(((_ == null ? void 0 : _.items) ?? []).map((u) => u.documentFileId))], s.documentFileIds.length === 0 && (s.documentFileIds = [qs])), s;
  }, [r, ae, X, A, _]), O = i.useCallback(async () => {
    l(!0);
    try {
      const s = await ze(qe);
      j(s.items ?? []), f(s.totalCount ?? 0);
    } catch (s) {
      z("error", "Belge listesi yüklenemedi."), console.error("[Documents] loadFiles", s);
    } finally {
      l(!1);
    }
  }, [qe]);
  i.useEffect(() => {
    O();
  }, [O]);
  const le = i.useCallback(async () => {
    try {
      const s = /* @__PURE__ */ new Date(), u = new Date(s.getFullYear(), s.getMonth(), 1).toISOString(), [v, T] = await Promise.all([
        ze({ maxResultCount: 1, skipCount: 0, expiringWithinDays: 30 }),
        ze({ maxResultCount: 1, skipCount: 0, uploadedAfter: u })
      ]);
      k(v.totalCount ?? 0), R(T.totalCount ?? 0);
    } catch (s) {
      console.error("[Documents] loadKpis", s);
    }
  }, []);
  i.useEffect(() => {
    le();
  }, [le]);
  const je = i.useCallback(async () => {
    if (!P) {
      ve([]);
      return;
    }
    try {
      const u = ((await la(P, null)).checklists ?? []).flatMap((v) => (v.items ?? []).filter((T) => T.status === 2).map((T) => ({ ...T, assignmentId: v.assignmentId })));
      ve(
        r.kind === "workstep" ? u.filter((v) => v.workStepId === r.workStepId) : u
      );
    } catch (s) {
      ve([]), console.error("[Documents] loadMissing", s);
    }
  }, [P, r.kind, r.workStepId]);
  i.useEffect(() => {
    je();
  }, [je]);
  const pe = i.useCallback(async () => {
    try {
      We(await ss(P));
    } catch (s) {
      We(null), console.error("[Documents] loadSuggestions", s);
    }
  }, [P]);
  i.useEffect(() => {
    pe();
  }, [pe]), i.useEffect(() => {
    Q && (async () => {
      try {
        Ke(await Xa());
      } catch (s) {
        console.error("[Documents] setupState", s);
      }
    })();
  }, [Q]);
  const be = (s) => ({
    documentFileId: s.documentFileId,
    kind: s.kind,
    payload: s.payload
  }), Ne = async (s, u, v) => {
    Ue(!0);
    try {
      await s(u), U(v), await Promise.all([pe(), O(), Z()]);
    } catch (T) {
      z("error", "Öneri işlenemedi."), console.error("[Documents] suggestion action", T);
    } finally {
      Ue(!1);
    }
  }, ye = i.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    t.forEach((T) => {
      s.has(T.projectId) || s.set(T.projectId, []), s.get(T.projectId).push(T);
    });
    const u = /* @__PURE__ */ new Map();
    a.forEach((T) => {
      const D = T.parentDocumentId || "root";
      u.has(D) || u.set(D, []), u.get(D).push(T);
    });
    const v = (T) => (u.get(T) || []).sort((D, J) => (D.sortOrder ?? 0) - (J.sortOrder ?? 0) || D.title.localeCompare(J.title, "tr")).map((D) => {
      const J = v(D.id), Fa = (D.projectId ? s.get(D.projectId) || [] : []).slice().sort((H, Aa) => H.order - Aa.order).map((H) => ({
        key: `step-${H.id}`,
        kind: "workstep",
        workStepId: H.id,
        projectId: H.projectId,
        label: `${H.order} · ${H.name}`,
        icon: "fa-diagram-next",
        count: H.documentCount,
        children: []
      }));
      return {
        key: `folder-${D.id}`,
        kind: "folder",
        documentId: D.id,
        projectId: D.projectId,
        label: D.title,
        icon: D.projectId ? "fa-diagram-project" : "fa-folder",
        children: [...Fa, ...J]
      };
    });
    return v("root");
  }, [a, t]), Se = i.useRef(!1);
  i.useEffect(() => {
    if (Se.current || y || ye.length === 0) return;
    const s = N.get("folder"), u = N.get("step");
    if (!s && !u) {
      Se.current = !0;
      return;
    }
    const v = (D) => D.flatMap((J) => [J, ...v(J.children || [])]), T = v(ye).find((D) => s ? D.documentId === s : D.workStepId === u);
    Se.current = !0, T && (w(T), F((D) => /* @__PURE__ */ new Set([...D, T.key])));
  }, [y, ye, N]), i.useEffect(() => {
    const s = new URLSearchParams();
    q !== "files" && s.set("tab", q), r.kind === "folder" ? s.set("folder", r.documentId) : r.kind === "workstep" ? s.set("step", r.workStepId) : r.kind === "smart" && s.set("smart", r.smart), A.trim() && s.set("q", A.trim()), ee !== "list" && s.set("view", ee), X !== "creationTime desc" && s.set("sort", X), ae > 0 && s.set("page", String(ae));
    const u = s.toString();
    window.history.replaceState(null, "", u ? `${window.location.pathname}?${u}` : window.location.pathname);
  }, [q, r, A, ee, X, ae]);
  const Na = i.useCallback(async (s) => {
    Re(s.id), Be(!0);
    try {
      xe(await He(s.id));
    } catch (u) {
      z("error", "Belge detayı açılamadı."), console.error("[Documents] openDetail", u);
    } finally {
      Be(!1);
    }
  }, []), Sa = async (s) => {
    $e(!0);
    try {
      await Ka(s.id, {
        displayName: s.displayName,
        documentTypeId: s.documentTypeId || null,
        projectId: s.projectId || null,
        workStepId: s.workStepId || null,
        amount: s.amount,
        currency: s.currency || "TRY",
        documentDate: s.documentDate || null,
        periodCode: s.periodCode || null,
        expiryDate: s.expiryDate || null,
        externalRef: s.externalRef || null,
        status: s.status,
        fields: s.fields.map((u) => ({
          fieldId: u.fieldId,
          valueText: u.valueText ?? null,
          valueNumber: u.valueNumber ?? null,
          valueDate: u.valueDate ?? null
        })),
        tags: s.tags || []
      }), U("Belge güncellendi."), xe(await He(s.id)), await O();
    } catch (u) {
      z("error", "Belge güncellenemedi."), console.error("[Documents] handleSave", u);
    } finally {
      $e(!1);
    }
  }, wa = async () => {
    if (ne)
      try {
        await Ga(ne.id), Pe === ne.id && (Re(null), xe(null)), U("Belge silindi."), await Promise.all([O(), le()]);
      } catch (s) {
        z("error", "Belge silinemedi."), console.error("[Documents] handleDelete", s);
      } finally {
        fe(null);
      }
  }, Ca = (s) => {
    he.current = Y.has(s.id) ? Array.from(Y) : [s.id];
  }, za = async (s) => {
    const u = he.current;
    if (u.length)
      try {
        u.length === 1 ? await Wa(u[0], s) : await Ve(u, s), U(u.length === 1 ? "Belge taşındı." : `${u.length} belge taşındı.`), V(/* @__PURE__ */ new Set()), await O();
      } catch (v) {
        z("error", "Taşıma başarısız oldu."), console.error("[Documents] move", v);
      } finally {
        he.current = [];
      }
  }, Da = async () => {
    const s = window.prompt("Hedef klasör adını yazın:");
    if (!s) return;
    const u = a.find((v) => v.title.toLocaleLowerCase("tr") === s.toLocaleLowerCase("tr"));
    if (!u) {
      z("warn", "Klasör bulunamadı.");
      return;
    }
    try {
      await Ve(Array.from(Y), u.id), U(`${Y.size} belge taşındı.`), V(/* @__PURE__ */ new Set()), await O();
    } catch (v) {
      z("error", "Toplu taşıma başarısız oldu."), console.error("[Documents] bulkMove", v);
    }
  }, Ia = async () => {
    const s = window.prompt("Etiket(ler) — virgülle ayırın:");
    if (!s) return;
    const u = s.split(",").map((v) => v.trim()).filter(Boolean);
    if (u.length)
      try {
        await Ua(Array.from(Y), u), U(`${Y.size} belge etiketlendi.`), V(/* @__PURE__ */ new Set()), await O();
      } catch (v) {
        z("error", "Etiketleme başarısız oldu."), console.error("[Documents] bulkTag", v);
      }
  }, we = async (s) => {
    if (!C || !(s != null && s.length)) return;
    const u = ke.current;
    ke.current = null, Le(!0);
    try {
      let v = null;
      for (const T of Array.from(s)) {
        const D = await ps(C, T);
        v = v ?? (D == null ? void 0 : D.documentFileId) ?? null;
      }
      u && v ? (await Ja({
        assignmentId: u.assignmentId,
        requirementId: u.requirementId,
        workStepId: u.workStepId || null,
        periodCode: u.periodCode || null,
        documentFileId: v
      }), U(`Yüklendi ve "${u.title}" kalemine bağlandı.`)) : U(s.length === 1 ? "Dosya yüklendi." : `${s.length} dosya yüklendi.`), await Promise.all([O(), le(), Z(), je()]);
    } catch (v) {
      z("error", "Dosya yüklenemedi."), console.error("[Documents] upload", v);
    } finally {
      Le(!1);
    }
  }, Ta = async (s) => {
    try {
      await qa(s.id), U(`"${s.displayName}" geri alındı.`), await Promise.all([O(), le(), Z()]);
    } catch (u) {
      z("error", "Belge geri alınamadı."), console.error("[Documents] restore", u);
    }
  }, Ea = (s) => {
    var u;
    if (!C) {
      z("warn", "Yükleme klasör bağlamında yapılır — soldan bir klasör seçin.");
      return;
    }
    ke.current = s, (u = ge.current) == null || u.click();
  }, Pa = () => {
    const s = new window.abp.ModalManager(ce() + "Documents/CreateModal");
    s.open({ parentDocumentId: C || void 0 }), s.onResult(() => {
      Z(), U("Klasör oluşturuldu.");
    });
  }, Ye = (s) => F((u) => {
    const v = new Set(u);
    return v.has(s) ? v.delete(s) : v.add(s), v;
  }), Ra = (s) => {
    var u;
    w(s), ue(0), V(/* @__PURE__ */ new Set()), (u = s.key) != null && u.startsWith("folder-") && Ye(s.key);
  }, Ba = (s) => V((u) => {
    const v = new Set(u);
    return v.has(s) ? v.delete(s) : v.add(s), v;
  }), $a = () => V((s) => c.every((u) => s.has(u.id)) ? /* @__PURE__ */ new Set() : new Set(c.map((u) => u.id)));
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto",
      style: { maxWidth: 1560 },
      onDragOver: (s) => {
        C && s.preventDefault();
      },
      onDrop: (s) => {
        var u;
        !C || !((u = s.dataTransfer.files) != null && u.length) || (s.preventDefault(), we(s.dataTransfer.files));
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Dokümanlar" }),
            /* @__PURE__ */ e.jsx("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: "Klasörler, belgeler ve meta veri" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center flex-wrap gap-2", children: [
            Q && /* @__PURE__ */ e.jsx(
              "a",
              {
                className: "apya-doc-linkbtn",
                href: `${ce()}Documents/Upload${C ? `?documentId=${C}` : ""}`,
                children: "Toplu yükleme"
              }
            ),
            Q && /* @__PURE__ */ e.jsx(I, { variant: "secondary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-plus" }), onClick: Pa, children: "Yeni klasör" }),
            Q && /* @__PURE__ */ e.jsx(
              I,
              {
                variant: "primary",
                isLoading: Me,
                disabled: !C,
                title: C ? void 0 : "Önce bir klasör seçin",
                leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
                onClick: () => {
                  var s;
                  return (s = ge.current) == null ? void 0 : s.click();
                },
                children: "Yükle"
              }
            ),
            Q && /* @__PURE__ */ e.jsx(
              I,
              {
                variant: "secondary",
                className: "apya-doc-capture-btn",
                isLoading: Me,
                disabled: !C,
                title: C ? void 0 : "Önce bir klasör seçin",
                leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-camera" }),
                onClick: () => {
                  var s;
                  return (s = Oe.current) == null ? void 0 : s.click();
                },
                children: "Belge yakala"
              }
            ),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                ref: ge,
                type: "file",
                multiple: !0,
                hidden: !0,
                onChange: (s) => {
                  we(s.target.files), s.target.value = "";
                }
              }
            ),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                ref: Oe,
                type: "file",
                accept: "image/*",
                capture: "environment",
                hidden: !0,
                onChange: (s) => {
                  we(s.target.files), s.target.value = "";
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(Hs, { uploadedThisMonth: x, expiring: b, compliance: ma }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-doc-tabs", role: "tablist", children: [
          { key: "files", label: "Dosyalar" },
          { key: "compliance", label: "Uygunluk" },
          { key: "activity", label: "Etkinlik" }
        ].map((s) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": q === s.key,
            className: E("apya-doc-tab", q === s.key && "is-active"),
            onClick: () => ua(s.key),
            children: s.label
          },
          s.key
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: E("apya-docs-shell", q !== "files" && "is-wide"), children: [
          /* @__PURE__ */ e.jsx(
            gs,
            {
              loading: y,
              tree: ye,
              activeKey: r.key,
              expanded: p,
              onToggle: Ye,
              onSelect: Ra,
              onDropFiles: za,
              dragTarget: fa,
              setDragTarget: ga
            }
          ),
          q === "compliance" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(
            Fs,
            {
              projectId: P,
              periodCode: null,
              onSummaryChange: pa,
              documentTypes: o
            }
          ) }) : q === "activity" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(Ls, { projectId: P, documentFileId: null }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            Ge && /* @__PURE__ */ e.jsx(
              Ks,
              {
                summary: _,
                busy: va,
                onApplyAll: () => Ne(
                  Qe,
                  ((_ == null ? void 0 : _.items) ?? []).map(be),
                  "Öneriler uygulandı."
                ),
                onApply: (s) => Ne(
                  Qe,
                  [be(s)],
                  "Öneri uygulandı."
                ),
                onDismiss: (s) => Ne(
                  ts,
                  [be(s)],
                  "Öneri yoksayıldı."
                ),
                onReload: pe
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "apya-grid-toolbar", style: { padding: "12px 14px", borderBottom: "1px solid var(--apya-border-subtle)" }, children: [
              /* @__PURE__ */ e.jsx(
                K,
                {
                  size: "sm",
                  className: "apya-grid-search",
                  leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
                  placeholder: "Bu bağlamda filtrele",
                  value: A,
                  onChange: (s) => {
                    te(s.target.value), ue(0);
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-grid-count apya-numeric", children: [
                g,
                " belge"
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-viewtoggle", children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: E(ee === "list" && "is-active"),
                    onClick: () => Ee("list"),
                    "aria-label": "Liste görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: E(ee === "grid" && "is-active"),
                    onClick: () => Ee("grid"),
                    "aria-label": "Kart görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-border-all" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              Ns,
              {
                loading: $,
                files: c,
                totalCount: g,
                view: ee,
                sorting: X,
                onSort: (s) => {
                  da(s), ue(0);
                },
                selectedId: Pe,
                onSelect: Na,
                checkedIds: Y,
                onToggleCheck: Ba,
                onToggleAll: $a,
                page: ae,
                pageSize: De,
                onPageChange: ue,
                onDragStart: Ca,
                emptyHint: C ? 'Dosyaları buraya sürükleyin ya da "Yükle" ile ekleyin.' : "Sol taraftan bir klasör seçin; yükleme klasör bağlamında yapılır.",
                missingItems: ka,
                onUploadMissing: Ea,
                canUpload: Q,
                isTrash: W,
                onRestore: Ta
              }
            ),
            ja && /* @__PURE__ */ e.jsx(
              Ss,
              {
                count: Y.size,
                onClear: () => V(/* @__PURE__ */ new Set()),
                onMove: Da,
                onTag: Ia
              }
            )
          ] }),
          q === "files" && /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx(
            Ds,
            {
              detail: ya,
              loading: xa,
              canEdit: Ge,
              documentTypes: o,
              saving: ha,
              onSave: Sa,
              onDelete: ba ? fe : () => {
              }
            }
          ) })
        ] }),
        ne && /* @__PURE__ */ e.jsx(
          _s,
          {
            title: "Belge silinecek",
            message: `"${ne.displayName}" ve tüm versiyonları çöp kutusuna taşınacak. Sol alttaki "Çöp kutusu"ndan geri alabilirsiniz.`,
            onConfirm: wa,
            onCancel: () => fe(null)
          }
        ),
        me && !me.setupCompleted && /* @__PURE__ */ e.jsx(
          Gs,
          {
            state: me,
            onDone: async () => {
              Ke({ ...me, setupCompleted: !0 }), await Promise.all([Z(), O()]);
            }
          }
        ),
        Fe && /* @__PURE__ */ e.jsx(Ys, { message: Fe, onDone: () => Ae(null) })
      ]
    }
  );
}
const sa = document.getElementById("documents-island");
sa && Ma(sa).render(/* @__PURE__ */ e.jsx(Vs, {}));
