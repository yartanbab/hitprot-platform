import { j as e, r as i, b as ka } from "./react-vendor.js";
/* empty css      */
import { S as Be, B as R, g as L, h as ba, I as G } from "./Dialog.js";
import { S as de } from "./SkeletonShape.js";
import { E as ne } from "./EmptyState.js";
import { H as ve } from "./Hint.js";
const Na = () => {
  var a, n, s;
  return (s = (n = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : n.documents) == null ? void 0 : s.document;
}, se = (a) => {
  var n, s;
  return (s = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.auth) == null ? void 0 : s.isGranted(a);
}, I = (a, n) => {
  var s, u, d;
  return (d = (u = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.notify) == null ? void 0 : u[a]) == null ? void 0 : d.call(u, n);
}, le = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function E(a) {
  return new Promise((n, s) => {
    window.abp.ajax(a).done(n).fail(s);
  });
}
const D = (a, n = {}) => {
  const s = new URLSearchParams();
  Object.entries(n).forEach(([d, m]) => {
    m != null && m !== "" && s.append(d, m);
  });
  const u = s.toString();
  return `${le()}Documents?handler=${a}${u ? "&" + u : ""}`;
}, Q = (a, n) => E({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(n) }), je = (a) => E({ url: D("Files", a), type: "GET" }), Me = (a) => E({ url: D("File", { id: a }), type: "GET" }), Sa = (a, n) => Q(D("UpdateFileMeta", { id: a }), n), wa = (a, n) => E({ url: D("MoveFile", { id: a, targetDocumentId: n }), type: "POST" }), Pe = (a, n) => Q(D("BulkMove"), { documentFileIds: a, targetDocumentId: n }), Ca = (a, n, s = !1) => Q(D("BulkTag"), { documentFileIds: a, tags: n, remove: s }), za = (a) => E({ url: D("DeleteFile", { id: a }), type: "POST" }), Da = (a) => E({ url: D("RestoreFile", { id: a }), type: "POST" }), Ia = () => E({ url: D("DocumentTypes"), type: "GET" }), Ta = (a) => E({ url: D("WorkSteps", { projectId: a }), type: "GET" }), $a = (a) => E({ url: D("CompliancePackages", { projectId: a }), type: "GET" }), Ue = (a, n) => E({ url: D("ComplianceOverview", { projectId: a, periodCode: n }), type: "GET" }), Ea = (a, n, s) => Q(D("ApplyCompliancePackage"), { projectId: a, packageId: n, periodCode: s }), Ra = (a) => E({ url: D("RemoveComplianceAssignment", { assignmentId: a }), type: "POST" }), Fa = (a) => Q(D("WaiveComplianceItem"), a), Ba = (a) => Q(D("LinkComplianceDocument"), a), Ma = (a) => E({ url: D("Activity", a), type: "GET" }), Pa = (a, n) => {
  const s = new FormData();
  return s.append("documentId", a), s.append("file", n), E({
    url: D("UploadFile"),
    type: "POST",
    data: s,
    contentType: !1,
    processData: !1
  });
}, T = (...a) => a.filter(Boolean).join(" "), F = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  money: (a, n) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + (n ? " " + Aa(n) : ""),
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toFixed(1) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
};
function Aa(a) {
  return { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }[a] || a;
}
const J = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Kesin", chip: "apya-chip-positive" },
  3: { text: "Eşleşti", chip: "apya-chip-accent" },
  4: { text: "Süre dolan", chip: "apya-chip-negative" }
}, Ae = {
  1: { text: "Manuel", variant: "neutral" },
  2: { text: "OCR", variant: "brand" },
  3: { text: "AI", variant: "accent" },
  4: { text: "Kural", variant: "warning" }
}, La = {
  1: "Yüklendi",
  2: "İndirildi",
  3: "Silindi",
  4: "Görüntülendi",
  5: "Meta değişti",
  6: "Taşındı"
};
function be(a, n) {
  var u;
  const s = ((u = (n || "").split(".").pop()) == null ? void 0 : u.toLowerCase()) || "";
  return a != null && a.includes("pdf") || s === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444", label: "PDF" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(s) ? { icon: "fa-file-excel", color: "#10B981", label: "XLS" } : a != null && a.includes("word") || ["docx", "doc"].includes(s) ? { icon: "fa-file-word", color: "#3B82F6", label: "DOC" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(s) ? { icon: "fa-file-powerpoint", color: "#F59E0B", label: "PPT" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(s) ? { icon: "fa-file-image", color: "#8B5CF6", label: "IMG" } : ["zip", "rar", "7z"].includes(s) ? { icon: "fa-file-zipper", color: "#6B7280", label: "ZIP" } : { icon: "fa-file", color: "#6B7280", label: "DOSYA" };
}
function Oa(a) {
  const n = ["apya-chip-accent", "apya-chip-brand", "apya-chip-positive", "apya-chip-warning", "apya-chip-neutral"];
  let s = 0;
  for (let u = 0; u < a.length; u++) s = s * 31 + a.charCodeAt(u) >>> 0;
  return n[s % n.length];
}
const Wa = [
  { key: "expiring", label: "Süresi dolanlar", icon: "fa-clock-rotate-left" },
  { key: "missing-meta", label: "Eksik meta", icon: "fa-triangle-exclamation" },
  { key: "trash", label: "Çöp kutusu", icon: "fa-trash-can" }
];
function qe({
  node: a,
  depth: n,
  activeKey: s,
  expanded: u,
  onToggle: d,
  onSelect: m,
  onDropFiles: y,
  dragTarget: x,
  setDragTarget: h
}) {
  var C;
  const f = ((C = a.children) == null ? void 0 : C.length) > 0, S = u.has(a.key), j = x === a.documentId && a.documentId;
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m(a),
        onDragOver: (b) => {
          a.documentId && (b.preventDefault(), h(a.documentId));
        },
        onDragLeave: () => h(null),
        onDrop: (b) => {
          a.documentId && (b.preventDefault(), h(null), y(a.documentId));
        },
        className: T("apya-md-item", s === a.key && "selected"),
        style: {
          paddingLeft: 10 + n * 14,
          borderRadius: 8,
          ...j ? { outline: "2px dashed var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
        },
        children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              role: "button",
              tabIndex: -1,
              onClick: (b) => {
                b.stopPropagation(), f && d(a.key);
              },
              className: "w-3 flex-shrink-0",
              style: { color: "var(--apya-text-tertiary)" },
              children: f && /* @__PURE__ */ e.jsx("i", { className: `fa fa-chevron-${S ? "down" : "right"}`, style: { fontSize: 9 } })
            }
          ),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${a.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: a.label }),
          typeof a.count == "number" && /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: a.count })
        ]
      }
    ),
    f && S && a.children.map((b) => /* @__PURE__ */ e.jsx(
      qe,
      {
        node: b,
        depth: n + 1,
        activeKey: s,
        expanded: u,
        onToggle: d,
        onSelect: m,
        onDropFiles: y,
        dragTarget: x,
        setDragTarget: h
      },
      b.key
    ))
  ] });
}
function Ua({
  loading: a,
  tree: n,
  activeKey: s,
  expanded: u,
  onToggle: d,
  onSelect: m,
  onDropFiles: y,
  dragTarget: x,
  setDragTarget: h
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Bağlam" }),
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m({ key: "all", kind: "all" }),
        className: T("apya-md-item", s === "all" && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-tree", style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", style: { fontWeight: 600 }, children: "Tüm Dokümanlar" })
        ]
      }
    ),
    a ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(de, { rows: 5 }) }) : n.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör yok." }) : n.map((f) => /* @__PURE__ */ e.jsx(
      qe,
      {
        node: f,
        depth: 0,
        activeKey: s,
        expanded: u,
        onToggle: d,
        onSelect: m,
        onDropFiles: y,
        dragTarget: x,
        setDragTarget: h
      },
      f.key
    )),
    /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Akıllı klasörler" }),
    Wa.map((f) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m({ key: f.key, kind: "smart", smart: f.key }),
        className: T("apya-md-item", s === f.key && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${f.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: f.label })
        ]
      },
      f.key
    ))
  ] });
}
const Ke = [
  { key: "displayName", label: "Belge", sortable: !0, width: "minmax(0,1fr)" },
  { key: "workStep", label: "İş adımı", sortable: !1, width: "140px" },
  { key: "type", label: "Tür", sortable: !1, width: "96px" },
  { key: "amount", label: "Tutar", sortable: !0, width: "116px", align: "right" },
  { key: "documentDate", label: "Tarih", sortable: !0, width: "96px" },
  { key: "status", label: "Durum", sortable: !1, width: "110px" }
], Ne = `34px ${Ke.map((a) => a.width).join(" ")}`;
function qa({ column: a, sorting: n, onSort: s }) {
  if (!a.sortable)
    return /* @__PURE__ */ e.jsx("span", { style: { textAlign: a.align || "left" }, children: a.label });
  const [u, d] = (n || "").split(" "), m = u === a.key, y = m && d !== "desc" ? "desc" : "asc";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => s(`${a.key} ${y}`),
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
function Ka({ item: a, onUpload: n, canUpload: s }) {
  const u = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || "Proje";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-missing-row", style: { gridTemplateColumns: Ne }, children: [
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
    /* @__PURE__ */ e.jsx("span", { children: s ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-missing-upload", onClick: () => n(a), children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
      " Yükle"
    ] }) : /* @__PURE__ */ e.jsx("span", { className: "apya-chip apya-chip-warning", children: "Eksik" }) })
  ] });
}
function Ya({ file: a, selected: n, checked: s, onSelect: u, onToggleCheck: d, onDragStart: m, isTrash: y, onRestore: x }) {
  const h = be(a.contentType, a.fileName), f = J[a.status] || J[1];
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !y,
      onDragStart: y ? void 0 : () => m(a),
      onClick: y ? void 0 : () => u(a),
      className: T("apya-doc-row", n && "is-selected", y && "is-trashed"),
      style: { gridTemplateColumns: Ne },
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            onClick: y ? void 0 : (S) => {
              S.stopPropagation(), d(a.id);
            },
            style: { cursor: y ? "default" : "pointer" },
            children: y ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash-can", style: { fontSize: 12, color: "var(--apya-text-tertiary)" } }) : /* @__PURE__ */ e.jsx(
              "i",
              {
                className: `fa fa-${s ? "square-check" : "square"}`,
                style: { fontSize: 13, color: s ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
                role: "checkbox",
                "aria-checked": s
              }
            )
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 26, height: 26, borderRadius: 7, background: `${h.color}1a`, color: h.color, fontSize: 11 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${h.icon}` })
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
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right" }, children: F.money(a.amount, a.currency) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: F.date(a.documentDate || a.creationTime) }),
        /* @__PURE__ */ e.jsx("span", { children: y ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => x(a), children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-rotate-left" }),
          " Geri al"
        ] }) : /* @__PURE__ */ e.jsx("span", { className: T("apya-chip", f.chip), children: f.text }) })
      ]
    }
  );
}
function Ga({ file: a, selected: n, onSelect: s, onDragStart: u }) {
  const d = be(a.contentType, a.fileName), m = J[a.status] || J[1];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: !0,
      onDragStart: () => u(a),
      onClick: () => s(a),
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
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(L, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", style: { borderTop: "none", paddingTop: 0 }, children: [
          /* @__PURE__ */ e.jsx("span", { className: T("apya-chip", m.chip), children: m.text }),
          a.amount !== null && a.amount !== void 0 && /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: F.money(a.amount, a.currency) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", children: a.uploaderName || "Sistem" }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", children: F.date(a.documentDate || a.creationTime) })
        ] })
      ]
    }
  );
}
function _a({
  loading: a,
  files: n,
  totalCount: s,
  view: u,
  sorting: d,
  onSort: m,
  selectedId: y,
  onSelect: x,
  checkedIds: h,
  onToggleCheck: f,
  onToggleAll: S,
  page: j,
  pageSize: C,
  onPageChange: b,
  onDragStart: g,
  emptyHint: O,
  missingItems: B = [],
  onUploadMissing: c,
  canUpload: r = !1,
  isTrash: o = !1,
  onRestore: z
}) {
  const k = n.length > 0 && n.every((N) => h.has(N.id)), $ = Math.max(1, Math.ceil(s / C)), ie = j === 0 && u === "list" ? B : [];
  return a ? u === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: Array.from({ length: 6 }).map((N, _) => /* @__PURE__ */ e.jsx(Be, { height: 120, rounded: "lg" }, _)) }) : /* @__PURE__ */ e.jsx("div", { className: "p-3 d-flex flex-column gap-2", children: Array.from({ length: 8 }).map((N, _) => /* @__PURE__ */ e.jsx(Be, { height: 40, rounded: "md" }, _)) }) : n.length === 0 && ie.length === 0 ? /* @__PURE__ */ e.jsx(
    ne,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
      title: "Burada henüz belge yok",
      description: O
    }
  ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    u === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: n.map((N) => /* @__PURE__ */ e.jsx(
      Ga,
      {
        file: N,
        selected: y === N.id,
        onSelect: x,
        onDragStart: g
      },
      N.id
    )) }) : /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-row-head", style: { gridTemplateColumns: Ne }, children: [
        /* @__PURE__ */ e.jsx("span", { onClick: S, style: { cursor: "pointer" }, children: /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${k ? "square-check" : "square"}`,
            style: { fontSize: 13, color: k ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
            role: "checkbox",
            "aria-checked": k
          }
        ) }),
        Ke.map((N) => /* @__PURE__ */ e.jsx(qa, { column: N, sorting: d, onSort: m }, N.key))
      ] }),
      ie.map((N) => /* @__PURE__ */ e.jsx(
        Ka,
        {
          item: N,
          onUpload: c,
          canUpload: r
        },
        `missing-${N.assignmentId}-${N.requirementId}-${N.workStepId || "none"}`
      )),
      n.map((N) => /* @__PURE__ */ e.jsx(
        Ya,
        {
          file: N,
          selected: y === N.id,
          checked: h.has(N.id),
          onSelect: x,
          onToggleCheck: f,
          onDragStart: g,
          isTrash: o,
          onRestore: z
        },
        N.id
      ))
    ] }),
    $ > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            j * C + 1,
            "–",
            Math.min((j + 1) * C, s),
            " / ",
            s
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(R, { variant: "outline", size: "sm", disabled: j === 0, onClick: () => b(j - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              j + 1,
              " / ",
              $
            ] }),
            /* @__PURE__ */ e.jsx(R, { variant: "outline", size: "sm", disabled: j + 1 >= $, onClick: () => b(j + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
function Ha({ count: a, onClear: n, onMove: s, onTag: u, busy: d }) {
  return a === 0 ? null : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-bulkbar", children: [
    /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
      a,
      " belge seçildi"
    ] }),
    /* @__PURE__ */ e.jsx("span", { style: { width: 1, height: 18, background: "rgba(255,255,255,.18)" } }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: s, disabled: d, children: [
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
function Va({ tags: a }) {
  return a != null && a.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1", children: a.map((n) => /* @__PURE__ */ e.jsx("span", { className: T("apya-chip", Oa(n)), children: n }, n)) }) : null;
}
const Le = {
  1: { icon: "fa-diagram-project", label: "Proje" },
  2: { icon: "fa-list-check", label: "İş adımı" },
  3: { icon: "fa-receipt", label: "Harcama", href: (a) => a ? `${le()}Expenses` : null },
  4: {
    icon: "fa-box-archive",
    label: "Teslim paketi",
    href: (a) => a ? `${le()}Documents/Deliveries?packageId=${a}` : null
  },
  5: { icon: "fa-clipboard-check", label: "Kontrol listesi kalemi" }
};
function Za({ field: a, value: n, onChange: s, disabled: u }) {
  const d = { size: "sm", disabled: u, value: n ?? "" };
  switch (a.fieldType) {
    case 2:
      return /* @__PURE__ */ e.jsx(G, { ...d, type: "date", onChange: (m) => s({ valueDate: m.target.value || null }) });
    case 3:
    case 4:
    case 5:
      return /* @__PURE__ */ e.jsx(
        G,
        {
          ...d,
          type: "number",
          step: a.fieldType === 3 ? "0.01" : "1",
          onChange: (m) => s({ valueNumber: m.target.value === "" ? null : Number(m.target.value) })
        }
      );
    default:
      return /* @__PURE__ */ e.jsx(G, { ...d, onChange: (m) => s({ valueText: m.target.value || null }) });
  }
}
function Ja(a) {
  return a.fieldType === 2 ? a.valueDate ? a.valueDate.substring(0, 10) : "" : [3, 4, 5].includes(a.fieldType) ? a.valueNumber ?? "" : a.valueText ?? "";
}
function Qa({
  detail: a,
  loading: n,
  canEdit: s,
  onSave: u,
  onDelete: d,
  saving: m,
  documentTypes: y
}) {
  var g, O, B;
  const [x, h] = i.useState(null);
  if (i.useEffect(() => {
    h(a ? { ...a, fields: (a.fields || []).map((c) => ({ ...c })) } : null);
  }, [a == null ? void 0 : a.id]), n)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(de, { rows: 6 }) });
  if (!a || !x)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(
      ne,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir belge seçin",
        description: "Künye, özel alanlar ve versiyon geçmişi burada görünür."
      }
    ) });
  const f = be(a.contentType, a.fileName), S = J[x.status] || J[1], j = F.daysLeft(x.expiryDate), C = (c, r) => {
    h((o) => ({
      ...o,
      fields: o.fields.map((z) => z.fieldId === c ? { ...z, valueText: null, valueNumber: null, valueDate: null, ...r } : z)
    }));
  }, b = x.fields.filter(
    (c) => c.isRequired && !c.valueText && c.valueNumber === null && !c.valueDate
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-md-detail", style: { overflowY: "auto" }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
      /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "d-grid place-items-center flex-shrink-0",
          style: { width: 48, height: 48, borderRadius: 14, background: `${f.color}1a`, color: f.color, fontSize: 20 },
          children: /* @__PURE__ */ e.jsx("i", { className: `fa ${f.icon}` })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 14, fontWeight: 600, wordBreak: "break-word" }, children: a.displayName }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric mt-1", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
          F.size(a.fileSize),
          " · ",
          f.label,
          a.versionCount > 1 && ` · v${a.versionCount}`
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-1 mt-1 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: T("apya-chip", S.chip), children: S.text }),
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
      a.downloadUrl && /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: ba({ variant: "primary" }), style: { flex: 1 }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }),
      s && !a.isLocked && /* @__PURE__ */ e.jsx(R, { variant: "outline", onClick: () => d(a), title: "Sil", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash", style: { color: "var(--apya-negative-500)" } }) })
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
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: F.dateTime(a.creationTime) })
      ] }),
      a.retentionUntil && /* @__PURE__ */ e.jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Saklama" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: F.date(a.retentionUntil) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Özel alanlar",
        /* @__PURE__ */ e.jsx(ve, { text: "Alan şeması belge tipine bağlıdır. Tip değiştirdiğinizde kaydettikten sonra o tipin alanları görünür." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tipi" }),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-select",
              disabled: !s || a.isLocked,
              value: x.documentTypeId || "",
              onChange: (c) => h({ ...x, documentTypeId: c.target.value || null }),
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "— Sınıflandırılmamış —" }),
                y.map((c) => /* @__PURE__ */ e.jsx("option", { value: c.id, children: c.name }, c.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Tutar" }),
          /* @__PURE__ */ e.jsx(
            G,
            {
              size: "sm",
              type: "number",
              step: "0.01",
              disabled: !s || a.isLocked,
              value: x.amount ?? "",
              onChange: (c) => h({ ...x, amount: c.target.value === "" ? null : Number(c.target.value) })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tarihi" }),
          /* @__PURE__ */ e.jsx(
            G,
            {
              size: "sm",
              type: "date",
              disabled: !s || a.isLocked,
              value: x.documentDate ? x.documentDate.substring(0, 10) : "",
              onChange: (c) => h({ ...x, documentDate: c.target.value || null })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Dönem" }),
          /* @__PURE__ */ e.jsx(
            G,
            {
              size: "sm",
              placeholder: "2026-Q2",
              disabled: !s || a.isLocked,
              value: x.periodCode ?? "",
              onChange: (c) => h({ ...x, periodCode: c.target.value || null })
            }
          )
        ] }),
        x.fields.map((c) => {
          var r, o;
          return /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              c.label,
              c.isRequired && /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-negative-500)" }, children: "*" }),
              /* @__PURE__ */ e.jsx(L, { variant: ((r = Ae[c.fillSource]) == null ? void 0 : r.variant) || "neutral", size: "sm", children: ((o = Ae[c.fillSource]) == null ? void 0 : o.text) || "—" }),
              c.confidence !== null && c.confidence !== void 0 && /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10 }, children: [
                "%",
                c.confidence
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              Za,
              {
                field: c,
                value: Ja(c),
                disabled: !s || a.isLocked,
                onChange: (z) => C(c.fieldId, z)
              }
            )
          ] }, c.fieldId);
        })
      ] }),
      b.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", style: { fontSize: 11, color: "var(--apya-warning-500)" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation" }),
        " ",
        b.length,
        " zorunlu alan boş."
      ] }),
      s && !a.isLocked && /* @__PURE__ */ e.jsx(
        R,
        {
          variant: "primary",
          size: "sm",
          className: "mt-3 w-100",
          isLoading: m,
          onClick: () => u(x),
          children: "Kaydet"
        }
      )
    ] }),
    ((g = a.tags) == null ? void 0 : g.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Etiketler" }),
      /* @__PURE__ */ e.jsx(Va, { tags: a.tags })
    ] }),
    ((O = a.related) == null ? void 0 : O.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "İlişkili kayıtlar",
        /* @__PURE__ */ e.jsx(ve, { text: "Belgenin bağlandığı harcama, içinde gittiği teslim paketi ve karşıladığı kontrol listesi kalemleri." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.related.map((c, r) => {
        var $;
        const o = Le[c.kind] ?? Le[3], z = ($ = o.href) == null ? void 0 : $.call(o, c.entityId), k = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 22, height: 22, borderRadius: 6, background: "var(--apya-surface-sunken)", color: "var(--apya-text-secondary)", fontSize: 10 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${o.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12 }, children: c.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "d-block text-truncate apya-numeric",
                style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" },
                children: [o.label, c.detail].filter(Boolean).join(" · ")
              }
            )
          ] })
        ] });
        return z ? /* @__PURE__ */ e.jsx(
          "a",
          {
            href: z,
            className: "d-flex align-items-center gap-2 text-decoration-none",
            style: { color: "inherit" },
            children: k
          },
          `${c.kind}-${c.entityId}-${r}`
        ) : /* @__PURE__ */ e.jsx("div", { className: "d-flex align-items-center gap-2", children: k }, `${c.kind}-${r}`);
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Versiyonlar",
        /* @__PURE__ */ e.jsx(ve, { text: "Aynı klasöre aynı isimle yeniden yüklenen dosya yeni versiyon olur; önceki versiyonlar burada kalır." })
      ] }),
      (B = a.versions) != null && B.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1", children: a.versions.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsxs(L, { variant: c.isLatest ? "brand" : "neutral", size: "sm", children: [
            "v",
            c.versionNumber
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { color: "var(--apya-text-secondary)" }, children: c.uploaderName })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { color: "var(--apya-text-tertiary)" }, children: F.date(c.creationTime) })
      ] }, c.id)) }) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Versiyon kaydı yok." })
    ] })
  ] });
}
const Oe = {
  1: { text: "Karşılandı", chip: "apya-chip-positive", icon: "fa-check" },
  2: { text: "Eksik", chip: "apya-chip-warning", icon: "fa-triangle-exclamation" },
  3: { text: "Feragat", chip: "apya-chip-neutral", icon: "fa-ban" }
}, Xa = { 1: "Proje", 2: "İş adımı", 3: "Dönem" };
function et({ percent: a, blocking: n }) {
  const s = n > 0 ? "var(--apya-negative-500)" : a >= 90 ? "var(--apya-positive-500)" : "var(--apya-warning-500)";
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", role: "progressbar", "aria-valuenow": a, "aria-valuemin": 0, "aria-valuemax": 100, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a}%`, background: s } }) });
}
function at({ item: a, canManage: n, onWaive: s, busy: u }) {
  const d = Oe[a.status] || Oe[2], m = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || Xa[a.scope];
  return /* @__PURE__ */ e.jsxs("div", { className: T("apya-doc-check-row", a.status === 2 && a.isBlocking && "is-blocking"), children: [
    /* @__PURE__ */ e.jsxs("span", { className: T("apya-chip", d.chip), children: [
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
      a.isBlocking && a.status === 2 && /* @__PURE__ */ e.jsx(L, { variant: "negative", size: "sm", children: "Teslimi bloke ediyor" }),
      n && a.status !== 1 && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: u,
          onClick: () => s(a, a.status !== 3),
          children: a.status === 3 ? "Feragati kaldır" : "Feragat et"
        }
      )
    ] })
  ] });
}
function tt({ projectId: a, periodCode: n, onSummaryChange: s }) {
  const [u, d] = i.useState(null), [m, y] = i.useState([]), [x, h] = i.useState(!0), [f, S] = i.useState(!1), j = se("Platform.Documents.ManageCompliance"), C = i.useCallback(async () => {
    if (!a) {
      d(null), h(!1);
      return;
    }
    h(!0);
    try {
      const [r, o] = await Promise.all([
        Ue(a, n),
        $a(a)
      ]);
      d(r), y(o ?? []), s == null || s((r == null ? void 0 : r.summary) ?? null);
    } catch (r) {
      I("error", "Uygunluk verisi yüklenemedi."), console.error("[Documents] compliance load", r);
    } finally {
      h(!1);
    }
  }, [a, n, s]);
  i.useEffect(() => {
    C();
  }, [C]);
  const b = async (r) => {
    S(!0);
    try {
      await Ea(a, r, n || null), await C();
    } catch (o) {
      I("error", "Paket uygulanamadı."), console.error("[Documents] applyPackage", o);
    } finally {
      S(!1);
    }
  }, g = async (r) => {
    S(!0);
    try {
      await Ra(r), await C();
    } catch (o) {
      I("error", "Paket kaldırılamadı."), console.error("[Documents] removeAssignment", o);
    } finally {
      S(!1);
    }
  }, O = async (r, o, z) => {
    const k = z ? window.prompt("Feragat gerekçesi:") : null;
    if (!(z && !k)) {
      S(!0);
      try {
        await Fa({
          assignmentId: r.assignmentId,
          requirementId: o.requirementId,
          workStepId: o.workStepId,
          periodCode: o.periodCode,
          waive: z,
          reason: k
        }), await C();
      } catch ($) {
        I("error", "İşlem başarısız oldu."), console.error("[Documents] waive", $);
      } finally {
        S(!1);
      }
    }
  };
  if (!a)
    return /* @__PURE__ */ e.jsx(
      ne,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-check" }),
        title: "Önce bir proje bağlamı seçin",
        description: "Uygunluk, projeye uygulanan kurum paketleri üzerinden hesaplanır."
      }
    );
  if (x)
    return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(de, { rows: 6 }) });
  const B = (u == null ? void 0 : u.checklists) ?? [], c = m.filter((r) => !r.isApplied);
  return /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
    B.length === 0 ? /* @__PURE__ */ e.jsx(
      ne,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-list" }),
        title: "Bu projeye henüz kurum paketi uygulanmadı",
        description: "Aşağıdan bir paket seçerek kontrol listesini başlatın."
      }
    ) : B.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
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
          j && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: f,
              onClick: () => g(r.assignmentId),
              children: "Kaldır"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(et, { percent: r.summary.percent, blocking: r.summary.blockingMissingCount }),
      /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
        r.summary.satisfiedCount,
        " / ",
        r.summary.totalCount - r.summary.waivedCount,
        " kalem tamam",
        r.summary.waivedCount > 0 && ` · ${r.summary.waivedCount} feragat`
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-list", children: r.items.map((o, z) => /* @__PURE__ */ e.jsx(
        at,
        {
          item: o,
          canManage: j,
          busy: f,
          onWaive: (k, $) => O(r, k, $)
        },
        `${o.requirementId}-${o.workStepId || o.periodCode || z}`
      )) })
    ] }, r.assignmentId)),
    j && c.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Uygulanabilir paketler" }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: c.map((r) => /* @__PURE__ */ e.jsxs(
        R,
        {
          variant: "outline",
          size: "sm",
          disabled: f,
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
const te = 25, st = {
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
}, nt = [
  { value: "", label: "Tümü" },
  { value: "1", label: "Yüklendi" },
  { value: "2", label: "İndirildi" },
  { value: "5", label: "Meta değişti" },
  { value: "3", label: "Silindi" }
];
function lt({ projectId: a, documentFileId: n }) {
  const [s, u] = i.useState([]), [d, m] = i.useState(0), [y, x] = i.useState(0), [h, f] = i.useState(""), [S, j] = i.useState(!0), C = i.useCallback(async () => {
    j(!0);
    try {
      const g = await Ma({
        maxResultCount: te,
        skipCount: y * te,
        projectId: a || void 0,
        documentFileId: n || void 0,
        action: h || void 0
      });
      u(g.items ?? []), m(g.totalCount ?? 0);
    } catch (g) {
      I("error", "Etkinlik kaydı yüklenemedi."), console.error("[Documents] activity load", g);
    } finally {
      j(!1);
    }
  }, [a, n, h, y]);
  i.useEffect(() => {
    C();
  }, [C]);
  const b = Math.max(1, Math.ceil(d / te));
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center gap-2 flex-wrap px-3 py-2",
        style: { borderBottom: "1px solid var(--apya-border-subtle)" },
        children: [
          nt.map((g) => /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: T("apya-doc-filterchip", h === g.value && "is-active"),
              onClick: () => {
                f(g.value), x(0);
              },
              children: g.label
            },
            g.value
          )),
          /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            d,
            " kayıt"
          ] })
        ]
      }
    ),
    S ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(de, { rows: 8 }) }) : s.length === 0 ? /* @__PURE__ */ e.jsx(
      ne,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left" }),
        title: "Henüz kayıtlı etkinlik yok",
        description: "Yükleme, indirme, meta değişikliği ve silme işlemleri burada iz bırakır."
      }
    ) : /* @__PURE__ */ e.jsx("div", { children: s.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", children: [
      /* @__PURE__ */ e.jsx("span", { className: T("apya-chip", st[g.action] || "apya-chip-neutral"), children: La[g.action] || "—" }),
      /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: g.documentFileName || g.folderName || "—" }),
        g.detail && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: g.detail })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12 }, children: g.actorName }),
        g.actorRole && /* @__PURE__ */ e.jsx(L, { variant: "neutral", size: "sm", children: g.actorRole })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: F.dateTime(g.creationTime) })
    ] }, g.id)) }),
    b > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            y * te + 1,
            "–",
            Math.min((y + 1) * te, d),
            " / ",
            d
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(R, { variant: "outline", size: "sm", disabled: y === 0, onClick: () => x(y - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              y + 1,
              " / ",
              b
            ] }),
            /* @__PURE__ */ e.jsx(R, { variant: "outline", size: "sm", disabled: y + 1 >= b, onClick: () => x(y + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
const ke = 25;
function it({ message: a, onDone: n }) {
  return i.useEffect(() => {
    const s = setTimeout(n, 2800);
    return () => clearTimeout(s);
  }, [n]), /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-check", style: { fontSize: 11, color: "var(--apya-positive-500)" } }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: a })
  ] });
}
function rt({ title: a, message: n, onConfirm: s, onCancel: u }) {
  const [d, m] = i.useState(!1);
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
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: n })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [
      /* @__PURE__ */ e.jsx(R, { variant: "outline", size: "sm", onClick: u, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        R,
        {
          variant: "destructive",
          size: "sm",
          isLoading: d,
          onClick: async () => {
            m(!0), await s(), m(!1);
          },
          children: "Evet, sil"
        }
      )
    ] })
  ] }) });
}
function ot({ uploadedThisMonth: a, expiring: n, compliance: s }) {
  const u = [
    {
      key: "compliance",
      label: "Uygunluk",
      value: s ? `%${s.percent}` : "—",
      icon: "fa-clipboard-check",
      tone: "positive",
      foot: s ? `${s.satisfiedCount} / ${s.totalCount - s.waivedCount} kalem tamam` : "Proje bağlamı seçin"
    },
    {
      key: "missing",
      label: "Eksik belge",
      value: s ? s.missingCount : "—",
      icon: "fa-triangle-exclamation",
      tone: "warning",
      foot: s && s.blockingMissingCount > 0 ? `${s.blockingMissingCount} tanesi teslimi bloke ediyor` : null
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
      /* @__PURE__ */ e.jsx("span", { className: T("apya-doc-kpi-icon", `is-${d.tone}`), children: /* @__PURE__ */ e.jsx("i", { className: `fa ${d.icon}` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: d.label })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: d.value }),
    d.foot && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: d.foot })
  ] }, d.key)) });
}
function ct() {
  const [a, n] = i.useState([]), [s, u] = i.useState([]), [d, m] = i.useState([]), [y, x] = i.useState(!0), [h, f] = i.useState([]), [S, j] = i.useState(0), [C, b] = i.useState(null), [g, O] = i.useState(null), [B, c] = i.useState(!0), r = i.useMemo(() => new URLSearchParams(window.location.search), []), [o, z] = i.useState(() => {
    const t = r.get("smart");
    return t ? { key: t, kind: "smart", smart: t } : { key: "all", kind: "all" };
  }), k = o.kind === "folder" ? o.documentId : null, $ = o.projectId || null, ie = o.kind === "smart" && o.smart === "trash", [N, _] = i.useState(/* @__PURE__ */ new Set()), [q, Ye] = i.useState(r.get("q") || ""), [H, Ge] = i.useState(r.get("sort") || "creationTime desc"), [V, Se] = i.useState(r.get("view") === "grid" ? "grid" : "list"), [Z, re] = i.useState(Number(r.get("page")) || 0), [M, _e] = i.useState(() => {
    const t = r.get("tab");
    return ["files", "compliance", "activity"].includes(t) ? t : "files";
  }), [He, Ve] = i.useState(null), [we, Ce] = i.useState(null), [Ze, ue] = i.useState(null), [Je, ze] = i.useState(!1), [Qe, De] = i.useState(!1), [W, K] = i.useState(/* @__PURE__ */ new Set()), [Xe, ea] = i.useState(null), me = i.useRef([]), [X, pe] = i.useState(null), [Ie, Te] = i.useState(null), [aa, $e] = i.useState(!1), ye = i.useRef(null), [ta, xe] = i.useState([]), he = i.useRef(null), oe = se("Platform.Documents.Create"), sa = se("Platform.Documents.ManageMeta"), na = se("Platform.Documents.BulkOperations"), la = se("Platform.Documents.Delete"), P = i.useCallback((t) => Te(t), []), ee = i.useCallback(async () => {
    x(!0);
    try {
      const [t, l, p] = await Promise.all([
        Na().getList({ maxResultCount: 1e3, sorting: "title asc" }),
        Ta(),
        Ia()
      ]);
      n(t.items ?? []), u(l ?? []), m(p ?? []);
    } catch (t) {
      I("error", "Klasör ağacı yüklenemedi."), console.error("[Documents] loadTree", t);
    } finally {
      x(!1);
    }
  }, []);
  i.useEffect(() => {
    ee();
  }, [ee]);
  const Ee = i.useMemo(() => {
    const t = { maxResultCount: ke, skipCount: Z * ke, sorting: H };
    return q.trim() && (t.filterText = q.trim()), o.kind === "folder" ? (t.documentId = o.documentId, t.includeSubFolders = !0) : o.kind === "workstep" ? t.workStepId = o.workStepId : o.kind === "smart" && o.smart === "expiring" ? t.expiringWithinDays = 30 : o.kind === "smart" && o.smart === "missing-meta" ? t.missingRequiredFields = !0 : o.kind === "smart" && o.smart === "trash" && (t.onlyDeleted = !0), t;
  }, [o, Z, H, q]), A = i.useCallback(async () => {
    c(!0);
    try {
      const t = await je(Ee);
      f(t.items ?? []), j(t.totalCount ?? 0);
    } catch (t) {
      I("error", "Belge listesi yüklenemedi."), console.error("[Documents] loadFiles", t);
    } finally {
      c(!1);
    }
  }, [Ee]);
  i.useEffect(() => {
    A();
  }, [A]);
  const ae = i.useCallback(async () => {
    try {
      const t = /* @__PURE__ */ new Date(), l = new Date(t.getFullYear(), t.getMonth(), 1).toISOString(), [p, w] = await Promise.all([
        je({ maxResultCount: 1, skipCount: 0, expiringWithinDays: 30 }),
        je({ maxResultCount: 1, skipCount: 0, uploadedAfter: l })
      ]);
      b(p.totalCount ?? 0), O(w.totalCount ?? 0);
    } catch (t) {
      console.error("[Documents] loadKpis", t);
    }
  }, []);
  i.useEffect(() => {
    ae();
  }, [ae]);
  const fe = i.useCallback(async () => {
    if (!$) {
      xe([]);
      return;
    }
    try {
      const l = ((await Ue($, null)).checklists ?? []).flatMap((p) => (p.items ?? []).filter((w) => w.status === 2).map((w) => ({ ...w, assignmentId: p.assignmentId })));
      xe(
        o.kind === "workstep" ? l.filter((p) => p.workStepId === o.workStepId) : l
      );
    } catch (t) {
      xe([]), console.error("[Documents] loadMissing", t);
    }
  }, [$, o.kind, o.workStepId]);
  i.useEffect(() => {
    fe();
  }, [fe]);
  const ce = i.useMemo(() => {
    const t = /* @__PURE__ */ new Map();
    s.forEach((w) => {
      t.has(w.projectId) || t.set(w.projectId, []), t.get(w.projectId).push(w);
    });
    const l = /* @__PURE__ */ new Map();
    a.forEach((w) => {
      const v = w.parentDocumentId || "root";
      l.has(v) || l.set(v, []), l.get(v).push(w);
    });
    const p = (w) => (l.get(w) || []).sort((v, Y) => (v.sortOrder ?? 0) - (Y.sortOrder ?? 0) || v.title.localeCompare(Y.title, "tr")).map((v) => {
      const Y = p(v.id), va = (v.projectId ? t.get(v.projectId) || [] : []).slice().sort((U, ja) => U.order - ja.order).map((U) => ({
        key: `step-${U.id}`,
        kind: "workstep",
        workStepId: U.id,
        projectId: U.projectId,
        label: `${U.order} · ${U.name}`,
        icon: "fa-diagram-next",
        count: U.documentCount,
        children: []
      }));
      return {
        key: `folder-${v.id}`,
        kind: "folder",
        documentId: v.id,
        projectId: v.projectId,
        label: v.title,
        icon: v.projectId ? "fa-diagram-project" : "fa-folder",
        children: [...va, ...Y]
      };
    });
    return p("root");
  }, [a, s]), ge = i.useRef(!1);
  i.useEffect(() => {
    if (ge.current || y || ce.length === 0) return;
    const t = r.get("folder"), l = r.get("step");
    if (!t && !l) {
      ge.current = !0;
      return;
    }
    const p = (v) => v.flatMap((Y) => [Y, ...p(Y.children || [])]), w = p(ce).find((v) => t ? v.documentId === t : v.workStepId === l);
    ge.current = !0, w && (z(w), _((v) => /* @__PURE__ */ new Set([...v, w.key])));
  }, [y, ce, r]), i.useEffect(() => {
    const t = new URLSearchParams();
    M !== "files" && t.set("tab", M), o.kind === "folder" ? t.set("folder", o.documentId) : o.kind === "workstep" ? t.set("step", o.workStepId) : o.kind === "smart" && t.set("smart", o.smart), q.trim() && t.set("q", q.trim()), V !== "list" && t.set("view", V), H !== "creationTime desc" && t.set("sort", H), Z > 0 && t.set("page", String(Z));
    const l = t.toString();
    window.history.replaceState(null, "", l ? `${window.location.pathname}?${l}` : window.location.pathname);
  }, [M, o, q, V, H, Z]);
  const ia = i.useCallback(async (t) => {
    Ce(t.id), ze(!0);
    try {
      ue(await Me(t.id));
    } catch (l) {
      I("error", "Belge detayı açılamadı."), console.error("[Documents] openDetail", l);
    } finally {
      ze(!1);
    }
  }, []), ra = async (t) => {
    De(!0);
    try {
      await Sa(t.id, {
        displayName: t.displayName,
        documentTypeId: t.documentTypeId || null,
        projectId: t.projectId || null,
        workStepId: t.workStepId || null,
        amount: t.amount,
        currency: t.currency || "TRY",
        documentDate: t.documentDate || null,
        periodCode: t.periodCode || null,
        expiryDate: t.expiryDate || null,
        externalRef: t.externalRef || null,
        status: t.status,
        fields: t.fields.map((l) => ({
          fieldId: l.fieldId,
          valueText: l.valueText ?? null,
          valueNumber: l.valueNumber ?? null,
          valueDate: l.valueDate ?? null
        })),
        tags: t.tags || []
      }), P("Belge güncellendi."), ue(await Me(t.id)), await A();
    } catch (l) {
      I("error", "Belge güncellenemedi."), console.error("[Documents] handleSave", l);
    } finally {
      De(!1);
    }
  }, oa = async () => {
    if (X)
      try {
        await za(X.id), we === X.id && (Ce(null), ue(null)), P("Belge silindi."), await Promise.all([A(), ae()]);
      } catch (t) {
        I("error", "Belge silinemedi."), console.error("[Documents] handleDelete", t);
      } finally {
        pe(null);
      }
  }, ca = (t) => {
    me.current = W.has(t.id) ? Array.from(W) : [t.id];
  }, da = async (t) => {
    const l = me.current;
    if (l.length)
      try {
        l.length === 1 ? await wa(l[0], t) : await Pe(l, t), P(l.length === 1 ? "Belge taşındı." : `${l.length} belge taşındı.`), K(/* @__PURE__ */ new Set()), await A();
      } catch (p) {
        I("error", "Taşıma başarısız oldu."), console.error("[Documents] move", p);
      } finally {
        me.current = [];
      }
  }, ua = async () => {
    const t = window.prompt("Hedef klasör adını yazın:");
    if (!t) return;
    const l = a.find((p) => p.title.toLocaleLowerCase("tr") === t.toLocaleLowerCase("tr"));
    if (!l) {
      I("warn", "Klasör bulunamadı.");
      return;
    }
    try {
      await Pe(Array.from(W), l.id), P(`${W.size} belge taşındı.`), K(/* @__PURE__ */ new Set()), await A();
    } catch (p) {
      I("error", "Toplu taşıma başarısız oldu."), console.error("[Documents] bulkMove", p);
    }
  }, ma = async () => {
    const t = window.prompt("Etiket(ler) — virgülle ayırın:");
    if (!t) return;
    const l = t.split(",").map((p) => p.trim()).filter(Boolean);
    if (l.length)
      try {
        await Ca(Array.from(W), l), P(`${W.size} belge etiketlendi.`), K(/* @__PURE__ */ new Set()), await A();
      } catch (p) {
        I("error", "Etiketleme başarısız oldu."), console.error("[Documents] bulkTag", p);
      }
  }, Re = async (t) => {
    if (!k || !(t != null && t.length)) return;
    const l = he.current;
    he.current = null, $e(!0);
    try {
      let p = null;
      for (const w of Array.from(t)) {
        const v = await Pa(k, w);
        p = p ?? (v == null ? void 0 : v.documentFileId) ?? null;
      }
      l && p ? (await Ba({
        assignmentId: l.assignmentId,
        requirementId: l.requirementId,
        workStepId: l.workStepId || null,
        periodCode: l.periodCode || null,
        documentFileId: p
      }), P(`Yüklendi ve "${l.title}" kalemine bağlandı.`)) : P(t.length === 1 ? "Dosya yüklendi." : `${t.length} dosya yüklendi.`), await Promise.all([A(), ae(), ee(), fe()]);
    } catch (p) {
      I("error", "Dosya yüklenemedi."), console.error("[Documents] upload", p);
    } finally {
      $e(!1);
    }
  }, pa = async (t) => {
    try {
      await Da(t.id), P(`"${t.displayName}" geri alındı.`), await Promise.all([A(), ae(), ee()]);
    } catch (l) {
      I("error", "Belge geri alınamadı."), console.error("[Documents] restore", l);
    }
  }, ya = (t) => {
    var l;
    if (!k) {
      I("warn", "Yükleme klasör bağlamında yapılır — soldan bir klasör seçin.");
      return;
    }
    he.current = t, (l = ye.current) == null || l.click();
  }, xa = () => {
    const t = new window.abp.ModalManager(le() + "Documents/CreateModal");
    t.open({ parentDocumentId: k || void 0 }), t.onResult(() => {
      ee(), P("Klasör oluşturuldu.");
    });
  }, Fe = (t) => _((l) => {
    const p = new Set(l);
    return p.has(t) ? p.delete(t) : p.add(t), p;
  }), ha = (t) => {
    var l;
    z(t), re(0), K(/* @__PURE__ */ new Set()), (l = t.key) != null && l.startsWith("folder-") && Fe(t.key);
  }, fa = (t) => K((l) => {
    const p = new Set(l);
    return p.has(t) ? p.delete(t) : p.add(t), p;
  }), ga = () => K((t) => h.every((l) => t.has(l.id)) ? /* @__PURE__ */ new Set() : new Set(h.map((l) => l.id)));
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto",
      style: { maxWidth: 1560 },
      onDragOver: (t) => {
        k && t.preventDefault();
      },
      onDrop: (t) => {
        var l;
        !k || !((l = t.dataTransfer.files) != null && l.length) || (t.preventDefault(), Re(t.dataTransfer.files));
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Dokümanlar" }),
            /* @__PURE__ */ e.jsx("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: "Klasörler, belgeler ve meta veri" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            oe && /* @__PURE__ */ e.jsx(
              "a",
              {
                className: "apya-doc-linkbtn",
                href: `${le()}Documents/Upload${k ? `?documentId=${k}` : ""}`,
                children: "Toplu yükleme"
              }
            ),
            oe && /* @__PURE__ */ e.jsx(R, { variant: "secondary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-plus" }), onClick: xa, children: "Yeni klasör" }),
            oe && /* @__PURE__ */ e.jsx(
              R,
              {
                variant: "primary",
                isLoading: aa,
                disabled: !k,
                title: k ? void 0 : "Önce bir klasör seçin",
                leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
                onClick: () => {
                  var t;
                  return (t = ye.current) == null ? void 0 : t.click();
                },
                children: "Yükle"
              }
            ),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                ref: ye,
                type: "file",
                multiple: !0,
                hidden: !0,
                onChange: (t) => {
                  Re(t.target.files), t.target.value = "";
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(ot, { uploadedThisMonth: g, expiring: C, compliance: He }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-doc-tabs", role: "tablist", children: [
          { key: "files", label: "Dosyalar" },
          { key: "compliance", label: "Uygunluk" },
          { key: "activity", label: "Etkinlik" }
        ].map((t) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": M === t.key,
            className: T("apya-doc-tab", M === t.key && "is-active"),
            onClick: () => _e(t.key),
            children: t.label
          },
          t.key
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: T("apya-docs-shell", M !== "files" && "is-wide"), children: [
          /* @__PURE__ */ e.jsx(
            Ua,
            {
              loading: y,
              tree: ce,
              activeKey: o.key,
              expanded: N,
              onToggle: Fe,
              onSelect: ha,
              onDropFiles: da,
              dragTarget: Xe,
              setDragTarget: ea
            }
          ),
          M === "compliance" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(
            tt,
            {
              projectId: $,
              periodCode: null,
              onSummaryChange: Ve
            }
          ) }) : M === "activity" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(lt, { projectId: $, documentFileId: null }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "apya-grid-toolbar", style: { padding: "12px 14px", borderBottom: "1px solid var(--apya-border-subtle)" }, children: [
              /* @__PURE__ */ e.jsx(
                G,
                {
                  size: "sm",
                  className: "apya-grid-search",
                  leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
                  placeholder: "Bu bağlamda filtrele",
                  value: q,
                  onChange: (t) => {
                    Ye(t.target.value), re(0);
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-grid-count apya-numeric", children: [
                S,
                " belge"
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-viewtoggle", children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: T(V === "list" && "is-active"),
                    onClick: () => Se("list"),
                    "aria-label": "Liste görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: T(V === "grid" && "is-active"),
                    onClick: () => Se("grid"),
                    "aria-label": "Kart görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-border-all" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              _a,
              {
                loading: B,
                files: h,
                totalCount: S,
                view: V,
                sorting: H,
                onSort: (t) => {
                  Ge(t), re(0);
                },
                selectedId: we,
                onSelect: ia,
                checkedIds: W,
                onToggleCheck: fa,
                onToggleAll: ga,
                page: Z,
                pageSize: ke,
                onPageChange: re,
                onDragStart: ca,
                emptyHint: k ? 'Dosyaları buraya sürükleyin ya da "Yükle" ile ekleyin.' : "Sol taraftan bir klasör seçin; yükleme klasör bağlamında yapılır.",
                missingItems: ta,
                onUploadMissing: ya,
                canUpload: oe,
                isTrash: ie,
                onRestore: pa
              }
            ),
            na && /* @__PURE__ */ e.jsx(
              Ha,
              {
                count: W.size,
                onClear: () => K(/* @__PURE__ */ new Set()),
                onMove: ua,
                onTag: ma
              }
            )
          ] }),
          M === "files" && /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx(
            Qa,
            {
              detail: Ze,
              loading: Je,
              canEdit: sa,
              documentTypes: d,
              saving: Qe,
              onSave: ra,
              onDelete: la ? pe : () => {
              }
            }
          ) })
        ] }),
        X && /* @__PURE__ */ e.jsx(
          rt,
          {
            title: "Belge silinecek",
            message: `"${X.displayName}" ve tüm versiyonları çöp kutusuna taşınacak. Sol alttaki "Çöp kutusu"ndan geri alabilirsiniz.`,
            onConfirm: oa,
            onCancel: () => pe(null)
          }
        ),
        Ie && /* @__PURE__ */ e.jsx(it, { message: Ie, onDone: () => Te(null) })
      ]
    }
  );
}
const We = document.getElementById("documents-island");
We && ka(We).render(/* @__PURE__ */ e.jsx(ct, {}));
