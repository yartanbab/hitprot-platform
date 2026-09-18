import { j as e, r as i, b as Ka } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { S as Xe, B as I, e as M, g as Wa, I as W } from "./Dialog-Bky2XNdc.js";
import { M as Pe } from "./ModalPortal-8QCz-DZi.js";
import { a as oe, g as Oa, b as Ua, c as C, d as Ya, e as qa, u as _a, f as Ga, h as Ha, i as Va, j as re, k as Qa, l as Za, r as Ja, w as Xa, m as es, n as as, o as ss, p as ts, q as ls, s as ns, t as is, v as De, x as rs, y as os, z as cs, A as ds, B as ea, E as Ee, D as us, P as ms, C as ps, F as aa, G as ys, H as xs, I as hs, J as sa, K as fs, L as gs, M as vs, N as ks } from "./ProcessRibbon-BtZ1ri4F.js";
import { S as de } from "./SkeletonShape-BzeBQ1R3.js";
import { E as ce } from "./EmptyState-D5m5kdmR.js";
import { d as ca } from "./draggableActivation-Ybw9Upbh.js";
import { H as Te } from "./Hint-CNW95h3H.js";
const D = (...a) => a.filter(Boolean).join(" "), Y = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  money: (a, r) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + (r ? " " + js(r) : ""),
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
};
function js(a) {
  return { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }[a] || a;
}
const se = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Kesin", chip: "apya-chip-positive" },
  3: { text: "Eşleşti", chip: "apya-chip-accent" },
  4: { text: "Süre dolan", chip: "apya-chip-negative" }
}, ta = {
  1: { text: "Manuel", variant: "neutral" },
  2: { text: "OCR", variant: "brand" },
  3: { text: "AI", variant: "accent" },
  4: { text: "Kural", variant: "warning" }
}, bs = {
  1: "Yüklendi",
  2: "İndirildi",
  3: "Silindi",
  4: "Görüntülendi",
  5: "Meta değişti",
  6: "Taşındı"
};
function $e(a, r) {
  var u;
  const t = ((u = (r || "").split(".").pop()) == null ? void 0 : u.toLowerCase()) || "";
  return a != null && a.includes("pdf") || t === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444", label: "PDF" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(t) ? { icon: "fa-file-excel", color: "#10B981", label: "XLS" } : a != null && a.includes("word") || ["docx", "doc"].includes(t) ? { icon: "fa-file-word", color: "#3B82F6", label: "DOC" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(t) ? { icon: "fa-file-powerpoint", color: "#F59E0B", label: "PPT" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(t) ? { icon: "fa-file-image", color: "#8B5CF6", label: "IMG" } : ["zip", "rar", "7z"].includes(t) ? { icon: "fa-file-zipper", color: "#6B7280", label: "ZIP" } : { icon: "fa-file", color: "#6B7280", label: "DOSYA" };
}
function Ns(a) {
  const r = ["apya-chip-accent", "apya-chip-brand", "apya-chip-positive", "apya-chip-warning", "apya-chip-neutral"];
  let t = 0;
  for (let u = 0; u < a.length; u++) t = t * 31 + a.charCodeAt(u) >>> 0;
  return r[t % r.length];
}
const Ss = [
  { key: "expiring", label: "Süresi dolanlar", icon: "fa-clock-rotate-left" },
  { key: "missing-meta", label: "Eksik meta", icon: "fa-triangle-exclamation" },
  { key: "suggested", label: "Öneri bekleyen", icon: "fa-wand-magic-sparkles" },
  { key: "trash", label: "Çöp kutusu", icon: "fa-trash-can" }
];
function da({
  node: a,
  depth: r,
  activeKey: t,
  expanded: u,
  onToggle: c,
  onSelect: m,
  onDropFiles: p,
  dragTarget: x,
  setDragTarget: d
}) {
  var b;
  const j = ((b = a.children) == null ? void 0 : b.length) > 0, v = u.has(a.key), f = x === a.documentId && a.documentId;
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m(a),
        onDragOver: (k) => {
          a.documentId && (k.preventDefault(), d(a.documentId));
        },
        onDragLeave: () => d(null),
        onDrop: (k) => {
          a.documentId && (k.preventDefault(), d(null), p(a.documentId));
        },
        className: D("apya-md-item", t === a.key && "selected"),
        style: {
          paddingLeft: 10 + r * 14,
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
                k.stopPropagation(), j && c(a.key);
              },
              className: "w-3 flex-shrink-0",
              style: { color: "var(--apya-text-tertiary)" },
              children: j && /* @__PURE__ */ e.jsx("i", { className: `fa fa-chevron-${v ? "down" : "right"}`, style: { fontSize: 9 } })
            }
          ),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${a.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: a.label }),
          typeof a.count == "number" && /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: a.count })
        ]
      }
    ),
    j && v && a.children.map((k) => /* @__PURE__ */ e.jsx(
      da,
      {
        node: k,
        depth: r + 1,
        activeKey: t,
        expanded: u,
        onToggle: c,
        onSelect: m,
        onDropFiles: p,
        dragTarget: x,
        setDragTarget: d
      },
      k.key
    ))
  ] });
}
function ws({
  loading: a,
  tree: r,
  activeKey: t,
  expanded: u,
  onToggle: c,
  onSelect: m,
  onDropFiles: p,
  dragTarget: x,
  setDragTarget: d
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
    a ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(de, { rows: 5 }) }) : r.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör yok." }) : r.map((j) => /* @__PURE__ */ e.jsx(
      da,
      {
        node: j,
        depth: 0,
        activeKey: t,
        expanded: u,
        onToggle: c,
        onSelect: m,
        onDropFiles: p,
        dragTarget: x,
        setDragTarget: d
      },
      j.key
    )),
    /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Akıllı klasörler" }),
    Ss.map((j) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => m({ key: j.key, kind: "smart", smart: j.key }),
        className: D("apya-md-item", t === j.key && "selected"),
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
const zs = [
  { key: "displayName", label: "Belge", sortable: !0 },
  { key: "workStep", label: "İş adımı", sortable: !1, className: "apya-doc-col-step" },
  { key: "type", label: "Tür", sortable: !1, className: "apya-doc-col-type" },
  { key: "amount", label: "Tutar", sortable: !0, align: "right" },
  { key: "documentDate", label: "Tarih", sortable: !0 },
  { key: "status", label: "Durum", sortable: !1 }
];
function Cs({ column: a, sorting: r, onSort: t }) {
  if (!a.sortable)
    return /* @__PURE__ */ e.jsx("span", { className: a.className, style: { textAlign: a.align || "left" }, children: a.label });
  const [u, c] = (r || "").split(" "), m = u === a.key, p = m && c !== "desc" ? "desc" : "asc";
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
        color: m ? "var(--apya-accent-500)" : "inherit",
        justifyContent: a.align === "right" ? "flex-end" : "flex-start",
        width: "100%"
      },
      "aria-sort": m ? c === "desc" ? "descending" : "ascending" : "none",
      children: [
        a.label,
        /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${m ? c === "desc" ? "arrow-down" : "arrow-up" : "arrows-up-down"}`,
            style: { fontSize: 8, opacity: m ? 1 : 0.4 }
          }
        )
      ]
    }
  );
}
function Is({ item: a, onUpload: r, canUpload: t }) {
  const u = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || "Proje";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-missing-row", children: [
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
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-step", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: u }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-type", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: a.documentTypeName || "—" }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right", color: "var(--apya-text-tertiary)" }, children: "—" }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-warning-700, #92400E)" }, children: "bekliyor" }),
    /* @__PURE__ */ e.jsx("span", { children: t ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-missing-upload", onClick: () => r(a), children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
      " Yükle"
    ] }) : /* @__PURE__ */ e.jsx("span", { className: "apya-chip apya-chip-warning", children: "Eksik" }) })
  ] });
}
function Ds({ file: a, selected: r, checked: t, onSelect: u, onToggleCheck: c, onDragStart: m, isTrash: p, onRestore: x }) {
  const d = $e(a.contentType, a.fileName), j = se[a.status] || se[1], v = ca(() => u(a));
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !p,
      onDragStart: p ? void 0 : () => m(a),
      onPointerDown: p ? void 0 : v.onPointerDown,
      onClick: p ? void 0 : v.onClick,
      className: D("apya-doc-row", r && "is-selected", p && "is-trashed"),
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            onClick: p ? void 0 : (f) => {
              f.stopPropagation(), c(a.id);
            },
            onPointerDown: p ? void 0 : (f) => f.stopPropagation(),
            style: { cursor: p ? "default" : "pointer" },
            children: p ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash-can", style: { fontSize: 12, color: "var(--apya-text-tertiary)" } }) : /* @__PURE__ */ e.jsx(
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
              style: { width: 26, height: 26, borderRadius: 7, background: `${d.color}1a`, color: d.color, fontSize: 11 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${d.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.displayName }),
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(M, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] }),
          a.isLocked && /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock", style: { fontSize: 10, color: "var(--apya-text-tertiary)" }, title: "Kilitli" })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-step", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-type", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: a.documentTypeName || "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right" }, children: Y.money(a.amount, a.currency) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: Y.date(a.documentDate || a.creationTime) }),
        /* @__PURE__ */ e.jsx("span", { children: p ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => x(a), children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-rotate-left" }),
          " Geri al"
        ] }) : /* @__PURE__ */ e.jsx("span", { className: D("apya-chip", j.chip), children: j.text }) })
      ]
    }
  );
}
function Es({ file: a, selected: r, onSelect: t, onDragStart: u }) {
  const c = $e(a.contentType, a.fileName), m = se[a.status] || se[1];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: !0,
      onDragStart: () => u(a),
      ...ca(() => t(a)),
      className: "apya-tile",
      style: {
        textAlign: "left",
        cursor: "pointer",
        ...r ? { borderColor: "var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-head", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-2", style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "apya-tile-icon-box", style: { background: `${c.color}1a`, color: c.color }, children: /* @__PURE__ */ e.jsx("i", { className: `fa ${c.icon}` }) }),
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
          a.amount !== null && a.amount !== void 0 && /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: Y.money(a.amount, a.currency) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", children: a.uploaderName || "Sistem" }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", children: Y.date(a.documentDate || a.creationTime) })
        ] })
      ]
    }
  );
}
function Ts({
  loading: a,
  files: r,
  totalCount: t,
  view: u,
  sorting: c,
  onSort: m,
  selectedId: p,
  onSelect: x,
  checkedIds: d,
  onToggleCheck: j,
  onToggleAll: v,
  page: f,
  pageSize: b,
  onPageChange: k,
  onDragStart: y,
  emptyHint: B,
  emptyAction: R = null,
  missingItems: n = [],
  onUploadMissing: N,
  canUpload: l = !1,
  isTrash: w = !1,
  onRestore: z
}) {
  const P = r.length > 0 && r.every((S) => d.has(S.id)), L = Math.max(1, Math.ceil(t / b)), g = f === 0 && u === "list" ? n : [];
  return a ? u === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: Array.from({ length: 6 }).map((S, $) => /* @__PURE__ */ e.jsx(Xe, { height: 120, rounded: "lg" }, $)) }) : /* @__PURE__ */ e.jsx("div", { className: "p-3 d-flex flex-column gap-2", children: Array.from({ length: 8 }).map((S, $) => /* @__PURE__ */ e.jsx(Xe, { height: 40, rounded: "md" }, $)) }) : r.length === 0 && g.length === 0 ? /* @__PURE__ */ e.jsx(
    ce,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
      title: "Burada henüz belge yok",
      description: B,
      action: R
    }
  ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    u === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: r.map((S) => /* @__PURE__ */ e.jsx(
      Es,
      {
        file: S,
        selected: p === S.id,
        onSelect: x,
        onDragStart: y
      },
      S.id
    )) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-filelist", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-row-head", children: [
        /* @__PURE__ */ e.jsx("span", { onClick: v, style: { cursor: "pointer" }, children: /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${P ? "square-check" : "square"}`,
            style: { fontSize: 13, color: P ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
            role: "checkbox",
            "aria-checked": P
          }
        ) }),
        zs.map((S) => /* @__PURE__ */ e.jsx(Cs, { column: S, sorting: c, onSort: m }, S.key))
      ] }),
      g.map((S) => /* @__PURE__ */ e.jsx(
        Is,
        {
          item: S,
          onUpload: N,
          canUpload: l
        },
        `missing-${S.assignmentId}-${S.requirementId}-${S.workStepId || "none"}`
      )),
      r.map((S) => /* @__PURE__ */ e.jsx(
        Ds,
        {
          file: S,
          selected: p === S.id,
          checked: d.has(S.id),
          onSelect: x,
          onToggleCheck: j,
          onDragStart: y,
          isTrash: w,
          onRestore: z
        },
        S.id
      ))
    ] }),
    L > 1 && /* @__PURE__ */ e.jsxs(
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
              L
            ] }),
            /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", disabled: f + 1 >= L, onClick: () => k(f + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
