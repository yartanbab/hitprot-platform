import { j as e, r as t, b as Za } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { S as oa, B as I, e as L, g as Ja, I as W } from "./Dialog-Bky2XNdc.js";
import { M as Ke } from "./ModalPortal-8QCz-DZi.js";
import { a as ue, g as Xa, b as es, c as C, d as as, e as ss, u as ts, f as ns, h as ls, i as is, j as de, k as rs, l as os, r as cs, w as ds, m as us, n as ms, o as ps, p as ys, q as xs, s as fs, t as hs, v as Fe, x as gs, y as ks, z as vs, A as js, B as ca, E as Ae, D as bs, P as Ns, C as Ss, F as da, G as ws, H as zs, I as Cs, J as ua, K as Is, L as Ds, M as Rs, N as Es } from "./ProcessRibbon-BtZ1ri4F.js";
import { S as pe } from "./SkeletonShape-BzeBQ1R3.js";
import { E as me } from "./EmptyState-D5m5kdmR.js";
import { d as ga } from "./draggableActivation-Ybw9Upbh.js";
import { H as Me } from "./Hint-CNW95h3H.js";
const R = (...a) => a.filter(Boolean).join(" "), q = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  money: (a, o) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + (o ? " " + Ts(o) : ""),
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
};
function Ts(a) {
  return { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }[a] || a;
}
const ne = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Kesin", chip: "apya-chip-positive" },
  3: { text: "Eşleşti", chip: "apya-chip-accent" },
  4: { text: "Süre dolan", chip: "apya-chip-negative" }
}, ma = {
  1: { text: "Manuel", variant: "neutral" },
  2: { text: "OCR", variant: "brand" },
  3: { text: "AI", variant: "accent" },
  4: { text: "Kural", variant: "warning" }
}, Bs = {
  1: "Yüklendi",
  2: "İndirildi",
  3: "Silindi",
  4: "Görüntülendi",
  5: "Meta değişti",
  6: "Taşındı"
};
function We(a, o) {
  var u;
  const n = ((u = (o || "").split(".").pop()) == null ? void 0 : u.toLowerCase()) || "";
  return a != null && a.includes("pdf") || n === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444", label: "PDF" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(n) ? { icon: "fa-file-excel", color: "#10B981", label: "XLS" } : a != null && a.includes("word") || ["docx", "doc"].includes(n) ? { icon: "fa-file-word", color: "#3B82F6", label: "DOC" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(n) ? { icon: "fa-file-powerpoint", color: "#F59E0B", label: "PPT" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(n) ? { icon: "fa-file-image", color: "#8B5CF6", label: "IMG" } : ["zip", "rar", "7z"].includes(n) ? { icon: "fa-file-zipper", color: "#6B7280", label: "ZIP" } : { icon: "fa-file", color: "#6B7280", label: "DOSYA" };
}
function $s(a) {
  const o = ["apya-chip-accent", "apya-chip-brand", "apya-chip-positive", "apya-chip-warning", "apya-chip-neutral"];
  let n = 0;
  for (let u = 0; u < a.length; u++) n = n * 31 + a.charCodeAt(u) >>> 0;
  return o[n % o.length];
}
const Ps = [
  { key: "expiring", label: "Süresi dolanlar", icon: "fa-clock-rotate-left" },
  { key: "missing-meta", label: "Eksik meta", icon: "fa-triangle-exclamation" },
  { key: "suggested", label: "Öneri bekleyen", icon: "fa-wand-magic-sparkles" },
  { key: "trash", label: "Çöp kutusu", icon: "fa-trash-can" }
];
function ka({
  node: a,
  depth: o,
  activeKey: n,
  expanded: u,
  onToggle: c,
  onSelect: p,
  onDropFiles: x,
  dragTarget: h,
  setDragTarget: d
}) {
  var N;
  const j = ((N = a.children) == null ? void 0 : N.length) > 0, k = u.has(a.key), g = h === a.documentId && a.documentId;
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => p(a),
        onDragOver: (v) => {
          a.documentId && (v.preventDefault(), d(a.documentId));
        },
        onDragLeave: () => d(null),
        onDrop: (v) => {
          a.documentId && (v.preventDefault(), d(null), x(a.documentId));
        },
        className: R("apya-md-item", n === a.key && "selected"),
        style: {
          paddingLeft: 10 + o * 14,
          borderRadius: 8,
          ...g ? { outline: "2px dashed var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
        },
        children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              role: "button",
              tabIndex: -1,
              onClick: (v) => {
                v.stopPropagation(), j && c(a.key);
              },
              className: "w-3 flex-shrink-0",
              style: { color: "var(--apya-text-tertiary)" },
              children: j && /* @__PURE__ */ e.jsx("i", { className: `fa fa-chevron-${k ? "down" : "right"}`, style: { fontSize: 9 } })
            }
          ),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${a.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: a.label }),
          typeof a.count == "number" && /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: a.count })
        ]
      }
    ),
    j && k && a.children.map((v) => /* @__PURE__ */ e.jsx(
      ka,
      {
        node: v,
        depth: o + 1,
        activeKey: n,
        expanded: u,
        onToggle: c,
        onSelect: p,
        onDropFiles: x,
        dragTarget: h,
        setDragTarget: d
      },
      v.key
    ))
  ] });
}
function Fs({
  loading: a,
  tree: o,
  activeKey: n,
  expanded: u,
  onToggle: c,
  onSelect: p,
  onDropFiles: x,
  dragTarget: h,
  setDragTarget: d
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Bağlam" }),
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => p({ key: "all", kind: "all" }),
        className: R("apya-md-item", n === "all" && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-tree", style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", style: { fontWeight: 600 }, children: "Tüm Dokümanlar" })
        ]
      }
    ),
    a ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(pe, { rows: 5 }) }) : o.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör yok." }) : o.map((j) => /* @__PURE__ */ e.jsx(
      ka,
      {
        node: j,
        depth: 0,
        activeKey: n,
        expanded: u,
        onToggle: c,
        onSelect: p,
        onDropFiles: x,
        dragTarget: h,
        setDragTarget: d
      },
      j.key
    )),
    /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Akıllı klasörler" }),
    Ps.map((j) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => p({ key: j.key, kind: "smart", smart: j.key }),
        className: R("apya-md-item", n === j.key && "selected"),
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
const As = [
  { key: "displayName", label: "Belge", sortable: !0 },
  { key: "workStep", label: "İş adımı", sortable: !1, className: "apya-doc-col-step" },
  { key: "type", label: "Tür", sortable: !1, className: "apya-doc-col-type" },
  { key: "amount", label: "Tutar", sortable: !0, align: "right" },
  { key: "documentDate", label: "Tarih", sortable: !0 },
  { key: "status", label: "Durum", sortable: !1 }
];
function Ms({ column: a, sorting: o, onSort: n }) {
  if (!a.sortable)
    return /* @__PURE__ */ e.jsx("span", { className: a.className, style: { textAlign: a.align || "left" }, children: a.label });
  const [u, c] = (o || "").split(" "), p = u === a.key, x = p && c !== "desc" ? "desc" : "asc";
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
      "aria-sort": p ? c === "desc" ? "descending" : "ascending" : "none",
      children: [
        a.label,
        /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${p ? c === "desc" ? "arrow-down" : "arrow-up" : "arrows-up-down"}`,
            style: { fontSize: 8, opacity: p ? 1 : 0.4 }
          }
        )
      ]
    }
  );
}
function Ls({ item: a, onUpload: o, canUpload: n }) {
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
      a.isBlocking && /* @__PURE__ */ e.jsx(L, { variant: "warning", size: "sm", children: "teslimi bloke ediyor" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-step", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: u }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-type", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: a.documentTypeName || "—" }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right", color: "var(--apya-text-tertiary)" }, children: "—" }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-warning-700, #92400E)" }, children: "bekliyor" }),
    /* @__PURE__ */ e.jsx("span", { children: n ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-missing-upload", onClick: () => o(a), children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
      " Yükle"
    ] }) : /* @__PURE__ */ e.jsx("span", { className: "apya-chip apya-chip-warning", children: "Eksik" }) })
  ] });
}
function Ks({ file: a, selected: o, checked: n, onSelect: u, onToggleCheck: c, onDragStart: p, isTrash: x, onRestore: h }) {
  const d = We(a.contentType, a.fileName), j = ne[a.status] || ne[1], k = ga(() => u(a));
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !x,
      onDragStart: x ? void 0 : () => p(a),
      onPointerDown: x ? void 0 : k.onPointerDown,
      onClick: x ? void 0 : k.onClick,
      className: R("apya-doc-row", o && "is-selected", x && "is-trashed"),
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            onClick: x ? void 0 : (g) => {
              g.stopPropagation(), c(a.id);
            },
            onPointerDown: x ? void 0 : (g) => g.stopPropagation(),
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
              style: { width: 26, height: 26, borderRadius: 7, background: `${d.color}1a`, color: d.color, fontSize: 11 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${d.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.displayName }),
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(L, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] }),
          a.isLocked && /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock", style: { fontSize: 10, color: "var(--apya-text-tertiary)" }, title: "Kilitli" })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-step", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-type", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: a.documentTypeName || "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right" }, children: q.money(a.amount, a.currency) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: q.date(a.documentDate || a.creationTime) }),
        /* @__PURE__ */ e.jsx("span", { children: x ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => h(a), children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-rotate-left" }),
          " Geri al"
        ] }) : /* @__PURE__ */ e.jsx("span", { className: R("apya-chip", j.chip), children: j.text }) })
      ]
    }
  );
}
function Ws({ file: a, selected: o, onSelect: n, onDragStart: u }) {
  const c = We(a.contentType, a.fileName), p = ne[a.status] || ne[1];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: !0,
      onDragStart: () => u(a),
      ...ga(() => n(a)),
      className: "apya-tile",
      style: {
        textAlign: "left",
        cursor: "pointer",
        ...o ? { borderColor: "var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
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
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(L, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", style: { borderTop: "none", paddingTop: 0 }, children: [
          /* @__PURE__ */ e.jsx("span", { className: R("apya-chip", p.chip), children: p.text }),
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
function Os({
  loading: a,
  files: o,
  totalCount: n,
  view: u,
  sorting: c,
  onSort: p,
  selectedId: x,
  onSelect: h,
  checkedIds: d,
  onToggleCheck: j,
  onToggleAll: k,
  page: g,
  pageSize: N,
  onPageChange: v,
  onDragStart: f,
  emptyHint: E,
  emptyAction: B = null,
  missingItems: i = [],
  onUploadMissing: S,
  canUpload: l = !1,
  isTrash: w = !1,
  onRestore: P
}) {
  const $ = o.length > 0 && o.every((b) => d.has(b.id)), M = Math.max(1, Math.ceil(n / N)), m = g === 0 && u === "list" ? i : [];
  return a ? u === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: Array.from({ length: 6 }).map((b, F) => /* @__PURE__ */ e.jsx(oa, { height: 120, rounded: "lg" }, F)) }) : /* @__PURE__ */ e.jsx("div", { className: "p-3 d-flex flex-column gap-2", children: Array.from({ length: 8 }).map((b, F) => /* @__PURE__ */ e.jsx(oa, { height: 40, rounded: "md" }, F)) }) : o.length === 0 && m.length === 0 ? /* @__PURE__ */ e.jsx(
    me,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
      title: "Burada henüz belge yok",
      description: E,
      action: B
    }
  ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    u === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: o.map((b) => /* @__PURE__ */ e.jsx(
      Ws,
      {
        file: b,
        selected: x === b.id,
        onSelect: h,
        onDragStart: f
      },
      b.id
    )) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-filelist", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-row-head", children: [
        /* @__PURE__ */ e.jsx("span", { onClick: k, style: { cursor: "pointer" }, children: /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${$ ? "square-check" : "square"}`,
            style: { fontSize: 13, color: $ ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
            role: "checkbox",
            "aria-checked": $
          }
        ) }),
        As.map((b) => /* @__PURE__ */ e.jsx(Ms, { column: b, sorting: c, onSort: p }, b.key))
      ] }),
      m.map((b) => /* @__PURE__ */ e.jsx(
        Ls,
        {
          item: b,
          onUpload: S,
          canUpload: l
        },
        `missing-${b.assignmentId}-${b.requirementId}-${b.workStepId || "none"}`
      )),
      o.map((b) => /* @__PURE__ */ e.jsx(
        Ks,
        {
          file: b,
          selected: x === b.id,
          checked: d.has(b.id),
          onSelect: h,
          onToggleCheck: j,
          onDragStart: f,
          isTrash: w,
          onRestore: P
        },
        b.id
      ))
    ] }),
    M > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            g * N + 1,
            "–",
            Math.min((g + 1) * N, n),
            " / ",
            n
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", disabled: g === 0, onClick: () => v(g - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              g + 1,
              " / ",
              M
            ] }),
            /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", disabled: g + 1 >= M, onClick: () => v(g + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
