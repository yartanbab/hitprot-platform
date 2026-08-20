import { j as e, r as i, b as va } from "./react-vendor.js";
/* empty css      */
import { S as Fe, B as E, g as M, h as ja, I as Y } from "./Dialog.js";
import { S as oe } from "./SkeletonShape.js";
import { E as ae } from "./EmptyState.js";
import { H as fe } from "./Hint.js";
const ka = () => {
  var a, n, t;
  return (t = (n = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : n.documents) == null ? void 0 : t.document;
}, ee = (a) => {
  var n, t;
  return (t = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.auth) == null ? void 0 : t.isGranted(a);
}, T = (a, n) => {
  var t, u, d;
  return (d = (u = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.notify) == null ? void 0 : u[a]) == null ? void 0 : d.call(u, n);
}, se = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function $(a) {
  return new Promise((n, t) => {
    window.abp.ajax(a).done(n).fail(t);
  });
}
const I = (a, n = {}) => {
  const t = new URLSearchParams();
  Object.entries(n).forEach(([d, m]) => {
    m != null && m !== "" && t.append(d, m);
  });
  const u = t.toString();
  return `${se()}Documents?handler=${a}${u ? "&" + u : ""}`;
}, Z = (a, n) => $({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(n) }), ge = (a) => $({ url: I("Files", a), type: "GET" }), Be = (a) => $({ url: I("File", { id: a }), type: "GET" }), ba = (a, n) => Z(I("UpdateFileMeta", { id: a }), n), Na = (a, n) => $({ url: I("MoveFile", { id: a, targetDocumentId: n }), type: "POST" }), Me = (a, n) => Z(I("BulkMove"), { documentFileIds: a, targetDocumentId: n }), Sa = (a, n, t = !1) => Z(I("BulkTag"), { documentFileIds: a, tags: n, remove: t }), wa = (a) => $({ url: I("DeleteFile", { id: a }), type: "POST" }), Ca = () => $({ url: I("DocumentTypes"), type: "GET" }), za = (a) => $({ url: I("WorkSteps", { projectId: a }), type: "GET" }), Da = (a) => $({ url: I("CompliancePackages", { projectId: a }), type: "GET" }), We = (a, n) => $({ url: I("ComplianceOverview", { projectId: a, periodCode: n }), type: "GET" }), Ia = (a, n, t) => Z(I("ApplyCompliancePackage"), { projectId: a, packageId: n, periodCode: t }), Ta = (a) => $({ url: I("RemoveComplianceAssignment", { assignmentId: a }), type: "POST" }), $a = (a) => Z(I("WaiveComplianceItem"), a), Ea = (a) => Z(I("LinkComplianceDocument"), a), Ra = (a) => $({ url: I("Activity", a), type: "GET" }), Fa = (a, n) => {
  const t = new FormData();
  return t.append("documentId", a), t.append("file", n), $({
    url: I("UploadFile"),
    type: "POST",
    data: t,
    contentType: !1,
    processData: !1
  });
}, D = (...a) => a.filter(Boolean).join(" "), R = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  money: (a, n) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + (n ? " " + Ba(n) : ""),
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toFixed(1) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
};
function Ba(a) {
  return { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }[a] || a;
}
const V = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Kesin", chip: "apya-chip-positive" },
  3: { text: "Eşleşti", chip: "apya-chip-accent" },
  4: { text: "Süre dolan", chip: "apya-chip-negative" }
}, Ae = {
  1: { text: "Manuel", variant: "neutral" },
  2: { text: "OCR", variant: "brand" },
  3: { text: "AI", variant: "accent" },
  4: { text: "Kural", variant: "warning" }
}, Ma = {
  1: "Yüklendi",
  2: "İndirildi",
  3: "Silindi",
  4: "Görüntülendi",
  5: "Meta değişti",
  6: "Taşındı"
};
function je(a, n) {
  var u;
  const t = ((u = (n || "").split(".").pop()) == null ? void 0 : u.toLowerCase()) || "";
  return a != null && a.includes("pdf") || t === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444", label: "PDF" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(t) ? { icon: "fa-file-excel", color: "#10B981", label: "XLS" } : a != null && a.includes("word") || ["docx", "doc"].includes(t) ? { icon: "fa-file-word", color: "#3B82F6", label: "DOC" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(t) ? { icon: "fa-file-powerpoint", color: "#F59E0B", label: "PPT" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(t) ? { icon: "fa-file-image", color: "#8B5CF6", label: "IMG" } : ["zip", "rar", "7z"].includes(t) ? { icon: "fa-file-zipper", color: "#6B7280", label: "ZIP" } : { icon: "fa-file", color: "#6B7280", label: "DOSYA" };
}
function Aa(a) {
  const n = ["apya-chip-accent", "apya-chip-brand", "apya-chip-positive", "apya-chip-warning", "apya-chip-neutral"];
  let t = 0;
  for (let u = 0; u < a.length; u++) t = t * 31 + a.charCodeAt(u) >>> 0;
  return n[t % n.length];
}
const Pa = [
  { key: "expiring", label: "Süresi dolanlar", icon: "fa-clock-rotate-left" },
  { key: "missing-meta", label: "Eksik meta", icon: "fa-triangle-exclamation" }
];
function Ue({
  node: a,
  depth: n,
  activeKey: t,
  expanded: u,
  onToggle: d,
  onSelect: m,
  onDropFiles: x,
  dragTarget: y,
  setDragTarget: g
}) {
  var z;
  const v = ((z = a.children) == null ? void 0 : z.length) > 0, C = u.has(a.key), k = y === a.documentId && a.documentId;
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m(a),
        onDragOver: (b) => {
          a.documentId && (b.preventDefault(), g(a.documentId));
        },
        onDragLeave: () => g(null),
        onDrop: (b) => {
          a.documentId && (b.preventDefault(), g(null), x(a.documentId));
        },
        className: D("apya-md-item", t === a.key && "selected"),
        style: {
          paddingLeft: 10 + n * 14,
          borderRadius: 8,
          ...k ? { outline: "2px dashed var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
        },
        children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              role: "button",
              tabIndex: -1,
              onClick: (b) => {
                b.stopPropagation(), v && d(a.key);
              },
              className: "w-3 flex-shrink-0",
              style: { color: "var(--apya-text-tertiary)" },
              children: v && /* @__PURE__ */ e.jsx("i", { className: `fa fa-chevron-${C ? "down" : "right"}`, style: { fontSize: 9 } })
            }
          ),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${a.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: a.label }),
          typeof a.count == "number" && /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: a.count })
        ]
      }
    ),
    v && C && a.children.map((b) => /* @__PURE__ */ e.jsx(
      Ue,
      {
        node: b,
        depth: n + 1,
        activeKey: t,
        expanded: u,
        onToggle: d,
        onSelect: m,
        onDropFiles: x,
        dragTarget: y,
        setDragTarget: g
      },
      b.key
    ))
  ] });
}
function La({
  loading: a,
  tree: n,
  activeKey: t,
  expanded: u,
  onToggle: d,
  onSelect: m,
  onDropFiles: x,
  dragTarget: y,
  setDragTarget: g
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Bağlam" }),
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m({ key: "all", kind: "all" }),
        className: D("apya-md-item", t === "all" && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-tree", style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", style: { fontWeight: 600 }, children: "Tüm Dokümanlar" })
        ]
      }
    ),
    a ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(oe, { rows: 5 }) }) : n.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör yok." }) : n.map((v) => /* @__PURE__ */ e.jsx(
      Ue,
      {
        node: v,
        depth: 0,
        activeKey: t,
        expanded: u,
        onToggle: d,
        onSelect: m,
        onDropFiles: x,
        dragTarget: y,
        setDragTarget: g
      },
      v.key
    )),
    /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Akıllı klasörler" }),
    Pa.map((v) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m({ key: v.key, kind: "smart", smart: v.key }),
        className: D("apya-md-item", t === v.key && "selected"),
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
const qe = [
  { key: "displayName", label: "Belge", sortable: !0, width: "minmax(0,1fr)" },
  { key: "workStep", label: "İş adımı", sortable: !1, width: "140px" },
  { key: "type", label: "Tür", sortable: !1, width: "96px" },
  { key: "amount", label: "Tutar", sortable: !0, width: "116px", align: "right" },
  { key: "documentDate", label: "Tarih", sortable: !0, width: "96px" },
  { key: "status", label: "Durum", sortable: !1, width: "110px" }
], ke = `34px ${qe.map((a) => a.width).join(" ")}`;
function Oa({ column: a, sorting: n, onSort: t }) {
  if (!a.sortable)
    return /* @__PURE__ */ e.jsx("span", { style: { textAlign: a.align || "left" }, children: a.label });
  const [u, d] = (n || "").split(" "), m = u === a.key, x = m && d !== "desc" ? "desc" : "asc";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => t(`${a.key} ${x}`),
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
      "aria-sort": m ? d === "desc" ? "descending" : "ascending" : "none",
      children: [
        a.label,
        /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${m ? d === "desc" ? "arrow-down" : "arrow-up" : "arrows-up-down"}`,
            style: { fontSize: 8, opacity: m ? 1 : 0.4 }
          }
        )
      ]
    }
  );
}
function Wa({ item: a, onUpload: n, canUpload: t }) {
  const u = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || "Proje";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-missing-row", style: { gridTemplateColumns: ke }, children: [
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
      a.isBlocking && /* @__PURE__ */ e.jsx(M, { variant: "warning", size: "sm", children: "teslimi bloke ediyor" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: u }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: a.documentTypeName || "—" }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right", color: "var(--apya-text-tertiary)" }, children: "—" }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-warning-700, #92400E)" }, children: "bekliyor" }),
    /* @__PURE__ */ e.jsx("span", { children: t ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-missing-upload", onClick: () => n(a), children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
      " Yükle"
    ] }) : /* @__PURE__ */ e.jsx("span", { className: "apya-chip apya-chip-warning", children: "Eksik" }) })
  ] });
}
function Ua({ file: a, selected: n, checked: t, onSelect: u, onToggleCheck: d, onDragStart: m }) {
  const x = je(a.contentType, a.fileName), y = V[a.status] || V[1];
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !0,
      onDragStart: () => m(a),
      onClick: () => u(a),
      className: D("apya-doc-row", n && "is-selected"),
      style: { gridTemplateColumns: ke },
      children: [
        /* @__PURE__ */ e.jsx("span", { onClick: (g) => {
          g.stopPropagation(), d(a.id);
        }, style: { cursor: "pointer" }, children: /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${t ? "square-check" : "square"}`,
            style: { fontSize: 13, color: t ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
            role: "checkbox",
            "aria-checked": t
          }
        ) }),
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 26, height: 26, borderRadius: 7, background: `${x.color}1a`, color: x.color, fontSize: 11 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${x.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.displayName }),
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(M, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] }),
          a.isLocked && /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock", style: { fontSize: 10, color: "var(--apya-text-tertiary)" }, title: "Kilitli" })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: a.documentTypeName || "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right" }, children: R.money(a.amount, a.currency) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: R.date(a.documentDate || a.creationTime) }),
        /* @__PURE__ */ e.jsx("span", { children: /* @__PURE__ */ e.jsx("span", { className: D("apya-chip", y.chip), children: y.text }) })
      ]
    }
  );
}
function qa({ file: a, selected: n, onSelect: t, onDragStart: u }) {
  const d = je(a.contentType, a.fileName), m = V[a.status] || V[1];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: !0,
      onDragStart: () => u(a),
      onClick: () => t(a),
      className: "apya-tile",
      style: {
        textAlign: "left",
        cursor: "pointer",
        ...n ? { borderColor: "var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-head", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-2", style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "apya-tile-icon-box", style: { background: `${d.color}1a`, color: d.color }, children: /* @__PURE__ */ e.jsx("i", { className: `fa ${d.icon}` }) }),
            /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
              /* @__PURE__ */ e.jsx("div", { className: "apya-tile-title", children: a.displayName }),
              /* @__PURE__ */ e.jsx("div", { className: "apya-tile-sub", children: a.documentTypeName || "Sınıflandırılmamış" })
            ] })
          ] }),
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(M, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", style: { borderTop: "none", paddingTop: 0 }, children: [
          /* @__PURE__ */ e.jsx("span", { className: D("apya-chip", m.chip), children: m.text }),
          a.amount !== null && a.amount !== void 0 && /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: R.money(a.amount, a.currency) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", children: a.uploaderName || "Sistem" }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", children: R.date(a.documentDate || a.creationTime) })
        ] })
      ]
    }
  );
}
function Ka({
  loading: a,
  files: n,
  totalCount: t,
  view: u,
  sorting: d,
  onSort: m,
  selectedId: x,
  onSelect: y,
  checkedIds: g,
  onToggleCheck: v,
  onToggleAll: C,
  page: k,
  pageSize: z,
  onPageChange: b,
  onDragStart: f,
  emptyHint: A,
  missingItems: F = [],
  onUploadMissing: o,
  canUpload: r = !1
}) {
  const c = n.length > 0 && n.every((h) => g.has(h.id)), S = Math.max(1, Math.ceil(t / z)), N = k === 0 && u === "list" ? F : [];
  return a ? u === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: Array.from({ length: 6 }).map((h, J) => /* @__PURE__ */ e.jsx(Fe, { height: 120, rounded: "lg" }, J)) }) : /* @__PURE__ */ e.jsx("div", { className: "p-3 d-flex flex-column gap-2", children: Array.from({ length: 8 }).map((h, J) => /* @__PURE__ */ e.jsx(Fe, { height: 40, rounded: "md" }, J)) }) : n.length === 0 && N.length === 0 ? /* @__PURE__ */ e.jsx(
    ae,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
      title: "Burada henüz belge yok",
      description: A
    }
  ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    u === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: n.map((h) => /* @__PURE__ */ e.jsx(
      qa,
      {
        file: h,
        selected: x === h.id,
        onSelect: y,
        onDragStart: f
      },
      h.id
    )) }) : /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-row-head", style: { gridTemplateColumns: ke }, children: [
        /* @__PURE__ */ e.jsx("span", { onClick: C, style: { cursor: "pointer" }, children: /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${c ? "square-check" : "square"}`,
            style: { fontSize: 13, color: c ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
            role: "checkbox",
            "aria-checked": c
          }
        ) }),
        qe.map((h) => /* @__PURE__ */ e.jsx(Oa, { column: h, sorting: d, onSort: m }, h.key))
      ] }),
      N.map((h) => /* @__PURE__ */ e.jsx(
        Wa,
        {
          item: h,
          onUpload: o,
          canUpload: r
        },
        `missing-${h.assignmentId}-${h.requirementId}-${h.workStepId || "none"}`
      )),
      n.map((h) => /* @__PURE__ */ e.jsx(
        Ua,
        {
          file: h,
          selected: x === h.id,
          checked: g.has(h.id),
          onSelect: y,
          onToggleCheck: v,
          onDragStart: f
        },
        h.id
      ))
    ] }),
    S > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            k * z + 1,
            "–",
            Math.min((k + 1) * z, t),
            " / ",
            t
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: k === 0, onClick: () => b(k - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              k + 1,
              " / ",
              S
            ] }),
            /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: k + 1 >= S, onClick: () => b(k + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
function Ya({ count: a, onClear: n, onMove: t, onTag: u, busy: d }) {
  return a === 0 ? null : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-bulkbar", children: [
    /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
      a,
      " belge seçildi"
    ] }),
    /* @__PURE__ */ e.jsx("span", { style: { width: 1, height: 18, background: "rgba(255,255,255,.18)" } }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: t, disabled: d, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-open" }),
      " Taşı"
    ] }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: u, disabled: d, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-tag" }),
      " Etiketle"
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
    /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: n, children: "Vazgeç" })
  ] });
}
function _a({ tags: a }) {
  return a != null && a.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1", children: a.map((n) => /* @__PURE__ */ e.jsx("span", { className: D("apya-chip", Aa(n)), children: n }, n)) }) : null;
}
const Pe = {
  1: { icon: "fa-diagram-project", label: "Proje" },
  2: { icon: "fa-list-check", label: "İş adımı" },
  3: { icon: "fa-receipt", label: "Harcama", href: (a) => a ? `${se()}Expenses` : null },
  4: {
    icon: "fa-box-archive",
    label: "Teslim paketi",
    href: (a) => a ? `${se()}Documents/Deliveries?packageId=${a}` : null
  },
  5: { icon: "fa-clipboard-check", label: "Kontrol listesi kalemi" }
};
function Ga({ field: a, value: n, onChange: t, disabled: u }) {
  const d = { size: "sm", disabled: u, value: n ?? "" };
  switch (a.fieldType) {
    case 2:
      return /* @__PURE__ */ e.jsx(Y, { ...d, type: "date", onChange: (m) => t({ valueDate: m.target.value || null }) });
    case 3:
    case 4:
    case 5:
      return /* @__PURE__ */ e.jsx(
        Y,
        {
          ...d,
          type: "number",
          step: a.fieldType === 3 ? "0.01" : "1",
          onChange: (m) => t({ valueNumber: m.target.value === "" ? null : Number(m.target.value) })
        }
      );
    default:
      return /* @__PURE__ */ e.jsx(Y, { ...d, onChange: (m) => t({ valueText: m.target.value || null }) });
  }
}
function Ha(a) {
  return a.fieldType === 2 ? a.valueDate ? a.valueDate.substring(0, 10) : "" : [3, 4, 5].includes(a.fieldType) ? a.valueNumber ?? "" : a.valueText ?? "";
}
function Va({
  detail: a,
  loading: n,
  canEdit: t,
  onSave: u,
  onDelete: d,
  saving: m,
  documentTypes: x
}) {
  var f, A, F;
  const [y, g] = i.useState(null);
  if (i.useEffect(() => {
    g(a ? { ...a, fields: (a.fields || []).map((o) => ({ ...o })) } : null);
  }, [a == null ? void 0 : a.id]), n)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(oe, { rows: 6 }) });
  if (!a || !y)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(
      ae,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir belge seçin",
        description: "Künye, özel alanlar ve versiyon geçmişi burada görünür."
      }
    ) });
  const v = je(a.contentType, a.fileName), C = V[y.status] || V[1], k = R.daysLeft(y.expiryDate), z = (o, r) => {
    g((c) => ({
      ...c,
      fields: c.fields.map((S) => S.fieldId === o ? { ...S, valueText: null, valueNumber: null, valueDate: null, ...r } : S)
    }));
  }, b = y.fields.filter(
    (o) => o.isRequired && !o.valueText && o.valueNumber === null && !o.valueDate
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
          R.size(a.fileSize),
          " · ",
          v.label,
          a.versionCount > 1 && ` · v${a.versionCount}`
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-1 mt-1 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: D("apya-chip", C.chip), children: C.text }),
          k !== null && k >= 0 && k <= 30 && /* @__PURE__ */ e.jsxs(M, { variant: "warning", size: "sm", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
            " ",
            k,
            " gün"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-3", children: [
      a.downloadUrl && /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: ja({ variant: "primary" }), style: { flex: 1 }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }),
      t && !a.isLocked && /* @__PURE__ */ e.jsx(E, { variant: "outline", onClick: () => d(a), title: "Sil", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash", style: { color: "var(--apya-negative-500)" } }) })
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
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: R.dateTime(a.creationTime) })
      ] }),
      a.retentionUntil && /* @__PURE__ */ e.jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Saklama" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: R.date(a.retentionUntil) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Özel alanlar",
        /* @__PURE__ */ e.jsx(fe, { text: "Alan şeması belge tipine bağlıdır. Tip değiştirdiğinizde kaydettikten sonra o tipin alanları görünür." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tipi" }),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-select",
              disabled: !t || a.isLocked,
              value: y.documentTypeId || "",
              onChange: (o) => g({ ...y, documentTypeId: o.target.value || null }),
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "— Sınıflandırılmamış —" }),
                x.map((o) => /* @__PURE__ */ e.jsx("option", { value: o.id, children: o.name }, o.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Tutar" }),
          /* @__PURE__ */ e.jsx(
            Y,
            {
              size: "sm",
              type: "number",
              step: "0.01",
              disabled: !t || a.isLocked,
              value: y.amount ?? "",
              onChange: (o) => g({ ...y, amount: o.target.value === "" ? null : Number(o.target.value) })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tarihi" }),
          /* @__PURE__ */ e.jsx(
            Y,
            {
              size: "sm",
              type: "date",
              disabled: !t || a.isLocked,
              value: y.documentDate ? y.documentDate.substring(0, 10) : "",
              onChange: (o) => g({ ...y, documentDate: o.target.value || null })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Dönem" }),
          /* @__PURE__ */ e.jsx(
            Y,
            {
              size: "sm",
              placeholder: "2026-Q2",
              disabled: !t || a.isLocked,
              value: y.periodCode ?? "",
              onChange: (o) => g({ ...y, periodCode: o.target.value || null })
            }
          )
        ] }),
        y.fields.map((o) => {
          var r, c;
          return /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              o.label,
              o.isRequired && /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-negative-500)" }, children: "*" }),
              /* @__PURE__ */ e.jsx(M, { variant: ((r = Ae[o.fillSource]) == null ? void 0 : r.variant) || "neutral", size: "sm", children: ((c = Ae[o.fillSource]) == null ? void 0 : c.text) || "—" }),
              o.confidence !== null && o.confidence !== void 0 && /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10 }, children: [
                "%",
                o.confidence
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              Ga,
              {
                field: o,
                value: Ha(o),
                disabled: !t || a.isLocked,
                onChange: (S) => z(o.fieldId, S)
              }
            )
          ] }, o.fieldId);
        })
      ] }),
      b.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", style: { fontSize: 11, color: "var(--apya-warning-500)" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation" }),
        " ",
        b.length,
        " zorunlu alan boş."
      ] }),
      t && !a.isLocked && /* @__PURE__ */ e.jsx(
        E,
        {
          variant: "primary",
          size: "sm",
          className: "mt-3 w-100",
          isLoading: m,
          onClick: () => u(y),
          children: "Kaydet"
        }
      )
    ] }),
    ((f = a.tags) == null ? void 0 : f.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Etiketler" }),
      /* @__PURE__ */ e.jsx(_a, { tags: a.tags })
    ] }),
    ((A = a.related) == null ? void 0 : A.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "İlişkili kayıtlar",
        /* @__PURE__ */ e.jsx(fe, { text: "Belgenin bağlandığı harcama, içinde gittiği teslim paketi ve karşıladığı kontrol listesi kalemleri." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.related.map((o, r) => {
        var h;
        const c = Pe[o.kind] ?? Pe[3], S = (h = c.href) == null ? void 0 : h.call(c, o.entityId), N = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 22, height: 22, borderRadius: 6, background: "var(--apya-surface-sunken)", color: "var(--apya-text-secondary)", fontSize: 10 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${c.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12 }, children: o.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "d-block text-truncate apya-numeric",
                style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" },
                children: [c.label, o.detail].filter(Boolean).join(" · ")
              }
            )
          ] })
        ] });
        return S ? /* @__PURE__ */ e.jsx(
          "a",
          {
            href: S,
            className: "d-flex align-items-center gap-2 text-decoration-none",
            style: { color: "inherit" },
            children: N
          },
          `${o.kind}-${o.entityId}-${r}`
        ) : /* @__PURE__ */ e.jsx("div", { className: "d-flex align-items-center gap-2", children: N }, `${o.kind}-${r}`);
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Versiyonlar",
        /* @__PURE__ */ e.jsx(fe, { text: "Aynı klasöre aynı isimle yeniden yüklenen dosya yeni versiyon olur; önceki versiyonlar burada kalır." })
      ] }),
      (F = a.versions) != null && F.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1", children: a.versions.map((o) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsxs(M, { variant: o.isLatest ? "brand" : "neutral", size: "sm", children: [
            "v",
            o.versionNumber
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { color: "var(--apya-text-secondary)" }, children: o.uploaderName })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { color: "var(--apya-text-tertiary)" }, children: R.date(o.creationTime) })
      ] }, o.id)) }) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Versiyon kaydı yok." })
    ] })
  ] });
}
const Le = {
  1: { text: "Karşılandı", chip: "apya-chip-positive", icon: "fa-check" },
  2: { text: "Eksik", chip: "apya-chip-warning", icon: "fa-triangle-exclamation" },
  3: { text: "Feragat", chip: "apya-chip-neutral", icon: "fa-ban" }
}, Za = { 1: "Proje", 2: "İş adımı", 3: "Dönem" };
function Ja({ percent: a, blocking: n }) {
  const t = n > 0 ? "var(--apya-negative-500)" : a >= 90 ? "var(--apya-positive-500)" : "var(--apya-warning-500)";
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", role: "progressbar", "aria-valuenow": a, "aria-valuemin": 0, "aria-valuemax": 100, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a}%`, background: t } }) });
}
function Qa({ item: a, canManage: n, onWaive: t, busy: u }) {
  const d = Le[a.status] || Le[2], m = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || Za[a.scope];
  return /* @__PURE__ */ e.jsxs("div", { className: D("apya-doc-check-row", a.status === 2 && a.isBlocking && "is-blocking"), children: [
    /* @__PURE__ */ e.jsxs("span", { className: D("apya-chip", d.chip), children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa ${d.icon}` }),
      " ",
      d.text
    ] }),
    /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.title }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
        m,
        a.documentTypeName && ` · ${a.documentTypeName}`,
        a.waiveReason && ` · ${a.waiveReason}`
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: a.documentFileName || "—" }),
    /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2 justify-content-end", children: [
      a.isBlocking && a.status === 2 && /* @__PURE__ */ e.jsx(M, { variant: "negative", size: "sm", children: "Teslimi bloke ediyor" }),
      n && a.status !== 1 && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: u,
          onClick: () => t(a, a.status !== 3),
          children: a.status === 3 ? "Feragati kaldır" : "Feragat et"
        }
      )
    ] })
  ] });
}
function Xa({ projectId: a, periodCode: n, onSummaryChange: t }) {
  const [u, d] = i.useState(null), [m, x] = i.useState([]), [y, g] = i.useState(!0), [v, C] = i.useState(!1), k = ee("Platform.Documents.ManageCompliance"), z = i.useCallback(async () => {
    if (!a) {
      d(null), g(!1);
      return;
    }
    g(!0);
    try {
      const [r, c] = await Promise.all([
        We(a, n),
        Da(a)
      ]);
      d(r), x(c ?? []), t == null || t((r == null ? void 0 : r.summary) ?? null);
    } catch (r) {
      T("error", "Uygunluk verisi yüklenemedi."), console.error("[Documents] compliance load", r);
    } finally {
      g(!1);
    }
  }, [a, n, t]);
  i.useEffect(() => {
    z();
  }, [z]);
  const b = async (r) => {
    C(!0);
    try {
      await Ia(a, r, n || null), await z();
    } catch (c) {
      T("error", "Paket uygulanamadı."), console.error("[Documents] applyPackage", c);
    } finally {
      C(!1);
    }
  }, f = async (r) => {
    C(!0);
    try {
      await Ta(r), await z();
    } catch (c) {
      T("error", "Paket kaldırılamadı."), console.error("[Documents] removeAssignment", c);
    } finally {
      C(!1);
    }
  }, A = async (r, c, S) => {
    const N = S ? window.prompt("Feragat gerekçesi:") : null;
    if (!(S && !N)) {
      C(!0);
      try {
        await $a({
          assignmentId: r.assignmentId,
          requirementId: c.requirementId,
          workStepId: c.workStepId,
          periodCode: c.periodCode,
          waive: S,
          reason: N
        }), await z();
      } catch (h) {
        T("error", "İşlem başarısız oldu."), console.error("[Documents] waive", h);
      } finally {
        C(!1);
      }
    }
  };
  if (!a)
    return /* @__PURE__ */ e.jsx(
      ae,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-check" }),
        title: "Önce bir proje bağlamı seçin",
        description: "Uygunluk, projeye uygulanan kurum paketleri üzerinden hesaplanır."
      }
    );
  if (y)
    return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(oe, { rows: 6 }) });
  const F = (u == null ? void 0 : u.checklists) ?? [], o = m.filter((r) => !r.isApplied);
  return /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
    F.length === 0 ? /* @__PURE__ */ e.jsx(
      ae,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-list" }),
        title: "Bu projeye henüz kurum paketi uygulanmadı",
        description: "Aşağıdan bir paket seçerek kontrol listesini başlatın."
      }
    ) : F.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
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
          r.summary.blockingMissingCount > 0 && /* @__PURE__ */ e.jsxs(M, { variant: "negative", size: "sm", children: [
            r.summary.blockingMissingCount,
            " bloke"
          ] }),
          k && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: v,
              onClick: () => f(r.assignmentId),
              children: "Kaldır"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(Ja, { percent: r.summary.percent, blocking: r.summary.blockingMissingCount }),
      /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
        r.summary.satisfiedCount,
        " / ",
        r.summary.totalCount - r.summary.waivedCount,
        " kalem tamam",
        r.summary.waivedCount > 0 && ` · ${r.summary.waivedCount} feragat`
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-list", children: r.items.map((c, S) => /* @__PURE__ */ e.jsx(
        Qa,
        {
          item: c,
          canManage: k,
          busy: v,
          onWaive: (N, h) => A(r, N, h)
        },
        `${c.requirementId}-${c.workStepId || c.periodCode || S}`
      )) })
    ] }, r.assignmentId)),
    k && o.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Uygulanabilir paketler" }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: o.map((r) => /* @__PURE__ */ e.jsxs(
        E,
        {
          variant: "outline",
          size: "sm",
          disabled: v,
          leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          onClick: () => b(r.id),
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
const X = 25, es = {
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
}, as = [
  { value: "", label: "Tümü" },
  { value: "1", label: "Yüklendi" },
  { value: "2", label: "İndirildi" },
  { value: "5", label: "Meta değişti" },
  { value: "3", label: "Silindi" }
];
function ss({ projectId: a, documentFileId: n }) {
  const [t, u] = i.useState([]), [d, m] = i.useState(0), [x, y] = i.useState(0), [g, v] = i.useState(""), [C, k] = i.useState(!0), z = i.useCallback(async () => {
    k(!0);
    try {
      const f = await Ra({
        maxResultCount: X,
        skipCount: x * X,
        projectId: a || void 0,
        documentFileId: n || void 0,
        action: g || void 0
      });
      u(f.items ?? []), m(f.totalCount ?? 0);
    } catch (f) {
      T("error", "Etkinlik kaydı yüklenemedi."), console.error("[Documents] activity load", f);
    } finally {
      k(!1);
    }
  }, [a, n, g, x]);
  i.useEffect(() => {
    z();
  }, [z]);
  const b = Math.max(1, Math.ceil(d / X));
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center gap-2 flex-wrap px-3 py-2",
        style: { borderBottom: "1px solid var(--apya-border-subtle)" },
        children: [
          as.map((f) => /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: D("apya-doc-filterchip", g === f.value && "is-active"),
              onClick: () => {
                v(f.value), y(0);
              },
              children: f.label
            },
            f.value
          )),
          /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            d,
            " kayıt"
          ] })
        ]
      }
    ),
    C ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(oe, { rows: 8 }) }) : t.length === 0 ? /* @__PURE__ */ e.jsx(
      ae,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left" }),
        title: "Henüz kayıtlı etkinlik yok",
        description: "Yükleme, indirme, meta değişikliği ve silme işlemleri burada iz bırakır."
      }
    ) : /* @__PURE__ */ e.jsx("div", { children: t.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", children: [
      /* @__PURE__ */ e.jsx("span", { className: D("apya-chip", es[f.action] || "apya-chip-neutral"), children: Ma[f.action] || "—" }),
      /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: f.documentFileName || f.folderName || "—" }),
        f.detail && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: f.detail })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12 }, children: f.actorName }),
        f.actorRole && /* @__PURE__ */ e.jsx(M, { variant: "neutral", size: "sm", children: f.actorRole })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: R.dateTime(f.creationTime) })
    ] }, f.id)) }),
    b > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            x * X + 1,
            "–",
            Math.min((x + 1) * X, d),
            " / ",
            d
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: x === 0, onClick: () => y(x - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              x + 1,
              " / ",
              b
            ] }),
            /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: x + 1 >= b, onClick: () => y(x + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
const ve = 25;
function ts({ message: a, onDone: n }) {
  return i.useEffect(() => {
    const t = setTimeout(n, 2800);
    return () => clearTimeout(t);
  }, [n]), /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-check", style: { fontSize: 11, color: "var(--apya-positive-500)" } }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: a })
  ] });
}
function ns({ title: a, message: n, onConfirm: t, onCancel: u }) {
  const [d, m] = i.useState(!1);
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
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: n })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [
      /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", onClick: u, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        E,
        {
          variant: "destructive",
          size: "sm",
          isLoading: d,
          onClick: async () => {
            m(!0), await t(), m(!1);
          },
          children: "Evet, sil"
        }
      )
    ] })
  ] }) });
}
function ls({ uploadedThisMonth: a, expiring: n, compliance: t }) {
  const u = [
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
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-kpis", children: u.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("span", { className: D("apya-doc-kpi-icon", `is-${d.tone}`), children: /* @__PURE__ */ e.jsx("i", { className: `fa ${d.icon}` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: d.label })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: d.value }),
    d.foot && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: d.foot })
  ] }, d.key)) });
}
function is() {
  const [a, n] = i.useState([]), [t, u] = i.useState([]), [d, m] = i.useState([]), [x, y] = i.useState(!0), [g, v] = i.useState([]), [C, k] = i.useState(0), [z, b] = i.useState(null), [f, A] = i.useState(null), [F, o] = i.useState(!0), r = i.useMemo(() => new URLSearchParams(window.location.search), []), [c, S] = i.useState(() => {
    const s = r.get("smart");
    return s ? { key: s, kind: "smart", smart: s } : { key: "all", kind: "all" };
  }), N = c.kind === "folder" ? c.documentId : null, h = c.projectId || null, [J, be] = i.useState(/* @__PURE__ */ new Set()), [U, Ke] = i.useState(r.get("q") || ""), [_, Ye] = i.useState(r.get("sort") || "creationTime desc"), [G, Ne] = i.useState(r.get("view") === "grid" ? "grid" : "list"), [H, te] = i.useState(Number(r.get("page")) || 0), [B, _e] = i.useState(() => {
    const s = r.get("tab");
    return ["files", "compliance", "activity"].includes(s) ? s : "files";
  }), [Ge, He] = i.useState(null), [Se, we] = i.useState(null), [Ve, ce] = i.useState(null), [Ze, Ce] = i.useState(!1), [Je, ze] = i.useState(!1), [P, q] = i.useState(/* @__PURE__ */ new Set()), [Qe, Xe] = i.useState(null), de = i.useRef([]), [Q, ue] = i.useState(null), [De, Ie] = i.useState(null), [ea, Te] = i.useState(!1), me = i.useRef(null), [aa, pe] = i.useState([]), ye = i.useRef(null), ne = ee("Platform.Documents.Create"), sa = ee("Platform.Documents.ManageMeta"), ta = ee("Platform.Documents.BulkOperations"), na = ee("Platform.Documents.Delete"), L = i.useCallback((s) => Ie(s), []), le = i.useCallback(async () => {
    y(!0);
    try {
      const [s, l, p] = await Promise.all([
        ka().getList({ maxResultCount: 1e3, sorting: "title asc" }),
        za(),
        Ca()
      ]);
      n(s.items ?? []), u(l ?? []), m(p ?? []);
    } catch (s) {
      T("error", "Klasör ağacı yüklenemedi."), console.error("[Documents] loadTree", s);
    } finally {
      y(!1);
    }
  }, []);
  i.useEffect(() => {
    le();
  }, [le]);
  const $e = i.useMemo(() => {
    const s = { maxResultCount: ve, skipCount: H * ve, sorting: _ };
    return U.trim() && (s.filterText = U.trim()), c.kind === "folder" ? (s.documentId = c.documentId, s.includeSubFolders = !0) : c.kind === "workstep" ? s.workStepId = c.workStepId : c.kind === "smart" && c.smart === "expiring" ? s.expiringWithinDays = 30 : c.kind === "smart" && c.smart === "missing-meta" && (s.missingRequiredFields = !0), s;
  }, [c, H, _, U]), O = i.useCallback(async () => {
    o(!0);
    try {
      const s = await ge($e);
      v(s.items ?? []), k(s.totalCount ?? 0);
    } catch (s) {
      T("error", "Belge listesi yüklenemedi."), console.error("[Documents] loadFiles", s);
    } finally {
      o(!1);
    }
  }, [$e]);
  i.useEffect(() => {
    O();
  }, [O]);
  const ie = i.useCallback(async () => {
    try {
      const s = /* @__PURE__ */ new Date(), l = new Date(s.getFullYear(), s.getMonth(), 1).toISOString(), [p, w] = await Promise.all([
        ge({ maxResultCount: 1, skipCount: 0, expiringWithinDays: 30 }),
        ge({ maxResultCount: 1, skipCount: 0, uploadedAfter: l })
      ]);
      b(p.totalCount ?? 0), A(w.totalCount ?? 0);
    } catch (s) {
      console.error("[Documents] loadKpis", s);
    }
  }, []);
  i.useEffect(() => {
    ie();
  }, [ie]);
  const xe = i.useCallback(async () => {
    if (!h) {
      pe([]);
      return;
    }
    try {
      const l = ((await We(h, null)).checklists ?? []).flatMap((p) => (p.items ?? []).filter((w) => w.status === 2).map((w) => ({ ...w, assignmentId: p.assignmentId })));
      pe(
        c.kind === "workstep" ? l.filter((p) => p.workStepId === c.workStepId) : l
      );
    } catch (s) {
      pe([]), console.error("[Documents] loadMissing", s);
    }
  }, [h, c.kind, c.workStepId]);
  i.useEffect(() => {
    xe();
  }, [xe]);
  const re = i.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    t.forEach((w) => {
      s.has(w.projectId) || s.set(w.projectId, []), s.get(w.projectId).push(w);
    });
    const l = /* @__PURE__ */ new Map();
    a.forEach((w) => {
      const j = w.parentDocumentId || "root";
      l.has(j) || l.set(j, []), l.get(j).push(w);
    });
    const p = (w) => (l.get(w) || []).sort((j, K) => (j.sortOrder ?? 0) - (K.sortOrder ?? 0) || j.title.localeCompare(K.title, "tr")).map((j) => {
      const K = p(j.id), fa = (j.projectId ? s.get(j.projectId) || [] : []).slice().sort((W, ga) => W.order - ga.order).map((W) => ({
        key: `step-${W.id}`,
        kind: "workstep",
        workStepId: W.id,
        projectId: W.projectId,
        label: `${W.order} · ${W.name}`,
        icon: "fa-diagram-next",
        count: W.documentCount,
        children: []
      }));
      return {
        key: `folder-${j.id}`,
        kind: "folder",
        documentId: j.id,
        projectId: j.projectId,
        label: j.title,
        icon: j.projectId ? "fa-diagram-project" : "fa-folder",
        children: [...fa, ...K]
      };
    });
    return p("root");
  }, [a, t]), he = i.useRef(!1);
  i.useEffect(() => {
    if (he.current || x || re.length === 0) return;
    const s = r.get("folder"), l = r.get("step");
    if (!s && !l) {
      he.current = !0;
      return;
    }
    const p = (j) => j.flatMap((K) => [K, ...p(K.children || [])]), w = p(re).find((j) => s ? j.documentId === s : j.workStepId === l);
    he.current = !0, w && (S(w), be((j) => /* @__PURE__ */ new Set([...j, w.key])));
  }, [x, re, r]), i.useEffect(() => {
    const s = new URLSearchParams();
    B !== "files" && s.set("tab", B), c.kind === "folder" ? s.set("folder", c.documentId) : c.kind === "workstep" ? s.set("step", c.workStepId) : c.kind === "smart" && s.set("smart", c.smart), U.trim() && s.set("q", U.trim()), G !== "list" && s.set("view", G), _ !== "creationTime desc" && s.set("sort", _), H > 0 && s.set("page", String(H));
    const l = s.toString();
    window.history.replaceState(null, "", l ? `${window.location.pathname}?${l}` : window.location.pathname);
  }, [B, c, U, G, _, H]);
  const la = i.useCallback(async (s) => {
    we(s.id), Ce(!0);
    try {
      ce(await Be(s.id));
    } catch (l) {
      T("error", "Belge detayı açılamadı."), console.error("[Documents] openDetail", l);
    } finally {
      Ce(!1);
    }
  }, []), ia = async (s) => {
    ze(!0);
    try {
      await ba(s.id, {
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
        fields: s.fields.map((l) => ({
          fieldId: l.fieldId,
          valueText: l.valueText ?? null,
          valueNumber: l.valueNumber ?? null,
          valueDate: l.valueDate ?? null
        })),
        tags: s.tags || []
      }), L("Belge güncellendi."), ce(await Be(s.id)), await O();
    } catch (l) {
      T("error", "Belge güncellenemedi."), console.error("[Documents] handleSave", l);
    } finally {
      ze(!1);
    }
  }, ra = async () => {
    if (Q)
      try {
        await wa(Q.id), Se === Q.id && (we(null), ce(null)), L("Belge silindi."), await Promise.all([O(), ie()]);
      } catch (s) {
        T("error", "Belge silinemedi."), console.error("[Documents] handleDelete", s);
      } finally {
        ue(null);
      }
  }, oa = (s) => {
    de.current = P.has(s.id) ? Array.from(P) : [s.id];
  }, ca = async (s) => {
    const l = de.current;
    if (l.length)
      try {
        l.length === 1 ? await Na(l[0], s) : await Me(l, s), L(l.length === 1 ? "Belge taşındı." : `${l.length} belge taşındı.`), q(/* @__PURE__ */ new Set()), await O();
      } catch (p) {
        T("error", "Taşıma başarısız oldu."), console.error("[Documents] move", p);
      } finally {
        de.current = [];
      }
  }, da = async () => {
    const s = window.prompt("Hedef klasör adını yazın:");
    if (!s) return;
    const l = a.find((p) => p.title.toLocaleLowerCase("tr") === s.toLocaleLowerCase("tr"));
    if (!l) {
      T("warn", "Klasör bulunamadı.");
      return;
    }
    try {
      await Me(Array.from(P), l.id), L(`${P.size} belge taşındı.`), q(/* @__PURE__ */ new Set()), await O();
    } catch (p) {
      T("error", "Toplu taşıma başarısız oldu."), console.error("[Documents] bulkMove", p);
    }
  }, ua = async () => {
    const s = window.prompt("Etiket(ler) — virgülle ayırın:");
    if (!s) return;
    const l = s.split(",").map((p) => p.trim()).filter(Boolean);
    if (l.length)
      try {
        await Sa(Array.from(P), l), L(`${P.size} belge etiketlendi.`), q(/* @__PURE__ */ new Set()), await O();
      } catch (p) {
        T("error", "Etiketleme başarısız oldu."), console.error("[Documents] bulkTag", p);
      }
  }, Ee = async (s) => {
    if (!N || !(s != null && s.length)) return;
    const l = ye.current;
    ye.current = null, Te(!0);
    try {
      let p = null;
      for (const w of Array.from(s)) {
        const j = await Fa(N, w);
        p = p ?? (j == null ? void 0 : j.documentFileId) ?? null;
      }
      l && p ? (await Ea({
        assignmentId: l.assignmentId,
        requirementId: l.requirementId,
        workStepId: l.workStepId || null,
        periodCode: l.periodCode || null,
        documentFileId: p
      }), L(`Yüklendi ve "${l.title}" kalemine bağlandı.`)) : L(s.length === 1 ? "Dosya yüklendi." : `${s.length} dosya yüklendi.`), await Promise.all([O(), ie(), le(), xe()]);
    } catch (p) {
      T("error", "Dosya yüklenemedi."), console.error("[Documents] upload", p);
    } finally {
      Te(!1);
    }
  }, ma = (s) => {
    var l;
    if (!N) {
      T("warn", "Yükleme klasör bağlamında yapılır — soldan bir klasör seçin.");
      return;
    }
    ye.current = s, (l = me.current) == null || l.click();
  }, pa = () => {
    const s = new window.abp.ModalManager(se() + "Documents/CreateModal");
    s.open({ parentDocumentId: N || void 0 }), s.onResult(() => {
      le(), L("Klasör oluşturuldu.");
    });
  }, Re = (s) => be((l) => {
    const p = new Set(l);
    return p.has(s) ? p.delete(s) : p.add(s), p;
  }), ya = (s) => {
    var l;
    S(s), te(0), q(/* @__PURE__ */ new Set()), (l = s.key) != null && l.startsWith("folder-") && Re(s.key);
  }, xa = (s) => q((l) => {
    const p = new Set(l);
    return p.has(s) ? p.delete(s) : p.add(s), p;
  }), ha = () => q((s) => g.every((l) => s.has(l.id)) ? /* @__PURE__ */ new Set() : new Set(g.map((l) => l.id)));
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto",
      style: { maxWidth: 1560 },
      onDragOver: (s) => {
        N && s.preventDefault();
      },
      onDrop: (s) => {
        var l;
        !N || !((l = s.dataTransfer.files) != null && l.length) || (s.preventDefault(), Ee(s.dataTransfer.files));
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Dokümanlar" }),
            /* @__PURE__ */ e.jsx("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: "Klasörler, belgeler ve meta veri" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            ne && /* @__PURE__ */ e.jsx(
              "a",
              {
                className: "apya-doc-linkbtn",
                href: `${se()}Documents/Upload${N ? `?documentId=${N}` : ""}`,
                children: "Toplu yükleme"
              }
            ),
            ne && /* @__PURE__ */ e.jsx(E, { variant: "secondary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-plus" }), onClick: pa, children: "Yeni klasör" }),
            ne && /* @__PURE__ */ e.jsx(
              E,
              {
                variant: "primary",
                isLoading: ea,
                disabled: !N,
                title: N ? void 0 : "Önce bir klasör seçin",
                leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
                onClick: () => {
                  var s;
                  return (s = me.current) == null ? void 0 : s.click();
                },
                children: "Yükle"
              }
            ),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                ref: me,
                type: "file",
                multiple: !0,
                hidden: !0,
                onChange: (s) => {
                  Ee(s.target.files), s.target.value = "";
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(ls, { uploadedThisMonth: f, expiring: z, compliance: Ge }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-doc-tabs", role: "tablist", children: [
          { key: "files", label: "Dosyalar" },
          { key: "compliance", label: "Uygunluk" },
          { key: "activity", label: "Etkinlik" }
        ].map((s) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": B === s.key,
            className: D("apya-doc-tab", B === s.key && "is-active"),
            onClick: () => _e(s.key),
            children: s.label
          },
          s.key
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: D("apya-docs-shell", B !== "files" && "is-wide"), children: [
          /* @__PURE__ */ e.jsx(
            La,
            {
              loading: x,
              tree: re,
              activeKey: c.key,
              expanded: J,
              onToggle: Re,
              onSelect: ya,
              onDropFiles: ca,
              dragTarget: Qe,
              setDragTarget: Xe
            }
          ),
          B === "compliance" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(
            Xa,
            {
              projectId: h,
              periodCode: null,
              onSummaryChange: He
            }
          ) }) : B === "activity" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(ss, { projectId: h, documentFileId: null }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "apya-grid-toolbar", style: { padding: "12px 14px", borderBottom: "1px solid var(--apya-border-subtle)" }, children: [
              /* @__PURE__ */ e.jsx(
                Y,
                {
                  size: "sm",
                  className: "apya-grid-search",
                  leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
                  placeholder: "Bu bağlamda filtrele",
                  value: U,
                  onChange: (s) => {
                    Ke(s.target.value), te(0);
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-grid-count apya-numeric", children: [
                C,
                " belge"
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-viewtoggle", children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: D(G === "list" && "is-active"),
                    onClick: () => Ne("list"),
                    "aria-label": "Liste görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: D(G === "grid" && "is-active"),
                    onClick: () => Ne("grid"),
                    "aria-label": "Kart görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-border-all" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              Ka,
              {
                loading: F,
                files: g,
                totalCount: C,
                view: G,
                sorting: _,
                onSort: (s) => {
                  Ye(s), te(0);
                },
                selectedId: Se,
                onSelect: la,
                checkedIds: P,
                onToggleCheck: xa,
                onToggleAll: ha,
                page: H,
                pageSize: ve,
                onPageChange: te,
                onDragStart: oa,
                emptyHint: N ? 'Dosyaları buraya sürükleyin ya da "Yükle" ile ekleyin.' : "Sol taraftan bir klasör seçin; yükleme klasör bağlamında yapılır.",
                missingItems: aa,
                onUploadMissing: ma,
                canUpload: ne
              }
            ),
            ta && /* @__PURE__ */ e.jsx(
              Ya,
              {
                count: P.size,
                onClear: () => q(/* @__PURE__ */ new Set()),
                onMove: da,
                onTag: ua
              }
            )
          ] }),
          B === "files" && /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx(
            Va,
            {
              detail: Ve,
              loading: Ze,
              canEdit: sa,
              documentTypes: d,
              saving: Je,
              onSave: ia,
              onDelete: na ? ue : () => {
              }
            }
          ) })
        ] }),
        Q && /* @__PURE__ */ e.jsx(
          ns,
          {
            title: "Belge silinecek",
            message: `"${Q.displayName}" ve tüm versiyonları kalıcı olarak silinecek.`,
            onConfirm: ra,
            onCancel: () => ue(null)
          }
        ),
        De && /* @__PURE__ */ e.jsx(ts, { message: De, onDone: () => Ie(null) })
      ]
    }
  );
}
const Oe = document.getElementById("documents-island");
Oe && va(Oe).render(/* @__PURE__ */ e.jsx(is, {}));