function Bs({ count: a, onClear: r, onMove: t, onTag: u, busy: c }) {
  return a === 0 ? null : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-bulkbar", children: [
    /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
      a,
      " belge seçildi"
    ] }),
    /* @__PURE__ */ e.jsx("span", { style: { width: 1, height: 18, background: "rgba(255,255,255,.18)" } }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: t, disabled: c, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-open" }),
      " Taşı"
    ] }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: u, disabled: c, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-tag" }),
      " Etiketle"
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
    /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: r, children: "Vazgeç" })
  ] });
}
function Ps({ tags: a }) {
  return a != null && a.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1", children: a.map((r) => /* @__PURE__ */ e.jsx("span", { className: D("apya-chip", Ns(r)), children: r }, r)) }) : null;
}
const la = {
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
function $s({ field: a, value: r, onChange: t, disabled: u }) {
  const c = { size: "sm", disabled: u, value: r ?? "" };
  switch (a.fieldType) {
    case 2:
      return /* @__PURE__ */ e.jsx(W, { ...c, type: "date", onChange: (m) => t({ valueDate: m.target.value || null }) });
    case 3:
    case 4:
    case 5:
      return /* @__PURE__ */ e.jsx(
        W,
        {
          ...c,
          type: "number",
          step: a.fieldType === 3 ? "0.01" : "1",
          onChange: (m) => t({ valueNumber: m.target.value === "" ? null : Number(m.target.value) })
        }
      );
    default:
      return /* @__PURE__ */ e.jsx(W, { ...c, onChange: (m) => t({ valueText: m.target.value || null }) });
  }
}
function Rs(a) {
  return a.fieldType === 2 ? a.valueDate ? a.valueDate.substring(0, 10) : "" : [3, 4, 5].includes(a.fieldType) ? a.valueNumber ?? "" : a.valueText ?? "";
}
function Fs({
  detail: a,
  loading: r,
  canEdit: t,
  onSave: u,
  onDelete: c,
  saving: m,
  documentTypes: p
}) {
  var y, B, R;
  const [x, d] = i.useState(null);
  if (i.useEffect(() => {
    d(a ? { ...a, fields: (a.fields || []).map((n) => ({ ...n })) } : null);
  }, [a == null ? void 0 : a.id]), r)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(de, { rows: 6 }) });
  if (!a || !x)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(
      ce,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir belge seçin",
        description: "Künye, özel alanlar ve versiyon geçmişi burada görünür."
      }
    ) });
  const j = $e(a.contentType, a.fileName), v = se[x.status] || se[1], f = Y.daysLeft(x.expiryDate), b = (n, N) => {
    d((l) => ({
      ...l,
      fields: l.fields.map((w) => w.fieldId === n ? { ...w, valueText: null, valueNumber: null, valueDate: null, ...N } : w)
    }));
  }, k = x.fields.filter(
    (n) => n.isRequired && !n.valueText && n.valueNumber === null && !n.valueDate
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
          Y.size(a.fileSize),
          " · ",
          j.label,
          a.versionCount > 1 && ` · v${a.versionCount}`
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-1 mt-1 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: D("apya-chip", v.chip), children: v.text }),
          f !== null && f >= 0 && f <= 30 && /* @__PURE__ */ e.jsxs(M, { variant: "warning", size: "sm", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
            " ",
            f,
            " gün"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-3", children: [
      a.downloadUrl && /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: Wa({ variant: "primary" }), style: { flex: 1 }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }),
      t && !a.isLocked && /* @__PURE__ */ e.jsx(I, { variant: "outline", onClick: () => c(a), title: "Sil", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash", style: { color: "var(--apya-negative-500)" } }) })
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
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: Y.dateTime(a.creationTime) })
      ] }),
      a.retentionUntil && /* @__PURE__ */ e.jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Saklama" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: Y.date(a.retentionUntil) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Özel alanlar",
        /* @__PURE__ */ e.jsx(Te, { text: "Alan şeması belge tipine bağlıdır. Tip değiştirdiğinizde kaydettikten sonra o tipin alanları görünür." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tipi" }),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-select",
              disabled: !t || a.isLocked,
              value: x.documentTypeId || "",
              onChange: (n) => d({ ...x, documentTypeId: n.target.value || null }),
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "— Sınıflandırılmamış —" }),
                p.map((n) => /* @__PURE__ */ e.jsx("option", { value: n.id, children: n.name }, n.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Tutar" }),
          /* @__PURE__ */ e.jsx(
            W,
            {
              size: "sm",
              type: "number",
              step: "0.01",
              disabled: !t || a.isLocked,
              value: x.amount ?? "",
              onChange: (n) => d({ ...x, amount: n.target.value === "" ? null : Number(n.target.value) })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tarihi" }),
          /* @__PURE__ */ e.jsx(
            W,
            {
              size: "sm",
              type: "date",
              disabled: !t || a.isLocked,
              value: x.documentDate ? x.documentDate.substring(0, 10) : "",
              onChange: (n) => d({ ...x, documentDate: n.target.value || null })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Dönem" }),
          /* @__PURE__ */ e.jsx(
            W,
            {
              size: "sm",
              placeholder: "2026-Q2",
              disabled: !t || a.isLocked,
              value: x.periodCode ?? "",
              onChange: (n) => d({ ...x, periodCode: n.target.value || null })
            }
          )
        ] }),
        x.fields.map((n) => {
          var N, l;
          return /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              n.label,
              n.isRequired && /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-negative-500)" }, children: "*" }),
              /* @__PURE__ */ e.jsx(M, { variant: ((N = ta[n.fillSource]) == null ? void 0 : N.variant) || "neutral", size: "sm", children: ((l = ta[n.fillSource]) == null ? void 0 : l.text) || "—" }),
              n.confidence !== null && n.confidence !== void 0 && /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10 }, children: [
                "%",
                n.confidence
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              $s,
              {
                field: n,
                value: Rs(n),
                disabled: !t || a.isLocked,
                onChange: (w) => b(n.fieldId, w)
              }
            )
          ] }, n.fieldId);
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
          onClick: () => u(x),
          children: "Kaydet"
        }
      )
    ] }),
    ((y = a.tags) == null ? void 0 : y.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Etiketler" }),
      /* @__PURE__ */ e.jsx(Ps, { tags: a.tags })
    ] }),
    ((B = a.related) == null ? void 0 : B.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "İlişkili kayıtlar",
        /* @__PURE__ */ e.jsx(Te, { text: "Belgenin bağlandığı harcama, içinde gittiği teslim paketi ve karşıladığı kontrol listesi kalemleri." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.related.map((n, N) => {
        var P;
        const l = la[n.kind] ?? la[3], w = (P = l.href) == null ? void 0 : P.call(l, n.entityId), z = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 22, height: 22, borderRadius: 6, background: "var(--apya-surface-sunken)", color: "var(--apya-text-secondary)", fontSize: 10 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${l.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12 }, children: n.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "d-block text-truncate apya-numeric",
                style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" },
                children: [l.label, n.detail].filter(Boolean).join(" · ")
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
            children: z
          },
          `${n.kind}-${n.entityId}-${N}`
        ) : /* @__PURE__ */ e.jsx("div", { className: "d-flex align-items-center gap-2", children: z }, `${n.kind}-${N}`);
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Versiyonlar",
        /* @__PURE__ */ e.jsx(Te, { text: "Aynı klasöre aynı isimle yeniden yüklenen dosya yeni versiyon olur; önceki versiyonlar burada kalır." })
      ] }),
      (R = a.versions) != null && R.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1", children: a.versions.map((n) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsxs(M, { variant: n.isLatest ? "brand" : "neutral", size: "sm", children: [
            "v",
            n.versionNumber
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { color: "var(--apya-text-secondary)" }, children: n.uploaderName })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { color: "var(--apya-text-tertiary)" }, children: Y.date(n.creationTime) })
      ] }, n.id)) }) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Versiyon kaydı yok." })
    ] })
  ] });
}
const ua = [
  { value: 1, label: "Proje geneli" },
  { value: 2, label: "Her iş adımı için" },
  { value: 3, label: "Her dönem için" }
], ma = [
  { value: 2, label: "Klasör şeması" },
  { value: 3, label: "Task eki" }
], As = {
  title: "",
  scope: 1,
  documentTypeId: "",
  isBlocking: !1,
  order: 0,
  source: 2,
  sourceEntityId: ""
};
function Ms({ draft: a, setDraft: r, documentTypes: t, tasks: u, onSubmit: c, onCancel: m, busy: p }) {
  const x = Number(a.source) === 3;
  return /* @__PURE__ */ e.jsxs(
    "form",
    {
      className: "d-flex flex-column gap-2 p-2",
      style: { background: "var(--apya-surface-sunken)", borderRadius: 10 },
      onSubmit: (d) => {
        d.preventDefault(), c();
      },
      children: [
        /* @__PURE__ */ e.jsx(
          W,
          {
            size: "sm",
            placeholder: "Kalem adı (ör. İmzalı hizmet sözleşmesi)",
            value: a.title,
            onChange: (d) => r({ ...a, title: d.target.value }),
            required: !0
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.source,
              onChange: (d) => r({ ...a, source: Number(d.target.value), sourceEntityId: "" }),
              "aria-label": "Kaynak",
              children: ma.map((d) => /* @__PURE__ */ e.jsx("option", { value: d.value, children: d.label }, d.value))
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.scope,
              onChange: (d) => r({ ...a, scope: Number(d.target.value) }),
              "aria-label": "Kapsam",
              children: ua.map((d) => /* @__PURE__ */ e.jsx("option", { value: d.value, children: d.label }, d.value))
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-doc-select",
              value: a.documentTypeId || "",
              onChange: (d) => r({ ...a, documentTypeId: d.target.value }),
              "aria-label": "Belge tipi",
              disabled: x,
              title: x ? "Göreve bağlı kalem otomatik eşleşmez" : void 0,
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "Belge tipi: yok (elle bağlanır)" }),
                t.map((d) => /* @__PURE__ */ e.jsx("option", { value: d.id, children: d.name }, d.id))
              ]
            }
          )
        ] }),
        x && /* @__PURE__ */ e.jsxs(
          "select",
          {
            className: "apya-doc-select",
            value: a.sourceEntityId || "",
            onChange: (d) => r({ ...a, sourceEntityId: d.target.value }),
            "aria-label": "Görev",
            required: !0,
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Görev seçin…" }),
              u.map((d) => /* @__PURE__ */ e.jsxs("option", { value: d.id, children: [
                "#",
                d.number,
                " · ",
                d.title
              ] }, d.id))
            ]
          }
        ),
        x && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-warning-700, #92400E)" }, children: "Göreve bağlı kalem otomatik karşılanmaz; belge elle bağlanır." }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex align-items-center gap-2", style: { fontSize: 12 }, children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: a.isBlocking,
              onChange: (d) => r({ ...a, isBlocking: d.target.checked })
            }
          ),
          "Eksikse teslim paketi üretimini bloke etsin"
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [
          /* @__PURE__ */ e.jsx(I, { type: "button", variant: "outline", size: "sm", onClick: m, children: "Vazgeç" }),
          /* @__PURE__ */ e.jsx(I, { type: "submit", size: "sm", isLoading: p, disabled: !a.title.trim(), children: "Kaydet" })
        ] })
      ]
    }
  );
}
function Ls({ pkg: a, projectId: r, documentTypes: t, onClose: u, onChanged: c }) {
  const [m, p] = i.useState([]), [x, d] = i.useState([]), [j, v] = i.useState(!0), [f, b] = i.useState(!1), [k, y] = i.useState({
    name: a.name,
    issuer: a.issuer,
    description: a.description || "",
    order: a.order || 0
  }), [B, R] = i.useState(null), [n, N] = i.useState(null), l = i.useCallback(async () => {
    v(!0);
    try {
      const [g, S] = await Promise.all([
        Oa(a.id),
        // Görev listesi yalnız proje bağlamında anlamlı; yoksa "task eki"
        // kaynağı seçilebilir ama liste boş kalır.
        r ? Ua(r) : Promise.resolve([])
      ]);
      p(g ?? []), d(S ?? []);
    } catch (g) {
      C("error", "Paket kalemleri yüklenemedi."), console.error("[Documents] package requirements", g);
    } finally {
      v(!1);
    }
  }, [a.id, r]);
  i.useEffect(() => {
    l();
  }, [l]);
  const w = async () => {
    b(!0);
    try {
      await _a(a.id, {
        name: k.name,
        issuer: k.issuer,
        description: k.description || null,
        order: k.order
      }), C("success", "Paket güncellendi."), c == null || c();
    } catch (g) {
      C("error", "Paket güncellenemedi."), console.error("[Documents] update package", g);
    } finally {
      b(!1);
    }
  }, z = async () => {
    b(!0);
    try {
      const g = {
        title: B.title.trim(),
        scope: Number(B.scope),
        documentTypeId: B.documentTypeId || null,
        isBlocking: B.isBlocking,
        order: Number(B.order) || m.length,
        source: Number(B.source),
        sourceEntityId: B.sourceEntityId || null
      };
      n ? await Ha(n, g) : await Va(a.id, g), R(null), N(null), await l(), c == null || c();
    } catch (g) {
      C("error", "Kalem kaydedilemedi."), console.error("[Documents] save requirement", g);
    } finally {
      b(!1);
    }
  }, P = async (g) => {
    b(!0);
    try {
      await Ga(g), await l(), c == null || c();
    } catch (S) {
      C("error", "Kalem silinemedi."), console.error("[Documents] delete requirement", S);
    } finally {
      b(!1);
    }
  }, L = async () => {
    var g, S;
    if (window.confirm(`"${a.name}" paketi silinecek. Emin misiniz?`)) {
      b(!0);
      try {
        await qa(a.id), c == null || c(), u();
      } catch ($) {
        C("error", ((S = (g = $ == null ? void 0 : $.responseJSON) == null ? void 0 : g.error) == null ? void 0 : S.message) || "Paket silinemedi."), console.error("[Documents] delete package", $);
      } finally {
        b(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Paketi düzenle" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: L, disabled: f, children: "Paketi sil" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: u, children: "Kapat" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx(
        W,
        {
          size: "sm",
          placeholder: "Paket adı",
          value: k.name,
          onChange: (g) => y({ ...k, name: g.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(
        W,
        {
          size: "sm",
          placeholder: "İsteyen taraf (ör. İç politika)",
          value: k.issuer,
          onChange: (g) => y({ ...k, issuer: g.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(I, { size: "sm", variant: "outline", isLoading: f, onClick: w, children: "Kaydet" })
    ] }),
    j ? /* @__PURE__ */ e.jsx(de, { rows: 4 }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-list", children: [
      m.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "p-2", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette henüz kalem yok." }),
      m.map((g) => {
        var S, $;
        return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", children: [
          /* @__PURE__ */ e.jsx("span", { className: D("apya-chip", g.isBlocking ? "apya-chip-warning" : "apya-chip-neutral"), children: g.isBlocking ? "bloke eden" : "normal" }),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: g.title }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              ((S = ma.find((te) => te.value === g.source)) == null ? void 0 : S.label) || "kurum şablonu",
              g.sourceEntityName && ` · ${g.sourceEntityName}`,
              " · ",
              ($ = ua.find((te) => te.value === g.scope)) == null ? void 0 : $.label,
              g.documentTypeName && ` · ${g.documentTypeName}`
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
                  N(g.id), R({
                    title: g.title,
                    scope: g.scope,
                    documentTypeId: g.documentTypeId || "",
                    isBlocking: g.isBlocking,
                    order: g.order,
                    source: g.source === 1 ? 2 : g.source,
                    sourceEntityId: g.sourceEntityId || ""
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
                onClick: () => P(g.id),
                children: "Sil"
              }
            )
          ] })
        ] }, g.id);
      })
    ] }),
    B ? /* @__PURE__ */ e.jsx(
      Ms,
      {
        draft: B,
        setDraft: R,
        documentTypes: t,
        tasks: x,
        onSubmit: z,
        onCancel: () => {
          R(null), N(null);
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
          N(null), R({ ...As, order: m.length });
        },
        children: "Kalem ekle"
      }
    )
  ] });
}
function Ks({ packages: a, projectId: r, documentTypes: t, onChanged: u }) {
  const [c, m] = i.useState(null), [p, x] = i.useState(!1), [d, j] = i.useState(""), [v, f] = i.useState(!1), b = a.filter((y) => y.isEditable), k = async () => {
    f(!0);
    try {
      const y = await Ya({
        name: d.trim(),
        issuer: "İç politika",
        description: null,
        order: b.length
      });
      j(""), x(!1), u == null || u(), m(y);
    } catch (y) {
      C("error", "Paket oluşturulamadı."), console.error("[Documents] create package", y);
    } finally {
      f(!1);
    }
  };
  return c ? /* @__PURE__ */ e.jsx(
    Ls,
    {
      pkg: c,
      projectId: r,
      documentTypes: t,
      onClose: () => m(null),
      onChanged: u
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Kendi paketleriniz" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      !p && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => x(!0), children: "+ Yeni paket" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Kurum paketleri (KOSGEB, TÜBİTAK) sistemde tanımlıdır ve değiştirilemez. Kendi klasör şemanız ve göreve bağlı ekleriniz için buradan paket kurun." }),
    p && /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        W,
        {
          size: "sm",
          autoFocus: !0,
          placeholder: "Paket adı (ör. Şirket klasör şeması)",
          value: d,
          onChange: (y) => j(y.target.value),
          onKeyDown: (y) => {
            y.key === "Enter" && d.trim() && k();
          }
        }
      ),
      /* @__PURE__ */ e.jsx(I, { size: "sm", isLoading: v, disabled: !d.trim(), onClick: k, children: "Oluştur" }),
      /* @__PURE__ */ e.jsx(I, { size: "sm", variant: "outline", onClick: () => {
        x(!1), j("");
      }, children: "Vazgeç" })
    ] }),
    b.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Henüz kendi paketiniz yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: b.map((y) => /* @__PURE__ */ e.jsxs(I, { variant: "outline", size: "sm", onClick: () => m(y), children: [
      y.name,
      /* @__PURE__ */ e.jsx(M, { variant: "neutral", size: "sm", children: y.requirementCount })
    ] }, y.id)) })
  ] });
}
const na = {
  1: { text: "Karşılandı", chip: "apya-chip-positive", icon: "fa-check" },
  2: { text: "Eksik", chip: "apya-chip-warning", icon: "fa-triangle-exclamation" },
  3: { text: "Feragat", chip: "apya-chip-neutral", icon: "fa-ban" }
}, Ws = { 1: "Proje", 2: "İş adımı", 3: "Dönem" }, ia = {
  1: "kurum şablonu",
  2: "klasör şeması",
  3: "task eki"
};
function Os({ percent: a, blocking: r }) {
  const t = r > 0 ? "var(--apya-negative-500)" : a >= 90 ? "var(--apya-positive-500)" : "var(--apya-warning-500)";
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", role: "progressbar", "aria-valuenow": a, "aria-valuemin": 0, "aria-valuemax": 100, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a}%`, background: t } }) });
}
function Us({ item: a, canManage: r, onWaive: t, busy: u }) {
  const c = na[a.status] || na[2], m = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || Ws[a.scope];
  return /* @__PURE__ */ e.jsxs("div", { className: D("apya-doc-check-row", a.status === 2 && a.isBlocking && "is-blocking"), children: [
    /* @__PURE__ */ e.jsxs("span", { className: D("apya-chip", c.chip), children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa ${c.icon}` }),
      " ",
      c.text
    ] }),
    /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.title }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
        ia[a.source] || ia[1],
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
      a.isBlocking && a.status === 2 && /* @__PURE__ */ e.jsx(M, { variant: "negative", size: "sm", children: "Teslimi bloke ediyor" }),
      r && a.status !== 1 && /* @__PURE__ */ e.jsx(
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
function Ys({ projectId: a, periodCode: r, onSummaryChange: t, documentTypes: u = [] }) {
  const [c, m] = i.useState(null), [p, x] = i.useState([]), [d, j] = i.useState(!0), [v, f] = i.useState(!1), b = re("Platform.Documents.ManageCompliance"), k = i.useCallback(async () => {
    if (!a) {
      m(null), j(!1);
      return;
    }
    j(!0);
    try {
      const [l, w] = await Promise.all([
        Qa(a, r),
        Za(a)
      ]);
      m(l), x(w ?? []), t == null || t((l == null ? void 0 : l.summary) ?? null);
    } catch (l) {
      C("error", "Uygunluk verisi yüklenemedi."), console.error("[Documents] compliance load", l);
    } finally {
      j(!1);
    }
  }, [a, r, t]);
  i.useEffect(() => {
    k();
  }, [k]);
  const y = async (l) => {
    f(!0);
    try {
      await es(a, l, r || null), await k();
    } catch (w) {
      C("error", "Paket uygulanamadı."), console.error("[Documents] applyPackage", w);
    } finally {
      f(!1);
    }
  }, B = async (l) => {
    f(!0);
    try {
      await Ja(l), await k();
    } catch (w) {
      C("error", "Paket kaldırılamadı."), console.error("[Documents] removeAssignment", w);
    } finally {
      f(!1);
    }
  }, R = async (l, w, z) => {
    const P = z ? window.prompt("Feragat gerekçesi:") : null;
    if (!(z && !P)) {
      f(!0);
      try {
        await Xa({
          assignmentId: l.assignmentId,
          requirementId: w.requirementId,
          workStepId: w.workStepId,
          periodCode: w.periodCode,
          waive: z,
          reason: P
        }), await k();
      } catch (L) {
        C("error", "İşlem başarısız oldu."), console.error("[Documents] waive", L);
      } finally {
        f(!1);
      }
    }
  };
  if (!a)
    return /* @__PURE__ */ e.jsx(
      ce,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-check" }),
        title: "Önce bir proje bağlamı seçin",
        description: "Uygunluk, projeye uygulanan kurum paketleri üzerinden hesaplanır."
      }
    );
  if (d)
    return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(de, { rows: 6 }) });
  const n = (c == null ? void 0 : c.checklists) ?? [], N = p.filter((l) => !l.isApplied);
  return /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
    n.length === 0 ? /* @__PURE__ */ e.jsx(
      ce,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-list" }),
        title: "Bu projeye henüz kurum paketi uygulanmadı",
        description: "Aşağıdan bir paket seçerek kontrol listesini başlatın."
      }
    ) : n.map((l) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
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
          b && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: v,
              onClick: () => B(l.assignmentId),
              children: "Kaldır"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(Os, { percent: l.summary.percent, blocking: l.summary.blockingMissingCount }),
      /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
        l.summary.satisfiedCount,
        " / ",
        l.summary.totalCount - l.summary.waivedCount,
        " kalem tamam",
        l.summary.waivedCount > 0 && ` · ${l.summary.waivedCount} feragat`
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-list", children: l.items.map((w, z) => /* @__PURE__ */ e.jsx(
        Us,
        {
          item: w,
          canManage: b,
          busy: v,
          onWaive: (P, L) => R(l, P, L)
        },
        `${w.requirementId}-${w.workStepId || w.periodCode || z}`
      )) })
    ] }, l.assignmentId)),
    b && /* @__PURE__ */ e.jsx(
      Ks,
      {
        packages: p,
        projectId: a,
        documentTypes: u,
        onChanged: k
      }
    ),
    b && N.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Uygulanabilir paketler" }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: N.map((l) => /* @__PURE__ */ e.jsxs(
        I,
        {
          variant: "outline",
          size: "sm",
          disabled: v,
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
const ie = 25, qs = {
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
}, _s = [
  { value: "", label: "Tümü" },
  { value: "1", label: "Yüklendi" },
  { value: "2", label: "İndirildi" },
  { value: "5", label: "Meta değişti" },
  { value: "3", label: "Silindi" }
];
function Gs({ projectId: a, documentFileId: r }) {
  const [t, u] = i.useState([]), [c, m] = i.useState(0), [p, x] = i.useState(0), [d, j] = i.useState(""), [v, f] = i.useState(!0), b = i.useCallback(async () => {
    f(!0);
    try {
      const y = await as({
        maxResultCount: ie,
        skipCount: p * ie,
        projectId: a || void 0,
        documentFileId: r || void 0,
        action: d || void 0
      });
      u(y.items ?? []), m(y.totalCount ?? 0);
    } catch (y) {
      C("error", "Etkinlik kaydı yüklenemedi."), console.error("[Documents] activity load", y);
    } finally {
      f(!1);
    }
  }, [a, r, d, p]);
  i.useEffect(() => {
    b();
  }, [b]);
  const k = Math.max(1, Math.ceil(c / ie));
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center gap-2 flex-wrap px-3 py-2",
        style: { borderBottom: "1px solid var(--apya-border-subtle)" },
        children: [
          _s.map((y) => /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: D("apya-doc-filterchip", d === y.value && "is-active"),
              onClick: () => {
                j(y.value), x(0);
              },
              children: y.label
            },
            y.value
          )),
          /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            c,
            " kayıt"
          ] })
        ]
      }
    ),
    v ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(de, { rows: 8 }) }) : t.length === 0 ? /* @__PURE__ */ e.jsx(
      ce,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left" }),
        title: "Henüz kayıtlı etkinlik yok",
        description: "Yükleme, indirme, meta değişikliği ve silme işlemleri burada iz bırakır."
      }
    ) : /* @__PURE__ */ e.jsx("div", { children: t.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", children: [
      /* @__PURE__ */ e.jsx("span", { className: D("apya-chip", qs[y.action] || "apya-chip-neutral"), children: bs[y.action] || "—" }),
      /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: y.documentFileName || y.folderName || "—" }),
        y.detail && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: y.detail })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12 }, children: y.actorName }),
        y.actorRole && /* @__PURE__ */ e.jsx(M, { variant: "neutral", size: "sm", children: y.actorRole })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: Y.dateTime(y.creationTime) })
    ] }, y.id)) }),
    k > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            p * ie + 1,
            "–",
            Math.min((p + 1) * ie, c),
            " / ",
            c
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", disabled: p === 0, onClick: () => x(p - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              p + 1,
              " / ",
              k
            ] }),
            /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", disabled: p + 1 >= k, onClick: () => x(p + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
const ra = {
  1: "klasör",
  2: "belge tipi",
  3: "iş adımı",
  4: "dönem",
  5: "harcama kalemi"
};
function Hs(a) {
  return a >= 90 ? "positive" : a >= 70 ? "brand" : "warning";
}
function Vs({ summary: a, busy: r, onApplyAll: t, onApply: u, onDismiss: c, onReload: m }) {
  const [p, x] = i.useState(!1), d = (a == null ? void 0 : a.items) ?? [];
  if (d.length === 0) return null;
  const j = [...new Set(d.map((v) => ra[v.kind]).filter(Boolean))];
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
      /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", onClick: () => x((v) => !v), children: p ? "Gizle" : "İncele" }),
      /* @__PURE__ */ e.jsx(I, { size: "sm", isLoading: r, onClick: t, children: "Tümünü uygula" })
    ] }),
    p && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-suggestion-list", children: [
      d.map((v) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-doc-suggestion-row",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5, minWidth: 0 }, children: v.documentFileName }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: [
              ra[v.kind],
              " → ",
              /* @__PURE__ */ e.jsx("strong", { children: v.targetName || v.payload })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: v.reason }),
            /* @__PURE__ */ e.jsxs(M, { variant: Hs(v.confidence), size: "sm", children: [
              "%",
              v.confidence
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex gap-2 justify-content-end", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: r,
                  onClick: () => u(v),
                  children: "Uygula"
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: r,
                  onClick: () => c(v),
                  title: "Bu öneri bir daha gösterilmez",
                  children: "Yoksay"
                }
              )
            ] })
          ]
        },
        `${v.documentFileId}-${v.kind}-${v.payload}`
      )),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: D("apya-doc-linkbtn", "mt-1"), onClick: m, children: "Yenile" })
    ] })
  ] });
}
const Qs = [
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
function Zs(a, r) {
  const t = (r == null ? void 0 : r.workStepCount) ?? 0, u = Array.from({ length: t }, (c, m) => `${m + 1} · iş adımı`);
  if (a === 1) return u;
  if (a === 2) {
    const c = (/* @__PURE__ */ new Date()).getFullYear();
    return [1, 2, 3, 4].map((m) => `${c} Q${m}`);
  }
  return [...u, "Finans", "Personel / İK", "Sözleşmeler"];
}
function Js({ state: a, onDone: r }) {
  var R;
  const [t, u] = i.useState(0), [c, m] = i.useState(""), [p, x] = i.useState(((R = a.projects[0]) == null ? void 0 : R.id) ?? ""), [d, j] = i.useState(3), [v, f] = i.useState(!1), b = a.projects.find((n) => n.id === p), k = Zs(d, b), y = async () => {
    f(!0);
    try {
      await ss(), r();
    } finally {
      f(!1);
    }
  }, B = async () => {
    f(!0);
    try {
      const n = await ts({
        projectId: p,
        schema: d,
        compliancePackageId: c || null,
        periodCode: null
      });
      C("success", `${n.createdFolderCount} klasör kuruldu.`), r();
    } catch (n) {
      C("error", "Kurulum tamamlanamadı."), console.error("[Documents] setup", n);
    } finally {
      f(!1);
    }
  };
  return /* @__PURE__ */ e.jsx(Pe, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-setup", onClick: (n) => n.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-setup-icon", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-wand-magic-sparkles" }) }),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: "Dokümanlar kurulumu" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Klasör şemasını kurumun beklediği yapıya göre kurun. Sonradan da değiştirebilirsiniz." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: y, disabled: v, children: "Atla" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-setup-steps", children: ["Kurum ve program", "Klasör şeması", "Ekip ve kutu"].map((n, N) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        className: D("apya-doc-setup-step", N === t && "is-active", N < t && "is-done"),
        onClick: () => u(N),
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-doc-setup-step-no", children: N + 1 }),
          n
        ]
      },
      n
    )) }),
    t === 0 && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
      /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: "Zorunlu belge listesi buradan gelir. Şimdi seçmeyip sonra Uygunluk sekmesinden de uygulayabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: D("apya-doc-filterchip", !c && "is-active"),
            onClick: () => m(""),
            children: "Şimdilik yok"
          }
        ),
        a.packages.map((n) => /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: D("apya-doc-filterchip", c === n.id && "is-active"),
            onClick: () => m(n.id),
            children: [
              n.name,
              /* @__PURE__ */ e.jsx(M, { variant: "neutral", size: "sm", children: n.requirementCount })
            ]
          },
          n.id
        ))
      ] })
    ] }),
    t === 1 && /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.projects.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kiracıda proje yok — klasör şeması bir projeye kurulur. Önce bir proje oluşturun." }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: p,
          onChange: (n) => x(n.target.value),
          "aria-label": "Proje",
          children: a.projects.map((n) => /* @__PURE__ */ e.jsxs("option", { value: n.id, children: [
            n.name,
            n.hasFolders ? " — zaten klasörü var" : ""
          ] }, n.id))
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: Qs.map((n) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: D("apya-doc-filterchip", d === n.value && "is-active"),
          onClick: () => j(n.value),
          title: n.detail,
          children: n.label
        },
        n.value
      )) }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-setup-preview", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Kurulacak klasörler" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12 }, children: b == null ? void 0 : b.name }),
        k.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Bu projede iş adımı tanımlı değil; yalnız proje klasörü kurulur." }) : k.map((n) => /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-secondary)", paddingLeft: 12 }, children: n }, n))
      ] })
    ] }) }),
    t === 2 && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", style: { fontSize: 12 }, children: [
      /* @__PURE__ */ e.jsx("div", { style: { color: "var(--apya-text-secondary)" }, children: "Ekip üyeleri ve alan bazlı izinler kimlik yönetiminden, alan izinleri ise Dokümanlar → Yönetim ekranından tanımlanır." }),
      /* @__PURE__ */ e.jsx("div", { style: { color: "var(--apya-text-tertiary)" }, children: "Belge e-posta kutusu (gelen ekleri otomatik klasörleme) henüz kullanıma açık değil; Entegrasyonlar ekranında yer ayrıldı." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end mt-3", children: [
      t > 0 && /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", onClick: () => u(t - 1), children: "Geri" }),
      t < 2 ? /* @__PURE__ */ e.jsx(I, { size: "sm", onClick: () => u(t + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(
        I,
        {
          size: "sm",
          isLoading: v,
          disabled: a.projects.length === 0 || !p,
          onClick: B,
          children: "Şemayı kur"
        }
      )
    ] })
  ] }) }) });
}
const Be = 25, Xs = "00000000-0000-0000-0000-000000000000";
function et({ message: a, onDone: r }) {
  return i.useEffect(() => {
    const t = setTimeout(r, 2800);
    return () => clearTimeout(t);
  }, [r]), /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-check", style: { fontSize: 11, color: "var(--apya-positive-500)" } }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: a })
  ] });
}
function at({ title: a, message: r, onConfirm: t, onCancel: u }) {
  const [c, m] = i.useState(!1);
  return /* @__PURE__ */ e.jsx(Pe, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: u, children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-dialog", onClick: (p) => p.stopPropagation(), children: [
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
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: r })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [
      /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", onClick: u, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        I,
        {
          variant: "destructive",
          size: "sm",
          isLoading: c,
          onClick: async () => {
            m(!0), await t(), m(!1);
          },
          children: "Evet, sil"
        }
      )
    ] })
  ] }) }) });
}
function st({ uploadedThisMonth: a, expiring: r, compliance: t }) {
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
    { key: "expiring", label: "Süresi dolan", value: r ?? "—", icon: "fa-clock-rotate-left", tone: "negative" }
  ];
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-kpis", children: u.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("span", { className: D("apya-doc-kpi-icon", `is-${c.tone}`), children: /* @__PURE__ */ e.jsx("i", { className: `fa ${c.icon}` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: c.label })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: c.value }),
    c.foot && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: c.foot })
  ] }, c.key)) });
}
function tt() {
  var Je;
  const [a, r] = i.useState([]), [t, u] = i.useState([]), [c, m] = i.useState([]), [p, x] = i.useState(!0), [d, j] = i.useState([]), [v, f] = i.useState(0), [b, k] = i.useState(null), [y, B] = i.useState(null), [R, n] = i.useState(!0), N = i.useMemo(() => new URLSearchParams(window.location.search), []), [l, w] = i.useState(() => {
    const s = N.get("smart");
    if (s) return { key: s, kind: "smart", smart: s };
    const o = N.get("projectId");
    return o && !N.get("folder") && !N.get("step") ? { key: `project-${o}`, kind: "project", projectId: o } : { key: "all", kind: "all" };
  }), z = l.kind === "folder" ? l.documentId : null, P = l.projectId || null, L = l.kind === "smart" && l.smart === "trash", [g, S] = i.useState(/* @__PURE__ */ new Set()), [$, te] = i.useState(N.get("q") || ""), [J, pa] = i.useState(N.get("sort") || "creationTime desc"), [X, Re] = i.useState(N.get("view") === "grid" ? "grid" : "list"), [ee, ue] = i.useState(Number(N.get("page")) || 0), [O, Fe] = i.useState(() => {
    const s = N.get("tab");
    return ["files", "compliance", "activity"].includes(s) ? s : "files";
  }), [Ae, Me] = i.useState(null), [ya, xe] = i.useState(null), [xa, Le] = i.useState(!1), [ha, Ke] = i.useState(!1), [q, H] = i.useState(/* @__PURE__ */ new Set()), [fa, ga] = i.useState(null), he = i.useRef([]), [le, fe] = i.useState(null), [We, Oe] = i.useState(null), [ge, Ue] = i.useState(!1), ve = i.useRef(null), ke = i.useRef(null), [ae, je] = i.useState(null), [_, Ye] = i.useState(null), [va, qe] = i.useState(!1), be = i.useRef(null), V = re("Platform.Documents.Create"), _e = re("Platform.Documents.ManageMeta"), ka = re("Platform.Documents.BulkOperations"), ja = re("Platform.Documents.Delete"), U = i.useCallback((s) => Oe(s), []), Q = i.useCallback(async () => {
    x(!0);
    try {
      const [s, o, h] = await Promise.all([
        ls().getList({ maxResultCount: 1e3, sorting: "title asc" }),
        ns(),
        is()
      ]);
      r(s.items ?? []), u(o ?? []), m(h ?? []);
    } catch (s) {
      C("error", "Klasör ağacı yüklenemedi."), console.error("[Documents] loadTree", s);
    } finally {
      x(!1);
    }
  }, []);
  i.useEffect(() => {
    Q();
  }, [Q]);
  const Ge = i.useMemo(() => {
    const s = { maxResultCount: Be, skipCount: ee * Be, sorting: J };
    return $.trim() && (s.filterText = $.trim()), l.kind === "folder" ? (s.documentId = l.documentId, s.includeSubFolders = !0) : l.kind === "workstep" ? s.workStepId = l.workStepId : l.kind === "project" ? s.projectId = l.projectId : l.kind === "smart" && l.smart === "expiring" ? s.expiringWithinDays = 30 : l.kind === "smart" && l.smart === "missing-meta" ? s.missingRequiredFields = !0 : l.kind === "smart" && l.smart === "trash" ? s.onlyDeleted = !0 : l.kind === "smart" && l.smart === "suggested" && (s.documentFileIds = [...new Set(((_ == null ? void 0 : _.items) ?? []).map((o) => o.documentFileId))], s.documentFileIds.length === 0 && (s.documentFileIds = [Xs])), s;
  }, [l, ee, J, $, _]), K = i.useCallback(async () => {
    n(!0);
    try {
      const s = await De(Ge);
      j(s.items ?? []), f(s.totalCount ?? 0);
    } catch (s) {
      C("error", "Belge listesi yüklenemedi."), console.error("[Documents] loadFiles", s);
    } finally {
      n(!1);
    }
  }, [Ge]);
  i.useEffect(() => {
    K();
  }, [K]);
  const ne = i.useCallback(async () => {
    try {
      const s = /* @__PURE__ */ new Date(), o = new Date(s.getFullYear(), s.getMonth(), 1).toISOString(), [h, E] = await Promise.all([
        De({ maxResultCount: 1, skipCount: 0, expiringWithinDays: 30 }),
        De({ maxResultCount: 1, skipCount: 0, uploadedAfter: o })
      ]);
      k(h.totalCount ?? 0), B(E.totalCount ?? 0);
    } catch (s) {
      console.error("[Documents] loadKpis", s);
    }
  }, []);
  i.useEffect(() => {
    ne();
  }, [ne]);
  const Z = rs(P), ba = Z.reload, Na = i.useMemo(() => {
    var o;
    const s = (((o = Z.overview) == null ? void 0 : o.checklists) ?? []).flatMap((h) => (h.items ?? []).filter((E) => E.status === 2).map((E) => ({ ...E, assignmentId: h.assignmentId })));
    return l.kind === "workstep" ? s.filter((h) => h.workStepId === l.workStepId) : s;
  }, [Z.overview, l.kind, l.workStepId]), He = i.useRef(Z);
  He.current = Z;
  const Sa = i.useCallback((s) => {
    var h;
    const o = He.current;
    !s || o.loading || os(s, (h = o.overview) == null ? void 0 : h.summary) || o.reload();
  }, []), me = i.useCallback(async () => {
    try {
      Ye(await cs(P));
    } catch (s) {
      Ye(null), console.error("[Documents] loadSuggestions", s);
    }
  }, [P]);
  i.useEffect(() => {
    me();
  }, [me]), i.useEffect(() => {
    V && (async () => {
      try {
        je(await ds());
      } catch (s) {
        console.error("[Documents] setupState", s);
      }
    })();
  }, [V]);
  const Ne = (s) => ({
    documentFileId: s.documentFileId,
    kind: s.kind,
    payload: s.payload
  }), Se = async (s, o, h) => {
    qe(!0);
    try {
      await s(o), U(h), await Promise.all([me(), K(), Q()]);
    } catch (E) {
      C("error", "Öneri işlenemedi."), console.error("[Documents] suggestion action", E);
    } finally {
      qe(!1);
    }
  }, pe = i.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    t.forEach((E) => {
      s.has(E.projectId) || s.set(E.projectId, []), s.get(E.projectId).push(E);
    });
    const o = /* @__PURE__ */ new Map();
    a.forEach((E) => {
      const T = E.parentDocumentId || "root";
      o.has(T) || o.set(T, []), o.get(T).push(E);
    });
    const h = (E) => (o.get(E) || []).sort((T, G) => (T.sortOrder ?? 0) - (G.sortOrder ?? 0) || T.title.localeCompare(G.title, "tr")).map((T) => {
      const G = h(T.id), F = (T.projectId ? s.get(T.projectId) || [] : []).slice().sort((A, La) => A.order - La.order).map((A) => ({
        key: `step-${A.id}`,
        kind: "workstep",
        workStepId: A.id,
        projectId: A.projectId,
        label: `${A.order} · ${A.name}`,
        icon: "fa-diagram-next",
        count: A.documentCount,
        children: []
      }));
      return {
        key: `folder-${T.id}`,
        kind: "folder",
        documentId: T.id,
        projectId: T.projectId,
        label: T.title,
        icon: T.projectId ? "fa-diagram-project" : "fa-folder",
        children: [...F, ...G]
      };
    });
    return h("root");
  }, [a, t]), we = i.useRef(!1);
  i.useEffect(() => {
    if (we.current || p || pe.length === 0) return;
    const s = N.get("folder"), o = N.get("step"), h = N.get("projectId");
    if (!s && !o && !h) {
      we.current = !0;
      return;
    }
    const E = (F) => F.flatMap((A) => [A, ...E(A.children || [])]), T = (F, A) => String(F ?? "").toLowerCase() === String(A ?? "").toLowerCase(), G = E(pe), ye = s ? G.find((F) => F.documentId === s) : o ? G.find((F) => F.workStepId === o) : G.find((F) => F.kind === "folder" && T(F.projectId, h));
    we.current = !0, ye && (w(ye), S((F) => /* @__PURE__ */ new Set([...F, ye.key])));
  }, [p, pe, N]), i.useEffect(() => {
    const s = new URLSearchParams();
    O !== "files" && s.set("tab", O), l.kind === "folder" ? s.set("folder", l.documentId) : l.kind === "workstep" ? s.set("step", l.workStepId) : l.kind === "project" ? s.set("projectId", l.projectId) : l.kind === "smart" && s.set("smart", l.smart), $.trim() && s.set("q", $.trim()), X !== "list" && s.set("view", X), J !== "creationTime desc" && s.set("sort", J), ee > 0 && s.set("page", String(ee));
    const o = s.toString();
    window.history.replaceState(null, "", o ? `${window.location.pathname}?${o}` : window.location.pathname);
  }, [O, l, $, X, J, ee]);
  const wa = i.useCallback(async (s) => {
    Me(s.id), Le(!0);
    try {
      xe(await ea(s.id));
    } catch (o) {
      C("error", "Belge detayı açılamadı."), console.error("[Documents] openDetail", o);
    } finally {
      Le(!1);
    }
  }, []), za = async (s) => {
    Ke(!0);
    try {
      await vs(s.id, {
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
        fields: s.fields.map((o) => ({
          fieldId: o.fieldId,
          valueText: o.valueText ?? null,
          valueNumber: o.valueNumber ?? null,
          valueDate: o.valueDate ?? null
        })),
        tags: s.tags || []
      }), U("Belge güncellendi."), xe(await ea(s.id)), await K();
    } catch (o) {
      C("error", "Belge güncellenemedi."), console.error("[Documents] handleSave", o);
    } finally {
      Ke(!1);
    }
  }, Ca = async () => {
    if (le)
      try {
        await ks(le.id), Ae === le.id && (Me(null), xe(null)), U("Belge silindi."), await Promise.all([K(), ne()]);
      } catch (s) {
        C("error", "Belge silinemedi."), console.error("[Documents] handleDelete", s);
      } finally {
        fe(null);
      }
  }, Ia = (s) => {
    he.current = q.has(s.id) ? Array.from(q) : [s.id];
  }, Da = async (s) => {
    const o = he.current;
    if (o.length)
      try {
        o.length === 1 ? await hs(o[0], s) : await sa(o, s), U(o.length === 1 ? "Belge taşındı." : `${o.length} belge taşındı.`), H(/* @__PURE__ */ new Set()), await K();
      } catch (h) {
        C("error", "Taşıma başarısız oldu."), console.error("[Documents] move", h);
      } finally {
        he.current = [];
      }
  }, Ea = async () => {
    const s = window.prompt("Hedef klasör adını yazın:");
    if (!s) return;
    const o = a.find((h) => h.title.toLocaleLowerCase("tr") === s.toLocaleLowerCase("tr"));
    if (!o) {
      C("warn", "Klasör bulunamadı.");
      return;
    }
    try {
      await sa(Array.from(q), o.id), U(`${q.size} belge taşındı.`), H(/* @__PURE__ */ new Set()), await K();
    } catch (h) {
      C("error", "Toplu taşıma başarısız oldu."), console.error("[Documents] bulkMove", h);
    }
  }, Ta = async () => {
    const s = window.prompt("Etiket(ler) — virgülle ayırın:");
    if (!s) return;
    const o = s.split(",").map((h) => h.trim()).filter(Boolean);
    if (o.length)
      try {
        await gs(Array.from(q), o), U(`${q.size} belge etiketlendi.`), H(/* @__PURE__ */ new Set()), await K();
      } catch (h) {
        C("error", "Etiketleme başarısız oldu."), console.error("[Documents] bulkTag", h);
      }
  }, ze = async (s) => {
    if (!z || !(s != null && s.length)) return;
    const o = be.current;
    be.current = null, Ue(!0);
    try {
      let h = null;
      for (const E of Array.from(s)) {
        const T = await ys(z, E);
        h = h ?? (T == null ? void 0 : T.documentFileId) ?? null;
      }
      o && h ? (await xs({
        assignmentId: o.assignmentId,
        requirementId: o.requirementId,
        workStepId: o.workStepId || null,
        periodCode: o.periodCode || null,
        documentFileId: h
      }), U(`Yüklendi ve "${o.title}" kalemine bağlandı.`)) : U(s.length === 1 ? "Dosya yüklendi." : `${s.length} dosya yüklendi.`), await Promise.all([K(), ne(), Q(), ba()]);
    } catch (h) {
      C("error", "Dosya yüklenemedi."), console.error("[Documents] upload", h);
    } finally {
      Ue(!1);
    }
  }, Ba = async (s) => {
    try {
      await fs(s.id), U(`"${s.displayName}" geri alındı.`), await Promise.all([K(), ne(), Q()]);
    } catch (o) {
      C("error", "Belge geri alınamadı."), console.error("[Documents] restore", o);
    }
  }, Pa = (s) => {
    var o;
    if (!z) {
      C("warn", "Yükleme klasör bağlamında yapılır — soldan bir klasör seçin.");
      return;
    }
    be.current = s, (o = ve.current) == null || o.click();
  }, Ce = () => {
    const s = new window.abp.ModalManager(oe() + "Documents/CreateModal");
    s.open({ parentDocumentId: z || void 0 }), s.onResult(() => {
      Q(), U("Klasör oluşturuldu.");
    });
  }, Ve = (s) => S((o) => {
    const h = new Set(o);
    return h.has(s) ? h.delete(s) : h.add(s), h;
  }), $a = (s) => {
    var o;
    w(s), ue(0), H(/* @__PURE__ */ new Set()), (o = s.key) != null && o.startsWith("folder-") && Ve(s.key);
  }, Ra = (s) => H((o) => {
    const h = new Set(o);
    return h.has(s) ? h.delete(s) : h.add(s), h;
  }), Fa = () => H((s) => d.every((o) => s.has(o.id)) ? /* @__PURE__ */ new Set() : new Set(d.map((o) => o.id))), Aa = (s, o) => {
    s !== "docs" && s !== "compliance" || (o.preventDefault(), Fe(s === "docs" ? "files" : "compliance"));
  }, Qe = () => {
    var s;
    return (s = ve.current) == null ? void 0 : s.click();
  }, Ze = !p && a.length === 0;
  let Ie = null;
  V && !$.trim() && l.kind !== "smart" && (Ze ? Ie = ae ? /* @__PURE__ */ e.jsx(
    Ee,
    {
      primary: /* @__PURE__ */ e.jsx(I, { onClick: () => je({ ...ae, setupCompleted: !1 }), children: "Şemayı kur" }),
      link: { label: "veya boş klasörle başla", onClick: Ce }
    }
  ) : /* @__PURE__ */ e.jsx(Ee, { primary: /* @__PURE__ */ e.jsx(I, { onClick: Ce, children: "Yeni klasör" }) }) : z && (Ie = /* @__PURE__ */ e.jsx(
    Ee,
    {
      primary: /* @__PURE__ */ e.jsx(I, { leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }), onClick: Qe, children: "Yükle" }),
      link: { label: "veya toplu yükleme ekranını aç", href: `${oe()}Documents/Upload?documentId=${z}` }
    }
  )));
  const Ma = Ze ? "Klasör şemasını kurumun beklediği yapıya göre kurun; zorunlu belgeler ve meta alanları birlikte gelir." : z ? 'Dosyaları buraya sürükleyin ya da "Yükle" ile ekleyin.' : "Sol taraftan bir klasör seçin; yükleme klasör bağlamında yapılır.";
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto",
      style: { maxWidth: 1560 },
      onDragOver: (s) => {
        z && s.preventDefault();
      },
      onDrop: (s) => {
        var o;
        !z || !((o = s.dataTransfer.files) != null && o.length) || (s.preventDefault(), ze(s.dataTransfer.files));
      },
      children: [
        /* @__PURE__ */ e.jsx(
          us,
          {
            title: "Dokümanlar",
            description: "Klasörler, belgeler ve meta veri",
            primary: V && /* @__PURE__ */ e.jsx(
              I,
              {
                variant: "primary",
                isLoading: ge,
                disabled: !z,
                title: z ? void 0 : "Önce bir klasör seçin",
                leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
                onClick: Qe,
                children: "Yükle"
              }
            ),
            menuItems: V ? [
              { key: "folder", label: "Yeni klasör", icon: "fa-folder-plus", onSelect: Ce },
              {
                key: "bulk",
                label: "Toplu yükleme",
                icon: "fa-layer-group",
                href: `${oe()}Documents/Upload${z ? `?documentId=${z}` : ""}`
              },
              {
                key: "capture",
                label: "Belge yakala",
                icon: "fa-camera",
                // Telefonda sağ alttaki sabit düğme bu işi görüyor; menüde tekrar etmesin.
                className: "is-desktop-only",
                disabled: !z || ge,
                hint: z ? null : "Önce bir klasör seçin",
                onSelect: () => {
                  var s;
                  return (s = ke.current) == null ? void 0 : s.click();
                }
              }
            ] : []
          }
        ),
        /* @__PURE__ */ e.jsx(
          ms,
          {
            active: O === "compliance" ? "compliance" : "docs",
            projectId: P,
            compliance: Z,
            onSelect: Aa
          }
        ),
        V && /* @__PURE__ */ e.jsx(Pe, { children: /* @__PURE__ */ e.jsx(
          I,
          {
            variant: "secondary",
            className: "apya-doc-capture-btn",
            isLoading: ge,
            disabled: !z,
            title: z ? void 0 : "Önce bir klasör seçin",
            leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-camera" }),
            onClick: () => {
              var s;
              return (s = ke.current) == null ? void 0 : s.click();
            },
            children: "Belge yakala"
          }
        ) }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: ve,
            type: "file",
            multiple: !0,
            hidden: !0,
            onChange: (s) => {
              ze(s.target.files), s.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: ke,
            type: "file",
            accept: "image/*",
            capture: "environment",
            hidden: !0,
            onChange: (s) => {
              ze(s.target.files), s.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ e.jsx(
          st,
          {
            uploadedThisMonth: y,
            expiring: b,
            compliance: ((Je = Z.overview) == null ? void 0 : Je.summary) ?? null
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "apya-doc-tabs", role: "tablist", children: [
          { key: "files", label: "Dosyalar" },
          { key: "compliance", label: "Uygunluk" },
          { key: "activity", label: "Etkinlik" }
        ].map((s) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": O === s.key,
            className: D("apya-doc-tab", O === s.key && "is-active"),
            onClick: () => Fe(s.key),
            children: s.label
          },
          s.key
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: D("apya-docs-shell", O !== "files" && "is-wide"), children: [
          /* @__PURE__ */ e.jsx(
            ws,
            {
              loading: p,
              tree: pe,
              activeKey: l.key,
              expanded: g,
              onToggle: Ve,
              onSelect: $a,
              onDropFiles: Da,
              dragTarget: fa,
              setDragTarget: ga
            }
          ),
          O === "compliance" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(
            Ys,
            {
              projectId: P,
              periodCode: null,
              onSummaryChange: Sa,
              documentTypes: c
            }
          ) }) : O === "activity" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(Gs, { projectId: P, documentFileId: null }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            _e && /* @__PURE__ */ e.jsx(
              Vs,
              {
                summary: _,
                busy: va,
                onApplyAll: () => Se(
                  aa,
                  ((_ == null ? void 0 : _.items) ?? []).map(Ne),
                  "Öneriler uygulandı."
                ),
                onApply: (s) => Se(
                  aa,
                  [Ne(s)],
                  "Öneri uygulandı."
                ),
                onDismiss: (s) => Se(
                  ps,
                  [Ne(s)],
                  "Öneri yoksayıldı."
                ),
                onReload: me
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "apya-grid-toolbar", style: { padding: "12px 14px", borderBottom: "1px solid var(--apya-border-subtle)" }, children: [
              /* @__PURE__ */ e.jsx(
                W,
                {
                  size: "sm",
                  className: "apya-grid-search",
                  leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
                  placeholder: "Bu bağlamda filtrele",
                  value: $,
                  onChange: (s) => {
                    te(s.target.value), ue(0);
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-grid-count apya-numeric", children: [
                v,
                " belge"
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-viewtoggle", children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: D(X === "list" && "is-active"),
                    onClick: () => Re("list"),
                    "aria-label": "Liste görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: D(X === "grid" && "is-active"),
                    onClick: () => Re("grid"),
                    "aria-label": "Kart görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-border-all" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              Ts,
              {
                loading: R,
                files: d,
                totalCount: v,
                view: X,
                sorting: J,
                onSort: (s) => {
                  pa(s), ue(0);
                },
                selectedId: Ae,
                onSelect: wa,
                checkedIds: q,
                onToggleCheck: Ra,
                onToggleAll: Fa,
                page: ee,
                pageSize: Be,
                onPageChange: ue,
                onDragStart: Ia,
                emptyHint: Ma,
                emptyAction: Ie,
                missingItems: Na,
                onUploadMissing: Pa,
                canUpload: V,
                isTrash: L,
                onRestore: Ba
              }
            ),
            ka && /* @__PURE__ */ e.jsx(
              Bs,
              {
                count: q.size,
                onClear: () => H(/* @__PURE__ */ new Set()),
                onMove: Ea,
                onTag: Ta
              }
            )
          ] }),
          O === "files" && /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx(
            Fs,
            {
              detail: ya,
              loading: xa,
              canEdit: _e,
              documentTypes: c,
              saving: ha,
              onSave: za,
              onDelete: ja ? fe : () => {
              }
            }
          ) })
        ] }),
        le && /* @__PURE__ */ e.jsx(
          at,
          {
            title: "Belge silinecek",
            message: `"${le.displayName}" ve tüm versiyonları çöp kutusuna taşınacak. Sol alttaki "Çöp kutusu"ndan geri alabilirsiniz.`,
            onConfirm: Ca,
            onCancel: () => fe(null)
          }
        ),
        ae && !ae.setupCompleted && /* @__PURE__ */ e.jsx(
          Js,
          {
            state: ae,
            onDone: async () => {
              je({ ...ae, setupCompleted: !0 }), await Promise.all([Q(), K()]);
            }
          }
        ),
        We && /* @__PURE__ */ e.jsx(et, { message: We, onDone: () => Oe(null) })
      ]
    }
  );
}
const oa = document.getElementById("documents-island");
oa && Ka(oa).render(/* @__PURE__ */ e.jsx(tt, {}));