function Us({ count: a, onClear: o, onMove: n, onTag: u, busy: c }) {
  return a === 0 ? null : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-bulkbar", children: [
    /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
      a,
      " belge seçildi"
    ] }),
    /* @__PURE__ */ e.jsx("span", { style: { width: 1, height: 18, background: "rgba(255,255,255,.18)" } }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: n, disabled: c, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-open" }),
      " Taşı"
    ] }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: u, disabled: c, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-tag" }),
      " Etiketle"
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
    /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: o, children: "Vazgeç" })
  ] });
}
function qs({ tags: a }) {
  return a != null && a.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1", children: a.map((o) => /* @__PURE__ */ e.jsx("span", { className: R("apya-chip", $s(o)), children: o }, o)) }) : null;
}
const pa = {
  1: { icon: "fa-diagram-project", label: "Proje" },
  2: { icon: "fa-list-check", label: "İş adımı" },
  3: { icon: "fa-receipt", label: "Harcama", href: (a) => a ? `${ue()}Expenses` : null },
  4: {
    icon: "fa-box-archive",
    label: "Teslim paketi",
    href: (a) => a ? `${ue()}Documents/Deliveries?packageId=${a}` : null
  },
  5: { icon: "fa-clipboard-check", label: "Kontrol listesi kalemi" }
};
function Ys({ field: a, value: o, onChange: n, disabled: u }) {
  const c = { size: "sm", disabled: u, value: o ?? "" };
  switch (a.fieldType) {
    case 2:
      return /* @__PURE__ */ e.jsx(W, { ...c, type: "date", onChange: (p) => n({ valueDate: p.target.value || null }) });
    case 3:
    case 4:
    case 5:
      return /* @__PURE__ */ e.jsx(
        W,
        {
          ...c,
          type: "number",
          step: a.fieldType === 3 ? "0.01" : "1",
          onChange: (p) => n({ valueNumber: p.target.value === "" ? null : Number(p.target.value) })
        }
      );
    default:
      return /* @__PURE__ */ e.jsx(W, { ...c, onChange: (p) => n({ valueText: p.target.value || null }) });
  }
}
function _s(a) {
  return a.fieldType === 2 ? a.valueDate ? a.valueDate.substring(0, 10) : "" : [3, 4, 5].includes(a.fieldType) ? a.valueNumber ?? "" : a.valueText ?? "";
}
function Gs({
  detail: a,
  loading: o,
  canEdit: n,
  onSave: u,
  onDelete: c,
  saving: p,
  documentTypes: x
}) {
  var f, E, B;
  const [h, d] = t.useState(null);
  if (t.useEffect(() => {
    d(a ? { ...a, fields: (a.fields || []).map((i) => ({ ...i })) } : null);
  }, [a == null ? void 0 : a.id]), o)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(pe, { rows: 6 }) });
  if (!a || !h)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(
      me,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir belge seçin",
        description: "Künye, özel alanlar ve versiyon geçmişi burada görünür."
      }
    ) });
  const j = We(a.contentType, a.fileName), k = ne[h.status] || ne[1], g = q.daysLeft(h.expiryDate), N = (i, S) => {
    d((l) => ({
      ...l,
      fields: l.fields.map((w) => w.fieldId === i ? { ...w, valueText: null, valueNumber: null, valueDate: null, ...S } : w)
    }));
  }, v = h.fields.filter(
    (i) => i.isRequired && !i.valueText && i.valueNumber === null && !i.valueDate
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
          q.size(a.fileSize),
          " · ",
          j.label,
          a.versionCount > 1 && ` · v${a.versionCount}`
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-1 mt-1 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: R("apya-chip", k.chip), children: k.text }),
          g !== null && g >= 0 && g <= 30 && /* @__PURE__ */ e.jsxs(L, { variant: "warning", size: "sm", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
            " ",
            g,
            " gün"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-3", children: [
      a.downloadUrl && /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: Ja({ variant: "primary" }), style: { flex: 1 }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }),
      n && !a.isLocked && /* @__PURE__ */ e.jsx(I, { variant: "outline", onClick: () => c(a), title: "Sil", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash", style: { color: "var(--apya-negative-500)" } }) })
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
        /* @__PURE__ */ e.jsx(Me, { text: "Alan şeması belge tipine bağlıdır. Tip değiştirdiğinizde kaydettikten sonra o tipin alanları görünür." })
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
              onChange: (i) => d({ ...h, documentTypeId: i.target.value || null }),
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "— Sınıflandırılmamış —" }),
                x.map((i) => /* @__PURE__ */ e.jsx("option", { value: i.id, children: i.name }, i.id))
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
              disabled: !n || a.isLocked,
              value: h.amount ?? "",
              onChange: (i) => d({ ...h, amount: i.target.value === "" ? null : Number(i.target.value) })
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
              disabled: !n || a.isLocked,
              value: h.documentDate ? h.documentDate.substring(0, 10) : "",
              onChange: (i) => d({ ...h, documentDate: i.target.value || null })
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
              disabled: !n || a.isLocked,
              value: h.periodCode ?? "",
              onChange: (i) => d({ ...h, periodCode: i.target.value || null })
            }
          )
        ] }),
        h.fields.map((i) => {
          var S, l;
          return /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              i.label,
              i.isRequired && /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-negative-500)" }, children: "*" }),
              /* @__PURE__ */ e.jsx(L, { variant: ((S = ma[i.fillSource]) == null ? void 0 : S.variant) || "neutral", size: "sm", children: ((l = ma[i.fillSource]) == null ? void 0 : l.text) || "—" }),
              i.confidence !== null && i.confidence !== void 0 && /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10 }, children: [
                "%",
                i.confidence
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              Ys,
              {
                field: i,
                value: _s(i),
                disabled: !n || a.isLocked,
                onChange: (w) => N(i.fieldId, w)
              }
            )
          ] }, i.fieldId);
        })
      ] }),
      v.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", style: { fontSize: 11, color: "var(--apya-warning-500)" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation" }),
        " ",
        v.length,
        " zorunlu alan boş."
      ] }),
      n && !a.isLocked && /* @__PURE__ */ e.jsx(
        I,
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
    ((f = a.tags) == null ? void 0 : f.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Etiketler" }),
      /* @__PURE__ */ e.jsx(qs, { tags: a.tags })
    ] }),
    ((E = a.related) == null ? void 0 : E.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "İlişkili kayıtlar",
        /* @__PURE__ */ e.jsx(Me, { text: "Belgenin bağlandığı harcama, içinde gittiği teslim paketi ve karşıladığı kontrol listesi kalemleri." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.related.map((i, S) => {
        var $;
        const l = pa[i.kind] ?? pa[3], w = ($ = l.href) == null ? void 0 : $.call(l, i.entityId), P = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 22, height: 22, borderRadius: 6, background: "var(--apya-surface-sunken)", color: "var(--apya-text-secondary)", fontSize: 10 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${l.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12 }, children: i.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "d-block text-truncate apya-numeric",
                style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" },
                children: [l.label, i.detail].filter(Boolean).join(" · ")
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
            children: P
          },
          `${i.kind}-${i.entityId}-${S}`
        ) : /* @__PURE__ */ e.jsx("div", { className: "d-flex align-items-center gap-2", children: P }, `${i.kind}-${S}`);
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Versiyonlar",
        /* @__PURE__ */ e.jsx(Me, { text: "Aynı klasöre aynı isimle yeniden yüklenen dosya yeni versiyon olur; önceki versiyonlar burada kalır." })
      ] }),
      (B = a.versions) != null && B.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1", children: a.versions.map((i) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsxs(L, { variant: i.isLatest ? "brand" : "neutral", size: "sm", children: [
            "v",
            i.versionNumber
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { color: "var(--apya-text-secondary)" }, children: i.uploaderName })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { color: "var(--apya-text-tertiary)" }, children: q.date(i.creationTime) })
      ] }, i.id)) }) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Versiyon kaydı yok." })
    ] })
  ] });
}
const va = [
  { value: 1, label: "Proje geneli" },
  { value: 2, label: "Her iş adımı için" },
  { value: 3, label: "Her dönem için" }
], ja = [
  { value: 2, label: "Klasör şeması" },
  { value: 3, label: "Task eki" }
], Hs = {
  title: "",
  scope: 1,
  documentTypeId: "",
  isBlocking: !1,
  order: 0,
  source: 2,
  sourceEntityId: ""
};
function Vs({ draft: a, setDraft: o, documentTypes: n, tasks: u, onSubmit: c, onCancel: p, busy: x }) {
  const h = Number(a.source) === 3;
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
            onChange: (d) => o({ ...a, title: d.target.value }),
            required: !0
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.source,
              onChange: (d) => o({ ...a, source: Number(d.target.value), sourceEntityId: "" }),
              "aria-label": "Kaynak",
              children: ja.map((d) => /* @__PURE__ */ e.jsx("option", { value: d.value, children: d.label }, d.value))
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.scope,
              onChange: (d) => o({ ...a, scope: Number(d.target.value) }),
              "aria-label": "Kapsam",
              children: va.map((d) => /* @__PURE__ */ e.jsx("option", { value: d.value, children: d.label }, d.value))
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-doc-select",
              value: a.documentTypeId || "",
              onChange: (d) => o({ ...a, documentTypeId: d.target.value }),
              "aria-label": "Belge tipi",
              disabled: h,
              title: h ? "Göreve bağlı kalem otomatik eşleşmez" : void 0,
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "Belge tipi: yok (elle bağlanır)" }),
                n.map((d) => /* @__PURE__ */ e.jsx("option", { value: d.id, children: d.name }, d.id))
              ]
            }
          )
        ] }),
        h && /* @__PURE__ */ e.jsxs(
          "select",
          {
            className: "apya-doc-select",
            value: a.sourceEntityId || "",
            onChange: (d) => o({ ...a, sourceEntityId: d.target.value }),
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
        h && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-warning-700, #92400E)" }, children: "Göreve bağlı kalem otomatik karşılanmaz; belge elle bağlanır." }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex align-items-center gap-2", style: { fontSize: 12 }, children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: a.isBlocking,
              onChange: (d) => o({ ...a, isBlocking: d.target.checked })
            }
          ),
          "Eksikse teslim paketi üretimini bloke etsin"
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [
          /* @__PURE__ */ e.jsx(I, { type: "button", variant: "outline", size: "sm", onClick: p, children: "Vazgeç" }),
          /* @__PURE__ */ e.jsx(I, { type: "submit", size: "sm", isLoading: x, disabled: !a.title.trim(), children: "Kaydet" })
        ] })
      ]
    }
  );
}
function Qs({ pkg: a, projectId: o, documentTypes: n, onClose: u, onChanged: c }) {
  const [p, x] = t.useState([]), [h, d] = t.useState([]), [j, k] = t.useState(!0), [g, N] = t.useState(!1), [v, f] = t.useState({
    name: a.name,
    issuer: a.issuer,
    description: a.description || "",
    order: a.order || 0
  }), [E, B] = t.useState(null), [i, S] = t.useState(null), l = t.useCallback(async () => {
    k(!0);
    try {
      const [m, b] = await Promise.all([
        Xa(a.id),
        // Görev listesi yalnız proje bağlamında anlamlı; yoksa "task eki"
        // kaynağı seçilebilir ama liste boş kalır.
        o ? es(o) : Promise.resolve([])
      ]);
      x(m ?? []), d(b ?? []);
    } catch (m) {
      C("error", "Paket kalemleri yüklenemedi."), console.error("[Documents] package requirements", m);
    } finally {
      k(!1);
    }
  }, [a.id, o]);
  t.useEffect(() => {
    l();
  }, [l]);
  const w = async () => {
    N(!0);
    try {
      await ts(a.id, {
        name: v.name,
        issuer: v.issuer,
        description: v.description || null,
        order: v.order
      }), C("success", "Paket güncellendi."), c == null || c();
    } catch (m) {
      C("error", "Paket güncellenemedi."), console.error("[Documents] update package", m);
    } finally {
      N(!1);
    }
  }, P = async () => {
    N(!0);
    try {
      const m = {
        title: E.title.trim(),
        scope: Number(E.scope),
        documentTypeId: E.documentTypeId || null,
        isBlocking: E.isBlocking,
        order: Number(E.order) || p.length,
        source: Number(E.source),
        sourceEntityId: E.sourceEntityId || null
      };
      i ? await ls(i, m) : await is(a.id, m), B(null), S(null), await l(), c == null || c();
    } catch (m) {
      C("error", "Kalem kaydedilemedi."), console.error("[Documents] save requirement", m);
    } finally {
      N(!1);
    }
  }, $ = async (m) => {
    N(!0);
    try {
      await ns(m), await l(), c == null || c();
    } catch (b) {
      C("error", "Kalem silinemedi."), console.error("[Documents] delete requirement", b);
    } finally {
      N(!1);
    }
  }, M = async () => {
    var m, b;
    if (window.confirm(`"${a.name}" paketi silinecek. Emin misiniz?`)) {
      N(!0);
      try {
        await ss(a.id), c == null || c(), u();
      } catch (F) {
        C("error", ((b = (m = F == null ? void 0 : F.responseJSON) == null ? void 0 : m.error) == null ? void 0 : b.message) || "Paket silinemedi."), console.error("[Documents] delete package", F);
      } finally {
        N(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Paketi düzenle" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: M, disabled: g, children: "Paketi sil" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: u, children: "Kapat" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx(
        W,
        {
          size: "sm",
          placeholder: "Paket adı",
          value: v.name,
          onChange: (m) => f({ ...v, name: m.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(
        W,
        {
          size: "sm",
          placeholder: "İsteyen taraf (ör. İç politika)",
          value: v.issuer,
          onChange: (m) => f({ ...v, issuer: m.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(I, { size: "sm", variant: "outline", isLoading: g, onClick: w, children: "Kaydet" })
    ] }),
    j ? /* @__PURE__ */ e.jsx(pe, { rows: 4 }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-list", children: [
      p.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "p-2", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette henüz kalem yok." }),
      p.map((m) => {
        var b, F;
        return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", children: [
          /* @__PURE__ */ e.jsx("span", { className: R("apya-chip", m.isBlocking ? "apya-chip-warning" : "apya-chip-neutral"), children: m.isBlocking ? "bloke eden" : "normal" }),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: m.title }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              ((b = ja.find((le) => le.value === m.source)) == null ? void 0 : b.label) || "kurum şablonu",
              m.sourceEntityName && ` · ${m.sourceEntityName}`,
              " · ",
              (F = va.find((le) => le.value === m.scope)) == null ? void 0 : F.label,
              m.documentTypeName && ` · ${m.documentTypeName}`
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("span", {}),
          /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2 justify-content-end", children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: g,
                onClick: () => {
                  S(m.id), B({
                    title: m.title,
                    scope: m.scope,
                    documentTypeId: m.documentTypeId || "",
                    isBlocking: m.isBlocking,
                    order: m.order,
                    source: m.source === 1 ? 2 : m.source,
                    sourceEntityId: m.sourceEntityId || ""
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
                disabled: g,
                onClick: () => $(m.id),
                children: "Sil"
              }
            )
          ] })
        ] }, m.id);
      })
    ] }),
    E ? /* @__PURE__ */ e.jsx(
      Vs,
      {
        draft: E,
        setDraft: B,
        documentTypes: n,
        tasks: h,
        onSubmit: P,
        onCancel: () => {
          B(null), S(null);
        },
        busy: g
      }
    ) : /* @__PURE__ */ e.jsx(
      I,
      {
        size: "sm",
        variant: "outline",
        leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
        onClick: () => {
          S(null), B({ ...Hs, order: p.length });
        },
        children: "Kalem ekle"
      }
    )
  ] });
}
function Zs({ packages: a, projectId: o, documentTypes: n, onChanged: u }) {
  const [c, p] = t.useState(null), [x, h] = t.useState(!1), [d, j] = t.useState(""), [k, g] = t.useState(!1), N = a.filter((f) => f.isEditable), v = async () => {
    g(!0);
    try {
      const f = await as({
        name: d.trim(),
        issuer: "İç politika",
        description: null,
        order: N.length
      });
      j(""), h(!1), u == null || u(), p(f);
    } catch (f) {
      C("error", "Paket oluşturulamadı."), console.error("[Documents] create package", f);
    } finally {
      g(!1);
    }
  };
  return c ? /* @__PURE__ */ e.jsx(
    Qs,
    {
      pkg: c,
      projectId: o,
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
        W,
        {
          size: "sm",
          autoFocus: !0,
          placeholder: "Paket adı (ör. Şirket klasör şeması)",
          value: d,
          onChange: (f) => j(f.target.value),
          onKeyDown: (f) => {
            f.key === "Enter" && d.trim() && v();
          }
        }
      ),
      /* @__PURE__ */ e.jsx(I, { size: "sm", isLoading: k, disabled: !d.trim(), onClick: v, children: "Oluştur" }),
      /* @__PURE__ */ e.jsx(I, { size: "sm", variant: "outline", onClick: () => {
        h(!1), j("");
      }, children: "Vazgeç" })
    ] }),
    N.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Henüz kendi paketiniz yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: N.map((f) => /* @__PURE__ */ e.jsxs(I, { variant: "outline", size: "sm", onClick: () => p(f), children: [
      f.name,
      /* @__PURE__ */ e.jsx(L, { variant: "neutral", size: "sm", children: f.requirementCount })
    ] }, f.id)) })
  ] });
}
const ya = {
  1: { text: "Karşılandı", chip: "apya-chip-positive", icon: "fa-check" },
  2: { text: "Eksik", chip: "apya-chip-warning", icon: "fa-triangle-exclamation" },
  3: { text: "Feragat", chip: "apya-chip-neutral", icon: "fa-ban" }
}, Js = { 1: "Proje", 2: "İş adımı", 3: "Dönem" }, xa = {
  1: "kurum şablonu",
  2: "klasör şeması",
  3: "task eki"
};
function Xs({ percent: a, blocking: o }) {
  const n = o > 0 ? "var(--apya-negative-500)" : a >= 90 ? "var(--apya-positive-500)" : "var(--apya-warning-500)";
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", role: "progressbar", "aria-valuenow": a, "aria-valuemin": 0, "aria-valuemax": 100, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a}%`, background: n } }) });
}
function et({ item: a, canManage: o, onWaive: n, busy: u }) {
  const c = ya[a.status] || ya[2], p = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || Js[a.scope];
  return /* @__PURE__ */ e.jsxs("div", { className: R("apya-doc-check-row", a.status === 2 && a.isBlocking && "is-blocking"), children: [
    /* @__PURE__ */ e.jsxs("span", { className: R("apya-chip", c.chip), children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa ${c.icon}` }),
      " ",
      c.text
    ] }),
    /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.title }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
        xa[a.source] || xa[1],
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
      a.isBlocking && a.status === 2 && /* @__PURE__ */ e.jsx(L, { variant: "negative", size: "sm", children: "Teslimi bloke ediyor" }),
      o && a.status !== 1 && /* @__PURE__ */ e.jsx(
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
function at({ projectId: a, periodCode: o, onSummaryChange: n, documentTypes: u = [] }) {
  const [c, p] = t.useState(null), [x, h] = t.useState([]), [d, j] = t.useState(!0), [k, g] = t.useState(!1), N = de("Platform.Documents.ManageCompliance"), v = t.useCallback(async () => {
    if (!a) {
      p(null), j(!1);
      return;
    }
    j(!0);
    try {
      const [l, w] = await Promise.all([
        rs(a, o),
        os(a)
      ]);
      p(l), h(w ?? []), n == null || n((l == null ? void 0 : l.summary) ?? null);
    } catch (l) {
      C("error", "Uygunluk verisi yüklenemedi."), console.error("[Documents] compliance load", l);
    } finally {
      j(!1);
    }
  }, [a, o, n]);
  t.useEffect(() => {
    v();
  }, [v]);
  const f = async (l) => {
    g(!0);
    try {
      await us(a, l, o || null), await v();
    } catch (w) {
      C("error", "Paket uygulanamadı."), console.error("[Documents] applyPackage", w);
    } finally {
      g(!1);
    }
  }, E = async (l) => {
    g(!0);
    try {
      await cs(l), await v();
    } catch (w) {
      C("error", "Paket kaldırılamadı."), console.error("[Documents] removeAssignment", w);
    } finally {
      g(!1);
    }
  }, B = async (l, w, P) => {
    const $ = P ? window.prompt("Feragat gerekçesi:") : null;
    if (!(P && !$)) {
      g(!0);
      try {
        await ds({
          assignmentId: l.assignmentId,
          requirementId: w.requirementId,
          workStepId: w.workStepId,
          periodCode: w.periodCode,
          waive: P,
          reason: $
        }), await v();
      } catch (M) {
        C("error", "İşlem başarısız oldu."), console.error("[Documents] waive", M);
      } finally {
        g(!1);
      }
    }
  };
  if (!a)
    return /* @__PURE__ */ e.jsx(
      me,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-check" }),
        title: "Önce bir proje bağlamı seçin",
        description: "Uygunluk, projeye uygulanan kurum paketleri üzerinden hesaplanır."
      }
    );
  if (d)
    return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(pe, { rows: 6 }) });
  const i = (c == null ? void 0 : c.checklists) ?? [], S = x.filter((l) => !l.isApplied);
  return /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
    i.length === 0 ? /* @__PURE__ */ e.jsx(
      me,
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
          l.summary.blockingMissingCount > 0 && /* @__PURE__ */ e.jsxs(L, { variant: "negative", size: "sm", children: [
            l.summary.blockingMissingCount,
            " bloke"
          ] }),
          N && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: k,
              onClick: () => E(l.assignmentId),
              children: "Kaldır"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(Xs, { percent: l.summary.percent, blocking: l.summary.blockingMissingCount }),
      /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
        l.summary.satisfiedCount,
        " / ",
        l.summary.totalCount - l.summary.waivedCount,
        " kalem tamam",
        l.summary.waivedCount > 0 && ` · ${l.summary.waivedCount} feragat`
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-list", children: l.items.map((w, P) => /* @__PURE__ */ e.jsx(
        et,
        {
          item: w,
          canManage: N,
          busy: k,
          onWaive: ($, M) => B(l, $, M)
        },
        `${w.requirementId}-${w.workStepId || w.periodCode || P}`
      )) })
    ] }, l.assignmentId)),
    N && /* @__PURE__ */ e.jsx(
      Zs,
      {
        packages: x,
        projectId: a,
        documentTypes: u,
        onChanged: v
      }
    ),
    N && S.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Uygulanabilir paketler" }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: S.map((l) => /* @__PURE__ */ e.jsxs(
        I,
        {
          variant: "outline",
          size: "sm",
          disabled: k,
          leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          onClick: () => f(l.id),
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
const ce = 25, st = {
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
}, tt = [
  { value: "", label: "Tümü" },
  { value: "1", label: "Yüklendi" },
  { value: "2", label: "İndirildi" },
  { value: "5", label: "Meta değişti" },
  { value: "3", label: "Silindi" }
];
function nt({ projectId: a, documentFileId: o }) {
  const [n, u] = t.useState([]), [c, p] = t.useState(0), [x, h] = t.useState(0), [d, j] = t.useState(""), [k, g] = t.useState(!0), N = t.useCallback(async () => {
    g(!0);
    try {
      const f = await ms({
        maxResultCount: ce,
        skipCount: x * ce,
        projectId: a || void 0,
        documentFileId: o || void 0,
        action: d || void 0
      });
      u(f.items ?? []), p(f.totalCount ?? 0);
    } catch (f) {
      C("error", "Etkinlik kaydı yüklenemedi."), console.error("[Documents] activity load", f);
    } finally {
      g(!1);
    }
  }, [a, o, d, x]);
  t.useEffect(() => {
    N();
  }, [N]);
  const v = Math.max(1, Math.ceil(c / ce));
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center gap-2 flex-wrap px-3 py-2",
        style: { borderBottom: "1px solid var(--apya-border-subtle)" },
        children: [
          tt.map((f) => /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: R("apya-doc-filterchip", d === f.value && "is-active"),
              onClick: () => {
                j(f.value), h(0);
              },
              children: f.label
            },
            f.value
          )),
          /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            c,
            " kayıt"
          ] })
        ]
      }
    ),
    k ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(pe, { rows: 8 }) }) : n.length === 0 ? /* @__PURE__ */ e.jsx(
      me,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left" }),
        title: "Henüz kayıtlı etkinlik yok",
        description: "Yükleme, indirme, meta değişikliği ve silme işlemleri burada iz bırakır."
      }
    ) : /* @__PURE__ */ e.jsx("div", { children: n.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", children: [
      /* @__PURE__ */ e.jsx("span", { className: R("apya-chip", st[f.action] || "apya-chip-neutral"), children: Bs[f.action] || "—" }),
      /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: f.documentFileName || f.folderName || "—" }),
        f.detail && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: f.detail })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12 }, children: f.actorName }),
        f.actorRole && /* @__PURE__ */ e.jsx(L, { variant: "neutral", size: "sm", children: f.actorRole })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: q.dateTime(f.creationTime) })
    ] }, f.id)) }),
    v > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            x * ce + 1,
            "–",
            Math.min((x + 1) * ce, c),
            " / ",
            c
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", disabled: x === 0, onClick: () => h(x - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              x + 1,
              " / ",
              v
            ] }),
            /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", disabled: x + 1 >= v, onClick: () => h(x + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
const fa = {
  1: "klasör",
  2: "belge tipi",
  3: "iş adımı",
  4: "dönem",
  5: "harcama kalemi"
};
function lt(a) {
  return a >= 90 ? "positive" : a >= 70 ? "brand" : "warning";
}
function it({ summary: a, busy: o, onApplyAll: n, onApply: u, onDismiss: c, onReload: p }) {
  const [x, h] = t.useState(!1), d = (a == null ? void 0 : a.items) ?? [];
  if (d.length === 0) return null;
  const j = [...new Set(d.map((k) => fa[k.kind]).filter(Boolean))];
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
      /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", onClick: () => h((k) => !k), children: x ? "Gizle" : "İncele" }),
      /* @__PURE__ */ e.jsx(I, { size: "sm", isLoading: o, onClick: n, children: "Tümünü uygula" })
    ] }),
    x && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-suggestion-list", children: [
      d.map((k) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-doc-suggestion-row",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5, minWidth: 0 }, children: k.documentFileName }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: [
              fa[k.kind],
              " → ",
              /* @__PURE__ */ e.jsx("strong", { children: k.targetName || k.payload })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: k.reason }),
            /* @__PURE__ */ e.jsxs(L, { variant: lt(k.confidence), size: "sm", children: [
              "%",
              k.confidence
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex gap-2 justify-content-end", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: o,
                  onClick: () => u(k),
                  children: "Uygula"
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: o,
                  onClick: () => c(k),
                  title: "Bu öneri bir daha gösterilmez",
                  children: "Yoksay"
                }
              )
            ] })
          ]
        },
        `${k.documentFileId}-${k.kind}-${k.payload}`
      )),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: R("apya-doc-linkbtn", "mt-1"), onClick: p, children: "Yenile" })
    ] })
  ] });
}
const rt = [
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
function ot(a, o) {
  const n = (o == null ? void 0 : o.workStepCount) ?? 0, u = Array.from({ length: n }, (c, p) => `${p + 1} · iş adımı`);
  if (a === 1) return u;
  if (a === 2) {
    const c = (/* @__PURE__ */ new Date()).getFullYear();
    return [1, 2, 3, 4].map((p) => `${c} Q${p}`);
  }
  return [...u, "Finans", "Personel / İK", "Sözleşmeler"];
}
function ct({ state: a, onDone: o }) {
  var B;
  const [n, u] = t.useState(0), [c, p] = t.useState(""), [x, h] = t.useState(((B = a.projects[0]) == null ? void 0 : B.id) ?? ""), [d, j] = t.useState(3), [k, g] = t.useState(!1), N = a.projects.find((i) => i.id === x), v = ot(d, N), f = async () => {
    g(!0);
    try {
      await ps(), o();
    } finally {
      g(!1);
    }
  }, E = async () => {
    g(!0);
    try {
      const i = await ys({
        projectId: x,
        schema: d,
        compliancePackageId: c || null,
        periodCode: null
      });
      C("success", `${i.createdFolderCount} klasör kuruldu.`), o();
    } catch (i) {
      C("error", "Kurulum tamamlanamadı."), console.error("[Documents] setup", i);
    } finally {
      g(!1);
    }
  };
  return /* @__PURE__ */ e.jsx(Ke, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-setup", onClick: (i) => i.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-setup-icon", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-wand-magic-sparkles" }) }),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: "Dokümanlar kurulumu" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Klasör şemasını kurumun beklediği yapıya göre kurun. Sonradan da değiştirebilirsiniz." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: f, disabled: k, children: "Atla" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-setup-steps", children: ["Kurum ve program", "Klasör şeması", "Ekip ve kutu"].map((i, S) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        className: R("apya-doc-setup-step", S === n && "is-active", S < n && "is-done"),
        onClick: () => u(S),
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-doc-setup-step-no", children: S + 1 }),
          i
        ]
      },
      i
    )) }),
    n === 0 && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
      /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: "Zorunlu belge listesi buradan gelir. Şimdi seçmeyip sonra Uygunluk sekmesinden de uygulayabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: R("apya-doc-filterchip", !c && "is-active"),
            onClick: () => p(""),
            children: "Şimdilik yok"
          }
        ),
        a.packages.map((i) => /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: R("apya-doc-filterchip", c === i.id && "is-active"),
            onClick: () => p(i.id),
            children: [
              i.name,
              /* @__PURE__ */ e.jsx(L, { variant: "neutral", size: "sm", children: i.requirementCount })
            ]
          },
          i.id
        ))
      ] })
    ] }),
    n === 1 && /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.projects.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kiracıda proje yok — klasör şeması bir projeye kurulur. Önce bir proje oluşturun." }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: x,
          onChange: (i) => h(i.target.value),
          "aria-label": "Proje",
          children: a.projects.map((i) => /* @__PURE__ */ e.jsxs("option", { value: i.id, children: [
            i.name,
            i.hasFolders ? " — zaten klasörü var" : ""
          ] }, i.id))
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: rt.map((i) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: R("apya-doc-filterchip", d === i.value && "is-active"),
          onClick: () => j(i.value),
          title: i.detail,
          children: i.label
        },
        i.value
      )) }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-setup-preview", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Kurulacak klasörler" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12 }, children: N == null ? void 0 : N.name }),
        v.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Bu projede iş adımı tanımlı değil; yalnız proje klasörü kurulur." }) : v.map((i) => /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-secondary)", paddingLeft: 12 }, children: i }, i))
      ] })
    ] }) }),
    n === 2 && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", style: { fontSize: 12 }, children: [
      /* @__PURE__ */ e.jsx("div", { style: { color: "var(--apya-text-secondary)" }, children: "Ekip üyeleri ve alan bazlı izinler kimlik yönetiminden, alan izinleri ise Dokümanlar → Yönetim ekranından tanımlanır." }),
      /* @__PURE__ */ e.jsx("div", { style: { color: "var(--apya-text-tertiary)" }, children: "Belge e-posta kutusu (gelen ekleri otomatik klasörleme) henüz kullanıma açık değil; Entegrasyonlar ekranında yer ayrıldı." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end mt-3", children: [
      n > 0 && /* @__PURE__ */ e.jsx(I, { variant: "outline", size: "sm", onClick: () => u(n - 1), children: "Geri" }),
      n < 2 ? /* @__PURE__ */ e.jsx(I, { size: "sm", onClick: () => u(n + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(
        I,
        {
          size: "sm",
          isLoading: k,
          disabled: a.projects.length === 0 || !x,
          onClick: E,
          children: "Şemayı kur"
        }
      )
    ] })
  ] }) }) });
}
const Le = 25, dt = "00000000-0000-0000-0000-000000000000";
function ut({ message: a, onDone: o }) {
  return t.useEffect(() => {
    const n = setTimeout(o, 2800);
    return () => clearTimeout(n);
  }, [o]), /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-check", style: { fontSize: 11, color: "var(--apya-positive-500)" } }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: a })
  ] });
}
function mt({ title: a, message: o, onConfirm: n, onCancel: u }) {
  const [c, p] = t.useState(!1);
  return /* @__PURE__ */ e.jsx(Ke, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: u, children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-dialog", onClick: (x) => x.stopPropagation(), children: [
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
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: o })
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
            p(!0), await n(), p(!1);
          },
          children: "Evet, sil"
        }
      )
    ] })
  ] }) }) });
}
function pt({ uploadedThisMonth: a, expiring: o, compliance: n }) {
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
    { key: "expiring", label: "Süresi dolan", value: o ?? "—", icon: "fa-clock-rotate-left", tone: "negative" }
  ];
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-kpis", children: u.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("span", { className: R("apya-doc-kpi-icon", `is-${c.tone}`), children: /* @__PURE__ */ e.jsx("i", { className: `fa ${c.icon}` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: c.label })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: c.value }),
    c.foot && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: c.foot })
  ] }, c.key)) });
}
function yt() {
  var ra;
  const [a, o] = t.useState([]), [n, u] = t.useState([]), [c, p] = t.useState([]), [x, h] = t.useState(!0), [d, j] = t.useState([]), [k, g] = t.useState(0), [N, v] = t.useState(null), [f, E] = t.useState(null), [B, i] = t.useState(!0), S = t.useMemo(() => new URLSearchParams(window.location.search), []), [l, w] = t.useState(() => {
    const s = S.get("smart");
    if (s) return { key: s, kind: "smart", smart: s };
    const r = S.get("folder");
    if (r) return { key: `folder-${r}`, kind: "folder", documentId: r };
    const y = S.get("step");
    if (y) return { key: `step-${y}`, kind: "workstep", workStepId: y };
    const z = S.get("projectId");
    return z ? { key: `project-${z}`, kind: "project", projectId: z } : { key: "all", kind: "all" };
  }), P = t.useRef(l), [$, M] = t.useState(() => l.kind === "project"), m = l.kind === "folder" ? l.documentId : null, b = l.projectId || null, F = l.kind === "smart" && l.smart === "trash", [le, Oe] = t.useState(/* @__PURE__ */ new Set()), [ie, ba] = t.useState(S.get("q") || ""), [J, Na] = t.useState(S.get("sort") || "creationTime desc"), [X, Ue] = t.useState(S.get("view") === "grid" ? "grid" : "list"), [ee, ye] = t.useState(Number(S.get("page")) || 0), [Y, Sa] = t.useState(ie);
  t.useEffect(() => {
    if (ie === Y) return;
    const s = setTimeout(() => {
      Sa(ie), ye(0);
    }, 300);
    return () => clearTimeout(s);
  }, [ie, Y]);
  const [O, qe] = t.useState(() => {
    const s = S.get("tab");
    return ["files", "compliance", "activity"].includes(s) ? s : "files";
  }), [Ye, ve] = t.useState(null), [wa, xe] = t.useState(null), [za, _e] = t.useState(!1), [Ca, Ge] = t.useState(!1), [_, V] = t.useState(/* @__PURE__ */ new Set()), [Ia, Da] = t.useState(null), je = t.useRef([]), [re, be] = t.useState(null), [He, Ve] = t.useState(null), [Ne, Qe] = t.useState(!1), Se = t.useRef(null), we = t.useRef(null), [ae, ze] = t.useState(null), [G, Ze] = t.useState(null), [Ra, Je] = t.useState(!1), Ce = t.useRef(null), Q = de("Platform.Documents.Create"), Xe = de("Platform.Documents.ManageMeta"), Ea = de("Platform.Documents.BulkOperations"), Ta = de("Platform.Documents.Delete"), U = t.useCallback((s) => Ve(s), []), Z = t.useCallback(async () => {
    h(!0);
    try {
      const [s, r, y] = await Promise.all([
        xs().getList({ maxResultCount: 1e3, sorting: "title asc" }),
        fs(),
        hs()
      ]);
      o(s.items ?? []), u(r ?? []), p(y ?? []);
    } catch (s) {
      C("error", "Klasör ağacı yüklenemedi."), console.error("[Documents] loadTree", s);
    } finally {
      h(!1);
    }
  }, []);
  t.useEffect(() => {
    Z();
  }, [Z]);
  const Ie = t.useMemo(() => {
    const s = { maxResultCount: Le, skipCount: ee * Le, sorting: J };
    return Y.trim() && (s.filterText = Y.trim()), l.kind === "folder" ? (s.documentId = l.documentId, s.includeSubFolders = !0) : l.kind === "workstep" ? s.workStepId = l.workStepId : l.kind === "project" ? s.projectId = l.projectId : l.kind === "smart" && l.smart === "expiring" ? s.expiringWithinDays = 30 : l.kind === "smart" && l.smart === "missing-meta" ? s.missingRequiredFields = !0 : l.kind === "smart" && l.smart === "trash" ? s.onlyDeleted = !0 : l.kind === "smart" && l.smart === "suggested" && (s.documentFileIds = [...new Set(((G == null ? void 0 : G.items) ?? []).map((r) => r.documentFileId))], s.documentFileIds.length === 0 && (s.documentFileIds = [dt])), s;
  }, [l, ee, J, Y, G]), ea = t.useRef(Ie);
  ea.current = Ie;
  const fe = t.useRef(0), K = t.useCallback(async () => {
    const s = ++fe.current;
    i(!0);
    try {
      const r = await Fe(ea.current);
      if (s !== fe.current) return;
      j(r.items ?? []), g(r.totalCount ?? 0);
    } catch (r) {
      if (s !== fe.current) return;
      C("error", "Belge listesi yüklenemedi."), console.error("[Documents] loadFiles", r);
    } finally {
      s === fe.current && i(!1);
    }
  }, []), Ba = JSON.stringify(Ie);
  t.useEffect(() => {
    $ || K();
  }, [Ba, $, K]);
  const aa = t.useRef(0), oe = t.useCallback(async () => {
    const s = ++aa.current;
    try {
      const r = /* @__PURE__ */ new Date(), y = new Date(r.getFullYear(), r.getMonth(), 1).toISOString(), [z, D] = await Promise.all([
        Fe({ maxResultCount: 1, skipCount: 0, expiringWithinDays: 30 }),
        Fe({ maxResultCount: 1, skipCount: 0, uploadedAfter: y })
      ]);
      if (s !== aa.current) return;
      v(z.totalCount ?? 0), E(D.totalCount ?? 0);
    } catch (r) {
      console.error("[Documents] loadKpis", r);
    }
  }, []);
  t.useEffect(() => {
    oe();
  }, [oe]);
  const se = gs(b), $a = t.useMemo(() => {
    var r;
    const s = (((r = se.overview) == null ? void 0 : r.checklists) ?? []).flatMap((y) => (y.items ?? []).filter((z) => z.status === 2).map((z) => ({ ...z, assignmentId: y.assignmentId })));
    return l.kind === "workstep" ? s.filter((y) => y.workStepId === l.workStepId) : s;
  }, [se.overview, l.kind, l.workStepId]), De = t.useRef(se);
  De.current = se;
  const Pa = t.useCallback((s) => {
    var y;
    const r = De.current;
    !s || r.loading || ks(s, (y = r.overview) == null ? void 0 : y.summary) || r.reload();
  }, []), sa = t.useRef(b);
  sa.current = b;
  const Re = t.useRef(0), he = t.useCallback(async () => {
    const s = ++Re.current;
    try {
      const r = await vs(sa.current);
      s === Re.current && Ze(r);
    } catch (r) {
      if (s !== Re.current) return;
      Ze(null), console.error("[Documents] loadSuggestions", r);
    }
  }, []);
  t.useEffect(() => {
    he();
  }, [b, he]), t.useEffect(() => {
    Q && (async () => {
      try {
        ze(await js());
      } catch (s) {
        console.error("[Documents] setupState", s);
      }
    })();
  }, [Q]);
  const Ee = (s) => ({
    documentFileId: s.documentFileId,
    kind: s.kind,
    payload: s.payload
  }), Te = async (s, r, y) => {
    Je(!0);
    try {
      await s(r), U(y), await Promise.all([he(), K(), Z()]);
    } catch (z) {
      C("error", "Öneri işlenemedi."), console.error("[Documents] suggestion action", z);
    } finally {
      Je(!1);
    }
  }, ge = t.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    n.forEach((z) => {
      s.has(z.projectId) || s.set(z.projectId, []), s.get(z.projectId).push(z);
    });
    const r = /* @__PURE__ */ new Map();
    a.forEach((z) => {
      const D = z.parentDocumentId || "root";
      r.has(D) || r.set(D, []), r.get(D).push(z);
    });
    const y = (z) => (r.get(z) || []).sort((D, H) => (D.sortOrder ?? 0) - (H.sortOrder ?? 0) || D.title.localeCompare(H.title, "tr")).map((D) => {
      const H = y(D.id), T = (D.projectId ? s.get(D.projectId) || [] : []).slice().sort((A, Qa) => A.order - Qa.order).map((A) => ({
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
        key: `folder-${D.id}`,
        kind: "folder",
        documentId: D.id,
        projectId: D.projectId,
        label: D.title,
        icon: D.projectId ? "fa-diagram-project" : "fa-folder",
        children: [...T, ...H]
      };
    });
    return y("root");
  }, [a, n]), ta = t.useRef(!1);
  t.useEffect(() => {
    if (ta.current || x) return;
    ta.current = !0;
    const s = S.get("folder"), r = S.get("step"), y = S.get("projectId");
    if (!s && !r && !y) return;
    const z = (T) => T.flatMap((A) => [A, ...z(A.children || [])]), D = (T, A) => String(T ?? "").toLowerCase() === String(A ?? "").toLowerCase(), H = z(ge), ke = s ? H.find((T) => T.documentId === s) : r ? H.find((T) => T.workStepId === r) : H.find((T) => T.kind === "folder" && D(T.projectId, y));
    ke ? (w((T) => T === P.current ? ke : T), Oe((T) => /* @__PURE__ */ new Set([...T, ke.key]))) : ge.length > 0 && (s || r) && w((T) => T === P.current ? { key: "all", kind: "all" } : T), M(!1);
  }, [x, ge, S]), t.useEffect(() => {
    const s = new URLSearchParams();
    O !== "files" && s.set("tab", O), l.kind === "folder" ? s.set("folder", l.documentId) : l.kind === "workstep" ? s.set("step", l.workStepId) : l.kind === "project" ? s.set("projectId", l.projectId) : l.kind === "smart" && s.set("smart", l.smart), Y.trim() && s.set("q", Y.trim()), X !== "list" && s.set("view", X), J !== "creationTime desc" && s.set("sort", J), ee > 0 && s.set("page", String(ee));
    const r = s.toString();
    window.history.replaceState(null, "", r ? `${window.location.pathname}?${r}` : window.location.pathname);
  }, [O, l, Y, X, J, ee]);
  const te = t.useRef(0), Fa = t.useCallback(async (s) => {
    const r = ++te.current;
    ve(s.id), _e(!0);
    try {
      const y = await ca(s.id);
      r === te.current && xe(y);
    } catch (y) {
      if (r !== te.current) return;
      ve(null), xe(null), C("error", "Belge detayı açılamadı."), console.error("[Documents] openDetail", y);
    } finally {
      r === te.current && _e(!1);
    }
  }, []), Aa = async (s) => {
    const r = te.current;
    Ge(!0);
    try {
      await Rs(s.id, {
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
        fields: s.fields.map((z) => ({
          fieldId: z.fieldId,
          valueText: z.valueText ?? null,
          valueNumber: z.valueNumber ?? null,
          valueDate: z.valueDate ?? null
        })),
        tags: s.tags || []
      }), U("Belge güncellendi.");
      const y = await ca(s.id);
      r === te.current && xe(y), await K();
    } catch (y) {
      C("error", "Belge güncellenemedi."), console.error("[Documents] handleSave", y);
    } finally {
      Ge(!1);
    }
  }, Ma = async () => {
    if (re)
      try {
        await Es(re.id), Ye === re.id && (ve(null), xe(null)), U("Belge silindi."), await Promise.all([K(), oe()]);
      } catch (s) {
        C("error", "Belge silinemedi."), console.error("[Documents] handleDelete", s);
      } finally {
        be(null);
      }
  }, La = (s) => {
    je.current = _.has(s.id) ? Array.from(_) : [s.id];
  }, Ka = async (s) => {
    const r = je.current;
    if (r.length)
      try {
        r.length === 1 ? await Cs(r[0], s) : await ua(r, s), U(r.length === 1 ? "Belge taşındı." : `${r.length} belge taşındı.`), V(/* @__PURE__ */ new Set()), await K();
      } catch (y) {
        C("error", "Taşıma başarısız oldu."), console.error("[Documents] move", y);
      } finally {
        je.current = [];
      }
  }, Wa = async () => {
    const s = window.prompt("Hedef klasör adını yazın:");
    if (!s) return;
    const r = a.find((y) => y.title.toLocaleLowerCase("tr") === s.toLocaleLowerCase("tr"));
    if (!r) {
      C("warn", "Klasör bulunamadı.");
      return;
    }
    try {
      await ua(Array.from(_), r.id), U(`${_.size} belge taşındı.`), V(/* @__PURE__ */ new Set()), await K();
    } catch (y) {
      C("error", "Toplu taşıma başarısız oldu."), console.error("[Documents] bulkMove", y);
    }
  }, Oa = async () => {
    const s = window.prompt("Etiket(ler) — virgülle ayırın:");
    if (!s) return;
    const r = s.split(",").map((y) => y.trim()).filter(Boolean);
    if (r.length)
      try {
        await Ds(Array.from(_), r), U(`${_.size} belge etiketlendi.`), V(/* @__PURE__ */ new Set()), await K();
      } catch (y) {
        C("error", "Etiketleme başarısız oldu."), console.error("[Documents] bulkTag", y);
      }
  }, Be = async (s) => {
    if (!m || !(s != null && s.length)) return;
    const r = Ce.current;
    Ce.current = null, Qe(!0);
    try {
      let y = null;
      for (const z of Array.from(s)) {
        const D = await ws(m, z);
        y = y ?? (D == null ? void 0 : D.documentFileId) ?? null;
      }
      r && y ? (await zs({
        assignmentId: r.assignmentId,
        requirementId: r.requirementId,
        workStepId: r.workStepId || null,
        periodCode: r.periodCode || null,
        documentFileId: y
      }), U(`Yüklendi ve "${r.title}" kalemine bağlandı.`)) : U(s.length === 1 ? "Dosya yüklendi." : `${s.length} dosya yüklendi.`), await Promise.all([K(), oe(), Z(), De.current.reload()]);
    } catch (y) {
      C("error", "Dosya yüklenemedi."), console.error("[Documents] upload", y);
    } finally {
      Qe(!1);
    }
  }, Ua = async (s) => {
    try {
      await Is(s.id), U(`"${s.displayName}" geri alındı.`), await Promise.all([K(), oe(), Z()]);
    } catch (r) {
      C("error", "Belge geri alınamadı."), console.error("[Documents] restore", r);
    }
  }, qa = (s) => {
    var r;
    if (!m) {
      C("warn", "Yükleme klasör bağlamında yapılır — soldan bir klasör seçin.");
      return;
    }
    Ce.current = s, (r = Se.current) == null || r.click();
  }, $e = () => {
    const s = new window.abp.ModalManager(ue() + "Documents/CreateModal");
    s.open({ parentDocumentId: m || void 0 }), s.onResult(() => {
      Z(), U("Klasör oluşturuldu.");
    });
  }, na = (s) => Oe((r) => {
    const y = new Set(r);
    return y.has(s) ? y.delete(s) : y.add(s), y;
  }), Ya = (s) => {
    var r;
    M(!1), w(s), ye(0), V(/* @__PURE__ */ new Set()), (r = s.key) != null && r.startsWith("folder-") && na(s.key);
  }, _a = (s) => V((r) => {
    const y = new Set(r);
    return y.has(s) ? y.delete(s) : y.add(s), y;
  }), Ga = () => V((s) => d.every((r) => s.has(r.id)) ? /* @__PURE__ */ new Set() : new Set(d.map((r) => r.id))), Ha = (s, r) => {
    s !== "docs" && s !== "compliance" || (r.preventDefault(), qe(s === "docs" ? "files" : "compliance"));
  }, la = () => {
    var s;
    return (s = Se.current) == null ? void 0 : s.click();
  }, ia = !x && a.length === 0;
  let Pe = null;
  Q && !Y.trim() && l.kind !== "smart" && (ia ? Pe = ae ? /* @__PURE__ */ e.jsx(
    Ae,
    {
      primary: /* @__PURE__ */ e.jsx(I, { onClick: () => ze({ ...ae, setupCompleted: !1 }), children: "Şemayı kur" }),
      link: { label: "veya boş klasörle başla", onClick: $e }
    }
  ) : /* @__PURE__ */ e.jsx(Ae, { primary: /* @__PURE__ */ e.jsx(I, { onClick: $e, children: "Yeni klasör" }) }) : m && (Pe = /* @__PURE__ */ e.jsx(
    Ae,
    {
      primary: /* @__PURE__ */ e.jsx(I, { leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }), onClick: la, children: "Yükle" }),
      link: { label: "veya toplu yükleme ekranını aç", href: `${ue()}Documents/Upload?documentId=${m}` }
    }
  )));
  const Va = ia ? "Klasör şemasını kurumun beklediği yapıya göre kurun; zorunlu belgeler ve meta alanları birlikte gelir." : m ? 'Dosyaları buraya sürükleyin ya da "Yükle" ile ekleyin.' : "Sol taraftan bir klasör seçin; yükleme klasör bağlamında yapılır.";
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto",
      style: { maxWidth: 1560 },
      onDragOver: (s) => {
        m && s.preventDefault();
      },
      onDrop: (s) => {
        var r;
        !m || !((r = s.dataTransfer.files) != null && r.length) || (s.preventDefault(), Be(s.dataTransfer.files));
      },
      children: [
        /* @__PURE__ */ e.jsx(
          bs,
          {
            title: "Dokümanlar",
            description: "Klasörler, belgeler ve meta veri",
            primary: Q && /* @__PURE__ */ e.jsx(
              I,
              {
                variant: "primary",
                isLoading: Ne,
                disabled: !m,
                title: m ? void 0 : "Önce bir klasör seçin",
                leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
                onClick: la,
                children: "Yükle"
              }
            ),
            menuItems: Q ? [
              { key: "folder", label: "Yeni klasör", icon: "fa-folder-plus", onSelect: $e },
              {
                key: "bulk",
                label: "Toplu yükleme",
                icon: "fa-layer-group",
                href: `${ue()}Documents/Upload${m ? `?documentId=${m}` : ""}`
              },
              {
                key: "capture",
                label: "Belge yakala",
                icon: "fa-camera",
                // Telefonda sağ alttaki sabit düğme bu işi görüyor; menüde tekrar etmesin.
                className: "is-desktop-only",
                disabled: !m || Ne,
                hint: m ? null : "Önce bir klasör seçin",
                onSelect: () => {
                  var s;
                  return (s = we.current) == null ? void 0 : s.click();
                }
              }
            ] : []
          }
        ),
        /* @__PURE__ */ e.jsx(
          Ns,
          {
            active: O === "compliance" ? "compliance" : "docs",
            projectId: b,
            compliance: se,
            onSelect: Ha
          }
        ),
        Q && /* @__PURE__ */ e.jsx(Ke, { children: /* @__PURE__ */ e.jsx(
          I,
          {
            variant: "secondary",
            className: "apya-doc-capture-btn",
            isLoading: Ne,
            disabled: !m,
            title: m ? void 0 : "Önce bir klasör seçin",
            leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-camera" }),
            onClick: () => {
              var s;
              return (s = we.current) == null ? void 0 : s.click();
            },
            children: "Belge yakala"
          }
        ) }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: Se,
            type: "file",
            multiple: !0,
            hidden: !0,
            onChange: (s) => {
              Be(s.target.files), s.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: we,
            type: "file",
            accept: "image/*",
            capture: "environment",
            hidden: !0,
            onChange: (s) => {
              Be(s.target.files), s.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ e.jsx(
          pt,
          {
            uploadedThisMonth: f,
            expiring: N,
            compliance: ((ra = se.overview) == null ? void 0 : ra.summary) ?? null
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
            className: R("apya-doc-tab", O === s.key && "is-active"),
            onClick: () => qe(s.key),
            children: s.label
          },
          s.key
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: R("apya-docs-shell", O !== "files" && "is-wide"), children: [
          /* @__PURE__ */ e.jsx(
            Fs,
            {
              loading: x,
              tree: ge,
              activeKey: l.key,
              expanded: le,
              onToggle: na,
              onSelect: Ya,
              onDropFiles: Ka,
              dragTarget: Ia,
              setDragTarget: Da
            }
          ),
          O === "compliance" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(
            at,
            {
              projectId: b,
              periodCode: null,
              onSummaryChange: Pa,
              documentTypes: c
            }
          ) }) : O === "activity" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(nt, { projectId: b, documentFileId: null }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            Xe && /* @__PURE__ */ e.jsx(
              it,
              {
                summary: G,
                busy: Ra,
                onApplyAll: () => Te(
                  da,
                  ((G == null ? void 0 : G.items) ?? []).map(Ee),
                  "Öneriler uygulandı."
                ),
                onApply: (s) => Te(
                  da,
                  [Ee(s)],
                  "Öneri uygulandı."
                ),
                onDismiss: (s) => Te(
                  Ss,
                  [Ee(s)],
                  "Öneri yoksayıldı."
                ),
                onReload: he
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
                  value: ie,
                  onChange: (s) => ba(s.target.value)
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
                    className: R(X === "list" && "is-active"),
                    onClick: () => Ue("list"),
                    "aria-label": "Liste görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: R(X === "grid" && "is-active"),
                    onClick: () => Ue("grid"),
                    "aria-label": "Kart görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-border-all" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              Os,
              {
                loading: B,
                files: d,
                totalCount: k,
                view: X,
                sorting: J,
                onSort: (s) => {
                  Na(s), ye(0);
                },
                selectedId: Ye,
                onSelect: Fa,
                checkedIds: _,
                onToggleCheck: _a,
                onToggleAll: Ga,
                page: ee,
                pageSize: Le,
                onPageChange: ye,
                onDragStart: La,
                emptyHint: Va,
                emptyAction: Pe,
                missingItems: $a,
                onUploadMissing: qa,
                canUpload: Q,
                isTrash: F,
                onRestore: Ua
              }
            ),
            Ea && /* @__PURE__ */ e.jsx(
              Us,
              {
                count: _.size,
                onClear: () => V(/* @__PURE__ */ new Set()),
                onMove: Wa,
                onTag: Oa
              }
            )
          ] }),
          O === "files" && /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx(
            Gs,
            {
              detail: wa,
              loading: za,
              canEdit: Xe,
              documentTypes: c,
              saving: Ca,
              onSave: Aa,
              onDelete: Ta ? be : () => {
              }
            }
          ) })
        ] }),
        re && /* @__PURE__ */ e.jsx(
          mt,
          {
            title: "Belge silinecek",
            message: `"${re.displayName}" ve tüm versiyonları çöp kutusuna taşınacak. Sol alttaki "Çöp kutusu"ndan geri alabilirsiniz.`,
            onConfirm: Ma,
            onCancel: () => be(null)
          }
        ),
        ae && !ae.setupCompleted && /* @__PURE__ */ e.jsx(
          ct,
          {
            state: ae,
            onDone: async () => {
              ze({ ...ae, setupCompleted: !0 }), await Promise.all([Z(), K()]);
            }
          }
        ),
        He && /* @__PURE__ */ e.jsx(ut, { message: He, onDone: () => Ve(null) })
      ]
    }
  );
}
const ha = document.getElementById("documents-island");
ha && Za(ha).render(/* @__PURE__ */ e.jsx(yt, {}));
