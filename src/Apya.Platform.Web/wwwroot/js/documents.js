import { j as e, r as o, b as oa } from "./react-vendor.js";
/* empty css      */
import { S as Ne, B as T, g as M, h as ca, I as U } from "./Dialog.js";
import { S as ae } from "./SkeletonShape.js";
import { E as V } from "./EmptyState.js";
import { H as Se } from "./Hint.js";
const da = () => {
  var a, n, t;
  return (t = (n = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : n.documents) == null ? void 0 : t.document;
}, H = (a) => {
  var n, t;
  return (t = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.auth) == null ? void 0 : t.isGranted(a);
}, C = (a, n) => {
  var t, c, r;
  return (r = (c = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.notify) == null ? void 0 : c[a]) == null ? void 0 : r.call(c, n);
}, Fe = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function D(a) {
  return new Promise((n, t) => {
    window.abp.ajax(a).done(n).fail(t);
  });
}
const S = (a, n = {}) => {
  const t = new URLSearchParams();
  Object.entries(n).forEach(([r, u]) => {
    u != null && u !== "" && t.append(r, u);
  });
  const c = t.toString();
  return `${Fe()}Documents?handler=${a}${c ? "&" + c : ""}`;
}, Z = (a, n) => D({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(n) }), we = (a) => D({ url: S("Files", a), type: "GET" }), Ce = (a) => D({ url: S("File", { id: a }), type: "GET" }), ua = (a, n) => Z(S("UpdateFileMeta", { id: a }), n), ma = (a, n) => D({ url: S("MoveFile", { id: a, targetDocumentId: n }), type: "POST" }), ze = (a, n) => Z(S("BulkMove"), { documentFileIds: a, targetDocumentId: n }), pa = (a, n, t = !1) => Z(S("BulkTag"), { documentFileIds: a, tags: n, remove: t }), ya = (a) => D({ url: S("DeleteFile", { id: a }), type: "POST" }), xa = () => D({ url: S("DocumentTypes"), type: "GET" }), ha = (a) => D({ url: S("WorkSteps", { projectId: a }), type: "GET" }), fa = (a) => D({ url: S("CompliancePackages", { projectId: a }), type: "GET" }), ga = (a, n) => D({ url: S("ComplianceOverview", { projectId: a, periodCode: n }), type: "GET" }), va = (a, n, t) => Z(S("ApplyCompliancePackage"), { projectId: a, packageId: n, periodCode: t }), ja = (a) => D({ url: S("RemoveComplianceAssignment", { assignmentId: a }), type: "POST" }), ka = (a) => Z(S("WaiveComplianceItem"), a), ba = (a) => D({ url: S("Activity", a), type: "GET" }), Na = (a, n) => {
  const t = new FormData();
  return t.append("documentId", a), t.append("file", n), D({
    url: S("UploadFile"),
    type: "POST",
    data: t,
    contentType: !1,
    processData: !1
  });
}, N = (...a) => a.filter(Boolean).join(" "), F = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  money: (a, n) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + (n ? " " + Sa(n) : ""),
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toFixed(1) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
};
function Sa(a) {
  return { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }[a] || a;
}
const G = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Kesin", chip: "apya-chip-positive" },
  3: { text: "Eşleşti", chip: "apya-chip-accent" },
  4: { text: "Süre dolan", chip: "apya-chip-negative" }
}, De = {
  1: { text: "Manuel", variant: "neutral" },
  2: { text: "OCR", variant: "brand" },
  3: { text: "AI", variant: "accent" },
  4: { text: "Kural", variant: "warning" }
}, wa = {
  1: "Yüklendi",
  2: "İndirildi",
  3: "Silindi",
  4: "Görüntülendi",
  5: "Meta değişti",
  6: "Taşındı"
};
function oe(a, n) {
  var c;
  const t = ((c = (n || "").split(".").pop()) == null ? void 0 : c.toLowerCase()) || "";
  return a != null && a.includes("pdf") || t === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444", label: "PDF" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(t) ? { icon: "fa-file-excel", color: "#10B981", label: "XLS" } : a != null && a.includes("word") || ["docx", "doc"].includes(t) ? { icon: "fa-file-word", color: "#3B82F6", label: "DOC" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(t) ? { icon: "fa-file-powerpoint", color: "#F59E0B", label: "PPT" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(t) ? { icon: "fa-file-image", color: "#8B5CF6", label: "IMG" } : ["zip", "rar", "7z"].includes(t) ? { icon: "fa-file-zipper", color: "#6B7280", label: "ZIP" } : { icon: "fa-file", color: "#6B7280", label: "DOSYA" };
}
function Ca(a) {
  const n = ["apya-chip-accent", "apya-chip-brand", "apya-chip-positive", "apya-chip-warning", "apya-chip-neutral"];
  let t = 0;
  for (let c = 0; c < a.length; c++) t = t * 31 + a.charCodeAt(c) >>> 0;
  return n[t % n.length];
}
const za = [
  { key: "expiring", label: "Süresi dolanlar", icon: "fa-clock-rotate-left" },
  { key: "missing-meta", label: "Eksik meta", icon: "fa-triangle-exclamation" }
];
function Ee({
  node: a,
  depth: n,
  activeKey: t,
  expanded: c,
  onToggle: r,
  onSelect: u,
  onDropFiles: p,
  dragTarget: m,
  setDragTarget: x
}) {
  var b;
  const h = ((b = a.children) == null ? void 0 : b.length) > 0, k = c.has(a.key), v = m === a.documentId && a.documentId;
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => u(a),
        onDragOver: (j) => {
          a.documentId && (j.preventDefault(), x(a.documentId));
        },
        onDragLeave: () => x(null),
        onDrop: (j) => {
          a.documentId && (j.preventDefault(), x(null), p(a.documentId));
        },
        className: N("apya-md-item", t === a.key && "selected"),
        style: {
          paddingLeft: 10 + n * 14,
          borderRadius: 8,
          ...v ? { outline: "2px dashed var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
        },
        children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              role: "button",
              tabIndex: -1,
              onClick: (j) => {
                j.stopPropagation(), h && r(a.key);
              },
              className: "w-3 flex-shrink-0",
              style: { color: "var(--apya-text-tertiary)" },
              children: h && /* @__PURE__ */ e.jsx("i", { className: `fa fa-chevron-${k ? "down" : "right"}`, style: { fontSize: 9 } })
            }
          ),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${a.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: a.label }),
          typeof a.count == "number" && /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: a.count })
        ]
      }
    ),
    h && k && a.children.map((j) => /* @__PURE__ */ e.jsx(
      Ee,
      {
        node: j,
        depth: n + 1,
        activeKey: t,
        expanded: c,
        onToggle: r,
        onSelect: u,
        onDropFiles: p,
        dragTarget: m,
        setDragTarget: x
      },
      j.key
    ))
  ] });
}
function Da({
  loading: a,
  tree: n,
  activeKey: t,
  expanded: c,
  onToggle: r,
  onSelect: u,
  onDropFiles: p,
  dragTarget: m,
  setDragTarget: x
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Bağlam" }),
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => u({ key: "all", kind: "all" }),
        className: N("apya-md-item", t === "all" && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-tree", style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", style: { fontWeight: 600 }, children: "Tüm Dokümanlar" })
        ]
      }
    ),
    a ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(ae, { rows: 5 }) }) : n.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör yok." }) : n.map((h) => /* @__PURE__ */ e.jsx(
      Ee,
      {
        node: h,
        depth: 0,
        activeKey: t,
        expanded: c,
        onToggle: r,
        onSelect: u,
        onDropFiles: p,
        dragTarget: m,
        setDragTarget: x
      },
      h.key
    )),
    /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Akıllı klasörler" }),
    za.map((h) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => u({ key: h.key, kind: "smart", smart: h.key }),
        className: N("apya-md-item", t === h.key && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${h.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: h.label })
        ]
      },
      h.key
    ))
  ] });
}
const Be = [
  { key: "displayName", label: "Belge", sortable: !0, width: "minmax(0,1fr)" },
  { key: "workStep", label: "İş adımı", sortable: !1, width: "140px" },
  { key: "type", label: "Tür", sortable: !1, width: "96px" },
  { key: "amount", label: "Tutar", sortable: !0, width: "116px", align: "right" },
  { key: "documentDate", label: "Tarih", sortable: !0, width: "96px" },
  { key: "status", label: "Durum", sortable: !1, width: "110px" }
], $e = `34px ${Be.map((a) => a.width).join(" ")}`;
function Ta({ column: a, sorting: n, onSort: t }) {
  if (!a.sortable)
    return /* @__PURE__ */ e.jsx("span", { style: { textAlign: a.align || "left" }, children: a.label });
  const [c, r] = (n || "").split(" "), u = c === a.key, p = u && r !== "desc" ? "desc" : "asc";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => t(`${a.key} ${p}`),
      className: "d-flex align-items-center gap-1",
      style: {
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        font: "inherit",
        color: u ? "var(--apya-accent-500)" : "inherit",
        justifyContent: a.align === "right" ? "flex-end" : "flex-start",
        width: "100%"
      },
      "aria-sort": u ? r === "desc" ? "descending" : "ascending" : "none",
      children: [
        a.label,
        /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${u ? r === "desc" ? "arrow-down" : "arrow-up" : "arrows-up-down"}`,
            style: { fontSize: 8, opacity: u ? 1 : 0.4 }
          }
        )
      ]
    }
  );
}
function Ia({ file: a, selected: n, checked: t, onSelect: c, onToggleCheck: r, onDragStart: u }) {
  const p = oe(a.contentType, a.fileName), m = G[a.status] || G[1];
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !0,
      onDragStart: () => u(a),
      onClick: () => c(a),
      className: N("apya-doc-row", n && "is-selected"),
      style: { gridTemplateColumns: $e },
      children: [
        /* @__PURE__ */ e.jsx("span", { onClick: (x) => {
          x.stopPropagation(), r(a.id);
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
              style: { width: 26, height: 26, borderRadius: 7, background: `${p.color}1a`, color: p.color, fontSize: 11 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${p.icon}` })
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
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right" }, children: F.money(a.amount, a.currency) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: F.date(a.documentDate || a.creationTime) }),
        /* @__PURE__ */ e.jsx("span", { children: /* @__PURE__ */ e.jsx("span", { className: N("apya-chip", m.chip), children: m.text }) })
      ]
    }
  );
}
function Fa({ file: a, selected: n, onSelect: t, onDragStart: c }) {
  const r = oe(a.contentType, a.fileName), u = G[a.status] || G[1];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: !0,
      onDragStart: () => c(a),
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
            /* @__PURE__ */ e.jsx("span", { className: "apya-tile-icon-box", style: { background: `${r.color}1a`, color: r.color }, children: /* @__PURE__ */ e.jsx("i", { className: `fa ${r.icon}` }) }),
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
          /* @__PURE__ */ e.jsx("span", { className: N("apya-chip", u.chip), children: u.text }),
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
function Ea({
  loading: a,
  files: n,
  totalCount: t,
  view: c,
  sorting: r,
  onSort: u,
  selectedId: p,
  onSelect: m,
  checkedIds: x,
  onToggleCheck: h,
  onToggleAll: k,
  page: v,
  pageSize: b,
  onPageChange: j,
  onDragStart: y,
  emptyHint: E
}) {
  const i = n.length > 0 && n.every((l) => x.has(l.id)), z = Math.max(1, Math.ceil(t / b));
  return a ? c === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: Array.from({ length: 6 }).map((l, f) => /* @__PURE__ */ e.jsx(Ne, { height: 120, rounded: "lg" }, f)) }) : /* @__PURE__ */ e.jsx("div", { className: "p-3 d-flex flex-column gap-2", children: Array.from({ length: 8 }).map((l, f) => /* @__PURE__ */ e.jsx(Ne, { height: 40, rounded: "md" }, f)) }) : n.length === 0 ? /* @__PURE__ */ e.jsx(
    V,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
      title: "Burada henüz belge yok",
      description: E
    }
  ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    c === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: n.map((l) => /* @__PURE__ */ e.jsx(
      Fa,
      {
        file: l,
        selected: p === l.id,
        onSelect: m,
        onDragStart: y
      },
      l.id
    )) }) : /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-row-head", style: { gridTemplateColumns: $e }, children: [
        /* @__PURE__ */ e.jsx("span", { onClick: k, style: { cursor: "pointer" }, children: /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${i ? "square-check" : "square"}`,
            style: { fontSize: 13, color: i ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
            role: "checkbox",
            "aria-checked": i
          }
        ) }),
        Be.map((l) => /* @__PURE__ */ e.jsx(Ta, { column: l, sorting: r, onSort: u }, l.key))
      ] }),
      n.map((l) => /* @__PURE__ */ e.jsx(
        Ia,
        {
          file: l,
          selected: p === l.id,
          checked: x.has(l.id),
          onSelect: m,
          onToggleCheck: h,
          onDragStart: y
        },
        l.id
      ))
    ] }),
    z > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            v * b + 1,
            "–",
            Math.min((v + 1) * b, t),
            " / ",
            t
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(T, { variant: "outline", size: "sm", disabled: v === 0, onClick: () => j(v - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              v + 1,
              " / ",
              z
            ] }),
            /* @__PURE__ */ e.jsx(T, { variant: "outline", size: "sm", disabled: v + 1 >= z, onClick: () => j(v + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
function Ba({ count: a, onClear: n, onMove: t, onTag: c, busy: r }) {
  return a === 0 ? null : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-bulkbar", children: [
    /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
      a,
      " belge seçildi"
    ] }),
    /* @__PURE__ */ e.jsx("span", { style: { width: 1, height: 18, background: "rgba(255,255,255,.18)" } }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: t, disabled: r, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-open" }),
      " Taşı"
    ] }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: c, disabled: r, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-tag" }),
      " Etiketle"
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
    /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: n, children: "Vazgeç" })
  ] });
}
function $a({ tags: a }) {
  return a != null && a.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1", children: a.map((n) => /* @__PURE__ */ e.jsx("span", { className: N("apya-chip", Ca(n)), children: n }, n)) }) : null;
}
function Ra({ field: a, value: n, onChange: t, disabled: c }) {
  const r = { size: "sm", disabled: c, value: n ?? "" };
  switch (a.fieldType) {
    case 2:
      return /* @__PURE__ */ e.jsx(U, { ...r, type: "date", onChange: (u) => t({ valueDate: u.target.value || null }) });
    case 3:
    case 4:
    case 5:
      return /* @__PURE__ */ e.jsx(
        U,
        {
          ...r,
          type: "number",
          step: a.fieldType === 3 ? "0.01" : "1",
          onChange: (u) => t({ valueNumber: u.target.value === "" ? null : Number(u.target.value) })
        }
      );
    default:
      return /* @__PURE__ */ e.jsx(U, { ...r, onChange: (u) => t({ valueText: u.target.value || null }) });
  }
}
function Aa(a) {
  return a.fieldType === 2 ? a.valueDate ? a.valueDate.substring(0, 10) : "" : [3, 4, 5].includes(a.fieldType) ? a.valueNumber ?? "" : a.valueText ?? "";
}
function Pa({
  detail: a,
  loading: n,
  canEdit: t,
  onSave: c,
  onDelete: r,
  saving: u,
  documentTypes: p
}) {
  var y, E;
  const [m, x] = o.useState(null);
  if (o.useEffect(() => {
    x(a ? { ...a, fields: (a.fields || []).map((i) => ({ ...i })) } : null);
  }, [a == null ? void 0 : a.id]), n)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(ae, { rows: 6 }) });
  if (!a || !m)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(
      V,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir belge seçin",
        description: "Künye, özel alanlar ve versiyon geçmişi burada görünür."
      }
    ) });
  const h = oe(a.contentType, a.fileName), k = G[m.status] || G[1], v = F.daysLeft(m.expiryDate), b = (i, z) => {
    x((l) => ({
      ...l,
      fields: l.fields.map((f) => f.fieldId === i ? { ...f, valueText: null, valueNumber: null, valueDate: null, ...z } : f)
    }));
  }, j = m.fields.filter(
    (i) => i.isRequired && !i.valueText && i.valueNumber === null && !i.valueDate
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-md-detail", style: { overflowY: "auto" }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
      /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "d-grid place-items-center flex-shrink-0",
          style: { width: 48, height: 48, borderRadius: 14, background: `${h.color}1a`, color: h.color, fontSize: 20 },
          children: /* @__PURE__ */ e.jsx("i", { className: `fa ${h.icon}` })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 14, fontWeight: 600, wordBreak: "break-word" }, children: a.displayName }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric mt-1", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
          F.size(a.fileSize),
          " · ",
          h.label,
          a.versionCount > 1 && ` · v${a.versionCount}`
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-1 mt-1 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: N("apya-chip", k.chip), children: k.text }),
          v !== null && v >= 0 && v <= 30 && /* @__PURE__ */ e.jsxs(M, { variant: "warning", size: "sm", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
            " ",
            v,
            " gün"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-3", children: [
      a.downloadUrl && /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: ca({ variant: "primary" }), style: { flex: 1 }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }),
      t && !a.isLocked && /* @__PURE__ */ e.jsx(T, { variant: "outline", onClick: () => r(a), title: "Sil", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash", style: { color: "var(--apya-negative-500)" } }) })
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
        /* @__PURE__ */ e.jsx(Se, { text: "Alan şeması belge tipine bağlıdır. Tip değiştirdiğinizde kaydettikten sonra o tipin alanları görünür." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tipi" }),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-select",
              disabled: !t || a.isLocked,
              value: m.documentTypeId || "",
              onChange: (i) => x({ ...m, documentTypeId: i.target.value || null }),
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "— Sınıflandırılmamış —" }),
                p.map((i) => /* @__PURE__ */ e.jsx("option", { value: i.id, children: i.name }, i.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Tutar" }),
          /* @__PURE__ */ e.jsx(
            U,
            {
              size: "sm",
              type: "number",
              step: "0.01",
              disabled: !t || a.isLocked,
              value: m.amount ?? "",
              onChange: (i) => x({ ...m, amount: i.target.value === "" ? null : Number(i.target.value) })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tarihi" }),
          /* @__PURE__ */ e.jsx(
            U,
            {
              size: "sm",
              type: "date",
              disabled: !t || a.isLocked,
              value: m.documentDate ? m.documentDate.substring(0, 10) : "",
              onChange: (i) => x({ ...m, documentDate: i.target.value || null })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Dönem" }),
          /* @__PURE__ */ e.jsx(
            U,
            {
              size: "sm",
              placeholder: "2026-Q2",
              disabled: !t || a.isLocked,
              value: m.periodCode ?? "",
              onChange: (i) => x({ ...m, periodCode: i.target.value || null })
            }
          )
        ] }),
        m.fields.map((i) => {
          var z, l;
          return /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              i.label,
              i.isRequired && /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-negative-500)" }, children: "*" }),
              /* @__PURE__ */ e.jsx(M, { variant: ((z = De[i.fillSource]) == null ? void 0 : z.variant) || "neutral", size: "sm", children: ((l = De[i.fillSource]) == null ? void 0 : l.text) || "—" }),
              i.confidence !== null && i.confidence !== void 0 && /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10 }, children: [
                "%",
                i.confidence
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              Ra,
              {
                field: i,
                value: Aa(i),
                disabled: !t || a.isLocked,
                onChange: (f) => b(i.fieldId, f)
              }
            )
          ] }, i.fieldId);
        })
      ] }),
      j.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", style: { fontSize: 11, color: "var(--apya-warning-500)" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation" }),
        " ",
        j.length,
        " zorunlu alan boş."
      ] }),
      t && !a.isLocked && /* @__PURE__ */ e.jsx(
        T,
        {
          variant: "primary",
          size: "sm",
          className: "mt-3 w-100",
          isLoading: u,
          onClick: () => c(m),
          children: "Kaydet"
        }
      )
    ] }),
    ((y = a.tags) == null ? void 0 : y.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Etiketler" }),
      /* @__PURE__ */ e.jsx($a, { tags: a.tags })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Versiyonlar",
        /* @__PURE__ */ e.jsx(Se, { text: "Aynı klasöre aynı isimle yeniden yüklenen dosya yeni versiyon olur; önceki versiyonlar burada kalır." })
      ] }),
      (E = a.versions) != null && E.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1", children: a.versions.map((i) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsxs(M, { variant: i.isLatest ? "brand" : "neutral", size: "sm", children: [
            "v",
            i.versionNumber
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { color: "var(--apya-text-secondary)" }, children: i.uploaderName })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { color: "var(--apya-text-tertiary)" }, children: F.date(i.creationTime) })
      ] }, i.id)) }) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Versiyon kaydı yok." })
    ] })
  ] });
}
const Te = {
  1: { text: "Karşılandı", chip: "apya-chip-positive", icon: "fa-check" },
  2: { text: "Eksik", chip: "apya-chip-warning", icon: "fa-triangle-exclamation" },
  3: { text: "Feragat", chip: "apya-chip-neutral", icon: "fa-ban" }
}, Ma = { 1: "Proje", 2: "İş adımı", 3: "Dönem" };
function La({ percent: a, blocking: n }) {
  const t = n > 0 ? "var(--apya-negative-500)" : a >= 90 ? "var(--apya-positive-500)" : "var(--apya-warning-500)";
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", role: "progressbar", "aria-valuenow": a, "aria-valuemin": 0, "aria-valuemax": 100, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a}%`, background: t } }) });
}
function Oa({ item: a, canManage: n, onWaive: t, busy: c }) {
  const r = Te[a.status] || Te[2], u = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || Ma[a.scope];
  return /* @__PURE__ */ e.jsxs("div", { className: N("apya-doc-check-row", a.status === 2 && a.isBlocking && "is-blocking"), children: [
    /* @__PURE__ */ e.jsxs("span", { className: N("apya-chip", r.chip), children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa ${r.icon}` }),
      " ",
      r.text
    ] }),
    /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.title }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
        u,
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
          disabled: c,
          onClick: () => t(a, a.status !== 3),
          children: a.status === 3 ? "Feragati kaldır" : "Feragat et"
        }
      )
    ] })
  ] });
}
function Wa({ projectId: a, periodCode: n, onSummaryChange: t }) {
  const [c, r] = o.useState(null), [u, p] = o.useState([]), [m, x] = o.useState(!0), [h, k] = o.useState(!1), v = H("Platform.Documents.ManageCompliance"), b = o.useCallback(async () => {
    if (!a) {
      r(null), x(!1);
      return;
    }
    x(!0);
    try {
      const [l, f] = await Promise.all([
        ga(a, n),
        fa(a)
      ]);
      r(l), p(f ?? []), t == null || t((l == null ? void 0 : l.summary) ?? null);
    } catch (l) {
      C("error", "Uygunluk verisi yüklenemedi."), console.error("[Documents] compliance load", l);
    } finally {
      x(!1);
    }
  }, [a, n, t]);
  o.useEffect(() => {
    b();
  }, [b]);
  const j = async (l) => {
    k(!0);
    try {
      await va(a, l, n || null), await b();
    } catch (f) {
      C("error", "Paket uygulanamadı."), console.error("[Documents] applyPackage", f);
    } finally {
      k(!1);
    }
  }, y = async (l) => {
    k(!0);
    try {
      await ja(l), await b();
    } catch (f) {
      C("error", "Paket kaldırılamadı."), console.error("[Documents] removeAssignment", f);
    } finally {
      k(!1);
    }
  }, E = async (l, f, I) => {
    const K = I ? window.prompt("Feragat gerekçesi:") : null;
    if (!(I && !K)) {
      k(!0);
      try {
        await ka({
          assignmentId: l.assignmentId,
          requirementId: f.requirementId,
          workStepId: f.workStepId,
          periodCode: f.periodCode,
          waive: I,
          reason: K
        }), await b();
      } catch (L) {
        C("error", "İşlem başarısız oldu."), console.error("[Documents] waive", L);
      } finally {
        k(!1);
      }
    }
  };
  if (!a)
    return /* @__PURE__ */ e.jsx(
      V,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-check" }),
        title: "Önce bir proje bağlamı seçin",
        description: "Uygunluk, projeye uygulanan kurum paketleri üzerinden hesaplanır."
      }
    );
  if (m)
    return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(ae, { rows: 6 }) });
  const i = (c == null ? void 0 : c.checklists) ?? [], z = u.filter((l) => !l.isApplied);
  return /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
    i.length === 0 ? /* @__PURE__ */ e.jsx(
      V,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-list" }),
        title: "Bu projeye henüz kurum paketi uygulanmadı",
        description: "Aşağıdan bir paket seçerek kontrol listesini başlatın."
      }
    ) : i.map((l) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
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
          l.summary.blockingMissingCount > 0 && /* @__PURE__ */ e.jsxs(M, { variant: "negative", size: "sm", children: [
            l.summary.blockingMissingCount,
            " bloke"
          ] }),
          v && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: h,
              onClick: () => y(l.assignmentId),
              children: "Kaldır"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(La, { percent: l.summary.percent, blocking: l.summary.blockingMissingCount }),
      /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
        l.summary.satisfiedCount,
        " / ",
        l.summary.totalCount - l.summary.waivedCount,
        " kalem tamam",
        l.summary.waivedCount > 0 && ` · ${l.summary.waivedCount} feragat`
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-list", children: l.items.map((f, I) => /* @__PURE__ */ e.jsx(
        Oa,
        {
          item: f,
          canManage: v,
          busy: h,
          onWaive: (K, L) => E(l, K, L)
        },
        `${f.requirementId}-${f.workStepId || f.periodCode || I}`
      )) })
    ] }, l.assignmentId)),
    v && z.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Uygulanabilir paketler" }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: z.map((l) => /* @__PURE__ */ e.jsxs(
        T,
        {
          variant: "outline",
          size: "sm",
          disabled: h,
          leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          onClick: () => j(l.id),
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
const Y = 25, Ua = {
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
}, Ka = [
  { value: "", label: "Tümü" },
  { value: "1", label: "Yüklendi" },
  { value: "2", label: "İndirildi" },
  { value: "5", label: "Meta değişti" },
  { value: "3", label: "Silindi" }
];
function qa({ projectId: a, documentFileId: n }) {
  const [t, c] = o.useState([]), [r, u] = o.useState(0), [p, m] = o.useState(0), [x, h] = o.useState(""), [k, v] = o.useState(!0), b = o.useCallback(async () => {
    v(!0);
    try {
      const y = await ba({
        maxResultCount: Y,
        skipCount: p * Y,
        projectId: a || void 0,
        documentFileId: n || void 0,
        action: x || void 0
      });
      c(y.items ?? []), u(y.totalCount ?? 0);
    } catch (y) {
      C("error", "Etkinlik kaydı yüklenemedi."), console.error("[Documents] activity load", y);
    } finally {
      v(!1);
    }
  }, [a, n, x, p]);
  o.useEffect(() => {
    b();
  }, [b]);
  const j = Math.max(1, Math.ceil(r / Y));
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center gap-2 flex-wrap px-3 py-2",
        style: { borderBottom: "1px solid var(--apya-border-subtle)" },
        children: [
          Ka.map((y) => /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: N("apya-doc-filterchip", x === y.value && "is-active"),
              onClick: () => {
                h(y.value), m(0);
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
    k ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(ae, { rows: 8 }) }) : t.length === 0 ? /* @__PURE__ */ e.jsx(
      V,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left" }),
        title: "Henüz kayıtlı etkinlik yok",
        description: "Yükleme, indirme, meta değişikliği ve silme işlemleri burada iz bırakır."
      }
    ) : /* @__PURE__ */ e.jsx("div", { children: t.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", children: [
      /* @__PURE__ */ e.jsx("span", { className: N("apya-chip", Ua[y.action] || "apya-chip-neutral"), children: wa[y.action] || "—" }),
      /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: y.documentFileName || y.folderName || "—" }),
        y.detail && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: y.detail })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12 }, children: y.actorName }),
        y.actorRole && /* @__PURE__ */ e.jsx(M, { variant: "neutral", size: "sm", children: y.actorRole })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: F.dateTime(y.creationTime) })
    ] }, y.id)) }),
    j > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            p * Y + 1,
            "–",
            Math.min((p + 1) * Y, r),
            " / ",
            r
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(T, { variant: "outline", size: "sm", disabled: p === 0, onClick: () => m(p - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              p + 1,
              " / ",
              j
            ] }),
            /* @__PURE__ */ e.jsx(T, { variant: "outline", size: "sm", disabled: p + 1 >= j, onClick: () => m(p + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
const re = 25;
function Ga({ message: a, onDone: n }) {
  return o.useEffect(() => {
    const t = setTimeout(n, 2800);
    return () => clearTimeout(t);
  }, [n]), /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-check", style: { fontSize: 11, color: "var(--apya-positive-500)" } }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: a })
  ] });
}
function _a({ title: a, message: n, onConfirm: t, onCancel: c }) {
  const [r, u] = o.useState(!1);
  return /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: c, children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-dialog", onClick: (p) => p.stopPropagation(), children: [
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
      /* @__PURE__ */ e.jsx(T, { variant: "outline", size: "sm", onClick: c, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        T,
        {
          variant: "destructive",
          size: "sm",
          isLoading: r,
          onClick: async () => {
            u(!0), await t(), u(!1);
          },
          children: "Evet, sil"
        }
      )
    ] })
  ] }) });
}
function Ya({ total: a, expiring: n, compliance: t }) {
  const c = [
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
    { key: "total", label: "Toplam belge", value: a, icon: "fa-folder-open", tone: "accent" },
    { key: "expiring", label: "Süresi dolan", value: n ?? "—", icon: "fa-clock-rotate-left", tone: "negative" }
  ];
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-kpis", children: c.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("span", { className: N("apya-doc-kpi-icon", `is-${r.tone}`), children: /* @__PURE__ */ e.jsx("i", { className: `fa ${r.icon}` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: r.label })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: r.value }),
    r.foot && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: r.foot })
  ] }, r.key)) });
}
function Ha() {
  const [a, n] = o.useState([]), [t, c] = o.useState([]), [r, u] = o.useState([]), [p, m] = o.useState(!0), [x, h] = o.useState([]), [k, v] = o.useState(0), [b, j] = o.useState(null), [y, E] = o.useState(!0), [i, z] = o.useState({ key: "all", kind: "all" }), [l, f] = o.useState(/* @__PURE__ */ new Set()), [I, K] = o.useState(""), [L, Re] = o.useState("creationTime desc"), [se, ce] = o.useState("list"), [te, J] = o.useState(0), [q, Ae] = o.useState("files"), [Pe, Me] = o.useState(null), [de, ue] = o.useState(null), [Le, ne] = o.useState(null), [Oe, me] = o.useState(!1), [We, pe] = o.useState(!1), [$, O] = o.useState(/* @__PURE__ */ new Set()), [Ue, Ke] = o.useState(null), le = o.useRef([]), [_, ie] = o.useState(null), [ye, xe] = o.useState(null), [qe, he] = o.useState(!1), fe = o.useRef(null), ge = H("Platform.Documents.Create"), Ge = H("Platform.Documents.ManageMeta"), _e = H("Platform.Documents.BulkOperations"), Ye = H("Platform.Documents.Delete"), W = o.useCallback((s) => xe(s), []), Q = o.useCallback(async () => {
    m(!0);
    try {
      const [s, d, g] = await Promise.all([
        da().getList({ maxResultCount: 1e3, sorting: "title asc" }),
        ha(),
        xa()
      ]);
      n(s.items ?? []), c(d ?? []), u(g ?? []);
    } catch (s) {
      C("error", "Klasör ağacı yüklenemedi."), console.error("[Documents] loadTree", s);
    } finally {
      m(!1);
    }
  }, []);
  o.useEffect(() => {
    Q();
  }, [Q]);
  const ve = o.useMemo(() => {
    const s = { maxResultCount: re, skipCount: te * re, sorting: L };
    return I.trim() && (s.filterText = I.trim()), i.kind === "folder" ? (s.documentId = i.documentId, s.includeSubFolders = !0) : i.kind === "workstep" ? s.workStepId = i.workStepId : i.kind === "smart" && i.smart === "expiring" ? s.expiringWithinDays = 30 : i.kind === "smart" && i.smart === "missing-meta" && (s.missingRequiredFields = !0), s;
  }, [i, te, L, I]), R = o.useCallback(async () => {
    E(!0);
    try {
      const s = await we(ve);
      h(s.items ?? []), v(s.totalCount ?? 0);
    } catch (s) {
      C("error", "Belge listesi yüklenemedi."), console.error("[Documents] loadFiles", s);
    } finally {
      E(!1);
    }
  }, [ve]);
  o.useEffect(() => {
    R();
  }, [R]);
  const X = o.useCallback(async () => {
    try {
      const s = await we({ maxResultCount: 1, skipCount: 0, expiringWithinDays: 30 });
      j(s.totalCount ?? 0);
    } catch (s) {
      console.error("[Documents] loadKpis", s);
    }
  }, []);
  o.useEffect(() => {
    X();
  }, [X]);
  const He = o.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    t.forEach((B) => {
      s.has(B.projectId) || s.set(B.projectId, []), s.get(B.projectId).push(B);
    });
    const d = /* @__PURE__ */ new Map();
    a.forEach((B) => {
      const w = B.parentDocumentId || "root";
      d.has(w) || d.set(w, []), d.get(w).push(B);
    });
    const g = (B) => (d.get(B) || []).sort((w, ee) => (w.sortOrder ?? 0) - (ee.sortOrder ?? 0) || w.title.localeCompare(ee.title, "tr")).map((w) => {
      const ee = g(w.id), ia = (w.projectId ? s.get(w.projectId) || [] : []).slice().sort((P, ra) => P.order - ra.order).map((P) => ({
        key: `step-${P.id}`,
        kind: "workstep",
        workStepId: P.id,
        projectId: P.projectId,
        label: `${P.order} · ${P.name}`,
        icon: "fa-diagram-next",
        count: P.documentCount,
        children: []
      }));
      return {
        key: `folder-${w.id}`,
        kind: "folder",
        documentId: w.id,
        projectId: w.projectId,
        label: w.title,
        icon: w.projectId ? "fa-diagram-project" : "fa-folder",
        children: [...ia, ...ee]
      };
    });
    return g("root");
  }, [a, t]), Ve = o.useCallback(async (s) => {
    ue(s.id), me(!0);
    try {
      ne(await Ce(s.id));
    } catch (d) {
      C("error", "Belge detayı açılamadı."), console.error("[Documents] openDetail", d);
    } finally {
      me(!1);
    }
  }, []), Ze = async (s) => {
    pe(!0);
    try {
      await ua(s.id, {
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
        fields: s.fields.map((d) => ({
          fieldId: d.fieldId,
          valueText: d.valueText ?? null,
          valueNumber: d.valueNumber ?? null,
          valueDate: d.valueDate ?? null
        })),
        tags: s.tags || []
      }), W("Belge güncellendi."), ne(await Ce(s.id)), await R();
    } catch (d) {
      C("error", "Belge güncellenemedi."), console.error("[Documents] handleSave", d);
    } finally {
      pe(!1);
    }
  }, Je = async () => {
    if (_)
      try {
        await ya(_.id), de === _.id && (ue(null), ne(null)), W("Belge silindi."), await Promise.all([R(), X()]);
      } catch (s) {
        C("error", "Belge silinemedi."), console.error("[Documents] handleDelete", s);
      } finally {
        ie(null);
      }
  }, Qe = (s) => {
    le.current = $.has(s.id) ? Array.from($) : [s.id];
  }, Xe = async (s) => {
    const d = le.current;
    if (d.length)
      try {
        d.length === 1 ? await ma(d[0], s) : await ze(d, s), W(d.length === 1 ? "Belge taşındı." : `${d.length} belge taşındı.`), O(/* @__PURE__ */ new Set()), await R();
      } catch (g) {
        C("error", "Taşıma başarısız oldu."), console.error("[Documents] move", g);
      } finally {
        le.current = [];
      }
  }, ea = async () => {
    const s = window.prompt("Hedef klasör adını yazın:");
    if (!s) return;
    const d = a.find((g) => g.title.toLocaleLowerCase("tr") === s.toLocaleLowerCase("tr"));
    if (!d) {
      C("warn", "Klasör bulunamadı.");
      return;
    }
    try {
      await ze(Array.from($), d.id), W(`${$.size} belge taşındı.`), O(/* @__PURE__ */ new Set()), await R();
    } catch (g) {
      C("error", "Toplu taşıma başarısız oldu."), console.error("[Documents] bulkMove", g);
    }
  }, aa = async () => {
    const s = window.prompt("Etiket(ler) — virgülle ayırın:");
    if (!s) return;
    const d = s.split(",").map((g) => g.trim()).filter(Boolean);
    if (d.length)
      try {
        await pa(Array.from($), d), W(`${$.size} belge etiketlendi.`), O(/* @__PURE__ */ new Set()), await R();
      } catch (g) {
        C("error", "Etiketleme başarısız oldu."), console.error("[Documents] bulkTag", g);
      }
  }, A = i.kind === "folder" ? i.documentId : null, je = i.projectId || null, ke = async (s) => {
    if (!(!A || !(s != null && s.length))) {
      he(!0);
      try {
        for (const d of Array.from(s))
          await Na(A, d);
        W(s.length === 1 ? "Dosya yüklendi." : `${s.length} dosya yüklendi.`), await Promise.all([R(), X(), Q()]);
      } catch (d) {
        C("error", "Dosya yüklenemedi."), console.error("[Documents] upload", d);
      } finally {
        he(!1);
      }
    }
  }, sa = () => {
    const s = new window.abp.ModalManager(Fe() + "Documents/CreateModal");
    s.open({ parentDocumentId: A || void 0 }), s.onResult(() => {
      Q(), W("Klasör oluşturuldu.");
    });
  }, be = (s) => f((d) => {
    const g = new Set(d);
    return g.has(s) ? g.delete(s) : g.add(s), g;
  }), ta = (s) => {
    var d;
    z(s), J(0), O(/* @__PURE__ */ new Set()), (d = s.key) != null && d.startsWith("folder-") && be(s.key);
  }, na = (s) => O((d) => {
    const g = new Set(d);
    return g.has(s) ? g.delete(s) : g.add(s), g;
  }), la = () => O((s) => x.every((d) => s.has(d.id)) ? /* @__PURE__ */ new Set() : new Set(x.map((d) => d.id)));
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto",
      style: { maxWidth: 1560 },
      onDragOver: (s) => {
        A && s.preventDefault();
      },
      onDrop: (s) => {
        var d;
        !A || !((d = s.dataTransfer.files) != null && d.length) || (s.preventDefault(), ke(s.dataTransfer.files));
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Dokümanlar" }),
            /* @__PURE__ */ e.jsx("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: "Klasörler, belgeler ve meta veri" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            ge && /* @__PURE__ */ e.jsx(T, { variant: "secondary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-plus" }), onClick: sa, children: "Yeni klasör" }),
            ge && /* @__PURE__ */ e.jsx(
              T,
              {
                variant: "primary",
                isLoading: qe,
                disabled: !A,
                title: A ? void 0 : "Önce bir klasör seçin",
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
                  ke(s.target.files), s.target.value = "";
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(Ya, { total: k, expiring: b, compliance: Pe }),
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
            className: N("apya-doc-tab", q === s.key && "is-active"),
            onClick: () => Ae(s.key),
            children: s.label
          },
          s.key
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: N("apya-docs-shell", q !== "files" && "is-wide"), children: [
          /* @__PURE__ */ e.jsx(
            Da,
            {
              loading: p,
              tree: He,
              activeKey: i.key,
              expanded: l,
              onToggle: be,
              onSelect: ta,
              onDropFiles: Xe,
              dragTarget: Ue,
              setDragTarget: Ke
            }
          ),
          q === "compliance" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(
            Wa,
            {
              projectId: je,
              periodCode: null,
              onSummaryChange: Me
            }
          ) }) : q === "activity" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(qa, { projectId: je, documentFileId: null }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "apya-grid-toolbar", style: { padding: "12px 14px", borderBottom: "1px solid var(--apya-border-subtle)" }, children: [
              /* @__PURE__ */ e.jsx(
                U,
                {
                  size: "sm",
                  className: "apya-grid-search",
                  leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
                  placeholder: "Bu bağlamda filtrele",
                  value: I,
                  onChange: (s) => {
                    K(s.target.value), J(0);
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-grid-count apya-numeric", children: [
                k,
                " belge"
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-viewtoggle", children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: N(se === "list" && "is-active"),
                    onClick: () => ce("list"),
                    "aria-label": "Liste görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: N(se === "grid" && "is-active"),
                    onClick: () => ce("grid"),
                    "aria-label": "Kart görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-border-all" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              Ea,
              {
                loading: y,
                files: x,
                totalCount: k,
                view: se,
                sorting: L,
                onSort: (s) => {
                  Re(s), J(0);
                },
                selectedId: de,
                onSelect: Ve,
                checkedIds: $,
                onToggleCheck: na,
                onToggleAll: la,
                page: te,
                pageSize: re,
                onPageChange: J,
                onDragStart: Qe,
                emptyHint: A ? 'Dosyaları buraya sürükleyin ya da "Yükle" ile ekleyin.' : "Sol taraftan bir klasör seçin; yükleme klasör bağlamında yapılır."
              }
            ),
            _e && /* @__PURE__ */ e.jsx(
              Ba,
              {
                count: $.size,
                onClear: () => O(/* @__PURE__ */ new Set()),
                onMove: ea,
                onTag: aa
              }
            )
          ] }),
          q === "files" && /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx(
            Pa,
            {
              detail: Le,
              loading: Oe,
              canEdit: Ge,
              documentTypes: r,
              saving: We,
              onSave: Ze,
              onDelete: Ye ? ie : () => {
              }
            }
          ) })
        ] }),
        _ && /* @__PURE__ */ e.jsx(
          _a,
          {
            title: "Belge silinecek",
            message: `"${_.displayName}" ve tüm versiyonları kalıcı olarak silinecek.`,
            onConfirm: Je,
            onCancel: () => ie(null)
          }
        ),
        ye && /* @__PURE__ */ e.jsx(Ga, { message: ye, onDone: () => xe(null) })
      ]
    }
  );
}
const Ie = document.getElementById("documents-island");
Ie && oa(Ie).render(/* @__PURE__ */ e.jsx(Ha, {}));
