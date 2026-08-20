import { j as e, r as i, b as Ra } from "./react-vendor.js";
/* empty css      */
import { S as Ke, B as E, g as L, h as Ba, I as O } from "./Dialog.js";
import { S as ce } from "./SkeletonShape.js";
import { E as re } from "./EmptyState.js";
import { H as Se } from "./Hint.js";
const $a = () => {
  var a, t, n;
  return (n = (t = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : t.documents) == null ? void 0 : n.document;
}, ie = (a) => {
  var t, n;
  return (n = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.auth) == null ? void 0 : n.isGranted(a);
}, I = (a, t) => {
  var n, u, r;
  return (r = (u = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.notify) == null ? void 0 : u[a]) == null ? void 0 : r.call(u, t);
}, oe = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function B(a) {
  return new Promise((t, n) => {
    window.abp.ajax(a).done(t).fail(n);
  });
}
const S = (a, t = {}) => {
  const n = new URLSearchParams();
  Object.entries(t).forEach(([r, m]) => {
    if (!(m == null || m === "")) {
      if (Array.isArray(m)) {
        m.forEach((y) => n.append(r, y));
        return;
      }
      n.append(r, m);
    }
  });
  const u = n.toString();
  return `${oe()}Documents?handler=${a}${u ? "&" + u : ""}`;
}, M = (a, t) => B({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(t) }), we = (a) => B({ url: S("Files", a), type: "GET" }), qe = (a) => B({ url: S("File", { id: a }), type: "GET" }), Fa = (a, t) => M(S("UpdateFileMeta", { id: a }), t), Aa = (a, t) => B({ url: S("MoveFile", { id: a, targetDocumentId: t }), type: "POST" }), Ge = (a, t) => M(S("BulkMove"), { documentFileIds: a, targetDocumentId: t }), Ma = (a, t, n = !1) => M(S("BulkTag"), { documentFileIds: a, tags: t, remove: n }), La = (a) => B({ url: S("DeleteFile", { id: a }), type: "POST" }), Oa = (a) => B({ url: S("RestoreFile", { id: a }), type: "POST" }), Wa = () => B({ url: S("DocumentTypes"), type: "GET" }), Ua = (a) => B({ url: S("WorkSteps", { projectId: a }), type: "GET" }), Ka = (a) => B({ url: S("CompliancePackages", { projectId: a }), type: "GET" }), Xe = (a, t) => B({ url: S("ComplianceOverview", { projectId: a, periodCode: t }), type: "GET" }), qa = (a, t, n) => M(S("ApplyCompliancePackage"), { projectId: a, packageId: t, periodCode: n }), Ga = (a) => B({ url: S("RemoveComplianceAssignment", { assignmentId: a }), type: "POST" }), Ya = (a) => M(S("WaiveComplianceItem"), a), _a = (a) => M(S("LinkComplianceDocument"), a), Ha = (a) => B({ url: S("Suggestions", { projectId: a }), type: "GET" }), Ye = (a) => M(S("ApplySuggestions"), { suggestions: a }), Va = (a) => M(S("DismissSuggestions"), { suggestions: a }), Ja = (a) => B({ url: S("ProjectTasks", { projectId: a }), type: "GET" }), Qa = (a) => B({ url: S("ComplianceRequirements", { packageId: a }), type: "GET" }), Za = (a) => M(S("CreateCompliancePackage"), a), Xa = (a, t) => M(S("UpdateCompliancePackage", { id: a }), t), es = (a) => B({ url: S("DeleteCompliancePackage", { id: a }), type: "POST" }), as = (a, t) => M(S("AddComplianceRequirement", { packageId: a }), t), ss = (a, t) => M(S("UpdateComplianceRequirement", { id: a }), t), ts = (a) => B({ url: S("DeleteComplianceRequirement", { id: a }), type: "POST" }), ns = (a) => B({ url: S("Activity", a), type: "GET" }), ls = (a, t) => {
  const n = new FormData();
  return n.append("documentId", a), n.append("file", t), B({
    url: S("UploadFile"),
    type: "POST",
    data: n,
    contentType: !1,
    processData: !1
  });
}, P = (...a) => a.filter(Boolean).join(" "), q = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  money: (a, t) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + (t ? " " + is(t) : ""),
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toFixed(1) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
};
function is(a) {
  return { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }[a] || a;
}
const ae = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Kesin", chip: "apya-chip-positive" },
  3: { text: "Eşleşti", chip: "apya-chip-accent" },
  4: { text: "Süre dolan", chip: "apya-chip-negative" }
}, _e = {
  1: { text: "Manuel", variant: "neutral" },
  2: { text: "OCR", variant: "brand" },
  3: { text: "AI", variant: "accent" },
  4: { text: "Kural", variant: "warning" }
}, rs = {
  1: "Yüklendi",
  2: "İndirildi",
  3: "Silindi",
  4: "Görüntülendi",
  5: "Meta değişti",
  6: "Taşındı"
};
function ze(a, t) {
  var u;
  const n = ((u = (t || "").split(".").pop()) == null ? void 0 : u.toLowerCase()) || "";
  return a != null && a.includes("pdf") || n === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444", label: "PDF" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(n) ? { icon: "fa-file-excel", color: "#10B981", label: "XLS" } : a != null && a.includes("word") || ["docx", "doc"].includes(n) ? { icon: "fa-file-word", color: "#3B82F6", label: "DOC" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(n) ? { icon: "fa-file-powerpoint", color: "#F59E0B", label: "PPT" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(n) ? { icon: "fa-file-image", color: "#8B5CF6", label: "IMG" } : ["zip", "rar", "7z"].includes(n) ? { icon: "fa-file-zipper", color: "#6B7280", label: "ZIP" } : { icon: "fa-file", color: "#6B7280", label: "DOSYA" };
}
function os(a) {
  const t = ["apya-chip-accent", "apya-chip-brand", "apya-chip-positive", "apya-chip-warning", "apya-chip-neutral"];
  let n = 0;
  for (let u = 0; u < a.length; u++) n = n * 31 + a.charCodeAt(u) >>> 0;
  return t[n % t.length];
}
const cs = [
  { key: "expiring", label: "Süresi dolanlar", icon: "fa-clock-rotate-left" },
  { key: "missing-meta", label: "Eksik meta", icon: "fa-triangle-exclamation" },
  { key: "suggested", label: "Öneri bekleyen", icon: "fa-wand-magic-sparkles" },
  { key: "trash", label: "Çöp kutusu", icon: "fa-trash-can" }
];
function ea({
  node: a,
  depth: t,
  activeKey: n,
  expanded: u,
  onToggle: r,
  onSelect: m,
  onDropFiles: y,
  dragTarget: h,
  setDragTarget: o
}) {
  var b;
  const v = ((b = a.children) == null ? void 0 : b.length) > 0, g = u.has(a.key), j = h === a.documentId && a.documentId;
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m(a),
        onDragOver: (k) => {
          a.documentId && (k.preventDefault(), o(a.documentId));
        },
        onDragLeave: () => o(null),
        onDrop: (k) => {
          a.documentId && (k.preventDefault(), o(null), y(a.documentId));
        },
        className: P("apya-md-item", n === a.key && "selected"),
        style: {
          paddingLeft: 10 + t * 14,
          borderRadius: 8,
          ...j ? { outline: "2px dashed var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
        },
        children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              role: "button",
              tabIndex: -1,
              onClick: (k) => {
                k.stopPropagation(), v && r(a.key);
              },
              className: "w-3 flex-shrink-0",
              style: { color: "var(--apya-text-tertiary)" },
              children: v && /* @__PURE__ */ e.jsx("i", { className: `fa fa-chevron-${g ? "down" : "right"}`, style: { fontSize: 9 } })
            }
          ),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${a.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: a.label }),
          typeof a.count == "number" && /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: a.count })
        ]
      }
    ),
    v && g && a.children.map((k) => /* @__PURE__ */ e.jsx(
      ea,
      {
        node: k,
        depth: t + 1,
        activeKey: n,
        expanded: u,
        onToggle: r,
        onSelect: m,
        onDropFiles: y,
        dragTarget: h,
        setDragTarget: o
      },
      k.key
    ))
  ] });
}
function ds({
  loading: a,
  tree: t,
  activeKey: n,
  expanded: u,
  onToggle: r,
  onSelect: m,
  onDropFiles: y,
  dragTarget: h,
  setDragTarget: o
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Bağlam" }),
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m({ key: "all", kind: "all" }),
        className: P("apya-md-item", n === "all" && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-tree", style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", style: { fontWeight: 600 }, children: "Tüm Dokümanlar" })
        ]
      }
    ),
    a ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(ce, { rows: 5 }) }) : t.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör yok." }) : t.map((v) => /* @__PURE__ */ e.jsx(
      ea,
      {
        node: v,
        depth: 0,
        activeKey: n,
        expanded: u,
        onToggle: r,
        onSelect: m,
        onDropFiles: y,
        dragTarget: h,
        setDragTarget: o
      },
      v.key
    )),
    /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Akıllı klasörler" }),
    cs.map((v) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m({ key: v.key, kind: "smart", smart: v.key }),
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
const aa = [
  { key: "displayName", label: "Belge", sortable: !0, width: "minmax(0,1fr)" },
  { key: "workStep", label: "İş adımı", sortable: !1, width: "140px" },
  { key: "type", label: "Tür", sortable: !1, width: "96px" },
  { key: "amount", label: "Tutar", sortable: !0, width: "116px", align: "right" },
  { key: "documentDate", label: "Tarih", sortable: !0, width: "96px" },
  { key: "status", label: "Durum", sortable: !1, width: "110px" }
], Ie = `34px ${aa.map((a) => a.width).join(" ")}`;
function us({ column: a, sorting: t, onSort: n }) {
  if (!a.sortable)
    return /* @__PURE__ */ e.jsx("span", { style: { textAlign: a.align || "left" }, children: a.label });
  const [u, r] = (t || "").split(" "), m = u === a.key, y = m && r !== "desc" ? "desc" : "asc";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => n(`${a.key} ${y}`),
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
      "aria-sort": m ? r === "desc" ? "descending" : "ascending" : "none",
      children: [
        a.label,
        /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${m ? r === "desc" ? "arrow-down" : "arrow-up" : "arrows-up-down"}`,
            style: { fontSize: 8, opacity: m ? 1 : 0.4 }
          }
        )
      ]
    }
  );
}
function ms({ item: a, onUpload: t, canUpload: n }) {
  const u = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || "Proje";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-missing-row", style: { gridTemplateColumns: Ie }, children: [
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
function ps({ file: a, selected: t, checked: n, onSelect: u, onToggleCheck: r, onDragStart: m, isTrash: y, onRestore: h }) {
  const o = ze(a.contentType, a.fileName), v = ae[a.status] || ae[1];
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !y,
      onDragStart: y ? void 0 : () => m(a),
      onClick: y ? void 0 : () => u(a),
      className: P("apya-doc-row", t && "is-selected", y && "is-trashed"),
      style: { gridTemplateColumns: Ie },
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            onClick: y ? void 0 : (g) => {
              g.stopPropagation(), r(a.id);
            },
            style: { cursor: y ? "default" : "pointer" },
            children: y ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash-can", style: { fontSize: 12, color: "var(--apya-text-tertiary)" } }) : /* @__PURE__ */ e.jsx(
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
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(L, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] }),
          a.isLocked && /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock", style: { fontSize: 10, color: "var(--apya-text-tertiary)" }, title: "Kilitli" })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: a.documentTypeName || "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right" }, children: q.money(a.amount, a.currency) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: q.date(a.documentDate || a.creationTime) }),
        /* @__PURE__ */ e.jsx("span", { children: y ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => h(a), children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-rotate-left" }),
          " Geri al"
        ] }) : /* @__PURE__ */ e.jsx("span", { className: P("apya-chip", v.chip), children: v.text }) })
      ]
    }
  );
}
function ys({ file: a, selected: t, onSelect: n, onDragStart: u }) {
  const r = ze(a.contentType, a.fileName), m = ae[a.status] || ae[1];
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
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(L, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", style: { borderTop: "none", paddingTop: 0 }, children: [
          /* @__PURE__ */ e.jsx("span", { className: P("apya-chip", m.chip), children: m.text }),
          a.amount !== null && a.amount !== void 0 && /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: q.money(a.amount, a.currency) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", children: a.uploaderName || "Sistem" }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", children: q.date(a.documentDate || a.creationTime) })
        ] })
      ]
    }
  );
}
function xs({
  loading: a,
  files: t,
  totalCount: n,
  view: u,
  sorting: r,
  onSort: m,
  selectedId: y,
  onSelect: h,
  checkedIds: o,
  onToggleCheck: v,
  onToggleAll: g,
  page: j,
  pageSize: b,
  onPageChange: k,
  onDragStart: x,
  emptyHint: R,
  missingItems: A = [],
  onUploadMissing: p,
  canUpload: w = !1,
  isTrash: l = !1,
  onRestore: N
}) {
  const C = t.length > 0 && t.every((d) => o.has(d.id)), T = Math.max(1, Math.ceil(n / b)), W = j === 0 && u === "list" ? A : [];
  return a ? u === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: Array.from({ length: 6 }).map((d, $) => /* @__PURE__ */ e.jsx(Ke, { height: 120, rounded: "lg" }, $)) }) : /* @__PURE__ */ e.jsx("div", { className: "p-3 d-flex flex-column gap-2", children: Array.from({ length: 8 }).map((d, $) => /* @__PURE__ */ e.jsx(Ke, { height: 40, rounded: "md" }, $)) }) : t.length === 0 && W.length === 0 ? /* @__PURE__ */ e.jsx(
    re,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
      title: "Burada henüz belge yok",
      description: R
    }
  ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    u === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: t.map((d) => /* @__PURE__ */ e.jsx(
      ys,
      {
        file: d,
        selected: y === d.id,
        onSelect: h,
        onDragStart: x
      },
      d.id
    )) }) : /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-row-head", style: { gridTemplateColumns: Ie }, children: [
        /* @__PURE__ */ e.jsx("span", { onClick: g, style: { cursor: "pointer" }, children: /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${C ? "square-check" : "square"}`,
            style: { fontSize: 13, color: C ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
            role: "checkbox",
            "aria-checked": C
          }
        ) }),
        aa.map((d) => /* @__PURE__ */ e.jsx(us, { column: d, sorting: r, onSort: m }, d.key))
      ] }),
      W.map((d) => /* @__PURE__ */ e.jsx(
        ms,
        {
          item: d,
          onUpload: p,
          canUpload: w
        },
        `missing-${d.assignmentId}-${d.requirementId}-${d.workStepId || "none"}`
      )),
      t.map((d) => /* @__PURE__ */ e.jsx(
        ps,
        {
          file: d,
          selected: y === d.id,
          checked: o.has(d.id),
          onSelect: h,
          onToggleCheck: v,
          onDragStart: x,
          isTrash: l,
          onRestore: N
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
            j * b + 1,
            "–",
            Math.min((j + 1) * b, n),
            " / ",
            n
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: j === 0, onClick: () => k(j - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              j + 1,
              " / ",
              T
            ] }),
            /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: j + 1 >= T, onClick: () => k(j + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
function hs({ count: a, onClear: t, onMove: n, onTag: u, busy: r }) {
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
function fs({ tags: a }) {
  return a != null && a.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1", children: a.map((t) => /* @__PURE__ */ e.jsx("span", { className: P("apya-chip", os(t)), children: t }, t)) }) : null;
}
const He = {
  1: { icon: "fa-diagram-project", label: "Proje" },
  2: { icon: "fa-list-check", label: "İş adımı" },
  3: { icon: "fa-receipt", label: "Harcama", href: (a) => a ? `${oe()}Expenses` : null },
  4: {
    icon: "fa-box-archive",
    label: "Teslim paketi",
    href: (a) => a ? `${oe()}Documents/Deliveries?packageId=${a}` : null
  },
  5: { icon: "fa-clipboard-check", label: "Kontrol listesi kalemi" }
};
function gs({ field: a, value: t, onChange: n, disabled: u }) {
  const r = { size: "sm", disabled: u, value: t ?? "" };
  switch (a.fieldType) {
    case 2:
      return /* @__PURE__ */ e.jsx(O, { ...r, type: "date", onChange: (m) => n({ valueDate: m.target.value || null }) });
    case 3:
    case 4:
    case 5:
      return /* @__PURE__ */ e.jsx(
        O,
        {
          ...r,
          type: "number",
          step: a.fieldType === 3 ? "0.01" : "1",
          onChange: (m) => n({ valueNumber: m.target.value === "" ? null : Number(m.target.value) })
        }
      );
    default:
      return /* @__PURE__ */ e.jsx(O, { ...r, onChange: (m) => n({ valueText: m.target.value || null }) });
  }
}
function vs(a) {
  return a.fieldType === 2 ? a.valueDate ? a.valueDate.substring(0, 10) : "" : [3, 4, 5].includes(a.fieldType) ? a.valueNumber ?? "" : a.valueText ?? "";
}
function ks({
  detail: a,
  loading: t,
  canEdit: n,
  onSave: u,
  onDelete: r,
  saving: m,
  documentTypes: y
}) {
  var x, R, A;
  const [h, o] = i.useState(null);
  if (i.useEffect(() => {
    o(a ? { ...a, fields: (a.fields || []).map((p) => ({ ...p })) } : null);
  }, [a == null ? void 0 : a.id]), t)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(ce, { rows: 6 }) });
  if (!a || !h)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(
      re,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir belge seçin",
        description: "Künye, özel alanlar ve versiyon geçmişi burada görünür."
      }
    ) });
  const v = ze(a.contentType, a.fileName), g = ae[h.status] || ae[1], j = q.daysLeft(h.expiryDate), b = (p, w) => {
    o((l) => ({
      ...l,
      fields: l.fields.map((N) => N.fieldId === p ? { ...N, valueText: null, valueNumber: null, valueDate: null, ...w } : N)
    }));
  }, k = h.fields.filter(
    (p) => p.isRequired && !p.valueText && p.valueNumber === null && !p.valueDate
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
          q.size(a.fileSize),
          " · ",
          v.label,
          a.versionCount > 1 && ` · v${a.versionCount}`
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-1 mt-1 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: P("apya-chip", g.chip), children: g.text }),
          j !== null && j >= 0 && j <= 30 && /* @__PURE__ */ e.jsxs(L, { variant: "warning", size: "sm", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
            " ",
            j,
            " gün"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-3", children: [
      a.downloadUrl && /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: Ba({ variant: "primary" }), style: { flex: 1 }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }),
      n && !a.isLocked && /* @__PURE__ */ e.jsx(E, { variant: "outline", onClick: () => r(a), title: "Sil", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash", style: { color: "var(--apya-negative-500)" } }) })
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
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: q.dateTime(a.creationTime) })
      ] }),
      a.retentionUntil && /* @__PURE__ */ e.jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Saklama" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: q.date(a.retentionUntil) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Özel alanlar",
        /* @__PURE__ */ e.jsx(Se, { text: "Alan şeması belge tipine bağlıdır. Tip değiştirdiğinizde kaydettikten sonra o tipin alanları görünür." })
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
              onChange: (p) => o({ ...h, documentTypeId: p.target.value || null }),
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "— Sınıflandırılmamış —" }),
                y.map((p) => /* @__PURE__ */ e.jsx("option", { value: p.id, children: p.name }, p.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Tutar" }),
          /* @__PURE__ */ e.jsx(
            O,
            {
              size: "sm",
              type: "number",
              step: "0.01",
              disabled: !n || a.isLocked,
              value: h.amount ?? "",
              onChange: (p) => o({ ...h, amount: p.target.value === "" ? null : Number(p.target.value) })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tarihi" }),
          /* @__PURE__ */ e.jsx(
            O,
            {
              size: "sm",
              type: "date",
              disabled: !n || a.isLocked,
              value: h.documentDate ? h.documentDate.substring(0, 10) : "",
              onChange: (p) => o({ ...h, documentDate: p.target.value || null })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Dönem" }),
          /* @__PURE__ */ e.jsx(
            O,
            {
              size: "sm",
              placeholder: "2026-Q2",
              disabled: !n || a.isLocked,
              value: h.periodCode ?? "",
              onChange: (p) => o({ ...h, periodCode: p.target.value || null })
            }
          )
        ] }),
        h.fields.map((p) => {
          var w, l;
          return /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              p.label,
              p.isRequired && /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-negative-500)" }, children: "*" }),
              /* @__PURE__ */ e.jsx(L, { variant: ((w = _e[p.fillSource]) == null ? void 0 : w.variant) || "neutral", size: "sm", children: ((l = _e[p.fillSource]) == null ? void 0 : l.text) || "—" }),
              p.confidence !== null && p.confidence !== void 0 && /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10 }, children: [
                "%",
                p.confidence
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              gs,
              {
                field: p,
                value: vs(p),
                disabled: !n || a.isLocked,
                onChange: (N) => b(p.fieldId, N)
              }
            )
          ] }, p.fieldId);
        })
      ] }),
      k.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", style: { fontSize: 11, color: "var(--apya-warning-500)" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation" }),
        " ",
        k.length,
        " zorunlu alan boş."
      ] }),
      n && !a.isLocked && /* @__PURE__ */ e.jsx(
        E,
        {
          variant: "primary",
          size: "sm",
          className: "mt-3 w-100",
          isLoading: m,
          onClick: () => u(h),
          children: "Kaydet"
        }
      )
    ] }),
    ((x = a.tags) == null ? void 0 : x.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Etiketler" }),
      /* @__PURE__ */ e.jsx(fs, { tags: a.tags })
    ] }),
    ((R = a.related) == null ? void 0 : R.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "İlişkili kayıtlar",
        /* @__PURE__ */ e.jsx(Se, { text: "Belgenin bağlandığı harcama, içinde gittiği teslim paketi ve karşıladığı kontrol listesi kalemleri." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.related.map((p, w) => {
        var T;
        const l = He[p.kind] ?? He[3], N = (T = l.href) == null ? void 0 : T.call(l, p.entityId), C = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 22, height: 22, borderRadius: 6, background: "var(--apya-surface-sunken)", color: "var(--apya-text-secondary)", fontSize: 10 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${l.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12 }, children: p.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "d-block text-truncate apya-numeric",
                style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" },
                children: [l.label, p.detail].filter(Boolean).join(" · ")
              }
            )
          ] })
        ] });
        return N ? /* @__PURE__ */ e.jsx(
          "a",
          {
            href: N,
            className: "d-flex align-items-center gap-2 text-decoration-none",
            style: { color: "inherit" },
            children: C
          },
          `${p.kind}-${p.entityId}-${w}`
        ) : /* @__PURE__ */ e.jsx("div", { className: "d-flex align-items-center gap-2", children: C }, `${p.kind}-${w}`);
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Versiyonlar",
        /* @__PURE__ */ e.jsx(Se, { text: "Aynı klasöre aynı isimle yeniden yüklenen dosya yeni versiyon olur; önceki versiyonlar burada kalır." })
      ] }),
      (A = a.versions) != null && A.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1", children: a.versions.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsxs(L, { variant: p.isLatest ? "brand" : "neutral", size: "sm", children: [
            "v",
            p.versionNumber
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { color: "var(--apya-text-secondary)" }, children: p.uploaderName })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { color: "var(--apya-text-tertiary)" }, children: q.date(p.creationTime) })
      ] }, p.id)) }) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Versiyon kaydı yok." })
    ] })
  ] });
}
const sa = [
  { value: 1, label: "Proje geneli" },
  { value: 2, label: "Her iş adımı için" },
  { value: 3, label: "Her dönem için" }
], ta = [
  { value: 2, label: "Klasör şeması" },
  { value: 3, label: "Task eki" }
], js = {
  title: "",
  scope: 1,
  documentTypeId: "",
  isBlocking: !1,
  order: 0,
  source: 2,
  sourceEntityId: ""
};
function bs({ draft: a, setDraft: t, documentTypes: n, tasks: u, onSubmit: r, onCancel: m, busy: y }) {
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
          O,
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
              children: ta.map((o) => /* @__PURE__ */ e.jsx("option", { value: o.value, children: o.label }, o.value))
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.scope,
              onChange: (o) => t({ ...a, scope: Number(o.target.value) }),
              "aria-label": "Kapsam",
              children: sa.map((o) => /* @__PURE__ */ e.jsx("option", { value: o.value, children: o.label }, o.value))
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
          /* @__PURE__ */ e.jsx(E, { type: "button", variant: "outline", size: "sm", onClick: m, children: "Vazgeç" }),
          /* @__PURE__ */ e.jsx(E, { type: "submit", size: "sm", isLoading: y, disabled: !a.title.trim(), children: "Kaydet" })
        ] })
      ]
    }
  );
}
function Ns({ pkg: a, projectId: t, documentTypes: n, onClose: u, onChanged: r }) {
  const [m, y] = i.useState([]), [h, o] = i.useState([]), [v, g] = i.useState(!0), [j, b] = i.useState(!1), [k, x] = i.useState({
    name: a.name,
    issuer: a.issuer,
    description: a.description || "",
    order: a.order || 0
  }), [R, A] = i.useState(null), [p, w] = i.useState(null), l = i.useCallback(async () => {
    g(!0);
    try {
      const [d, $] = await Promise.all([
        Qa(a.id),
        // Görev listesi yalnız proje bağlamında anlamlı; yoksa "task eki"
        // kaynağı seçilebilir ama liste boş kalır.
        t ? Ja(t) : Promise.resolve([])
      ]);
      y(d ?? []), o($ ?? []);
    } catch (d) {
      I("error", "Paket kalemleri yüklenemedi."), console.error("[Documents] package requirements", d);
    } finally {
      g(!1);
    }
  }, [a.id, t]);
  i.useEffect(() => {
    l();
  }, [l]);
  const N = async () => {
    b(!0);
    try {
      await Xa(a.id, {
        name: k.name,
        issuer: k.issuer,
        description: k.description || null,
        order: k.order
      }), I("success", "Paket güncellendi."), r == null || r();
    } catch (d) {
      I("error", "Paket güncellenemedi."), console.error("[Documents] update package", d);
    } finally {
      b(!1);
    }
  }, C = async () => {
    b(!0);
    try {
      const d = {
        title: R.title.trim(),
        scope: Number(R.scope),
        documentTypeId: R.documentTypeId || null,
        isBlocking: R.isBlocking,
        order: Number(R.order) || m.length,
        source: Number(R.source),
        sourceEntityId: R.sourceEntityId || null
      };
      p ? await ss(p, d) : await as(a.id, d), A(null), w(null), await l(), r == null || r();
    } catch (d) {
      I("error", "Kalem kaydedilemedi."), console.error("[Documents] save requirement", d);
    } finally {
      b(!1);
    }
  }, T = async (d) => {
    b(!0);
    try {
      await ts(d), await l(), r == null || r();
    } catch ($) {
      I("error", "Kalem silinemedi."), console.error("[Documents] delete requirement", $);
    } finally {
      b(!1);
    }
  }, W = async () => {
    var d, $;
    if (window.confirm(`"${a.name}" paketi silinecek. Emin misiniz?`)) {
      b(!0);
      try {
        await es(a.id), r == null || r(), u();
      } catch (F) {
        I("error", (($ = (d = F == null ? void 0 : F.responseJSON) == null ? void 0 : d.error) == null ? void 0 : $.message) || "Paket silinemedi."), console.error("[Documents] delete package", F);
      } finally {
        b(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Paketi düzenle" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: W, disabled: j, children: "Paketi sil" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: u, children: "Kapat" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx(
        O,
        {
          size: "sm",
          placeholder: "Paket adı",
          value: k.name,
          onChange: (d) => x({ ...k, name: d.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(
        O,
        {
          size: "sm",
          placeholder: "İsteyen taraf (ör. İç politika)",
          value: k.issuer,
          onChange: (d) => x({ ...k, issuer: d.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(E, { size: "sm", variant: "outline", isLoading: j, onClick: N, children: "Kaydet" })
    ] }),
    v ? /* @__PURE__ */ e.jsx(ce, { rows: 4 }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-list", children: [
      m.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "p-2", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette henüz kalem yok." }),
      m.map((d) => {
        var $, F;
        return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", children: [
          /* @__PURE__ */ e.jsx("span", { className: P("apya-chip", d.isBlocking ? "apya-chip-warning" : "apya-chip-neutral"), children: d.isBlocking ? "bloke eden" : "normal" }),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: d.title }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              (($ = ta.find((se) => se.value === d.source)) == null ? void 0 : $.label) || "kurum şablonu",
              d.sourceEntityName && ` · ${d.sourceEntityName}`,
              " · ",
              (F = sa.find((se) => se.value === d.scope)) == null ? void 0 : F.label,
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
                disabled: j,
                onClick: () => {
                  w(d.id), A({
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
                disabled: j,
                onClick: () => T(d.id),
                children: "Sil"
              }
            )
          ] })
        ] }, d.id);
      })
    ] }),
    R ? /* @__PURE__ */ e.jsx(
      bs,
      {
        draft: R,
        setDraft: A,
        documentTypes: n,
        tasks: h,
        onSubmit: C,
        onCancel: () => {
          A(null), w(null);
        },
        busy: j
      }
    ) : /* @__PURE__ */ e.jsx(
      E,
      {
        size: "sm",
        variant: "outline",
        leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
        onClick: () => {
          w(null), A({ ...js, order: m.length });
        },
        children: "Kalem ekle"
      }
    )
  ] });
}
function Ss({ packages: a, projectId: t, documentTypes: n, onChanged: u }) {
  const [r, m] = i.useState(null), [y, h] = i.useState(!1), [o, v] = i.useState(""), [g, j] = i.useState(!1), b = a.filter((x) => x.isEditable), k = async () => {
    j(!0);
    try {
      const x = await Za({
        name: o.trim(),
        issuer: "İç politika",
        description: null,
        order: b.length
      });
      v(""), h(!1), u == null || u(), m(x);
    } catch (x) {
      I("error", "Paket oluşturulamadı."), console.error("[Documents] create package", x);
    } finally {
      j(!1);
    }
  };
  return r ? /* @__PURE__ */ e.jsx(
    Ns,
    {
      pkg: r,
      projectId: t,
      documentTypes: n,
      onClose: () => m(null),
      onChanged: u
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
        O,
        {
          size: "sm",
          autoFocus: !0,
          placeholder: "Paket adı (ör. Şirket klasör şeması)",
          value: o,
          onChange: (x) => v(x.target.value),
          onKeyDown: (x) => {
            x.key === "Enter" && o.trim() && k();
          }
        }
      ),
      /* @__PURE__ */ e.jsx(E, { size: "sm", isLoading: g, disabled: !o.trim(), onClick: k, children: "Oluştur" }),
      /* @__PURE__ */ e.jsx(E, { size: "sm", variant: "outline", onClick: () => {
        h(!1), v("");
      }, children: "Vazgeç" })
    ] }),
    b.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Henüz kendi paketiniz yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: b.map((x) => /* @__PURE__ */ e.jsxs(E, { variant: "outline", size: "sm", onClick: () => m(x), children: [
      x.name,
      /* @__PURE__ */ e.jsx(L, { variant: "neutral", size: "sm", children: x.requirementCount })
    ] }, x.id)) })
  ] });
}
const Ve = {
  1: { text: "Karşılandı", chip: "apya-chip-positive", icon: "fa-check" },
  2: { text: "Eksik", chip: "apya-chip-warning", icon: "fa-triangle-exclamation" },
  3: { text: "Feragat", chip: "apya-chip-neutral", icon: "fa-ban" }
}, ws = { 1: "Proje", 2: "İş adımı", 3: "Dönem" }, Je = {
  1: "kurum şablonu",
  2: "klasör şeması",
  3: "task eki"
};
function Cs({ percent: a, blocking: t }) {
  const n = t > 0 ? "var(--apya-negative-500)" : a >= 90 ? "var(--apya-positive-500)" : "var(--apya-warning-500)";
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", role: "progressbar", "aria-valuenow": a, "aria-valuemin": 0, "aria-valuemax": 100, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a}%`, background: n } }) });
}
function zs({ item: a, canManage: t, onWaive: n, busy: u }) {
  const r = Ve[a.status] || Ve[2], m = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || ws[a.scope];
  return /* @__PURE__ */ e.jsxs("div", { className: P("apya-doc-check-row", a.status === 2 && a.isBlocking && "is-blocking"), children: [
    /* @__PURE__ */ e.jsxs("span", { className: P("apya-chip", r.chip), children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa ${r.icon}` }),
      " ",
      r.text
    ] }),
    /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.title }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
        Je[a.source] || Je[1],
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
function Is({ projectId: a, periodCode: t, onSummaryChange: n, documentTypes: u = [] }) {
  const [r, m] = i.useState(null), [y, h] = i.useState([]), [o, v] = i.useState(!0), [g, j] = i.useState(!1), b = ie("Platform.Documents.ManageCompliance"), k = i.useCallback(async () => {
    if (!a) {
      m(null), v(!1);
      return;
    }
    v(!0);
    try {
      const [l, N] = await Promise.all([
        Xe(a, t),
        Ka(a)
      ]);
      m(l), h(N ?? []), n == null || n((l == null ? void 0 : l.summary) ?? null);
    } catch (l) {
      I("error", "Uygunluk verisi yüklenemedi."), console.error("[Documents] compliance load", l);
    } finally {
      v(!1);
    }
  }, [a, t, n]);
  i.useEffect(() => {
    k();
  }, [k]);
  const x = async (l) => {
    j(!0);
    try {
      await qa(a, l, t || null), await k();
    } catch (N) {
      I("error", "Paket uygulanamadı."), console.error("[Documents] applyPackage", N);
    } finally {
      j(!1);
    }
  }, R = async (l) => {
    j(!0);
    try {
      await Ga(l), await k();
    } catch (N) {
      I("error", "Paket kaldırılamadı."), console.error("[Documents] removeAssignment", N);
    } finally {
      j(!1);
    }
  }, A = async (l, N, C) => {
    const T = C ? window.prompt("Feragat gerekçesi:") : null;
    if (!(C && !T)) {
      j(!0);
      try {
        await Ya({
          assignmentId: l.assignmentId,
          requirementId: N.requirementId,
          workStepId: N.workStepId,
          periodCode: N.periodCode,
          waive: C,
          reason: T
        }), await k();
      } catch (W) {
        I("error", "İşlem başarısız oldu."), console.error("[Documents] waive", W);
      } finally {
        j(!1);
      }
    }
  };
  if (!a)
    return /* @__PURE__ */ e.jsx(
      re,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-check" }),
        title: "Önce bir proje bağlamı seçin",
        description: "Uygunluk, projeye uygulanan kurum paketleri üzerinden hesaplanır."
      }
    );
  if (o)
    return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(ce, { rows: 6 }) });
  const p = (r == null ? void 0 : r.checklists) ?? [], w = y.filter((l) => !l.isApplied);
  return /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
    p.length === 0 ? /* @__PURE__ */ e.jsx(
      re,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-list" }),
        title: "Bu projeye henüz kurum paketi uygulanmadı",
        description: "Aşağıdan bir paket seçerek kontrol listesini başlatın."
      }
    ) : p.map((l) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
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
          l.summary.blockingMissingCount > 0 && /* @__PURE__ */ e.jsxs(L, { variant: "negative", size: "sm", children: [
            l.summary.blockingMissingCount,
            " bloke"
          ] }),
          b && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: g,
              onClick: () => R(l.assignmentId),
              children: "Kaldır"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(Cs, { percent: l.summary.percent, blocking: l.summary.blockingMissingCount }),
      /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
        l.summary.satisfiedCount,
        " / ",
        l.summary.totalCount - l.summary.waivedCount,
        " kalem tamam",
        l.summary.waivedCount > 0 && ` · ${l.summary.waivedCount} feragat`
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-list", children: l.items.map((N, C) => /* @__PURE__ */ e.jsx(
        zs,
        {
          item: N,
          canManage: b,
          busy: g,
          onWaive: (T, W) => A(l, T, W)
        },
        `${N.requirementId}-${N.workStepId || N.periodCode || C}`
      )) })
    ] }, l.assignmentId)),
    b && /* @__PURE__ */ e.jsx(
      Ss,
      {
        packages: y,
        projectId: a,
        documentTypes: u,
        onChanged: k
      }
    ),
    b && w.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Uygulanabilir paketler" }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: w.map((l) => /* @__PURE__ */ e.jsxs(
        E,
        {
          variant: "outline",
          size: "sm",
          disabled: g,
          leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          onClick: () => x(l.id),
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
const le = 25, Ds = {
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
}, Ts = [
  { value: "", label: "Tümü" },
  { value: "1", label: "Yüklendi" },
  { value: "2", label: "İndirildi" },
  { value: "5", label: "Meta değişti" },
  { value: "3", label: "Silindi" }
];
function Es({ projectId: a, documentFileId: t }) {
  const [n, u] = i.useState([]), [r, m] = i.useState(0), [y, h] = i.useState(0), [o, v] = i.useState(""), [g, j] = i.useState(!0), b = i.useCallback(async () => {
    j(!0);
    try {
      const x = await ns({
        maxResultCount: le,
        skipCount: y * le,
        projectId: a || void 0,
        documentFileId: t || void 0,
        action: o || void 0
      });
      u(x.items ?? []), m(x.totalCount ?? 0);
    } catch (x) {
      I("error", "Etkinlik kaydı yüklenemedi."), console.error("[Documents] activity load", x);
    } finally {
      j(!1);
    }
  }, [a, t, o, y]);
  i.useEffect(() => {
    b();
  }, [b]);
  const k = Math.max(1, Math.ceil(r / le));
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center gap-2 flex-wrap px-3 py-2",
        style: { borderBottom: "1px solid var(--apya-border-subtle)" },
        children: [
          Ts.map((x) => /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: P("apya-doc-filterchip", o === x.value && "is-active"),
              onClick: () => {
                v(x.value), h(0);
              },
              children: x.label
            },
            x.value
          )),
          /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            r,
            " kayıt"
          ] })
        ]
      }
    ),
    g ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(ce, { rows: 8 }) }) : n.length === 0 ? /* @__PURE__ */ e.jsx(
      re,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left" }),
        title: "Henüz kayıtlı etkinlik yok",
        description: "Yükleme, indirme, meta değişikliği ve silme işlemleri burada iz bırakır."
      }
    ) : /* @__PURE__ */ e.jsx("div", { children: n.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", children: [
      /* @__PURE__ */ e.jsx("span", { className: P("apya-chip", Ds[x.action] || "apya-chip-neutral"), children: rs[x.action] || "—" }),
      /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: x.documentFileName || x.folderName || "—" }),
        x.detail && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: x.detail })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12 }, children: x.actorName }),
        x.actorRole && /* @__PURE__ */ e.jsx(L, { variant: "neutral", size: "sm", children: x.actorRole })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: q.dateTime(x.creationTime) })
    ] }, x.id)) }),
    k > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            y * le + 1,
            "–",
            Math.min((y + 1) * le, r),
            " / ",
            r
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: y === 0, onClick: () => h(y - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              y + 1,
              " / ",
              k
            ] }),
            /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: y + 1 >= k, onClick: () => h(y + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
const Qe = {
  1: "klasör",
  2: "belge tipi",
  3: "iş adımı",
  4: "dönem",
  5: "harcama kalemi"
};
function Ps(a) {
  return a >= 90 ? "positive" : a >= 70 ? "brand" : "warning";
}
function Rs({ summary: a, busy: t, onApplyAll: n, onApply: u, onDismiss: r, onReload: m }) {
  const [y, h] = i.useState(!1), o = (a == null ? void 0 : a.items) ?? [];
  if (o.length === 0) return null;
  const v = [...new Set(o.map((g) => Qe[g.kind]).filter(Boolean))];
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-suggestion-banner", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-suggestion-icon", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-wand-magic-sparkles" }) }),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
          a.documentCount,
          " dosya için ",
          v.join(", "),
          " önerisi hazır"
        ] }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Kural motoru ve harcama eşleşmesinden üretildi — uygulanmadan önce onayınızı bekler." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", onClick: () => h((g) => !g), children: y ? "Gizle" : "İncele" }),
      /* @__PURE__ */ e.jsx(E, { size: "sm", isLoading: t, onClick: n, children: "Tümünü uygula" })
    ] }),
    y && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-suggestion-list", children: [
      o.map((g) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-doc-suggestion-row",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5, minWidth: 0 }, children: g.documentFileName }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: [
              Qe[g.kind],
              " → ",
              /* @__PURE__ */ e.jsx("strong", { children: g.targetName || g.payload })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: g.reason }),
            /* @__PURE__ */ e.jsxs(L, { variant: Ps(g.confidence), size: "sm", children: [
              "%",
              g.confidence
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex gap-2 justify-content-end", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: t,
                  onClick: () => u(g),
                  children: "Uygula"
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: t,
                  onClick: () => r(g),
                  title: "Bu öneri bir daha gösterilmez",
                  children: "Yoksay"
                }
              )
            ] })
          ]
        },
        `${g.documentFileId}-${g.kind}-${g.payload}`
      )),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: P("apya-doc-linkbtn", "mt-1"), onClick: m, children: "Yenile" })
    ] })
  ] });
}
const Ce = 25, Bs = "00000000-0000-0000-0000-000000000000";
function $s({ message: a, onDone: t }) {
  return i.useEffect(() => {
    const n = setTimeout(t, 2800);
    return () => clearTimeout(n);
  }, [t]), /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-check", style: { fontSize: 11, color: "var(--apya-positive-500)" } }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: a })
  ] });
}
function Fs({ title: a, message: t, onConfirm: n, onCancel: u }) {
  const [r, m] = i.useState(!1);
  return /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: u, children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-dialog", onClick: (y) => y.stopPropagation(), children: [
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
      /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", onClick: u, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        E,
        {
          variant: "destructive",
          size: "sm",
          isLoading: r,
          onClick: async () => {
            m(!0), await n(), m(!1);
          },
          children: "Evet, sil"
        }
      )
    ] })
  ] }) });
}
function As({ uploadedThisMonth: a, expiring: t, compliance: n }) {
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
function Ms() {
  const [a, t] = i.useState([]), [n, u] = i.useState([]), [r, m] = i.useState([]), [y, h] = i.useState(!0), [o, v] = i.useState([]), [g, j] = i.useState(0), [b, k] = i.useState(null), [x, R] = i.useState(null), [A, p] = i.useState(!0), w = i.useMemo(() => new URLSearchParams(window.location.search), []), [l, N] = i.useState(() => {
    const s = w.get("smart");
    return s ? { key: s, kind: "smart", smart: s } : { key: "all", kind: "all" };
  }), C = l.kind === "folder" ? l.documentId : null, T = l.projectId || null, W = l.kind === "smart" && l.smart === "trash", [d, $] = i.useState(/* @__PURE__ */ new Set()), [F, se] = i.useState(w.get("q") || ""), [Q, na] = i.useState(w.get("sort") || "creationTime desc"), [Z, De] = i.useState(w.get("view") === "grid" ? "grid" : "list"), [X, de] = i.useState(Number(w.get("page")) || 0), [G, la] = i.useState(() => {
    const s = w.get("tab");
    return ["files", "compliance", "activity"].includes(s) ? s : "files";
  }), [ia, ra] = i.useState(null), [Te, Ee] = i.useState(null), [oa, ye] = i.useState(null), [ca, Pe] = i.useState(!1), [da, Re] = i.useState(!1), [Y, V] = i.useState(/* @__PURE__ */ new Set()), [ua, ma] = i.useState(null), xe = i.useRef([]), [te, he] = i.useState(null), [Be, $e] = i.useState(null), [pa, Fe] = i.useState(!1), fe = i.useRef(null), [_, Ae] = i.useState(null), [ya, Me] = i.useState(!1), [xa, ge] = i.useState([]), ve = i.useRef(null), ue = ie("Platform.Documents.Create"), Le = ie("Platform.Documents.ManageMeta"), ha = ie("Platform.Documents.BulkOperations"), fa = ie("Platform.Documents.Delete"), U = i.useCallback((s) => $e(s), []), ee = i.useCallback(async () => {
    h(!0);
    try {
      const [s, c, f] = await Promise.all([
        $a().getList({ maxResultCount: 1e3, sorting: "title asc" }),
        Ua(),
        Wa()
      ]);
      t(s.items ?? []), u(c ?? []), m(f ?? []);
    } catch (s) {
      I("error", "Klasör ağacı yüklenemedi."), console.error("[Documents] loadTree", s);
    } finally {
      h(!1);
    }
  }, []);
  i.useEffect(() => {
    ee();
  }, [ee]);
  const Oe = i.useMemo(() => {
    const s = { maxResultCount: Ce, skipCount: X * Ce, sorting: Q };
    return F.trim() && (s.filterText = F.trim()), l.kind === "folder" ? (s.documentId = l.documentId, s.includeSubFolders = !0) : l.kind === "workstep" ? s.workStepId = l.workStepId : l.kind === "smart" && l.smart === "expiring" ? s.expiringWithinDays = 30 : l.kind === "smart" && l.smart === "missing-meta" ? s.missingRequiredFields = !0 : l.kind === "smart" && l.smart === "trash" ? s.onlyDeleted = !0 : l.kind === "smart" && l.smart === "suggested" && (s.documentFileIds = [...new Set(((_ == null ? void 0 : _.items) ?? []).map((c) => c.documentFileId))], s.documentFileIds.length === 0 && (s.documentFileIds = [Bs])), s;
  }, [l, X, Q, F, _]), K = i.useCallback(async () => {
    p(!0);
    try {
      const s = await we(Oe);
      v(s.items ?? []), j(s.totalCount ?? 0);
    } catch (s) {
      I("error", "Belge listesi yüklenemedi."), console.error("[Documents] loadFiles", s);
    } finally {
      p(!1);
    }
  }, [Oe]);
  i.useEffect(() => {
    K();
  }, [K]);
  const ne = i.useCallback(async () => {
    try {
      const s = /* @__PURE__ */ new Date(), c = new Date(s.getFullYear(), s.getMonth(), 1).toISOString(), [f, D] = await Promise.all([
        we({ maxResultCount: 1, skipCount: 0, expiringWithinDays: 30 }),
        we({ maxResultCount: 1, skipCount: 0, uploadedAfter: c })
      ]);
      k(f.totalCount ?? 0), R(D.totalCount ?? 0);
    } catch (s) {
      console.error("[Documents] loadKpis", s);
    }
  }, []);
  i.useEffect(() => {
    ne();
  }, [ne]);
  const ke = i.useCallback(async () => {
    if (!T) {
      ge([]);
      return;
    }
    try {
      const c = ((await Xe(T, null)).checklists ?? []).flatMap((f) => (f.items ?? []).filter((D) => D.status === 2).map((D) => ({ ...D, assignmentId: f.assignmentId })));
      ge(
        l.kind === "workstep" ? c.filter((f) => f.workStepId === l.workStepId) : c
      );
    } catch (s) {
      ge([]), console.error("[Documents] loadMissing", s);
    }
  }, [T, l.kind, l.workStepId]);
  i.useEffect(() => {
    ke();
  }, [ke]);
  const me = i.useCallback(async () => {
    try {
      Ae(await Ha(T));
    } catch (s) {
      Ae(null), console.error("[Documents] loadSuggestions", s);
    }
  }, [T]);
  i.useEffect(() => {
    me();
  }, [me]);
  const je = (s) => ({
    documentFileId: s.documentFileId,
    kind: s.kind,
    payload: s.payload
  }), be = async (s, c, f) => {
    Me(!0);
    try {
      await s(c), U(f), await Promise.all([me(), K(), ee()]);
    } catch (D) {
      I("error", "Öneri işlenemedi."), console.error("[Documents] suggestion action", D);
    } finally {
      Me(!1);
    }
  }, pe = i.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    n.forEach((D) => {
      s.has(D.projectId) || s.set(D.projectId, []), s.get(D.projectId).push(D);
    });
    const c = /* @__PURE__ */ new Map();
    a.forEach((D) => {
      const z = D.parentDocumentId || "root";
      c.has(z) || c.set(z, []), c.get(z).push(D);
    });
    const f = (D) => (c.get(D) || []).sort((z, J) => (z.sortOrder ?? 0) - (J.sortOrder ?? 0) || z.title.localeCompare(J.title, "tr")).map((z) => {
      const J = f(z.id), Ea = (z.projectId ? s.get(z.projectId) || [] : []).slice().sort((H, Pa) => H.order - Pa.order).map((H) => ({
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
        key: `folder-${z.id}`,
        kind: "folder",
        documentId: z.id,
        projectId: z.projectId,
        label: z.title,
        icon: z.projectId ? "fa-diagram-project" : "fa-folder",
        children: [...Ea, ...J]
      };
    });
    return f("root");
  }, [a, n]), Ne = i.useRef(!1);
  i.useEffect(() => {
    if (Ne.current || y || pe.length === 0) return;
    const s = w.get("folder"), c = w.get("step");
    if (!s && !c) {
      Ne.current = !0;
      return;
    }
    const f = (z) => z.flatMap((J) => [J, ...f(J.children || [])]), D = f(pe).find((z) => s ? z.documentId === s : z.workStepId === c);
    Ne.current = !0, D && (N(D), $((z) => /* @__PURE__ */ new Set([...z, D.key])));
  }, [y, pe, w]), i.useEffect(() => {
    const s = new URLSearchParams();
    G !== "files" && s.set("tab", G), l.kind === "folder" ? s.set("folder", l.documentId) : l.kind === "workstep" ? s.set("step", l.workStepId) : l.kind === "smart" && s.set("smart", l.smart), F.trim() && s.set("q", F.trim()), Z !== "list" && s.set("view", Z), Q !== "creationTime desc" && s.set("sort", Q), X > 0 && s.set("page", String(X));
    const c = s.toString();
    window.history.replaceState(null, "", c ? `${window.location.pathname}?${c}` : window.location.pathname);
  }, [G, l, F, Z, Q, X]);
  const ga = i.useCallback(async (s) => {
    Ee(s.id), Pe(!0);
    try {
      ye(await qe(s.id));
    } catch (c) {
      I("error", "Belge detayı açılamadı."), console.error("[Documents] openDetail", c);
    } finally {
      Pe(!1);
    }
  }, []), va = async (s) => {
    Re(!0);
    try {
      await Fa(s.id, {
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
      }), U("Belge güncellendi."), ye(await qe(s.id)), await K();
    } catch (c) {
      I("error", "Belge güncellenemedi."), console.error("[Documents] handleSave", c);
    } finally {
      Re(!1);
    }
  }, ka = async () => {
    if (te)
      try {
        await La(te.id), Te === te.id && (Ee(null), ye(null)), U("Belge silindi."), await Promise.all([K(), ne()]);
      } catch (s) {
        I("error", "Belge silinemedi."), console.error("[Documents] handleDelete", s);
      } finally {
        he(null);
      }
  }, ja = (s) => {
    xe.current = Y.has(s.id) ? Array.from(Y) : [s.id];
  }, ba = async (s) => {
    const c = xe.current;
    if (c.length)
      try {
        c.length === 1 ? await Aa(c[0], s) : await Ge(c, s), U(c.length === 1 ? "Belge taşındı." : `${c.length} belge taşındı.`), V(/* @__PURE__ */ new Set()), await K();
      } catch (f) {
        I("error", "Taşıma başarısız oldu."), console.error("[Documents] move", f);
      } finally {
        xe.current = [];
      }
  }, Na = async () => {
    const s = window.prompt("Hedef klasör adını yazın:");
    if (!s) return;
    const c = a.find((f) => f.title.toLocaleLowerCase("tr") === s.toLocaleLowerCase("tr"));
    if (!c) {
      I("warn", "Klasör bulunamadı.");
      return;
    }
    try {
      await Ge(Array.from(Y), c.id), U(`${Y.size} belge taşındı.`), V(/* @__PURE__ */ new Set()), await K();
    } catch (f) {
      I("error", "Toplu taşıma başarısız oldu."), console.error("[Documents] bulkMove", f);
    }
  }, Sa = async () => {
    const s = window.prompt("Etiket(ler) — virgülle ayırın:");
    if (!s) return;
    const c = s.split(",").map((f) => f.trim()).filter(Boolean);
    if (c.length)
      try {
        await Ma(Array.from(Y), c), U(`${Y.size} belge etiketlendi.`), V(/* @__PURE__ */ new Set()), await K();
      } catch (f) {
        I("error", "Etiketleme başarısız oldu."), console.error("[Documents] bulkTag", f);
      }
  }, We = async (s) => {
    if (!C || !(s != null && s.length)) return;
    const c = ve.current;
    ve.current = null, Fe(!0);
    try {
      let f = null;
      for (const D of Array.from(s)) {
        const z = await ls(C, D);
        f = f ?? (z == null ? void 0 : z.documentFileId) ?? null;
      }
      c && f ? (await _a({
        assignmentId: c.assignmentId,
        requirementId: c.requirementId,
        workStepId: c.workStepId || null,
        periodCode: c.periodCode || null,
        documentFileId: f
      }), U(`Yüklendi ve "${c.title}" kalemine bağlandı.`)) : U(s.length === 1 ? "Dosya yüklendi." : `${s.length} dosya yüklendi.`), await Promise.all([K(), ne(), ee(), ke()]);
    } catch (f) {
      I("error", "Dosya yüklenemedi."), console.error("[Documents] upload", f);
    } finally {
      Fe(!1);
    }
  }, wa = async (s) => {
    try {
      await Oa(s.id), U(`"${s.displayName}" geri alındı.`), await Promise.all([K(), ne(), ee()]);
    } catch (c) {
      I("error", "Belge geri alınamadı."), console.error("[Documents] restore", c);
    }
  }, Ca = (s) => {
    var c;
    if (!C) {
      I("warn", "Yükleme klasör bağlamında yapılır — soldan bir klasör seçin.");
      return;
    }
    ve.current = s, (c = fe.current) == null || c.click();
  }, za = () => {
    const s = new window.abp.ModalManager(oe() + "Documents/CreateModal");
    s.open({ parentDocumentId: C || void 0 }), s.onResult(() => {
      ee(), U("Klasör oluşturuldu.");
    });
  }, Ue = (s) => $((c) => {
    const f = new Set(c);
    return f.has(s) ? f.delete(s) : f.add(s), f;
  }), Ia = (s) => {
    var c;
    N(s), de(0), V(/* @__PURE__ */ new Set()), (c = s.key) != null && c.startsWith("folder-") && Ue(s.key);
  }, Da = (s) => V((c) => {
    const f = new Set(c);
    return f.has(s) ? f.delete(s) : f.add(s), f;
  }), Ta = () => V((s) => o.every((c) => s.has(c.id)) ? /* @__PURE__ */ new Set() : new Set(o.map((c) => c.id)));
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto",
      style: { maxWidth: 1560 },
      onDragOver: (s) => {
        C && s.preventDefault();
      },
      onDrop: (s) => {
        var c;
        !C || !((c = s.dataTransfer.files) != null && c.length) || (s.preventDefault(), We(s.dataTransfer.files));
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Dokümanlar" }),
            /* @__PURE__ */ e.jsx("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: "Klasörler, belgeler ve meta veri" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            ue && /* @__PURE__ */ e.jsx(
              "a",
              {
                className: "apya-doc-linkbtn",
                href: `${oe()}Documents/Upload${C ? `?documentId=${C}` : ""}`,
                children: "Toplu yükleme"
              }
            ),
            ue && /* @__PURE__ */ e.jsx(E, { variant: "secondary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-plus" }), onClick: za, children: "Yeni klasör" }),
            ue && /* @__PURE__ */ e.jsx(
              E,
              {
                variant: "primary",
                isLoading: pa,
                disabled: !C,
                title: C ? void 0 : "Önce bir klasör seçin",
                leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
                onClick: () => {
                  var s;
                  return (s = fe.current) == null ? void 0 : s.click();
                },
                children: "Yükle"
              }
            ),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                ref: fe,
                type: "file",
                multiple: !0,
                hidden: !0,
                onChange: (s) => {
                  We(s.target.files), s.target.value = "";
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(As, { uploadedThisMonth: x, expiring: b, compliance: ia }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-doc-tabs", role: "tablist", children: [
          { key: "files", label: "Dosyalar" },
          { key: "compliance", label: "Uygunluk" },
          { key: "activity", label: "Etkinlik" }
        ].map((s) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": G === s.key,
            className: P("apya-doc-tab", G === s.key && "is-active"),
            onClick: () => la(s.key),
            children: s.label
          },
          s.key
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: P("apya-docs-shell", G !== "files" && "is-wide"), children: [
          /* @__PURE__ */ e.jsx(
            ds,
            {
              loading: y,
              tree: pe,
              activeKey: l.key,
              expanded: d,
              onToggle: Ue,
              onSelect: Ia,
              onDropFiles: ba,
              dragTarget: ua,
              setDragTarget: ma
            }
          ),
          G === "compliance" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(
            Is,
            {
              projectId: T,
              periodCode: null,
              onSummaryChange: ra,
              documentTypes: r
            }
          ) }) : G === "activity" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(Es, { projectId: T, documentFileId: null }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            Le && /* @__PURE__ */ e.jsx(
              Rs,
              {
                summary: _,
                busy: ya,
                onApplyAll: () => be(
                  Ye,
                  ((_ == null ? void 0 : _.items) ?? []).map(je),
                  "Öneriler uygulandı."
                ),
                onApply: (s) => be(
                  Ye,
                  [je(s)],
                  "Öneri uygulandı."
                ),
                onDismiss: (s) => be(
                  Va,
                  [je(s)],
                  "Öneri yoksayıldı."
                ),
                onReload: me
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "apya-grid-toolbar", style: { padding: "12px 14px", borderBottom: "1px solid var(--apya-border-subtle)" }, children: [
              /* @__PURE__ */ e.jsx(
                O,
                {
                  size: "sm",
                  className: "apya-grid-search",
                  leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
                  placeholder: "Bu bağlamda filtrele",
                  value: F,
                  onChange: (s) => {
                    se(s.target.value), de(0);
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
                    className: P(Z === "list" && "is-active"),
                    onClick: () => De("list"),
                    "aria-label": "Liste görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: P(Z === "grid" && "is-active"),
                    onClick: () => De("grid"),
                    "aria-label": "Kart görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-border-all" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              xs,
              {
                loading: A,
                files: o,
                totalCount: g,
                view: Z,
                sorting: Q,
                onSort: (s) => {
                  na(s), de(0);
                },
                selectedId: Te,
                onSelect: ga,
                checkedIds: Y,
                onToggleCheck: Da,
                onToggleAll: Ta,
                page: X,
                pageSize: Ce,
                onPageChange: de,
                onDragStart: ja,
                emptyHint: C ? 'Dosyaları buraya sürükleyin ya da "Yükle" ile ekleyin.' : "Sol taraftan bir klasör seçin; yükleme klasör bağlamında yapılır.",
                missingItems: xa,
                onUploadMissing: Ca,
                canUpload: ue,
                isTrash: W,
                onRestore: wa
              }
            ),
            ha && /* @__PURE__ */ e.jsx(
              hs,
              {
                count: Y.size,
                onClear: () => V(/* @__PURE__ */ new Set()),
                onMove: Na,
                onTag: Sa
              }
            )
          ] }),
          G === "files" && /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx(
            ks,
            {
              detail: oa,
              loading: ca,
              canEdit: Le,
              documentTypes: r,
              saving: da,
              onSave: va,
              onDelete: fa ? he : () => {
              }
            }
          ) })
        ] }),
        te && /* @__PURE__ */ e.jsx(
          Fs,
          {
            title: "Belge silinecek",
            message: `"${te.displayName}" ve tüm versiyonları çöp kutusuna taşınacak. Sol alttaki "Çöp kutusu"ndan geri alabilirsiniz.`,
            onConfirm: ka,
            onCancel: () => he(null)
          }
        ),
        Be && /* @__PURE__ */ e.jsx($s, { message: Be, onDone: () => $e(null) })
      ]
    }
  );
}
const Ze = document.getElementById("documents-island");
Ze && Ra(Ze).render(/* @__PURE__ */ e.jsx(Ms, {}));
