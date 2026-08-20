import { j as e, r as i, b as Sa } from "./react-vendor.js";
/* empty css      */
import { S as Fe, B as R, g as W, h as wa, I as A } from "./Dialog.js";
import { S as oe } from "./SkeletonShape.js";
import { E as ie } from "./EmptyState.js";
import { H as ke } from "./Hint.js";
const Ca = () => {
  var a, t, n;
  return (n = (t = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : t.documents) == null ? void 0 : n.document;
}, le = (a) => {
  var t, n;
  return (n = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.auth) == null ? void 0 : n.isGranted(a);
}, z = (a, t) => {
  var n, u, r;
  return (r = (u = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.notify) == null ? void 0 : u[a]) == null ? void 0 : r.call(u, t);
}, re = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function $(a) {
  return new Promise((t, n) => {
    window.abp.ajax(a).done(t).fail(n);
  });
}
const C = (a, t = {}) => {
  const n = new URLSearchParams();
  Object.entries(t).forEach(([r, p]) => {
    p != null && p !== "" && n.append(r, p);
  });
  const u = n.toString();
  return `${re()}Documents?handler=${a}${u ? "&" + u : ""}`;
}, U = (a, t) => $({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(t) }), je = (a) => $({ url: C("Files", a), type: "GET" }), Me = (a) => $({ url: C("File", { id: a }), type: "GET" }), za = (a, t) => U(C("UpdateFileMeta", { id: a }), t), Ia = (a, t) => $({ url: C("MoveFile", { id: a, targetDocumentId: t }), type: "POST" }), Ae = (a, t) => U(C("BulkMove"), { documentFileIds: a, targetDocumentId: t }), Da = (a, t, n = !1) => U(C("BulkTag"), { documentFileIds: a, tags: t, remove: n }), Ta = (a) => $({ url: C("DeleteFile", { id: a }), type: "POST" }), Ea = (a) => $({ url: C("RestoreFile", { id: a }), type: "POST" }), Pa = () => $({ url: C("DocumentTypes"), type: "GET" }), Ra = (a) => $({ url: C("WorkSteps", { projectId: a }), type: "GET" }), $a = (a) => $({ url: C("CompliancePackages", { projectId: a }), type: "GET" }), qe = (a, t) => $({ url: C("ComplianceOverview", { projectId: a, periodCode: t }), type: "GET" }), Ba = (a, t, n) => U(C("ApplyCompliancePackage"), { projectId: a, packageId: t, periodCode: n }), Fa = (a) => $({ url: C("RemoveComplianceAssignment", { assignmentId: a }), type: "POST" }), Ma = (a) => U(C("WaiveComplianceItem"), a), Aa = (a) => U(C("LinkComplianceDocument"), a), La = (a) => $({ url: C("ProjectTasks", { projectId: a }), type: "GET" }), Oa = (a) => $({ url: C("ComplianceRequirements", { packageId: a }), type: "GET" }), Wa = (a) => U(C("CreateCompliancePackage"), a), Ua = (a, t) => U(C("UpdateCompliancePackage", { id: a }), t), Ka = (a) => $({ url: C("DeleteCompliancePackage", { id: a }), type: "POST" }), qa = (a, t) => U(C("AddComplianceRequirement", { packageId: a }), t), Ga = (a, t) => U(C("UpdateComplianceRequirement", { id: a }), t), Ya = (a) => $({ url: C("DeleteComplianceRequirement", { id: a }), type: "POST" }), _a = (a) => $({ url: C("Activity", a), type: "GET" }), Ha = (a, t) => {
  const n = new FormData();
  return n.append("documentId", a), n.append("file", t), $({
    url: C("UploadFile"),
    type: "POST",
    data: n,
    contentType: !1,
    processData: !1
  });
}, P = (...a) => a.filter(Boolean).join(" "), O = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  money: (a, t) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + (t ? " " + Va(t) : ""),
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toFixed(1) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
};
function Va(a) {
  return { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }[a] || a;
}
const X = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Kesin", chip: "apya-chip-positive" },
  3: { text: "Eşleşti", chip: "apya-chip-accent" },
  4: { text: "Süre dolan", chip: "apya-chip-negative" }
}, Le = {
  1: { text: "Manuel", variant: "neutral" },
  2: { text: "OCR", variant: "brand" },
  3: { text: "AI", variant: "accent" },
  4: { text: "Kural", variant: "warning" }
}, Ja = {
  1: "Yüklendi",
  2: "İndirildi",
  3: "Silindi",
  4: "Görüntülendi",
  5: "Meta değişti",
  6: "Taşındı"
};
function Ne(a, t) {
  var u;
  const n = ((u = (t || "").split(".").pop()) == null ? void 0 : u.toLowerCase()) || "";
  return a != null && a.includes("pdf") || n === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444", label: "PDF" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(n) ? { icon: "fa-file-excel", color: "#10B981", label: "XLS" } : a != null && a.includes("word") || ["docx", "doc"].includes(n) ? { icon: "fa-file-word", color: "#3B82F6", label: "DOC" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(n) ? { icon: "fa-file-powerpoint", color: "#F59E0B", label: "PPT" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(n) ? { icon: "fa-file-image", color: "#8B5CF6", label: "IMG" } : ["zip", "rar", "7z"].includes(n) ? { icon: "fa-file-zipper", color: "#6B7280", label: "ZIP" } : { icon: "fa-file", color: "#6B7280", label: "DOSYA" };
}
function Qa(a) {
  const t = ["apya-chip-accent", "apya-chip-brand", "apya-chip-positive", "apya-chip-warning", "apya-chip-neutral"];
  let n = 0;
  for (let u = 0; u < a.length; u++) n = n * 31 + a.charCodeAt(u) >>> 0;
  return t[n % t.length];
}
const Za = [
  { key: "expiring", label: "Süresi dolanlar", icon: "fa-clock-rotate-left" },
  { key: "missing-meta", label: "Eksik meta", icon: "fa-triangle-exclamation" },
  { key: "trash", label: "Çöp kutusu", icon: "fa-trash-can" }
];
function Ge({
  node: a,
  depth: t,
  activeKey: n,
  expanded: u,
  onToggle: r,
  onSelect: p,
  onDropFiles: x,
  dragTarget: h,
  setDragTarget: o
}) {
  var j;
  const v = ((j = a.children) == null ? void 0 : j.length) > 0, I = u.has(a.key), k = h === a.documentId && a.documentId;
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => p(a),
        onDragOver: (g) => {
          a.documentId && (g.preventDefault(), o(a.documentId));
        },
        onDragLeave: () => o(null),
        onDrop: (g) => {
          a.documentId && (g.preventDefault(), o(null), x(a.documentId));
        },
        className: P("apya-md-item", n === a.key && "selected"),
        style: {
          paddingLeft: 10 + t * 14,
          borderRadius: 8,
          ...k ? { outline: "2px dashed var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
        },
        children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              role: "button",
              tabIndex: -1,
              onClick: (g) => {
                g.stopPropagation(), v && r(a.key);
              },
              className: "w-3 flex-shrink-0",
              style: { color: "var(--apya-text-tertiary)" },
              children: v && /* @__PURE__ */ e.jsx("i", { className: `fa fa-chevron-${I ? "down" : "right"}`, style: { fontSize: 9 } })
            }
          ),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${a.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: a.label }),
          typeof a.count == "number" && /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: a.count })
        ]
      }
    ),
    v && I && a.children.map((g) => /* @__PURE__ */ e.jsx(
      Ge,
      {
        node: g,
        depth: t + 1,
        activeKey: n,
        expanded: u,
        onToggle: r,
        onSelect: p,
        onDropFiles: x,
        dragTarget: h,
        setDragTarget: o
      },
      g.key
    ))
  ] });
}
function Xa({
  loading: a,
  tree: t,
  activeKey: n,
  expanded: u,
  onToggle: r,
  onSelect: p,
  onDropFiles: x,
  dragTarget: h,
  setDragTarget: o
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Bağlam" }),
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => p({ key: "all", kind: "all" }),
        className: P("apya-md-item", n === "all" && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-tree", style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", style: { fontWeight: 600 }, children: "Tüm Dokümanlar" })
        ]
      }
    ),
    a ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(oe, { rows: 5 }) }) : t.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör yok." }) : t.map((v) => /* @__PURE__ */ e.jsx(
      Ge,
      {
        node: v,
        depth: 0,
        activeKey: n,
        expanded: u,
        onToggle: r,
        onSelect: p,
        onDropFiles: x,
        dragTarget: h,
        setDragTarget: o
      },
      v.key
    )),
    /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Akıllı klasörler" }),
    Za.map((v) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => p({ key: v.key, kind: "smart", smart: v.key }),
        className: P("apya-md-item", n === v.key && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${v.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: v.label })
        ]
      },
      v.key
    ))
  ] });
}
const Ye = [
  { key: "displayName", label: "Belge", sortable: !0, width: "minmax(0,1fr)" },
  { key: "workStep", label: "İş adımı", sortable: !1, width: "140px" },
  { key: "type", label: "Tür", sortable: !1, width: "96px" },
  { key: "amount", label: "Tutar", sortable: !0, width: "116px", align: "right" },
  { key: "documentDate", label: "Tarih", sortable: !0, width: "96px" },
  { key: "status", label: "Durum", sortable: !1, width: "110px" }
], Se = `34px ${Ye.map((a) => a.width).join(" ")}`;
function es({ column: a, sorting: t, onSort: n }) {
  if (!a.sortable)
    return /* @__PURE__ */ e.jsx("span", { style: { textAlign: a.align || "left" }, children: a.label });
  const [u, r] = (t || "").split(" "), p = u === a.key, x = p && r !== "desc" ? "desc" : "asc";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => n(`${a.key} ${x}`),
      className: "d-flex align-items-center gap-1",
      style: {
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        font: "inherit",
        color: p ? "var(--apya-accent-500)" : "inherit",
        justifyContent: a.align === "right" ? "flex-end" : "flex-start",
        width: "100%"
      },
      "aria-sort": p ? r === "desc" ? "descending" : "ascending" : "none",
      children: [
        a.label,
        /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${p ? r === "desc" ? "arrow-down" : "arrow-up" : "arrows-up-down"}`,
            style: { fontSize: 8, opacity: p ? 1 : 0.4 }
          }
        )
      ]
    }
  );
}
function as({ item: a, onUpload: t, canUpload: n }) {
  const u = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || "Proje";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-missing-row", style: { gridTemplateColumns: Se }, children: [
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
      a.isBlocking && /* @__PURE__ */ e.jsx(W, { variant: "warning", size: "sm", children: "teslimi bloke ediyor" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: u }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: a.documentTypeName || "—" }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right", color: "var(--apya-text-tertiary)" }, children: "—" }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-warning-700, #92400E)" }, children: "bekliyor" }),
    /* @__PURE__ */ e.jsx("span", { children: n ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-missing-upload", onClick: () => t(a), children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
      " Yükle"
    ] }) : /* @__PURE__ */ e.jsx("span", { className: "apya-chip apya-chip-warning", children: "Eksik" }) })
  ] });
}
function ss({ file: a, selected: t, checked: n, onSelect: u, onToggleCheck: r, onDragStart: p, isTrash: x, onRestore: h }) {
  const o = Ne(a.contentType, a.fileName), v = X[a.status] || X[1];
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !x,
      onDragStart: x ? void 0 : () => p(a),
      onClick: x ? void 0 : () => u(a),
      className: P("apya-doc-row", t && "is-selected", x && "is-trashed"),
      style: { gridTemplateColumns: Se },
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            onClick: x ? void 0 : (I) => {
              I.stopPropagation(), r(a.id);
            },
            style: { cursor: x ? "default" : "pointer" },
            children: x ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash-can", style: { fontSize: 12, color: "var(--apya-text-tertiary)" } }) : /* @__PURE__ */ e.jsx(
              "i",
              {
                className: `fa fa-${n ? "square-check" : "square"}`,
                style: { fontSize: 13, color: n ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
                role: "checkbox",
                "aria-checked": n
              }
            )
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 26, height: 26, borderRadius: 7, background: `${o.color}1a`, color: o.color, fontSize: 11 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${o.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.displayName }),
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(W, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] }),
          a.isLocked && /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock", style: { fontSize: 10, color: "var(--apya-text-tertiary)" }, title: "Kilitli" })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: a.documentTypeName || "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right" }, children: O.money(a.amount, a.currency) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: O.date(a.documentDate || a.creationTime) }),
        /* @__PURE__ */ e.jsx("span", { children: x ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => h(a), children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-rotate-left" }),
          " Geri al"
        ] }) : /* @__PURE__ */ e.jsx("span", { className: P("apya-chip", v.chip), children: v.text }) })
      ]
    }
  );
}
function ts({ file: a, selected: t, onSelect: n, onDragStart: u }) {
  const r = Ne(a.contentType, a.fileName), p = X[a.status] || X[1];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: !0,
      onDragStart: () => u(a),
      onClick: () => n(a),
      className: "apya-tile",
      style: {
        textAlign: "left",
        cursor: "pointer",
        ...t ? { borderColor: "var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-head", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-2", style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "apya-tile-icon-box", style: { background: `${r.color}1a`, color: r.color }, children: /* @__PURE__ */ e.jsx("i", { className: `fa ${r.icon}` }) }),
            /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
              /* @__PURE__ */ e.jsx("div", { className: "apya-tile-title", children: a.displayName }),
              /* @__PURE__ */ e.jsx("div", { className: "apya-tile-sub", children: a.documentTypeName || "Sınıflandırılmamış" })
            ] })
          ] }),
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(W, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", style: { borderTop: "none", paddingTop: 0 }, children: [
          /* @__PURE__ */ e.jsx("span", { className: P("apya-chip", p.chip), children: p.text }),
          a.amount !== null && a.amount !== void 0 && /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: O.money(a.amount, a.currency) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", children: a.uploaderName || "Sistem" }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", children: O.date(a.documentDate || a.creationTime) })
        ] })
      ]
    }
  );
}
function ns({
  loading: a,
  files: t,
  totalCount: n,
  view: u,
  sorting: r,
  onSort: p,
  selectedId: x,
  onSelect: h,
  checkedIds: o,
  onToggleCheck: v,
  onToggleAll: I,
  page: k,
  pageSize: j,
  onPageChange: g,
  onDragStart: y,
  emptyHint: E,
  missingItems: M = [],
  onUploadMissing: m,
  canUpload: N = !1,
  isTrash: l = !1,
  onRestore: b
}) {
  const S = t.length > 0 && t.every((d) => o.has(d.id)), T = Math.max(1, Math.ceil(n / j)), L = k === 0 && u === "list" ? M : [];
  return a ? u === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: Array.from({ length: 6 }).map((d, B) => /* @__PURE__ */ e.jsx(Fe, { height: 120, rounded: "lg" }, B)) }) : /* @__PURE__ */ e.jsx("div", { className: "p-3 d-flex flex-column gap-2", children: Array.from({ length: 8 }).map((d, B) => /* @__PURE__ */ e.jsx(Fe, { height: 40, rounded: "md" }, B)) }) : t.length === 0 && L.length === 0 ? /* @__PURE__ */ e.jsx(
    ie,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
      title: "Burada henüz belge yok",
      description: E
    }
  ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    u === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: t.map((d) => /* @__PURE__ */ e.jsx(
      ts,
      {
        file: d,
        selected: x === d.id,
        onSelect: h,
        onDragStart: y
      },
      d.id
    )) }) : /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-row-head", style: { gridTemplateColumns: Se }, children: [
        /* @__PURE__ */ e.jsx("span", { onClick: I, style: { cursor: "pointer" }, children: /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${S ? "square-check" : "square"}`,
            style: { fontSize: 13, color: S ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
            role: "checkbox",
            "aria-checked": S
          }
        ) }),
        Ye.map((d) => /* @__PURE__ */ e.jsx(es, { column: d, sorting: r, onSort: p }, d.key))
      ] }),
      L.map((d) => /* @__PURE__ */ e.jsx(
        as,
        {
          item: d,
          onUpload: m,
          canUpload: N
        },
        `missing-${d.assignmentId}-${d.requirementId}-${d.workStepId || "none"}`
      )),
      t.map((d) => /* @__PURE__ */ e.jsx(
        ss,
        {
          file: d,
          selected: x === d.id,
          checked: o.has(d.id),
          onSelect: h,
          onToggleCheck: v,
          onDragStart: y,
          isTrash: l,
          onRestore: b
        },
        d.id
      ))
    ] }),
    T > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            k * j + 1,
            "–",
            Math.min((k + 1) * j, n),
            " / ",
            n
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(R, { variant: "outline", size: "sm", disabled: k === 0, onClick: () => g(k - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              k + 1,
              " / ",
              T
            ] }),
            /* @__PURE__ */ e.jsx(R, { variant: "outline", size: "sm", disabled: k + 1 >= T, onClick: () => g(k + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
function ls({ count: a, onClear: t, onMove: n, onTag: u, busy: r }) {
  return a === 0 ? null : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-bulkbar", children: [
    /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
      a,
      " belge seçildi"
    ] }),
    /* @__PURE__ */ e.jsx("span", { style: { width: 1, height: 18, background: "rgba(255,255,255,.18)" } }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: n, disabled: r, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-open" }),
      " Taşı"
    ] }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: u, disabled: r, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-tag" }),
      " Etiketle"
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
    /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: t, children: "Vazgeç" })
  ] });
}
function is({ tags: a }) {
  return a != null && a.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1", children: a.map((t) => /* @__PURE__ */ e.jsx("span", { className: P("apya-chip", Qa(t)), children: t }, t)) }) : null;
}
const Oe = {
  1: { icon: "fa-diagram-project", label: "Proje" },
  2: { icon: "fa-list-check", label: "İş adımı" },
  3: { icon: "fa-receipt", label: "Harcama", href: (a) => a ? `${re()}Expenses` : null },
  4: {
    icon: "fa-box-archive",
    label: "Teslim paketi",
    href: (a) => a ? `${re()}Documents/Deliveries?packageId=${a}` : null
  },
  5: { icon: "fa-clipboard-check", label: "Kontrol listesi kalemi" }
};
function rs({ field: a, value: t, onChange: n, disabled: u }) {
  const r = { size: "sm", disabled: u, value: t ?? "" };
  switch (a.fieldType) {
    case 2:
      return /* @__PURE__ */ e.jsx(A, { ...r, type: "date", onChange: (p) => n({ valueDate: p.target.value || null }) });
    case 3:
    case 4:
    case 5:
      return /* @__PURE__ */ e.jsx(
        A,
        {
          ...r,
          type: "number",
          step: a.fieldType === 3 ? "0.01" : "1",
          onChange: (p) => n({ valueNumber: p.target.value === "" ? null : Number(p.target.value) })
        }
      );
    default:
      return /* @__PURE__ */ e.jsx(A, { ...r, onChange: (p) => n({ valueText: p.target.value || null }) });
  }
}
function os(a) {
  return a.fieldType === 2 ? a.valueDate ? a.valueDate.substring(0, 10) : "" : [3, 4, 5].includes(a.fieldType) ? a.valueNumber ?? "" : a.valueText ?? "";
}
function cs({
  detail: a,
  loading: t,
  canEdit: n,
  onSave: u,
  onDelete: r,
  saving: p,
  documentTypes: x
}) {
  var y, E, M;
  const [h, o] = i.useState(null);
  if (i.useEffect(() => {
    o(a ? { ...a, fields: (a.fields || []).map((m) => ({ ...m })) } : null);
  }, [a == null ? void 0 : a.id]), t)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(oe, { rows: 6 }) });
  if (!a || !h)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(
      ie,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir belge seçin",
        description: "Künye, özel alanlar ve versiyon geçmişi burada görünür."
      }
    ) });
  const v = Ne(a.contentType, a.fileName), I = X[h.status] || X[1], k = O.daysLeft(h.expiryDate), j = (m, N) => {
    o((l) => ({
      ...l,
      fields: l.fields.map((b) => b.fieldId === m ? { ...b, valueText: null, valueNumber: null, valueDate: null, ...N } : b)
    }));
  }, g = h.fields.filter(
    (m) => m.isRequired && !m.valueText && m.valueNumber === null && !m.valueDate
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-md-detail", style: { overflowY: "auto" }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
      /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "d-grid place-items-center flex-shrink-0",
          style: { width: 48, height: 48, borderRadius: 14, background: `${v.color}1a`, color: v.color, fontSize: 20 },
          children: /* @__PURE__ */ e.jsx("i", { className: `fa ${v.icon}` })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 14, fontWeight: 600, wordBreak: "break-word" }, children: a.displayName }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric mt-1", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
          O.size(a.fileSize),
          " · ",
          v.label,
          a.versionCount > 1 && ` · v${a.versionCount}`
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-1 mt-1 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: P("apya-chip", I.chip), children: I.text }),
          k !== null && k >= 0 && k <= 30 && /* @__PURE__ */ e.jsxs(W, { variant: "warning", size: "sm", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
            " ",
            k,
            " gün"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-3", children: [
      a.downloadUrl && /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: wa({ variant: "primary" }), style: { flex: 1 }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }),
      n && !a.isLocked && /* @__PURE__ */ e.jsx(R, { variant: "outline", onClick: () => r(a), title: "Sil", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash", style: { color: "var(--apya-negative-500)" } }) })
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
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: O.dateTime(a.creationTime) })
      ] }),
      a.retentionUntil && /* @__PURE__ */ e.jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Saklama" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: O.date(a.retentionUntil) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Özel alanlar",
        /* @__PURE__ */ e.jsx(ke, { text: "Alan şeması belge tipine bağlıdır. Tip değiştirdiğinizde kaydettikten sonra o tipin alanları görünür." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tipi" }),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-select",
              disabled: !n || a.isLocked,
              value: h.documentTypeId || "",
              onChange: (m) => o({ ...h, documentTypeId: m.target.value || null }),
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "— Sınıflandırılmamış —" }),
                x.map((m) => /* @__PURE__ */ e.jsx("option", { value: m.id, children: m.name }, m.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Tutar" }),
          /* @__PURE__ */ e.jsx(
            A,
            {
              size: "sm",
              type: "number",
              step: "0.01",
              disabled: !n || a.isLocked,
              value: h.amount ?? "",
              onChange: (m) => o({ ...h, amount: m.target.value === "" ? null : Number(m.target.value) })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tarihi" }),
          /* @__PURE__ */ e.jsx(
            A,
            {
              size: "sm",
              type: "date",
              disabled: !n || a.isLocked,
              value: h.documentDate ? h.documentDate.substring(0, 10) : "",
              onChange: (m) => o({ ...h, documentDate: m.target.value || null })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Dönem" }),
          /* @__PURE__ */ e.jsx(
            A,
            {
              size: "sm",
              placeholder: "2026-Q2",
              disabled: !n || a.isLocked,
              value: h.periodCode ?? "",
              onChange: (m) => o({ ...h, periodCode: m.target.value || null })
            }
          )
        ] }),
        h.fields.map((m) => {
          var N, l;
          return /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              m.label,
              m.isRequired && /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-negative-500)" }, children: "*" }),
              /* @__PURE__ */ e.jsx(W, { variant: ((N = Le[m.fillSource]) == null ? void 0 : N.variant) || "neutral", size: "sm", children: ((l = Le[m.fillSource]) == null ? void 0 : l.text) || "—" }),
              m.confidence !== null && m.confidence !== void 0 && /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10 }, children: [
                "%",
                m.confidence
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              rs,
              {
                field: m,
                value: os(m),
                disabled: !n || a.isLocked,
                onChange: (b) => j(m.fieldId, b)
              }
            )
          ] }, m.fieldId);
        })
      ] }),
      g.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", style: { fontSize: 11, color: "var(--apya-warning-500)" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation" }),
        " ",
        g.length,
        " zorunlu alan boş."
      ] }),
      n && !a.isLocked && /* @__PURE__ */ e.jsx(
        R,
        {
          variant: "primary",
          size: "sm",
          className: "mt-3 w-100",
          isLoading: p,
          onClick: () => u(h),
          children: "Kaydet"
        }
      )
    ] }),
    ((y = a.tags) == null ? void 0 : y.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Etiketler" }),
      /* @__PURE__ */ e.jsx(is, { tags: a.tags })
    ] }),
    ((E = a.related) == null ? void 0 : E.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "İlişkili kayıtlar",
        /* @__PURE__ */ e.jsx(ke, { text: "Belgenin bağlandığı harcama, içinde gittiği teslim paketi ve karşıladığı kontrol listesi kalemleri." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.related.map((m, N) => {
        var T;
        const l = Oe[m.kind] ?? Oe[3], b = (T = l.href) == null ? void 0 : T.call(l, m.entityId), S = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 22, height: 22, borderRadius: 6, background: "var(--apya-surface-sunken)", color: "var(--apya-text-secondary)", fontSize: 10 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${l.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12 }, children: m.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "d-block text-truncate apya-numeric",
                style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" },
                children: [l.label, m.detail].filter(Boolean).join(" · ")
              }
            )
          ] })
        ] });
        return b ? /* @__PURE__ */ e.jsx(
          "a",
          {
            href: b,
            className: "d-flex align-items-center gap-2 text-decoration-none",
            style: { color: "inherit" },
            children: S
          },
          `${m.kind}-${m.entityId}-${N}`
        ) : /* @__PURE__ */ e.jsx("div", { className: "d-flex align-items-center gap-2", children: S }, `${m.kind}-${N}`);
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Versiyonlar",
        /* @__PURE__ */ e.jsx(ke, { text: "Aynı klasöre aynı isimle yeniden yüklenen dosya yeni versiyon olur; önceki versiyonlar burada kalır." })
      ] }),
      (M = a.versions) != null && M.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1", children: a.versions.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsxs(W, { variant: m.isLatest ? "brand" : "neutral", size: "sm", children: [
            "v",
            m.versionNumber
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { color: "var(--apya-text-secondary)" }, children: m.uploaderName })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { color: "var(--apya-text-tertiary)" }, children: O.date(m.creationTime) })
      ] }, m.id)) }) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Versiyon kaydı yok." })
    ] })
  ] });
}
const _e = [
  { value: 1, label: "Proje geneli" },
  { value: 2, label: "Her iş adımı için" },
  { value: 3, label: "Her dönem için" }
], He = [
  { value: 2, label: "Klasör şeması" },
  { value: 3, label: "Task eki" }
], ds = {
  title: "",
  scope: 1,
  documentTypeId: "",
  isBlocking: !1,
  order: 0,
  source: 2,
  sourceEntityId: ""
};
function us({ draft: a, setDraft: t, documentTypes: n, tasks: u, onSubmit: r, onCancel: p, busy: x }) {
  const h = Number(a.source) === 3;
  return /* @__PURE__ */ e.jsxs(
    "form",
    {
      className: "d-flex flex-column gap-2 p-2",
      style: { background: "var(--apya-surface-sunken)", borderRadius: 10 },
      onSubmit: (o) => {
        o.preventDefault(), r();
      },
      children: [
        /* @__PURE__ */ e.jsx(
          A,
          {
            size: "sm",
            placeholder: "Kalem adı (ör. İmzalı hizmet sözleşmesi)",
            value: a.title,
            onChange: (o) => t({ ...a, title: o.target.value }),
            required: !0
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.source,
              onChange: (o) => t({ ...a, source: Number(o.target.value), sourceEntityId: "" }),
              "aria-label": "Kaynak",
              children: He.map((o) => /* @__PURE__ */ e.jsx("option", { value: o.value, children: o.label }, o.value))
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.scope,
              onChange: (o) => t({ ...a, scope: Number(o.target.value) }),
              "aria-label": "Kapsam",
              children: _e.map((o) => /* @__PURE__ */ e.jsx("option", { value: o.value, children: o.label }, o.value))
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-doc-select",
              value: a.documentTypeId || "",
              onChange: (o) => t({ ...a, documentTypeId: o.target.value }),
              "aria-label": "Belge tipi",
              disabled: h,
              title: h ? "Göreve bağlı kalem otomatik eşleşmez" : void 0,
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "Belge tipi: yok (elle bağlanır)" }),
                n.map((o) => /* @__PURE__ */ e.jsx("option", { value: o.id, children: o.name }, o.id))
              ]
            }
          )
        ] }),
        h && /* @__PURE__ */ e.jsxs(
          "select",
          {
            className: "apya-doc-select",
            value: a.sourceEntityId || "",
            onChange: (o) => t({ ...a, sourceEntityId: o.target.value }),
            "aria-label": "Görev",
            required: !0,
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Görev seçin…" }),
              u.map((o) => /* @__PURE__ */ e.jsxs("option", { value: o.id, children: [
                "#",
                o.number,
                " · ",
                o.title
              ] }, o.id))
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
              onChange: (o) => t({ ...a, isBlocking: o.target.checked })
            }
          ),
          "Eksikse teslim paketi üretimini bloke etsin"
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [
          /* @__PURE__ */ e.jsx(R, { type: "button", variant: "outline", size: "sm", onClick: p, children: "Vazgeç" }),
          /* @__PURE__ */ e.jsx(R, { type: "submit", size: "sm", isLoading: x, disabled: !a.title.trim(), children: "Kaydet" })
        ] })
      ]
    }
  );
}
function ms({ pkg: a, projectId: t, documentTypes: n, onClose: u, onChanged: r }) {
  const [p, x] = i.useState([]), [h, o] = i.useState([]), [v, I] = i.useState(!0), [k, j] = i.useState(!1), [g, y] = i.useState({
    name: a.name,
    issuer: a.issuer,
    description: a.description || "",
    order: a.order || 0
  }), [E, M] = i.useState(null), [m, N] = i.useState(null), l = i.useCallback(async () => {
    I(!0);
    try {
      const [d, B] = await Promise.all([
        Oa(a.id),
        // Görev listesi yalnız proje bağlamında anlamlı; yoksa "task eki"
        // kaynağı seçilebilir ama liste boş kalır.
        t ? La(t) : Promise.resolve([])
      ]);
      x(d ?? []), o(B ?? []);
    } catch (d) {
      z("error", "Paket kalemleri yüklenemedi."), console.error("[Documents] package requirements", d);
    } finally {
      I(!1);
    }
  }, [a.id, t]);
  i.useEffect(() => {
    l();
  }, [l]);
  const b = async () => {
    j(!0);
    try {
      await Ua(a.id, {
        name: g.name,
        issuer: g.issuer,
        description: g.description || null,
        order: g.order
      }), z("success", "Paket güncellendi."), r == null || r();
    } catch (d) {
      z("error", "Paket güncellenemedi."), console.error("[Documents] update package", d);
    } finally {
      j(!1);
    }
  }, S = async () => {
    j(!0);
    try {
      const d = {
        title: E.title.trim(),
        scope: Number(E.scope),
        documentTypeId: E.documentTypeId || null,
        isBlocking: E.isBlocking,
        order: Number(E.order) || p.length,
        source: Number(E.source),
        sourceEntityId: E.sourceEntityId || null
      };
      m ? await Ga(m, d) : await qa(a.id, d), M(null), N(null), await l(), r == null || r();
    } catch (d) {
      z("error", "Kalem kaydedilemedi."), console.error("[Documents] save requirement", d);
    } finally {
      j(!1);
    }
  }, T = async (d) => {
    j(!0);
    try {
      await Ya(d), await l(), r == null || r();
    } catch (B) {
      z("error", "Kalem silinemedi."), console.error("[Documents] delete requirement", B);
    } finally {
      j(!1);
    }
  }, L = async () => {
    var d, B;
    if (window.confirm(`"${a.name}" paketi silinecek. Emin misiniz?`)) {
      j(!0);
      try {
        await Ka(a.id), r == null || r(), u();
      } catch (F) {
        z("error", ((B = (d = F == null ? void 0 : F.responseJSON) == null ? void 0 : d.error) == null ? void 0 : B.message) || "Paket silinemedi."), console.error("[Documents] delete package", F);
      } finally {
        j(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Paketi düzenle" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: L, disabled: k, children: "Paketi sil" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: u, children: "Kapat" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx(
        A,
        {
          size: "sm",
          placeholder: "Paket adı",
          value: g.name,
          onChange: (d) => y({ ...g, name: d.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(
        A,
        {
          size: "sm",
          placeholder: "İsteyen taraf (ör. İç politika)",
          value: g.issuer,
          onChange: (d) => y({ ...g, issuer: d.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(R, { size: "sm", variant: "outline", isLoading: k, onClick: b, children: "Kaydet" })
    ] }),
    v ? /* @__PURE__ */ e.jsx(oe, { rows: 4 }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-list", children: [
      p.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "p-2", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette henüz kalem yok." }),
      p.map((d) => {
        var B, F;
        return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", children: [
          /* @__PURE__ */ e.jsx("span", { className: P("apya-chip", d.isBlocking ? "apya-chip-warning" : "apya-chip-neutral"), children: d.isBlocking ? "bloke eden" : "normal" }),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: d.title }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              ((B = He.find((ee) => ee.value === d.source)) == null ? void 0 : B.label) || "kurum şablonu",
              d.sourceEntityName && ` · ${d.sourceEntityName}`,
              " · ",
              (F = _e.find((ee) => ee.value === d.scope)) == null ? void 0 : F.label,
              d.documentTypeName && ` · ${d.documentTypeName}`
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("span", {}),
          /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2 justify-content-end", children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: k,
                onClick: () => {
                  N(d.id), M({
                    title: d.title,
                    scope: d.scope,
                    documentTypeId: d.documentTypeId || "",
                    isBlocking: d.isBlocking,
                    order: d.order,
                    source: d.source === 1 ? 2 : d.source,
                    sourceEntityId: d.sourceEntityId || ""
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
                disabled: k,
                onClick: () => T(d.id),
                children: "Sil"
              }
            )
          ] })
        ] }, d.id);
      })
    ] }),
    E ? /* @__PURE__ */ e.jsx(
      us,
      {
        draft: E,
        setDraft: M,
        documentTypes: n,
        tasks: h,
        onSubmit: S,
        onCancel: () => {
          M(null), N(null);
        },
        busy: k
      }
    ) : /* @__PURE__ */ e.jsx(
      R,
      {
        size: "sm",
        variant: "outline",
        leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
        onClick: () => {
          N(null), M({ ...ds, order: p.length });
        },
        children: "Kalem ekle"
      }
    )
  ] });
}
function ps({ packages: a, projectId: t, documentTypes: n, onChanged: u }) {
  const [r, p] = i.useState(null), [x, h] = i.useState(!1), [o, v] = i.useState(""), [I, k] = i.useState(!1), j = a.filter((y) => y.isEditable), g = async () => {
    k(!0);
    try {
      const y = await Wa({
        name: o.trim(),
        issuer: "İç politika",
        description: null,
        order: j.length
      });
      v(""), h(!1), u == null || u(), p(y);
    } catch (y) {
      z("error", "Paket oluşturulamadı."), console.error("[Documents] create package", y);
    } finally {
      k(!1);
    }
  };
  return r ? /* @__PURE__ */ e.jsx(
    ms,
    {
      pkg: r,
      projectId: t,
      documentTypes: n,
      onClose: () => p(null),
      onChanged: u
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Kendi paketleriniz" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      !x && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => h(!0), children: "+ Yeni paket" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Kurum paketleri (KOSGEB, TÜBİTAK) sistemde tanımlıdır ve değiştirilemez. Kendi klasör şemanız ve göreve bağlı ekleriniz için buradan paket kurun." }),
    x && /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        A,
        {
          size: "sm",
          autoFocus: !0,
          placeholder: "Paket adı (ör. Şirket klasör şeması)",
          value: o,
          onChange: (y) => v(y.target.value),
          onKeyDown: (y) => {
            y.key === "Enter" && o.trim() && g();
          }
        }
      ),
      /* @__PURE__ */ e.jsx(R, { size: "sm", isLoading: I, disabled: !o.trim(), onClick: g, children: "Oluştur" }),
      /* @__PURE__ */ e.jsx(R, { size: "sm", variant: "outline", onClick: () => {
        h(!1), v("");
      }, children: "Vazgeç" })
    ] }),
    j.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Henüz kendi paketiniz yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: j.map((y) => /* @__PURE__ */ e.jsxs(R, { variant: "outline", size: "sm", onClick: () => p(y), children: [
      y.name,
      /* @__PURE__ */ e.jsx(W, { variant: "neutral", size: "sm", children: y.requirementCount })
    ] }, y.id)) })
  ] });
}
const We = {
  1: { text: "Karşılandı", chip: "apya-chip-positive", icon: "fa-check" },
  2: { text: "Eksik", chip: "apya-chip-warning", icon: "fa-triangle-exclamation" },
  3: { text: "Feragat", chip: "apya-chip-neutral", icon: "fa-ban" }
}, ys = { 1: "Proje", 2: "İş adımı", 3: "Dönem" }, Ue = {
  1: "kurum şablonu",
  2: "klasör şeması",
  3: "task eki"
};
function xs({ percent: a, blocking: t }) {
  const n = t > 0 ? "var(--apya-negative-500)" : a >= 90 ? "var(--apya-positive-500)" : "var(--apya-warning-500)";
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", role: "progressbar", "aria-valuenow": a, "aria-valuemin": 0, "aria-valuemax": 100, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a}%`, background: n } }) });
}
function hs({ item: a, canManage: t, onWaive: n, busy: u }) {
  const r = We[a.status] || We[2], p = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || ys[a.scope];
  return /* @__PURE__ */ e.jsxs("div", { className: P("apya-doc-check-row", a.status === 2 && a.isBlocking && "is-blocking"), children: [
    /* @__PURE__ */ e.jsxs("span", { className: P("apya-chip", r.chip), children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa ${r.icon}` }),
      " ",
      r.text
    ] }),
    /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.title }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
        Ue[a.source] || Ue[1],
        a.sourceEntityName && ` · ${a.sourceEntityName}`,
        " · ",
        p,
        a.documentTypeName && ` · ${a.documentTypeName}`,
        a.waiveReason && ` · ${a.waiveReason}`
      ] }),
      a.requiresManualLink && a.status === 2 && /* @__PURE__ */ e.jsx("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-warning-700, #92400E)" }, children: "Otomatik eşleşmez — belgeyi elle bağlayın." })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: a.documentFileName || "—" }),
    /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2 justify-content-end", children: [
      a.isBlocking && a.status === 2 && /* @__PURE__ */ e.jsx(W, { variant: "negative", size: "sm", children: "Teslimi bloke ediyor" }),
      t && a.status !== 1 && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: u,
          onClick: () => n(a, a.status !== 3),
          children: a.status === 3 ? "Feragati kaldır" : "Feragat et"
        }
      )
    ] })
  ] });
}
function fs({ projectId: a, periodCode: t, onSummaryChange: n, documentTypes: u = [] }) {
  const [r, p] = i.useState(null), [x, h] = i.useState([]), [o, v] = i.useState(!0), [I, k] = i.useState(!1), j = le("Platform.Documents.ManageCompliance"), g = i.useCallback(async () => {
    if (!a) {
      p(null), v(!1);
      return;
    }
    v(!0);
    try {
      const [l, b] = await Promise.all([
        qe(a, t),
        $a(a)
      ]);
      p(l), h(b ?? []), n == null || n((l == null ? void 0 : l.summary) ?? null);
    } catch (l) {
      z("error", "Uygunluk verisi yüklenemedi."), console.error("[Documents] compliance load", l);
    } finally {
      v(!1);
    }
  }, [a, t, n]);
  i.useEffect(() => {
    g();
  }, [g]);
  const y = async (l) => {
    k(!0);
    try {
      await Ba(a, l, t || null), await g();
    } catch (b) {
      z("error", "Paket uygulanamadı."), console.error("[Documents] applyPackage", b);
    } finally {
      k(!1);
    }
  }, E = async (l) => {
    k(!0);
    try {
      await Fa(l), await g();
    } catch (b) {
      z("error", "Paket kaldırılamadı."), console.error("[Documents] removeAssignment", b);
    } finally {
      k(!1);
    }
  }, M = async (l, b, S) => {
    const T = S ? window.prompt("Feragat gerekçesi:") : null;
    if (!(S && !T)) {
      k(!0);
      try {
        await Ma({
          assignmentId: l.assignmentId,
          requirementId: b.requirementId,
          workStepId: b.workStepId,
          periodCode: b.periodCode,
          waive: S,
          reason: T
        }), await g();
      } catch (L) {
        z("error", "İşlem başarısız oldu."), console.error("[Documents] waive", L);
      } finally {
        k(!1);
      }
    }
  };
  if (!a)
    return /* @__PURE__ */ e.jsx(
      ie,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-check" }),
        title: "Önce bir proje bağlamı seçin",
        description: "Uygunluk, projeye uygulanan kurum paketleri üzerinden hesaplanır."
      }
    );
  if (o)
    return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(oe, { rows: 6 }) });
  const m = (r == null ? void 0 : r.checklists) ?? [], N = x.filter((l) => !l.isApplied);
  return /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
    m.length === 0 ? /* @__PURE__ */ e.jsx(
      ie,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-list" }),
        title: "Bu projeye henüz kurum paketi uygulanmadı",
        description: "Aşağıdan bir paket seçerek kontrol listesini başlatın."
      }
    ) : m.map((l) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
        /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsx("div", { style: { fontSize: 13.5, fontWeight: 600 }, children: l.packageName }),
          /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            l.issuer,
            l.periodCode && ` · ${l.periodCode}`
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 15, fontWeight: 500 }, children: [
            "%",
            l.summary.percent
          ] }),
          l.summary.blockingMissingCount > 0 && /* @__PURE__ */ e.jsxs(W, { variant: "negative", size: "sm", children: [
            l.summary.blockingMissingCount,
            " bloke"
          ] }),
          j && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: I,
              onClick: () => E(l.assignmentId),
              children: "Kaldır"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(xs, { percent: l.summary.percent, blocking: l.summary.blockingMissingCount }),
      /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
        l.summary.satisfiedCount,
        " / ",
        l.summary.totalCount - l.summary.waivedCount,
        " kalem tamam",
        l.summary.waivedCount > 0 && ` · ${l.summary.waivedCount} feragat`
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-list", children: l.items.map((b, S) => /* @__PURE__ */ e.jsx(
        hs,
        {
          item: b,
          canManage: j,
          busy: I,
          onWaive: (T, L) => M(l, T, L)
        },
        `${b.requirementId}-${b.workStepId || b.periodCode || S}`
      )) })
    ] }, l.assignmentId)),
    j && /* @__PURE__ */ e.jsx(
      ps,
      {
        packages: x,
        projectId: a,
        documentTypes: u,
        onChanged: g
      }
    ),
    j && N.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Uygulanabilir paketler" }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: N.map((l) => /* @__PURE__ */ e.jsxs(
        R,
        {
          variant: "outline",
          size: "sm",
          disabled: I,
          leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          onClick: () => y(l.id),
          children: [
            l.name,
            " (",
            l.requirementCount,
            ")"
          ]
        },
        l.id
      )) })
    ] })
  ] });
}
const ne = 25, gs = {
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
}, vs = [
  { value: "", label: "Tümü" },
  { value: "1", label: "Yüklendi" },
  { value: "2", label: "İndirildi" },
  { value: "5", label: "Meta değişti" },
  { value: "3", label: "Silindi" }
];
function ks({ projectId: a, documentFileId: t }) {
  const [n, u] = i.useState([]), [r, p] = i.useState(0), [x, h] = i.useState(0), [o, v] = i.useState(""), [I, k] = i.useState(!0), j = i.useCallback(async () => {
    k(!0);
    try {
      const y = await _a({
        maxResultCount: ne,
        skipCount: x * ne,
        projectId: a || void 0,
        documentFileId: t || void 0,
        action: o || void 0
      });
      u(y.items ?? []), p(y.totalCount ?? 0);
    } catch (y) {
      z("error", "Etkinlik kaydı yüklenemedi."), console.error("[Documents] activity load", y);
    } finally {
      k(!1);
    }
  }, [a, t, o, x]);
  i.useEffect(() => {
    j();
  }, [j]);
  const g = Math.max(1, Math.ceil(r / ne));
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center gap-2 flex-wrap px-3 py-2",
        style: { borderBottom: "1px solid var(--apya-border-subtle)" },
        children: [
          vs.map((y) => /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: P("apya-doc-filterchip", o === y.value && "is-active"),
              onClick: () => {
                v(y.value), h(0);
              },
              children: y.label
            },
            y.value
          )),
          /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            r,
            " kayıt"
          ] })
        ]
      }
    ),
    I ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(oe, { rows: 8 }) }) : n.length === 0 ? /* @__PURE__ */ e.jsx(
      ie,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left" }),
        title: "Henüz kayıtlı etkinlik yok",
        description: "Yükleme, indirme, meta değişikliği ve silme işlemleri burada iz bırakır."
      }
    ) : /* @__PURE__ */ e.jsx("div", { children: n.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", children: [
      /* @__PURE__ */ e.jsx("span", { className: P("apya-chip", gs[y.action] || "apya-chip-neutral"), children: Ja[y.action] || "—" }),
      /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: y.documentFileName || y.folderName || "—" }),
        y.detail && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: y.detail })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12 }, children: y.actorName }),
        y.actorRole && /* @__PURE__ */ e.jsx(W, { variant: "neutral", size: "sm", children: y.actorRole })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: O.dateTime(y.creationTime) })
    ] }, y.id)) }),
    g > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            x * ne + 1,
            "–",
            Math.min((x + 1) * ne, r),
            " / ",
            r
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(R, { variant: "outline", size: "sm", disabled: x === 0, onClick: () => h(x - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              x + 1,
              " / ",
              g
            ] }),
            /* @__PURE__ */ e.jsx(R, { variant: "outline", size: "sm", disabled: x + 1 >= g, onClick: () => h(x + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
const be = 25;
function js({ message: a, onDone: t }) {
  return i.useEffect(() => {
    const n = setTimeout(t, 2800);
    return () => clearTimeout(n);
  }, [t]), /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-check", style: { fontSize: 11, color: "var(--apya-positive-500)" } }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: a })
  ] });
}
function bs({ title: a, message: t, onConfirm: n, onCancel: u }) {
  const [r, p] = i.useState(!1);
  return /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: u, children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-dialog", onClick: (x) => x.stopPropagation(), children: [
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
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: t })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [
      /* @__PURE__ */ e.jsx(R, { variant: "outline", size: "sm", onClick: u, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        R,
        {
          variant: "destructive",
          size: "sm",
          isLoading: r,
          onClick: async () => {
            p(!0), await n(), p(!1);
          },
          children: "Evet, sil"
        }
      )
    ] })
  ] }) });
}
function Ns({ uploadedThisMonth: a, expiring: t, compliance: n }) {
  const u = [
    {
      key: "compliance",
      label: "Uygunluk",
      value: n ? `%${n.percent}` : "—",
      icon: "fa-clipboard-check",
      tone: "positive",
      foot: n ? `${n.satisfiedCount} / ${n.totalCount - n.waivedCount} kalem tamam` : "Proje bağlamı seçin"
    },
    {
      key: "missing",
      label: "Eksik belge",
      value: n ? n.missingCount : "—",
      icon: "fa-triangle-exclamation",
      tone: "warning",
      foot: n && n.blockingMissingCount > 0 ? `${n.blockingMissingCount} tanesi teslimi bloke ediyor` : null
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
    { key: "expiring", label: "Süresi dolan", value: t ?? "—", icon: "fa-clock-rotate-left", tone: "negative" }
  ];
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-kpis", children: u.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("span", { className: P("apya-doc-kpi-icon", `is-${r.tone}`), children: /* @__PURE__ */ e.jsx("i", { className: `fa ${r.icon}` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: r.label })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: r.value }),
    r.foot && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: r.foot })
  ] }, r.key)) });
}
function Ss() {
  const [a, t] = i.useState([]), [n, u] = i.useState([]), [r, p] = i.useState([]), [x, h] = i.useState(!0), [o, v] = i.useState([]), [I, k] = i.useState(0), [j, g] = i.useState(null), [y, E] = i.useState(null), [M, m] = i.useState(!0), N = i.useMemo(() => new URLSearchParams(window.location.search), []), [l, b] = i.useState(() => {
    const s = N.get("smart");
    return s ? { key: s, kind: "smart", smart: s } : { key: "all", kind: "all" };
  }), S = l.kind === "folder" ? l.documentId : null, T = l.projectId || null, L = l.kind === "smart" && l.smart === "trash", [d, B] = i.useState(/* @__PURE__ */ new Set()), [F, ee] = i.useState(N.get("q") || ""), [J, Ve] = i.useState(N.get("sort") || "creationTime desc"), [Q, we] = i.useState(N.get("view") === "grid" ? "grid" : "list"), [Z, ce] = i.useState(Number(N.get("page")) || 0), [K, Je] = i.useState(() => {
    const s = N.get("tab");
    return ["files", "compliance", "activity"].includes(s) ? s : "files";
  }), [Qe, Ze] = i.useState(null), [Ce, ze] = i.useState(null), [Xe, me] = i.useState(null), [ea, Ie] = i.useState(!1), [aa, De] = i.useState(!1), [Y, H] = i.useState(/* @__PURE__ */ new Set()), [sa, ta] = i.useState(null), pe = i.useRef([]), [ae, ye] = i.useState(null), [Te, Ee] = i.useState(null), [na, Pe] = i.useState(!1), xe = i.useRef(null), [la, he] = i.useState([]), fe = i.useRef(null), de = le("Platform.Documents.Create"), ia = le("Platform.Documents.ManageMeta"), ra = le("Platform.Documents.BulkOperations"), oa = le("Platform.Documents.Delete"), q = i.useCallback((s) => Ee(s), []), se = i.useCallback(async () => {
    h(!0);
    try {
      const [s, c, f] = await Promise.all([
        Ca().getList({ maxResultCount: 1e3, sorting: "title asc" }),
        Ra(),
        Pa()
      ]);
      t(s.items ?? []), u(c ?? []), p(f ?? []);
    } catch (s) {
      z("error", "Klasör ağacı yüklenemedi."), console.error("[Documents] loadTree", s);
    } finally {
      h(!1);
    }
  }, []);
  i.useEffect(() => {
    se();
  }, [se]);
  const Re = i.useMemo(() => {
    const s = { maxResultCount: be, skipCount: Z * be, sorting: J };
    return F.trim() && (s.filterText = F.trim()), l.kind === "folder" ? (s.documentId = l.documentId, s.includeSubFolders = !0) : l.kind === "workstep" ? s.workStepId = l.workStepId : l.kind === "smart" && l.smart === "expiring" ? s.expiringWithinDays = 30 : l.kind === "smart" && l.smart === "missing-meta" ? s.missingRequiredFields = !0 : l.kind === "smart" && l.smart === "trash" && (s.onlyDeleted = !0), s;
  }, [l, Z, J, F]), G = i.useCallback(async () => {
    m(!0);
    try {
      const s = await je(Re);
      v(s.items ?? []), k(s.totalCount ?? 0);
    } catch (s) {
      z("error", "Belge listesi yüklenemedi."), console.error("[Documents] loadFiles", s);
    } finally {
      m(!1);
    }
  }, [Re]);
  i.useEffect(() => {
    G();
  }, [G]);
  const te = i.useCallback(async () => {
    try {
      const s = /* @__PURE__ */ new Date(), c = new Date(s.getFullYear(), s.getMonth(), 1).toISOString(), [f, D] = await Promise.all([
        je({ maxResultCount: 1, skipCount: 0, expiringWithinDays: 30 }),
        je({ maxResultCount: 1, skipCount: 0, uploadedAfter: c })
      ]);
      g(f.totalCount ?? 0), E(D.totalCount ?? 0);
    } catch (s) {
      console.error("[Documents] loadKpis", s);
    }
  }, []);
  i.useEffect(() => {
    te();
  }, [te]);
  const ge = i.useCallback(async () => {
    if (!T) {
      he([]);
      return;
    }
    try {
      const c = ((await qe(T, null)).checklists ?? []).flatMap((f) => (f.items ?? []).filter((D) => D.status === 2).map((D) => ({ ...D, assignmentId: f.assignmentId })));
      he(
        l.kind === "workstep" ? c.filter((f) => f.workStepId === l.workStepId) : c
      );
    } catch (s) {
      he([]), console.error("[Documents] loadMissing", s);
    }
  }, [T, l.kind, l.workStepId]);
  i.useEffect(() => {
    ge();
  }, [ge]);
  const ue = i.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    n.forEach((D) => {
      s.has(D.projectId) || s.set(D.projectId, []), s.get(D.projectId).push(D);
    });
    const c = /* @__PURE__ */ new Map();
    a.forEach((D) => {
      const w = D.parentDocumentId || "root";
      c.has(w) || c.set(w, []), c.get(w).push(D);
    });
    const f = (D) => (c.get(D) || []).sort((w, V) => (w.sortOrder ?? 0) - (V.sortOrder ?? 0) || w.title.localeCompare(V.title, "tr")).map((w) => {
      const V = f(w.id), ba = (w.projectId ? s.get(w.projectId) || [] : []).slice().sort((_, Na) => _.order - Na.order).map((_) => ({
        key: `step-${_.id}`,
        kind: "workstep",
        workStepId: _.id,
        projectId: _.projectId,
        label: `${_.order} · ${_.name}`,
        icon: "fa-diagram-next",
        count: _.documentCount,
        children: []
      }));
      return {
        key: `folder-${w.id}`,
        kind: "folder",
        documentId: w.id,
        projectId: w.projectId,
        label: w.title,
        icon: w.projectId ? "fa-diagram-project" : "fa-folder",
        children: [...ba, ...V]
      };
    });
    return f("root");
  }, [a, n]), ve = i.useRef(!1);
  i.useEffect(() => {
    if (ve.current || x || ue.length === 0) return;
    const s = N.get("folder"), c = N.get("step");
    if (!s && !c) {
      ve.current = !0;
      return;
    }
    const f = (w) => w.flatMap((V) => [V, ...f(V.children || [])]), D = f(ue).find((w) => s ? w.documentId === s : w.workStepId === c);
    ve.current = !0, D && (b(D), B((w) => /* @__PURE__ */ new Set([...w, D.key])));
  }, [x, ue, N]), i.useEffect(() => {
    const s = new URLSearchParams();
    K !== "files" && s.set("tab", K), l.kind === "folder" ? s.set("folder", l.documentId) : l.kind === "workstep" ? s.set("step", l.workStepId) : l.kind === "smart" && s.set("smart", l.smart), F.trim() && s.set("q", F.trim()), Q !== "list" && s.set("view", Q), J !== "creationTime desc" && s.set("sort", J), Z > 0 && s.set("page", String(Z));
    const c = s.toString();
    window.history.replaceState(null, "", c ? `${window.location.pathname}?${c}` : window.location.pathname);
  }, [K, l, F, Q, J, Z]);
  const ca = i.useCallback(async (s) => {
    ze(s.id), Ie(!0);
    try {
      me(await Me(s.id));
    } catch (c) {
      z("error", "Belge detayı açılamadı."), console.error("[Documents] openDetail", c);
    } finally {
      Ie(!1);
    }
  }, []), da = async (s) => {
    De(!0);
    try {
      await za(s.id, {
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
        fields: s.fields.map((c) => ({
          fieldId: c.fieldId,
          valueText: c.valueText ?? null,
          valueNumber: c.valueNumber ?? null,
          valueDate: c.valueDate ?? null
        })),
        tags: s.tags || []
      }), q("Belge güncellendi."), me(await Me(s.id)), await G();
    } catch (c) {
      z("error", "Belge güncellenemedi."), console.error("[Documents] handleSave", c);
    } finally {
      De(!1);
    }
  }, ua = async () => {
    if (ae)
      try {
        await Ta(ae.id), Ce === ae.id && (ze(null), me(null)), q("Belge silindi."), await Promise.all([G(), te()]);
      } catch (s) {
        z("error", "Belge silinemedi."), console.error("[Documents] handleDelete", s);
      } finally {
        ye(null);
      }
  }, ma = (s) => {
    pe.current = Y.has(s.id) ? Array.from(Y) : [s.id];
  }, pa = async (s) => {
    const c = pe.current;
    if (c.length)
      try {
        c.length === 1 ? await Ia(c[0], s) : await Ae(c, s), q(c.length === 1 ? "Belge taşındı." : `${c.length} belge taşındı.`), H(/* @__PURE__ */ new Set()), await G();
      } catch (f) {
        z("error", "Taşıma başarısız oldu."), console.error("[Documents] move", f);
      } finally {
        pe.current = [];
      }
  }, ya = async () => {
    const s = window.prompt("Hedef klasör adını yazın:");
    if (!s) return;
    const c = a.find((f) => f.title.toLocaleLowerCase("tr") === s.toLocaleLowerCase("tr"));
    if (!c) {
      z("warn", "Klasör bulunamadı.");
      return;
    }
    try {
      await Ae(Array.from(Y), c.id), q(`${Y.size} belge taşındı.`), H(/* @__PURE__ */ new Set()), await G();
    } catch (f) {
      z("error", "Toplu taşıma başarısız oldu."), console.error("[Documents] bulkMove", f);
    }
  }, xa = async () => {
    const s = window.prompt("Etiket(ler) — virgülle ayırın:");
    if (!s) return;
    const c = s.split(",").map((f) => f.trim()).filter(Boolean);
    if (c.length)
      try {
        await Da(Array.from(Y), c), q(`${Y.size} belge etiketlendi.`), H(/* @__PURE__ */ new Set()), await G();
      } catch (f) {
        z("error", "Etiketleme başarısız oldu."), console.error("[Documents] bulkTag", f);
      }
  }, $e = async (s) => {
    if (!S || !(s != null && s.length)) return;
    const c = fe.current;
    fe.current = null, Pe(!0);
    try {
      let f = null;
      for (const D of Array.from(s)) {
        const w = await Ha(S, D);
        f = f ?? (w == null ? void 0 : w.documentFileId) ?? null;
      }
      c && f ? (await Aa({
        assignmentId: c.assignmentId,
        requirementId: c.requirementId,
        workStepId: c.workStepId || null,
        periodCode: c.periodCode || null,
        documentFileId: f
      }), q(`Yüklendi ve "${c.title}" kalemine bağlandı.`)) : q(s.length === 1 ? "Dosya yüklendi." : `${s.length} dosya yüklendi.`), await Promise.all([G(), te(), se(), ge()]);
    } catch (f) {
      z("error", "Dosya yüklenemedi."), console.error("[Documents] upload", f);
    } finally {
      Pe(!1);
    }
  }, ha = async (s) => {
    try {
      await Ea(s.id), q(`"${s.displayName}" geri alındı.`), await Promise.all([G(), te(), se()]);
    } catch (c) {
      z("error", "Belge geri alınamadı."), console.error("[Documents] restore", c);
    }
  }, fa = (s) => {
    var c;
    if (!S) {
      z("warn", "Yükleme klasör bağlamında yapılır — soldan bir klasör seçin.");
      return;
    }
    fe.current = s, (c = xe.current) == null || c.click();
  }, ga = () => {
    const s = new window.abp.ModalManager(re() + "Documents/CreateModal");
    s.open({ parentDocumentId: S || void 0 }), s.onResult(() => {
      se(), q("Klasör oluşturuldu.");
    });
  }, Be = (s) => B((c) => {
    const f = new Set(c);
    return f.has(s) ? f.delete(s) : f.add(s), f;
  }), va = (s) => {
    var c;
    b(s), ce(0), H(/* @__PURE__ */ new Set()), (c = s.key) != null && c.startsWith("folder-") && Be(s.key);
  }, ka = (s) => H((c) => {
    const f = new Set(c);
    return f.has(s) ? f.delete(s) : f.add(s), f;
  }), ja = () => H((s) => o.every((c) => s.has(c.id)) ? /* @__PURE__ */ new Set() : new Set(o.map((c) => c.id)));
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto",
      style: { maxWidth: 1560 },
      onDragOver: (s) => {
        S && s.preventDefault();
      },
      onDrop: (s) => {
        var c;
        !S || !((c = s.dataTransfer.files) != null && c.length) || (s.preventDefault(), $e(s.dataTransfer.files));
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Dokümanlar" }),
            /* @__PURE__ */ e.jsx("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: "Klasörler, belgeler ve meta veri" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            de && /* @__PURE__ */ e.jsx(
              "a",
              {
                className: "apya-doc-linkbtn",
                href: `${re()}Documents/Upload${S ? `?documentId=${S}` : ""}`,
                children: "Toplu yükleme"
              }
            ),
            de && /* @__PURE__ */ e.jsx(R, { variant: "secondary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-plus" }), onClick: ga, children: "Yeni klasör" }),
            de && /* @__PURE__ */ e.jsx(
              R,
              {
                variant: "primary",
                isLoading: na,
                disabled: !S,
                title: S ? void 0 : "Önce bir klasör seçin",
                leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
                onClick: () => {
                  var s;
                  return (s = xe.current) == null ? void 0 : s.click();
                },
                children: "Yükle"
              }
            ),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                ref: xe,
                type: "file",
                multiple: !0,
                hidden: !0,
                onChange: (s) => {
                  $e(s.target.files), s.target.value = "";
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(Ns, { uploadedThisMonth: y, expiring: j, compliance: Qe }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-doc-tabs", role: "tablist", children: [
          { key: "files", label: "Dosyalar" },
          { key: "compliance", label: "Uygunluk" },
          { key: "activity", label: "Etkinlik" }
        ].map((s) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": K === s.key,
            className: P("apya-doc-tab", K === s.key && "is-active"),
            onClick: () => Je(s.key),
            children: s.label
          },
          s.key
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: P("apya-docs-shell", K !== "files" && "is-wide"), children: [
          /* @__PURE__ */ e.jsx(
            Xa,
            {
              loading: x,
              tree: ue,
              activeKey: l.key,
              expanded: d,
              onToggle: Be,
              onSelect: va,
              onDropFiles: pa,
              dragTarget: sa,
              setDragTarget: ta
            }
          ),
          K === "compliance" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(
            fs,
            {
              projectId: T,
              periodCode: null,
              onSummaryChange: Ze,
              documentTypes: r
            }
          ) }) : K === "activity" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(ks, { projectId: T, documentFileId: null }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "apya-grid-toolbar", style: { padding: "12px 14px", borderBottom: "1px solid var(--apya-border-subtle)" }, children: [
              /* @__PURE__ */ e.jsx(
                A,
                {
                  size: "sm",
                  className: "apya-grid-search",
                  leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
                  placeholder: "Bu bağlamda filtrele",
                  value: F,
                  onChange: (s) => {
                    ee(s.target.value), ce(0);
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-grid-count apya-numeric", children: [
                I,
                " belge"
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-viewtoggle", children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: P(Q === "list" && "is-active"),
                    onClick: () => we("list"),
                    "aria-label": "Liste görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: P(Q === "grid" && "is-active"),
                    onClick: () => we("grid"),
                    "aria-label": "Kart görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-border-all" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              ns,
              {
                loading: M,
                files: o,
                totalCount: I,
                view: Q,
                sorting: J,
                onSort: (s) => {
                  Ve(s), ce(0);
                },
                selectedId: Ce,
                onSelect: ca,
                checkedIds: Y,
                onToggleCheck: ka,
                onToggleAll: ja,
                page: Z,
                pageSize: be,
                onPageChange: ce,
                onDragStart: ma,
                emptyHint: S ? 'Dosyaları buraya sürükleyin ya da "Yükle" ile ekleyin.' : "Sol taraftan bir klasör seçin; yükleme klasör bağlamında yapılır.",
                missingItems: la,
                onUploadMissing: fa,
                canUpload: de,
                isTrash: L,
                onRestore: ha
              }
            ),
            ra && /* @__PURE__ */ e.jsx(
              ls,
              {
                count: Y.size,
                onClear: () => H(/* @__PURE__ */ new Set()),
                onMove: ya,
                onTag: xa
              }
            )
          ] }),
          K === "files" && /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx(
            cs,
            {
              detail: Xe,
              loading: ea,
              canEdit: ia,
              documentTypes: r,
              saving: aa,
              onSave: da,
              onDelete: oa ? ye : () => {
              }
            }
          ) })
        ] }),
        ae && /* @__PURE__ */ e.jsx(
          bs,
          {
            title: "Belge silinecek",
            message: `"${ae.displayName}" ve tüm versiyonları çöp kutusuna taşınacak. Sol alttaki "Çöp kutusu"ndan geri alabilirsiniz.`,
            onConfirm: ua,
            onCancel: () => ye(null)
          }
        ),
        Te && /* @__PURE__ */ e.jsx(js, { message: Te, onDone: () => Ee(null) })
      ]
    }
  );
}
const Ke = document.getElementById("documents-island");
Ke && Sa(Ke).render(/* @__PURE__ */ e.jsx(Ss, {}));
