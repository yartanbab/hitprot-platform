import { r as n, j as e } from "./react-vendor-D7YDiBbi.js";
import { E as G, t as ys, R as xs, u as fs, w as ee, m as hs } from "./index-DgpuJ91w.js";
import { S as ka, B as D, e as q, g as gs, I as O } from "./Dialog-BEQtx1HL.js";
import { M as Ge } from "./ModalPortal-CVz5ohco.js";
import { a as fe, g as vs, b as ks, c as T, d as js, e as bs, u as Ns, f as Ss, h as ws, i as zs, j as xe, k as Cs, l as Is, r as Ds, w as Es, m as Rs, n as Ts, o as Bs, p as $s, q as Ps, s as Fs, t as As, v as Ue, x as Ls, y as Ms, z as Ks, A as Ws, B as ja, E as Ye, D as qs, P as Os, C as Us, F as ba, G as Ys, H as Hs, I as _s, J as Na, K as Gs, L as Vs, M as Qs, N as Zs } from "./ProcessRibbon-CHjVpooY.js";
import { S as he } from "./SkeletonShape-Cev7M69F.js";
import { d as Ea } from "./draggableActivation-Ybw9Upbh.js";
import { H as He } from "./Hint-BhMztyJX.js";
const B = (...a) => a.filter(Boolean).join(" "), H = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  money: (a, r) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + (r ? " " + Js(r) : ""),
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
};
function Js(a) {
  return { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }[a] || a;
}
const de = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Kesin", chip: "apya-chip-positive" },
  3: { text: "Eşleşti", chip: "apya-chip-accent" },
  4: { text: "Süre dolan", chip: "apya-chip-negative" }
}, Sa = {
  1: { text: "Manuel", variant: "neutral" },
  2: { text: "OCR", variant: "brand" },
  3: { text: "AI", variant: "accent" },
  4: { text: "Kural", variant: "warning" }
}, Xs = {
  1: "Yüklendi",
  2: "İndirildi",
  3: "Silindi",
  4: "Görüntülendi",
  5: "Meta değişti",
  6: "Taşındı"
};
function Ve(a, r) {
  var d;
  const i = ((d = (r || "").split(".").pop()) == null ? void 0 : d.toLowerCase()) || "";
  return a != null && a.includes("pdf") || i === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444", label: "PDF" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(i) ? { icon: "fa-file-excel", color: "#10B981", label: "XLS" } : a != null && a.includes("word") || ["docx", "doc"].includes(i) ? { icon: "fa-file-word", color: "#3B82F6", label: "DOC" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(i) ? { icon: "fa-file-powerpoint", color: "#F59E0B", label: "PPT" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(i) ? { icon: "fa-file-image", color: "#8B5CF6", label: "IMG" } : ["zip", "rar", "7z"].includes(i) ? { icon: "fa-file-zipper", color: "#6B7280", label: "ZIP" } : { icon: "fa-file", color: "#6B7280", label: "DOSYA" };
}
function et(a) {
  const r = ["apya-chip-accent", "apya-chip-brand", "apya-chip-positive", "apya-chip-warning", "apya-chip-neutral"];
  let i = 0;
  for (let d = 0; d < a.length; d++) i = i * 31 + a.charCodeAt(d) >>> 0;
  return r[i % r.length];
}
const at = [
  { key: "expiring", label: "Süresi dolanlar", icon: "fa-clock-rotate-left" },
  { key: "missing-meta", label: "Eksik meta", icon: "fa-triangle-exclamation" },
  { key: "suggested", label: "Öneri bekleyen", icon: "fa-wand-magic-sparkles" },
  { key: "trash", label: "Çöp kutusu", icon: "fa-trash-can" }
];
function Ra({
  node: a,
  depth: r,
  activeKey: i,
  expanded: d,
  onToggle: o,
  onSelect: y,
  onDropFiles: u,
  dragTarget: g,
  setDragTarget: c
}) {
  var k;
  const N = ((k = a.children) == null ? void 0 : k.length) > 0, v = d.has(a.key), j = g === a.documentId && a.documentId;
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => y(a),
        onDragOver: (x) => {
          a.documentId && (x.preventDefault(), c(a.documentId));
        },
        onDragLeave: () => c(null),
        onDrop: (x) => {
          a.documentId && (x.preventDefault(), c(null), u(a.documentId));
        },
        className: B("apya-md-item", i === a.key && "selected"),
        style: {
          paddingLeft: 10 + r * 14,
          borderRadius: 8,
          ...j ? { outline: "2px dashed var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
        },
        children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              role: "button",
              tabIndex: -1,
              onClick: (x) => {
                x.stopPropagation(), N && o(a.key);
              },
              className: "w-3 flex-shrink-0",
              style: { color: "var(--apya-text-tertiary)" },
              children: N && /* @__PURE__ */ e.jsx("i", { className: `fa fa-chevron-${v ? "down" : "right"}`, style: { fontSize: 9 } })
            }
          ),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${a.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: a.label }),
          typeof a.count == "number" && /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: a.count })
        ]
      }
    ),
    N && v && a.children.map((x) => /* @__PURE__ */ e.jsx(
      Ra,
      {
        node: x,
        depth: r + 1,
        activeKey: i,
        expanded: d,
        onToggle: o,
        onSelect: y,
        onDropFiles: u,
        dragTarget: g,
        setDragTarget: c
      },
      x.key
    ))
  ] });
}
function st({
  loading: a,
  error: r = null,
  onRetry: i,
  tree: d,
  activeKey: o,
  expanded: y,
  onToggle: u,
  onSelect: g,
  onDropFiles: c,
  dragTarget: N,
  setDragTarget: v
}) {
  const j = n.useId(), k = a && !!r;
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Bağlam" }),
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => g({ key: "all", kind: "all" }),
        className: B("apya-md-item", o === "all" && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-tree", style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", style: { fontWeight: 600 }, children: "Tüm Dokümanlar" })
        ]
      }
    ),
    a && !r ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(he, { rows: 5 }) }) : r && d.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(G, { compact: !0, variant: "error", title: "Klasörler yüklenemedi", error: r, onRetry: i, retrying: k }) }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      r && /* @__PURE__ */ e.jsxs(
        "div",
        {
          role: "alert",
          className: "mx-1 mb-2 flex flex-wrap items-center gap-2 rounded-card border border-negative-100 bg-negative-50 px-3 py-2 text-[12.5px] text-negative-700",
          children: [
            /* @__PURE__ */ e.jsx("span", { id: j, className: "min-w-0 flex-1", children: ys("Documents:Tree:RefreshFailed", "Klasörler yenilenemedi.") }),
            /* @__PURE__ */ e.jsx(xs, { onRetry: i, retrying: k, "aria-describedby": j })
          ]
        }
      ),
      d.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör yok." }) : d.map((x) => /* @__PURE__ */ e.jsx(
        Ra,
        {
          node: x,
          depth: 0,
          activeKey: o,
          expanded: y,
          onToggle: u,
          onSelect: g,
          onDropFiles: c,
          dragTarget: N,
          setDragTarget: v
        },
        x.key
      ))
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Akıllı klasörler" }),
    at.map((x) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => g({ key: x.key, kind: "smart", smart: x.key }),
        className: B("apya-md-item", o === x.key && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${x.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: x.label })
        ]
      },
      x.key
    ))
  ] });
}
const tt = [
  { key: "displayName", label: "Belge", sortable: !0 },
  { key: "workStep", label: "İş adımı", sortable: !1, className: "apya-doc-col-step" },
  { key: "type", label: "Tür", sortable: !1, className: "apya-doc-col-type" },
  { key: "amount", label: "Tutar", sortable: !0, align: "right" },
  { key: "documentDate", label: "Tarih", sortable: !0 },
  { key: "status", label: "Durum", sortable: !1 }
];
function nt({ column: a, sorting: r, onSort: i }) {
  if (!a.sortable)
    return /* @__PURE__ */ e.jsx("span", { className: a.className, style: { textAlign: a.align || "left" }, children: a.label });
  const [d, o] = (r || "").split(" "), y = d === a.key, u = y && o !== "desc" ? "desc" : "asc";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => i(`${a.key} ${u}`),
      className: "d-flex align-items-center gap-1",
      style: {
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        font: "inherit",
        color: y ? "var(--apya-accent-500)" : "inherit",
        justifyContent: a.align === "right" ? "flex-end" : "flex-start",
        width: "100%"
      },
      "aria-sort": y ? o === "desc" ? "descending" : "ascending" : "none",
      children: [
        a.label,
        /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${y ? o === "desc" ? "arrow-down" : "arrow-up" : "arrows-up-down"}`,
            style: { fontSize: 8, opacity: y ? 1 : 0.4 }
          }
        )
      ]
    }
  );
}
function lt({ item: a, onUpload: r, canUpload: i }) {
  const d = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || "Proje";
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
      a.isBlocking && /* @__PURE__ */ e.jsx(q, { variant: "warning", size: "sm", children: "teslimi bloke ediyor" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-step", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: d }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-type", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: a.documentTypeName || "—" }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right", color: "var(--apya-text-tertiary)" }, children: "—" }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-warning-700, #92400E)" }, children: "bekliyor" }),
    /* @__PURE__ */ e.jsx("span", { children: i ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-missing-upload", onClick: () => r(a), children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
      " Yükle"
    ] }) : /* @__PURE__ */ e.jsx("span", { className: "apya-chip apya-chip-warning", children: "Eksik" }) })
  ] });
}
function it({ file: a, selected: r, checked: i, onSelect: d, onToggleCheck: o, onDragStart: y, isTrash: u, onRestore: g }) {
  const c = Ve(a.contentType, a.fileName), N = de[a.status] || de[1], v = Ea(() => d(a));
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !u,
      onDragStart: u ? void 0 : () => y(a),
      onPointerDown: u ? void 0 : v.onPointerDown,
      onClick: u ? void 0 : v.onClick,
      className: B("apya-doc-row", r && "is-selected", u && "is-trashed"),
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            onClick: u ? void 0 : (j) => {
              j.stopPropagation(), o(a.id);
            },
            onPointerDown: u ? void 0 : (j) => j.stopPropagation(),
            style: { cursor: u ? "default" : "pointer" },
            children: u ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash-can", style: { fontSize: 12, color: "var(--apya-text-tertiary)" } }) : /* @__PURE__ */ e.jsx(
              "i",
              {
                className: `fa fa-${i ? "square-check" : "square"}`,
                style: { fontSize: 13, color: i ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
                role: "checkbox",
                "aria-checked": i
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
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(q, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] }),
          a.isLocked && /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock", style: { fontSize: 10, color: "var(--apya-text-tertiary)" }, title: "Kilitli" })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-step", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-type", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: a.documentTypeName || "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right" }, children: H.money(a.amount, a.currency) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: H.date(a.documentDate || a.creationTime) }),
        /* @__PURE__ */ e.jsx("span", { children: u ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => g(a), children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-rotate-left" }),
          " Geri al"
        ] }) : /* @__PURE__ */ e.jsx("span", { className: B("apya-chip", N.chip), children: N.text }) })
      ]
    }
  );
}
function rt({ file: a, selected: r, onSelect: i, onDragStart: d }) {
  const o = Ve(a.contentType, a.fileName), y = de[a.status] || de[1];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: !0,
      onDragStart: () => d(a),
      ...Ea(() => i(a)),
      className: "apya-tile",
      style: {
        textAlign: "left",
        cursor: "pointer",
        ...r ? { borderColor: "var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {}
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
          a.versionCount > 1 && /* @__PURE__ */ e.jsxs(q, { variant: "brand", size: "sm", children: [
            "v",
            a.versionCount
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", style: { borderTop: "none", paddingTop: 0 }, children: [
          /* @__PURE__ */ e.jsx("span", { className: B("apya-chip", y.chip), children: y.text }),
          a.amount !== null && a.amount !== void 0 && /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: H.money(a.amount, a.currency) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", children: a.uploaderName || "Sistem" }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", children: H.date(a.documentDate || a.creationTime) })
        ] })
      ]
    }
  );
}
function ot({
  loading: a,
  loadError: r = null,
  onRetry: i,
  files: d,
  totalCount: o,
  view: y,
  sorting: u,
  onSort: g,
  selectedId: c,
  onSelect: N,
  checkedIds: v,
  onToggleCheck: j,
  onToggleAll: k,
  page: x,
  pageSize: b,
  onPageChange: w,
  onDragStart: C,
  emptyHint: t,
  emptyAction: z = null,
  missingItems: E = [],
  onUploadMissing: A,
  canUpload: K = !1,
  isTrash: f = !1,
  onRestore: m
}) {
  const h = d.length > 0 && d.every((I) => v.has(I.id)), $ = Math.max(1, Math.ceil(o / b)), L = x === 0 && y === "list" ? E : [];
  return a && !r ? y === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: Array.from({ length: 6 }).map((I, P) => /* @__PURE__ */ e.jsx(ka, { height: 120, rounded: "lg" }, P)) }) : /* @__PURE__ */ e.jsx("div", { className: "p-3 d-flex flex-column gap-2", children: Array.from({ length: 8 }).map((I, P) => /* @__PURE__ */ e.jsx(ka, { height: 40, rounded: "md" }, P)) }) : r ? /* @__PURE__ */ e.jsx(G, { variant: "error", title: "Belge listesi yüklenemedi", error: r, onRetry: i, retrying: a }) : d.length === 0 && L.length === 0 ? /* @__PURE__ */ e.jsx(
    G,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
      title: "Burada henüz belge yok",
      description: t,
      action: z
    }
  ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    y === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: d.map((I) => /* @__PURE__ */ e.jsx(
      rt,
      {
        file: I,
        selected: c === I.id,
        onSelect: N,
        onDragStart: C
      },
      I.id
    )) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-filelist", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-row-head", children: [
        /* @__PURE__ */ e.jsx("span", { onClick: k, style: { cursor: "pointer" }, children: /* @__PURE__ */ e.jsx(
          "i",
          {
            className: `fa fa-${h ? "square-check" : "square"}`,
            style: { fontSize: 13, color: h ? "var(--apya-accent-500)" : "var(--apya-text-tertiary)" },
            role: "checkbox",
            "aria-checked": h
          }
        ) }),
        tt.map((I) => /* @__PURE__ */ e.jsx(nt, { column: I, sorting: u, onSort: g }, I.key))
      ] }),
      L.map((I) => /* @__PURE__ */ e.jsx(
        lt,
        {
          item: I,
          onUpload: A,
          canUpload: K
        },
        `missing-${I.assignmentId}-${I.requirementId}-${I.workStepId || "none"}`
      )),
      d.map((I) => /* @__PURE__ */ e.jsx(
        it,
        {
          file: I,
          selected: c === I.id,
          checked: v.has(I.id),
          onSelect: N,
          onToggleCheck: j,
          onDragStart: C,
          isTrash: f,
          onRestore: m
        },
        I.id
      ))
    ] }),
    $ > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            x * b + 1,
            "–",
            Math.min((x + 1) * b, o),
            " / ",
            o
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(D, { variant: "outline", size: "sm", disabled: x === 0, onClick: () => w(x - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              x + 1,
              " / ",
              $
            ] }),
            /* @__PURE__ */ e.jsx(D, { variant: "outline", size: "sm", disabled: x + 1 >= $, onClick: () => w(x + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
function ct({ count: a, onClear: r, onMove: i, onTag: d, busy: o }) {
  return a === 0 ? null : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-bulkbar", children: [
    /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
      a,
      " belge seçildi"
    ] }),
    /* @__PURE__ */ e.jsx("span", { style: { width: 1, height: 18, background: "rgba(255,255,255,.18)" } }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: i, disabled: o, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-open" }),
      " Taşı"
    ] }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: d, disabled: o, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-tag" }),
      " Etiketle"
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
    /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: r, children: "Vazgeç" })
  ] });
}
function dt({ tags: a }) {
  return a != null && a.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1", children: a.map((r) => /* @__PURE__ */ e.jsx("span", { className: B("apya-chip", et(r)), children: r }, r)) }) : null;
}
const wa = {
  1: { icon: "fa-diagram-project", label: "Proje" },
  2: { icon: "fa-list-check", label: "İş adımı" },
  3: { icon: "fa-receipt", label: "Harcama", href: (a) => a ? `${fe()}Expenses` : null },
  4: {
    icon: "fa-box-archive",
    label: "Teslim paketi",
    href: (a) => a ? `${fe()}Documents/Deliveries?packageId=${a}` : null
  },
  5: { icon: "fa-clipboard-check", label: "Kontrol listesi kalemi" }
};
function ut({ field: a, value: r, onChange: i, disabled: d }) {
  const o = { size: "sm", disabled: d, value: r ?? "" };
  switch (a.fieldType) {
    case 2:
      return /* @__PURE__ */ e.jsx(O, { ...o, type: "date", onChange: (y) => i({ valueDate: y.target.value || null }) });
    case 3:
    case 4:
    case 5:
      return /* @__PURE__ */ e.jsx(
        O,
        {
          ...o,
          type: "number",
          step: a.fieldType === 3 ? "0.01" : "1",
          onChange: (y) => i({ valueNumber: y.target.value === "" ? null : Number(y.target.value) })
        }
      );
    default:
      return /* @__PURE__ */ e.jsx(O, { ...o, onChange: (y) => i({ valueText: y.target.value || null }) });
  }
}
function mt(a) {
  return a.fieldType === 2 ? a.valueDate ? a.valueDate.substring(0, 10) : "" : [3, 4, 5].includes(a.fieldType) ? a.valueNumber ?? "" : a.valueText ?? "";
}
function pt({
  detail: a,
  loading: r,
  canEdit: i,
  onSave: d,
  onDelete: o,
  saving: y,
  documentTypes: u
}) {
  var b, w, C;
  const [g, c] = n.useState(null);
  if (n.useEffect(() => {
    c(a ? { ...a, fields: (a.fields || []).map((t) => ({ ...t })) } : null);
  }, [a == null ? void 0 : a.id]), r)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(he, { rows: 6 }) });
  if (!a || !g)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(
      G,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir belge seçin",
        description: "Künye, özel alanlar ve versiyon geçmişi burada görünür."
      }
    ) });
  const N = Ve(a.contentType, a.fileName), v = de[g.status] || de[1], j = H.daysLeft(g.expiryDate), k = (t, z) => {
    c((E) => ({
      ...E,
      fields: E.fields.map((A) => A.fieldId === t ? { ...A, valueText: null, valueNumber: null, valueDate: null, ...z } : A)
    }));
  }, x = g.fields.filter(
    (t) => t.isRequired && !t.valueText && t.valueNumber === null && !t.valueDate
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-md-detail", style: { overflowY: "auto" }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
      /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "d-grid place-items-center flex-shrink-0",
          style: { width: 48, height: 48, borderRadius: 14, background: `${N.color}1a`, color: N.color, fontSize: 20 },
          children: /* @__PURE__ */ e.jsx("i", { className: `fa ${N.icon}` })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 14, fontWeight: 600, wordBreak: "break-word" }, children: a.displayName }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric mt-1", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
          H.size(a.fileSize),
          " · ",
          N.label,
          a.versionCount > 1 && ` · v${a.versionCount}`
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-1 mt-1 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: B("apya-chip", v.chip), children: v.text }),
          j !== null && j >= 0 && j <= 30 && /* @__PURE__ */ e.jsxs(q, { variant: "warning", size: "sm", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
            " ",
            j,
            " gün"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-3", children: [
      a.downloadUrl && /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: gs({ variant: "primary" }), style: { flex: 1 }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }),
      i && !a.isLocked && /* @__PURE__ */ e.jsx(D, { variant: "outline", onClick: () => o(a), title: "Sil", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash", style: { color: "var(--apya-negative-500)" } }) })
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
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: H.dateTime(a.creationTime) })
      ] }),
      a.retentionUntil && /* @__PURE__ */ e.jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Saklama" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: H.date(a.retentionUntil) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Özel alanlar",
        /* @__PURE__ */ e.jsx(He, { text: "Alan şeması belge tipine bağlıdır. Tip değiştirdiğinizde kaydettikten sonra o tipin alanları görünür." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tipi" }),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-select",
              disabled: !i || a.isLocked,
              value: g.documentTypeId || "",
              onChange: (t) => c({ ...g, documentTypeId: t.target.value || null }),
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "— Sınıflandırılmamış —" }),
                u.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: t.name }, t.id))
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
              disabled: !i || a.isLocked,
              value: g.amount ?? "",
              onChange: (t) => c({ ...g, amount: t.target.value === "" ? null : Number(t.target.value) })
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
              disabled: !i || a.isLocked,
              value: g.documentDate ? g.documentDate.substring(0, 10) : "",
              onChange: (t) => c({ ...g, documentDate: t.target.value || null })
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
              disabled: !i || a.isLocked,
              value: g.periodCode ?? "",
              onChange: (t) => c({ ...g, periodCode: t.target.value || null })
            }
          )
        ] }),
        g.fields.map((t) => {
          var z, E;
          return /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              t.label,
              t.isRequired && /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-negative-500)" }, children: "*" }),
              /* @__PURE__ */ e.jsx(q, { variant: ((z = Sa[t.fillSource]) == null ? void 0 : z.variant) || "neutral", size: "sm", children: ((E = Sa[t.fillSource]) == null ? void 0 : E.text) || "—" }),
              t.confidence !== null && t.confidence !== void 0 && /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10 }, children: [
                "%",
                t.confidence
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              ut,
              {
                field: t,
                value: mt(t),
                disabled: !i || a.isLocked,
                onChange: (A) => k(t.fieldId, A)
              }
            )
          ] }, t.fieldId);
        })
      ] }),
      x.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", style: { fontSize: 11, color: "var(--apya-warning-500)" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation" }),
        " ",
        x.length,
        " zorunlu alan boş."
      ] }),
      i && !a.isLocked && /* @__PURE__ */ e.jsx(
        D,
        {
          variant: "primary",
          size: "sm",
          className: "mt-3 w-100",
          isLoading: y,
          onClick: () => d(g),
          children: "Kaydet"
        }
      )
    ] }),
    ((b = a.tags) == null ? void 0 : b.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Etiketler" }),
      /* @__PURE__ */ e.jsx(dt, { tags: a.tags })
    ] }),
    ((w = a.related) == null ? void 0 : w.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "İlişkili kayıtlar",
        /* @__PURE__ */ e.jsx(He, { text: "Belgenin bağlandığı harcama, içinde gittiği teslim paketi ve karşıladığı kontrol listesi kalemleri." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.related.map((t, z) => {
        var f;
        const E = wa[t.kind] ?? wa[3], A = (f = E.href) == null ? void 0 : f.call(E, t.entityId), K = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 22, height: 22, borderRadius: 6, background: "var(--apya-surface-sunken)", color: "var(--apya-text-secondary)", fontSize: 10 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${E.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12 }, children: t.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "d-block text-truncate apya-numeric",
                style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" },
                children: [E.label, t.detail].filter(Boolean).join(" · ")
              }
            )
          ] })
        ] });
        return A ? /* @__PURE__ */ e.jsx(
          "a",
          {
            href: A,
            className: "d-flex align-items-center gap-2 text-decoration-none",
            style: { color: "inherit" },
            children: K
          },
          `${t.kind}-${t.entityId}-${z}`
        ) : /* @__PURE__ */ e.jsx("div", { className: "d-flex align-items-center gap-2", children: K }, `${t.kind}-${z}`);
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Versiyonlar",
        /* @__PURE__ */ e.jsx(He, { text: "Aynı klasöre aynı isimle yeniden yüklenen dosya yeni versiyon olur; önceki versiyonlar burada kalır." })
      ] }),
      (C = a.versions) != null && C.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1", children: a.versions.map((t) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsxs(q, { variant: t.isLatest ? "brand" : "neutral", size: "sm", children: [
            "v",
            t.versionNumber
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { color: "var(--apya-text-secondary)" }, children: t.uploaderName })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { color: "var(--apya-text-tertiary)" }, children: H.date(t.creationTime) })
      ] }, t.id)) }) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Versiyon kaydı yok." })
    ] })
  ] });
}
const Ta = [
  { value: 1, label: "Proje geneli" },
  { value: 2, label: "Her iş adımı için" },
  { value: 3, label: "Her dönem için" }
], Ba = [
  { value: 2, label: "Klasör şeması" },
  { value: 3, label: "Task eki" }
], yt = {
  title: "",
  scope: 1,
  documentTypeId: "",
  isBlocking: !1,
  order: 0,
  source: 2,
  sourceEntityId: ""
};
function xt({ draft: a, setDraft: r, documentTypes: i, tasks: d, onSubmit: o, onCancel: y, busy: u }) {
  const g = Number(a.source) === 3;
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
          O,
          {
            size: "sm",
            placeholder: "Kalem adı (ör. İmzalı hizmet sözleşmesi)",
            value: a.title,
            onChange: (c) => r({ ...a, title: c.target.value }),
            required: !0
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.source,
              onChange: (c) => r({ ...a, source: Number(c.target.value), sourceEntityId: "" }),
              "aria-label": "Kaynak",
              children: Ba.map((c) => /* @__PURE__ */ e.jsx("option", { value: c.value, children: c.label }, c.value))
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.scope,
              onChange: (c) => r({ ...a, scope: Number(c.target.value) }),
              "aria-label": "Kapsam",
              children: Ta.map((c) => /* @__PURE__ */ e.jsx("option", { value: c.value, children: c.label }, c.value))
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-doc-select",
              value: a.documentTypeId || "",
              onChange: (c) => r({ ...a, documentTypeId: c.target.value }),
              "aria-label": "Belge tipi",
              disabled: g,
              title: g ? "Göreve bağlı kalem otomatik eşleşmez" : void 0,
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "Belge tipi: yok (elle bağlanır)" }),
                i.map((c) => /* @__PURE__ */ e.jsx("option", { value: c.id, children: c.name }, c.id))
              ]
            }
          )
        ] }),
        g && /* @__PURE__ */ e.jsxs(
          "select",
          {
            className: "apya-doc-select",
            value: a.sourceEntityId || "",
            onChange: (c) => r({ ...a, sourceEntityId: c.target.value }),
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
        g && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-warning-700, #92400E)" }, children: "Göreve bağlı kalem otomatik karşılanmaz; belge elle bağlanır." }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex align-items-center gap-2", style: { fontSize: 12 }, children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: a.isBlocking,
              onChange: (c) => r({ ...a, isBlocking: c.target.checked })
            }
          ),
          "Eksikse teslim paketi üretimini bloke etsin"
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [
          /* @__PURE__ */ e.jsx(D, { type: "button", variant: "outline", size: "sm", onClick: y, children: "Vazgeç" }),
          /* @__PURE__ */ e.jsx(D, { type: "submit", size: "sm", isLoading: u, disabled: !a.title.trim(), children: "Kaydet" })
        ] })
      ]
    }
  );
}
function ft({ pkg: a, projectId: r, documentTypes: i, onClose: d, onChanged: o }) {
  const [y, u] = n.useState([]), [g, c] = n.useState([]), [N, v] = n.useState(!0), [j, k] = n.useState(!1), [x, b] = n.useState({
    name: a.name,
    issuer: a.issuer,
    description: a.description || "",
    order: a.order || 0
  }), [w, C] = n.useState(null), [t, z] = n.useState(null), E = n.useCallback(async () => {
    v(!0);
    try {
      const [h, $] = await Promise.all([
        vs(a.id),
        // Görev listesi yalnız proje bağlamında anlamlı; yoksa "task eki"
        // kaynağı seçilebilir ama liste boş kalır.
        r ? ks(r) : Promise.resolve([])
      ]);
      u(h ?? []), c($ ?? []);
    } catch (h) {
      T("error", "Paket kalemleri yüklenemedi."), console.error("[Documents] package requirements", h);
    } finally {
      v(!1);
    }
  }, [a.id, r]);
  n.useEffect(() => {
    E();
  }, [E]);
  const A = async () => {
    k(!0);
    try {
      await Ns(a.id, {
        name: x.name,
        issuer: x.issuer,
        description: x.description || null,
        order: x.order
      }), T("success", "Paket güncellendi."), o == null || o();
    } catch (h) {
      T("error", "Paket güncellenemedi."), console.error("[Documents] update package", h);
    } finally {
      k(!1);
    }
  }, K = async () => {
    k(!0);
    try {
      const h = {
        title: w.title.trim(),
        scope: Number(w.scope),
        documentTypeId: w.documentTypeId || null,
        isBlocking: w.isBlocking,
        order: Number(w.order) || y.length,
        source: Number(w.source),
        sourceEntityId: w.sourceEntityId || null
      };
      t ? await ws(t, h) : await zs(a.id, h), C(null), z(null), await E(), o == null || o();
    } catch (h) {
      T("error", "Kalem kaydedilemedi."), console.error("[Documents] save requirement", h);
    } finally {
      k(!1);
    }
  }, f = async (h) => {
    k(!0);
    try {
      await Ss(h), await E(), o == null || o();
    } catch ($) {
      T("error", "Kalem silinemedi."), console.error("[Documents] delete requirement", $);
    } finally {
      k(!1);
    }
  }, m = async () => {
    var h, $;
    if (window.confirm(`"${a.name}" paketi silinecek. Emin misiniz?`)) {
      k(!0);
      try {
        await bs(a.id), o == null || o(), d();
      } catch (L) {
        T("error", (($ = (h = L == null ? void 0 : L.responseJSON) == null ? void 0 : h.error) == null ? void 0 : $.message) || "Paket silinemedi."), console.error("[Documents] delete package", L);
      } finally {
        k(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Paketi düzenle" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: m, disabled: j, children: "Paketi sil" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: d, children: "Kapat" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx(
        O,
        {
          size: "sm",
          placeholder: "Paket adı",
          value: x.name,
          onChange: (h) => b({ ...x, name: h.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(
        O,
        {
          size: "sm",
          placeholder: "İsteyen taraf (ör. İç politika)",
          value: x.issuer,
          onChange: (h) => b({ ...x, issuer: h.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(D, { size: "sm", variant: "outline", isLoading: j, onClick: A, children: "Kaydet" })
    ] }),
    N ? /* @__PURE__ */ e.jsx(he, { rows: 4 }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-list", children: [
      y.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "p-2", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette henüz kalem yok." }),
      y.map((h) => {
        var $, L;
        return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", children: [
          /* @__PURE__ */ e.jsx("span", { className: B("apya-chip", h.isBlocking ? "apya-chip-warning" : "apya-chip-neutral"), children: h.isBlocking ? "bloke eden" : "normal" }),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: h.title }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              (($ = Ba.find((I) => I.value === h.source)) == null ? void 0 : $.label) || "kurum şablonu",
              h.sourceEntityName && ` · ${h.sourceEntityName}`,
              " · ",
              (L = Ta.find((I) => I.value === h.scope)) == null ? void 0 : L.label,
              h.documentTypeName && ` · ${h.documentTypeName}`
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
                  z(h.id), C({
                    title: h.title,
                    scope: h.scope,
                    documentTypeId: h.documentTypeId || "",
                    isBlocking: h.isBlocking,
                    order: h.order,
                    source: h.source === 1 ? 2 : h.source,
                    sourceEntityId: h.sourceEntityId || ""
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
                onClick: () => f(h.id),
                children: "Sil"
              }
            )
          ] })
        ] }, h.id);
      })
    ] }),
    w ? /* @__PURE__ */ e.jsx(
      xt,
      {
        draft: w,
        setDraft: C,
        documentTypes: i,
        tasks: g,
        onSubmit: K,
        onCancel: () => {
          C(null), z(null);
        },
        busy: j
      }
    ) : /* @__PURE__ */ e.jsx(
      D,
      {
        size: "sm",
        variant: "outline",
        leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
        onClick: () => {
          z(null), C({ ...yt, order: y.length });
        },
        children: "Kalem ekle"
      }
    )
  ] });
}
function ht({ packages: a, projectId: r, documentTypes: i, onChanged: d }) {
  const [o, y] = n.useState(null), [u, g] = n.useState(!1), [c, N] = n.useState(""), [v, j] = n.useState(!1), k = a.filter((b) => b.isEditable), x = async () => {
    j(!0);
    try {
      const b = await js({
        name: c.trim(),
        issuer: "İç politika",
        description: null,
        order: k.length
      });
      N(""), g(!1), d == null || d(), y(b);
    } catch (b) {
      T("error", "Paket oluşturulamadı."), console.error("[Documents] create package", b);
    } finally {
      j(!1);
    }
  };
  return o ? /* @__PURE__ */ e.jsx(
    ft,
    {
      pkg: o,
      projectId: r,
      documentTypes: i,
      onClose: () => y(null),
      onChanged: d
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Kendi paketleriniz" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      !u && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => g(!0), children: "+ Yeni paket" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Kurum paketleri (KOSGEB, TÜBİTAK) sistemde tanımlıdır ve değiştirilemez. Kendi klasör şemanız ve göreve bağlı ekleriniz için buradan paket kurun." }),
    u && /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        O,
        {
          size: "sm",
          autoFocus: !0,
          placeholder: "Paket adı (ör. Şirket klasör şeması)",
          value: c,
          onChange: (b) => N(b.target.value),
          onKeyDown: (b) => {
            b.key === "Enter" && c.trim() && x();
          }
        }
      ),
      /* @__PURE__ */ e.jsx(D, { size: "sm", isLoading: v, disabled: !c.trim(), onClick: x, children: "Oluştur" }),
      /* @__PURE__ */ e.jsx(D, { size: "sm", variant: "outline", onClick: () => {
        g(!1), N("");
      }, children: "Vazgeç" })
    ] }),
    k.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Henüz kendi paketiniz yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: k.map((b) => /* @__PURE__ */ e.jsxs(D, { variant: "outline", size: "sm", onClick: () => y(b), children: [
      b.name,
      /* @__PURE__ */ e.jsx(q, { variant: "neutral", size: "sm", children: b.requirementCount })
    ] }, b.id)) })
  ] });
}
const za = {
  1: { text: "Karşılandı", chip: "apya-chip-positive", icon: "fa-check" },
  2: { text: "Eksik", chip: "apya-chip-warning", icon: "fa-triangle-exclamation" },
  3: { text: "Feragat", chip: "apya-chip-neutral", icon: "fa-ban" }
}, gt = { 1: "Proje", 2: "İş adımı", 3: "Dönem" }, Ca = {
  1: "kurum şablonu",
  2: "klasör şeması",
  3: "task eki"
};
function vt({ percent: a, blocking: r }) {
  const i = r > 0 ? "var(--apya-negative-500)" : a >= 90 ? "var(--apya-positive-500)" : "var(--apya-warning-500)";
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", role: "progressbar", "aria-valuenow": a, "aria-valuemin": 0, "aria-valuemax": 100, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a}%`, background: i } }) });
}
function kt({ item: a, canManage: r, onWaive: i, busy: d }) {
  const o = za[a.status] || za[2], y = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || gt[a.scope];
  return /* @__PURE__ */ e.jsxs("div", { className: B("apya-doc-check-row", a.status === 2 && a.isBlocking && "is-blocking"), children: [
    /* @__PURE__ */ e.jsxs("span", { className: B("apya-chip", o.chip), children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa ${o.icon}` }),
      " ",
      o.text
    ] }),
    /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.title }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
        Ca[a.source] || Ca[1],
        a.sourceEntityName && ` · ${a.sourceEntityName}`,
        " · ",
        y,
        a.documentTypeName && ` · ${a.documentTypeName}`,
        a.waiveReason && ` · ${a.waiveReason}`
      ] }),
      a.requiresManualLink && a.status === 2 && /* @__PURE__ */ e.jsx("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-warning-700, #92400E)" }, children: "Otomatik eşleşmez — belgeyi elle bağlayın." })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: a.documentFileName || "—" }),
    /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2 justify-content-end", children: [
      a.isBlocking && a.status === 2 && /* @__PURE__ */ e.jsx(q, { variant: "negative", size: "sm", children: "Teslimi bloke ediyor" }),
      r && a.status !== 1 && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: d,
          onClick: () => i(a, a.status !== 3),
          children: a.status === 3 ? "Feragati kaldır" : "Feragat et"
        }
      )
    ] })
  ] });
}
function jt({ projectId: a, periodCode: r, onSummaryChange: i, documentTypes: d = [] }) {
  const [o, y] = n.useState(null), [u, g] = n.useState([]), [c, N] = n.useState(!0), [v, j] = n.useState(null), [k, x] = n.useState(!1), b = xe("Platform.Documents.ManageCompliance"), w = n.useRef(0), C = n.useCallback(async () => {
    const f = ++w.current;
    if (!a) {
      y(null), j(null), N(!1);
      return;
    }
    N(!0);
    try {
      const [m, h] = await Promise.all([
        Cs(a, r, { abpHandleError: !1 }),
        Is(a, { abpHandleError: !1 })
      ]);
      if (f !== w.current) return;
      y(m), g(h ?? []), j(null), i == null || i((m == null ? void 0 : m.summary) ?? null);
    } catch (m) {
      if (f !== w.current) return;
      j(m), console.error("[Documents] compliance load", m);
    } finally {
      f === w.current && N(!1);
    }
  }, [a, r, i]);
  n.useEffect(() => {
    C();
  }, [C]);
  const t = async (f) => {
    x(!0);
    try {
      await Rs(a, f, r || null), await C();
    } catch (m) {
      T("error", "Paket uygulanamadı."), console.error("[Documents] applyPackage", m);
    } finally {
      x(!1);
    }
  }, z = async (f) => {
    x(!0);
    try {
      await Ds(f), await C();
    } catch (m) {
      T("error", "Paket kaldırılamadı."), console.error("[Documents] removeAssignment", m);
    } finally {
      x(!1);
    }
  }, E = async (f, m, h) => {
    const $ = h ? window.prompt("Feragat gerekçesi:") : null;
    if (!(h && !$)) {
      x(!0);
      try {
        await Es({
          assignmentId: f.assignmentId,
          requirementId: m.requirementId,
          workStepId: m.workStepId,
          periodCode: m.periodCode,
          waive: h,
          reason: $
        }), await C();
      } catch (L) {
        T("error", "İşlem başarısız oldu."), console.error("[Documents] waive", L);
      } finally {
        x(!1);
      }
    }
  };
  if (!a)
    return /* @__PURE__ */ e.jsx(
      G,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-check" }),
        title: "Önce bir proje bağlamı seçin",
        description: "Uygunluk, projeye uygulanan kurum paketleri üzerinden hesaplanır."
      }
    );
  if (c && !v)
    return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(he, { rows: 6 }) });
  if (v)
    return /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(G, { variant: "error", title: "Uygunluk verisi yüklenemedi", error: v, onRetry: C, retrying: c }) });
  const A = (o == null ? void 0 : o.checklists) ?? [], K = u.filter((f) => !f.isApplied);
  return /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
    A.length === 0 ? /* @__PURE__ */ e.jsx(
      G,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-list" }),
        title: "Bu projeye henüz kurum paketi uygulanmadı",
        description: "Aşağıdan bir paket seçerek kontrol listesini başlatın."
      }
    ) : A.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
        /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsx("div", { style: { fontSize: 13.5, fontWeight: 600 }, children: f.packageName }),
          /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            f.issuer,
            f.periodCode && ` · ${f.periodCode}`
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 15, fontWeight: 500 }, children: [
            "%",
            f.summary.percent
          ] }),
          f.summary.blockingMissingCount > 0 && /* @__PURE__ */ e.jsxs(q, { variant: "negative", size: "sm", children: [
            f.summary.blockingMissingCount,
            " bloke"
          ] }),
          b && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: k,
              onClick: () => z(f.assignmentId),
              children: "Kaldır"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(vt, { percent: f.summary.percent, blocking: f.summary.blockingMissingCount }),
      /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
        f.summary.satisfiedCount,
        " / ",
        f.summary.totalCount - f.summary.waivedCount,
        " kalem tamam",
        f.summary.waivedCount > 0 && ` · ${f.summary.waivedCount} feragat`
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-list", children: f.items.map((m, h) => /* @__PURE__ */ e.jsx(
        kt,
        {
          item: m,
          canManage: b,
          busy: k,
          onWaive: ($, L) => E(f, $, L)
        },
        `${m.requirementId}-${m.workStepId || m.periodCode || h}`
      )) })
    ] }, f.assignmentId)),
    b && /* @__PURE__ */ e.jsx(
      ht,
      {
        packages: u,
        projectId: a,
        documentTypes: d,
        onChanged: C
      }
    ),
    b && K.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Uygulanabilir paketler" }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: K.map((f) => /* @__PURE__ */ e.jsxs(
        D,
        {
          variant: "outline",
          size: "sm",
          disabled: k,
          leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          onClick: () => t(f.id),
          children: [
            f.name,
            " (",
            f.requirementCount,
            ")"
          ]
        },
        f.id
      )) })
    ] })
  ] });
}
const ye = 25, bt = {
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
}, Nt = [
  { value: "", label: "Tümü" },
  { value: "1", label: "Yüklendi" },
  { value: "2", label: "İndirildi" },
  { value: "5", label: "Meta değişti" },
  { value: "3", label: "Silindi" }
];
function St({ projectId: a, documentFileId: r }) {
  const [i, d] = n.useState([]), [o, y] = n.useState(0), [u, g] = n.useState(0), [c, N] = n.useState(""), [v, j] = n.useState(!0), [k, x] = n.useState(null), b = n.useRef(0), w = n.useCallback(async () => {
    const t = ++b.current;
    j(!0);
    try {
      const z = await Ts({
        maxResultCount: ye,
        skipCount: u * ye,
        projectId: a || void 0,
        documentFileId: r || void 0,
        action: c || void 0
      }, { abpHandleError: !1 });
      if (t !== b.current) return;
      d(z.items ?? []), y(z.totalCount ?? 0), x(null);
    } catch (z) {
      if (t !== b.current) return;
      x(z), console.error("[Documents] activity load", z);
    } finally {
      t === b.current && j(!1);
    }
  }, [a, r, c, u]);
  n.useEffect(() => {
    w();
  }, [w]);
  const C = Math.max(1, Math.ceil(o / ye));
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center gap-2 flex-wrap px-3 py-2",
        style: { borderBottom: "1px solid var(--apya-border-subtle)" },
        children: [
          Nt.map((t) => /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: B("apya-doc-filterchip", c === t.value && "is-active"),
              onClick: () => {
                N(t.value), g(0);
              },
              children: t.label
            },
            t.value
          )),
          /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            v || k ? "—" : o,
            " kayıt"
          ] })
        ]
      }
    ),
    v && !k ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(he, { rows: 8 }) }) : k ? /* @__PURE__ */ e.jsx(G, { variant: "error", title: "Etkinlik kaydı yüklenemedi", error: k, onRetry: w, retrying: v }) : i.length === 0 ? /* @__PURE__ */ e.jsx(
      G,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left" }),
        title: "Henüz kayıtlı etkinlik yok",
        description: "Yükleme, indirme, meta değişikliği ve silme işlemleri burada iz bırakır."
      }
    ) : /* @__PURE__ */ e.jsx("div", { children: i.map((t) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", children: [
      /* @__PURE__ */ e.jsx("span", { className: B("apya-chip", bt[t.action] || "apya-chip-neutral"), children: Xs[t.action] || "—" }),
      /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: t.documentFileName || t.folderName || "—" }),
        t.detail && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: t.detail })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12 }, children: t.actorName }),
        t.actorRole && /* @__PURE__ */ e.jsx(q, { variant: "neutral", size: "sm", children: t.actorRole })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: H.dateTime(t.creationTime) })
    ] }, t.id)) }),
    !k && C > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            u * ye + 1,
            "–",
            Math.min((u + 1) * ye, o),
            " / ",
            o
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(D, { variant: "outline", size: "sm", disabled: u === 0, onClick: () => g(u - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              u + 1,
              " / ",
              C
            ] }),
            /* @__PURE__ */ e.jsx(D, { variant: "outline", size: "sm", disabled: u + 1 >= C, onClick: () => g(u + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
const Ia = {
  1: "klasör",
  2: "belge tipi",
  3: "iş adımı",
  4: "dönem",
  5: "harcama kalemi"
};
function wt(a) {
  return a >= 90 ? "positive" : a >= 70 ? "brand" : "warning";
}
function zt({ summary: a, busy: r, onApplyAll: i, onApply: d, onDismiss: o, onReload: y }) {
  const [u, g] = n.useState(!1), c = (a == null ? void 0 : a.items) ?? [];
  if (c.length === 0) return null;
  const N = [...new Set(c.map((v) => Ia[v.kind]).filter(Boolean))];
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-suggestion-banner", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-suggestion-icon", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-wand-magic-sparkles" }) }),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
          a.documentCount,
          " dosya için ",
          N.join(", "),
          " önerisi hazır"
        ] }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Kural motoru ve harcama eşleşmesinden üretildi — uygulanmadan önce onayınızı bekler." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx(D, { variant: "outline", size: "sm", onClick: () => g((v) => !v), children: u ? "Gizle" : "İncele" }),
      /* @__PURE__ */ e.jsx(D, { size: "sm", isLoading: r, onClick: i, children: "Tümünü uygula" })
    ] }),
    u && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-suggestion-list", children: [
      c.map((v) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-doc-suggestion-row",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5, minWidth: 0 }, children: v.documentFileName }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: [
              Ia[v.kind],
              " → ",
              /* @__PURE__ */ e.jsx("strong", { children: v.targetName || v.payload })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: v.reason }),
            /* @__PURE__ */ e.jsxs(q, { variant: wt(v.confidence), size: "sm", children: [
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
                  onClick: () => d(v),
                  children: "Uygula"
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: r,
                  onClick: () => o(v),
                  title: "Bu öneri bir daha gösterilmez",
                  children: "Yoksay"
                }
              )
            ] })
          ]
        },
        `${v.documentFileId}-${v.kind}-${v.payload}`
      )),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: B("apya-doc-linkbtn", "mt-1"), onClick: y, children: "Yenile" })
    ] })
  ] });
}
const Ct = [
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
function It(a, r) {
  const i = (r == null ? void 0 : r.workStepCount) ?? 0, d = Array.from({ length: i }, (o, y) => `${y + 1} · iş adımı`);
  if (a === 1) return d;
  if (a === 2) {
    const o = (/* @__PURE__ */ new Date()).getFullYear();
    return [1, 2, 3, 4].map((y) => `${o} Q${y}`);
  }
  return [...d, "Finans", "Personel / İK", "Sözleşmeler"];
}
function Dt({ state: a, onDone: r }) {
  var C;
  const [i, d] = n.useState(0), [o, y] = n.useState(""), [u, g] = n.useState(((C = a.projects[0]) == null ? void 0 : C.id) ?? ""), [c, N] = n.useState(3), [v, j] = n.useState(!1), k = a.projects.find((t) => t.id === u), x = It(c, k), b = async () => {
    j(!0);
    try {
      await Bs(), r();
    } finally {
      j(!1);
    }
  }, w = async () => {
    j(!0);
    try {
      const t = await $s({
        projectId: u,
        schema: c,
        compliancePackageId: o || null,
        periodCode: null
      });
      T("success", `${t.createdFolderCount} klasör kuruldu.`), r();
    } catch (t) {
      T("error", "Kurulum tamamlanamadı."), console.error("[Documents] setup", t);
    } finally {
      j(!1);
    }
  };
  return /* @__PURE__ */ e.jsx(Ge, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-setup", onClick: (t) => t.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-setup-icon", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-wand-magic-sparkles" }) }),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: "Dokümanlar kurulumu" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Klasör şemasını kurumun beklediği yapıya göre kurun. Sonradan da değiştirebilirsiniz." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: b, disabled: v, children: "Atla" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-setup-steps", children: ["Kurum ve program", "Klasör şeması", "Ekip ve kutu"].map((t, z) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        className: B("apya-doc-setup-step", z === i && "is-active", z < i && "is-done"),
        onClick: () => d(z),
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-doc-setup-step-no", children: z + 1 }),
          t
        ]
      },
      t
    )) }),
    i === 0 && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
      /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: "Zorunlu belge listesi buradan gelir. Şimdi seçmeyip sonra Uygunluk sekmesinden de uygulayabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: B("apya-doc-filterchip", !o && "is-active"),
            onClick: () => y(""),
            children: "Şimdilik yok"
          }
        ),
        a.packages.map((t) => /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: B("apya-doc-filterchip", o === t.id && "is-active"),
            onClick: () => y(t.id),
            children: [
              t.name,
              /* @__PURE__ */ e.jsx(q, { variant: "neutral", size: "sm", children: t.requirementCount })
            ]
          },
          t.id
        ))
      ] })
    ] }),
    i === 1 && /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.projects.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kiracıda proje yok — klasör şeması bir projeye kurulur. Önce bir proje oluşturun." }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: u,
          onChange: (t) => g(t.target.value),
          "aria-label": "Proje",
          children: a.projects.map((t) => /* @__PURE__ */ e.jsxs("option", { value: t.id, children: [
            t.name,
            t.hasFolders ? " — zaten klasörü var" : ""
          ] }, t.id))
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: Ct.map((t) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: B("apya-doc-filterchip", c === t.value && "is-active"),
          onClick: () => N(t.value),
          title: t.detail,
          children: t.label
        },
        t.value
      )) }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-setup-preview", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Kurulacak klasörler" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12 }, children: k == null ? void 0 : k.name }),
        x.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Bu projede iş adımı tanımlı değil; yalnız proje klasörü kurulur." }) : x.map((t) => /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-secondary)", paddingLeft: 12 }, children: t }, t))
      ] })
    ] }) }),
    i === 2 && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", style: { fontSize: 12 }, children: [
      /* @__PURE__ */ e.jsx("div", { style: { color: "var(--apya-text-secondary)" }, children: "Ekip üyeleri ve alan bazlı izinler kimlik yönetiminden, alan izinleri ise Dokümanlar → Yönetim ekranından tanımlanır." }),
      /* @__PURE__ */ e.jsx("div", { style: { color: "var(--apya-text-tertiary)" }, children: "Belge e-posta kutusu (gelen ekleri otomatik klasörleme) henüz kullanıma açık değil; Entegrasyonlar ekranında yer ayrıldı." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end mt-3", children: [
      i > 0 && /* @__PURE__ */ e.jsx(D, { variant: "outline", size: "sm", onClick: () => d(i - 1), children: "Geri" }),
      i < 2 ? /* @__PURE__ */ e.jsx(D, { size: "sm", onClick: () => d(i + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(
        D,
        {
          size: "sm",
          isLoading: v,
          disabled: a.projects.length === 0 || !u,
          onClick: w,
          children: "Şemayı kur"
        }
      )
    ] })
  ] }) }) });
}
const _e = 25, Et = "00000000-0000-0000-0000-000000000000";
function Rt({ message: a, onDone: r }) {
  return n.useEffect(() => {
    const i = setTimeout(r, 2800);
    return () => clearTimeout(i);
  }, [r]), /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-check", style: { fontSize: 11, color: "var(--apya-positive-500)" } }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: a })
  ] });
}
function Tt({ title: a, message: r, onConfirm: i, onCancel: d }) {
  const [o, y] = n.useState(!1);
  return /* @__PURE__ */ e.jsx(Ge, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: d, children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-dialog", onClick: (u) => u.stopPropagation(), children: [
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
      /* @__PURE__ */ e.jsx(D, { variant: "outline", size: "sm", onClick: d, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        D,
        {
          variant: "destructive",
          size: "sm",
          isLoading: o,
          onClick: async () => {
            y(!0), await i(), y(!1);
          },
          children: "Evet, sil"
        }
      )
    ] })
  ] }) }) });
}
function Bt({ uploadedThisMonth: a, expiring: r, compliance: i, hasProject: d, complianceFailed: o }) {
  const y = [
    {
      key: "compliance",
      label: "Uygunluk",
      value: i ? `%${i.percent}` : "—",
      icon: "fa-clipboard-check",
      tone: "positive",
      foot: i ? `${i.satisfiedCount} / ${i.totalCount - i.waivedCount} kalem tamam` : d ? o ? "Yüklenemedi" : null : "Proje bağlamı seçin"
    },
    {
      key: "missing",
      label: "Eksik belge",
      value: i ? i.missingCount : "—",
      icon: "fa-triangle-exclamation",
      tone: "warning",
      foot: i && i.blockingMissingCount > 0 ? `${i.blockingMissingCount} tanesi teslimi bloke ediyor` : null
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
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-kpis", children: y.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("span", { className: B("apya-doc-kpi-icon", `is-${u.tone}`), children: /* @__PURE__ */ e.jsx("i", { className: `fa ${u.icon}` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: u.label })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: u.value }),
    u.foot && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: u.foot })
  ] }, u.key)) });
}
function $t() {
  var va;
  const [a, r] = n.useState([]), [i, d] = n.useState([]), [o, y] = n.useState([]), [u, g] = n.useState(!0), [c, N] = n.useState(null), [v, j] = n.useState([]), [k, x] = n.useState(0), [b, w] = n.useState(null), [C, t] = n.useState(null), [z, E] = n.useState(!0), [A, K] = n.useState(null), f = n.useMemo(() => new URLSearchParams(window.location.search), []), [m, h] = n.useState(() => {
    const s = f.get("smart");
    if (s) return { key: s, kind: "smart", smart: s };
    const l = f.get("folder");
    if (l) return { key: `folder-${l}`, kind: "folder", documentId: l };
    const p = f.get("step");
    if (p) return { key: `step-${p}`, kind: "workstep", workStepId: p };
    const S = f.get("projectId");
    return S ? { key: `project-${S}`, kind: "project", projectId: S } : { key: "all", kind: "all" };
  }), $ = n.useRef(m), [L, I] = n.useState(() => m.kind === "project"), P = m.kind === "folder" ? m.documentId : null, V = m.projectId || null, $a = m.kind === "smart" && m.smart === "trash", [Pa, Qe] = n.useState(/* @__PURE__ */ new Set()), [ue, Fa] = n.useState(f.get("q") || ""), [ne, Aa] = n.useState(f.get("sort") || "creationTime desc"), [le, Ze] = n.useState(f.get("view") === "grid" ? "grid" : "list"), [ie, ge] = n.useState(Number(f.get("page")) || 0), [_, La] = n.useState(ue);
  n.useEffect(() => {
    if (ue === _) return;
    const s = setTimeout(() => {
      La(ue), ge(0);
    }, 300);
    return () => clearTimeout(s);
  }, [ue, _]);
  const [U, Je] = n.useState(() => {
    const s = f.get("tab");
    return ["files", "compliance", "activity"].includes(s) ? s : "files";
  }), [Xe, we] = n.useState(null), [Ma, ve] = n.useState(null), [Ka, ea] = n.useState(!1), [Wa, aa] = n.useState(!1), [Q, ae] = n.useState(/* @__PURE__ */ new Set()), [qa, Oa] = n.useState(null), ze = n.useRef([]), [me, Ce] = n.useState(null), [sa, ta] = n.useState(null), [Ie, na] = n.useState(!1), De = n.useRef(null), Ee = n.useRef(null), [re, Re] = n.useState(null), [Z, la] = n.useState(null), [Ua, ia] = n.useState(!1), [ra, oa] = n.useState(null), [Ya, ca] = n.useState(!1), Te = n.useRef(null), se = xe("Platform.Documents.Create"), da = xe("Platform.Documents.ManageMeta"), Ha = xe("Platform.Documents.BulkOperations"), _a = xe("Platform.Documents.Delete"), Y = n.useCallback((s) => ta(s), []), ke = n.useRef(0), J = n.useCallback(async () => {
    const s = ++ke.current;
    g(!0);
    try {
      const [l, p, S] = await Promise.all([
        Ps().getList({ maxResultCount: 1e3, sorting: "title asc" }, { abpHandleError: !1 }),
        Fs(null, { abpHandleError: !1 }).catch(() => []),
        As({ abpHandleError: !1 }).catch(() => [])
      ]);
      if (s !== ke.current) return;
      r(l.items ?? []), d(p ?? []), y(S ?? []), N(null);
    } catch (l) {
      if (s !== ke.current) return;
      N(l), console.error("[Documents] loadTree", l);
    } finally {
      s === ke.current && g(!1);
    }
  }, []);
  n.useEffect(() => {
    J();
  }, [J]);
  const Be = n.useMemo(() => {
    const s = { maxResultCount: _e, skipCount: ie * _e, sorting: ne };
    return _.trim() && (s.filterText = _.trim()), m.kind === "folder" ? (s.documentId = m.documentId, s.includeSubFolders = !0) : m.kind === "workstep" ? s.workStepId = m.workStepId : m.kind === "project" ? s.projectId = m.projectId : m.kind === "smart" && m.smart === "expiring" ? s.expiringWithinDays = 30 : m.kind === "smart" && m.smart === "missing-meta" ? s.missingRequiredFields = !0 : m.kind === "smart" && m.smart === "trash" ? s.onlyDeleted = !0 : m.kind === "smart" && m.smart === "suggested" && (s.documentFileIds = [...new Set(((Z == null ? void 0 : Z.items) ?? []).map((l) => l.documentFileId))], s.documentFileIds.length === 0 && (s.documentFileIds = [Et])), s;
  }, [m, ie, ne, _, Z]), ua = n.useRef(Be);
  ua.current = Be;
  const je = n.useRef(0), W = n.useCallback(async () => {
    const s = ++je.current;
    E(!0);
    try {
      const l = await Ue(ua.current, { abpHandleError: !1 });
      if (s !== je.current) return;
      j(l.items ?? []), x(l.totalCount ?? 0), K(null);
    } catch (l) {
      if (s !== je.current) return;
      K(l), console.error("[Documents] loadFiles", l);
    } finally {
      s === je.current && E(!1);
    }
  }, []), Ga = JSON.stringify(Be);
  n.useEffect(() => {
    L || W();
  }, [Ga, L, W]);
  const $e = n.useRef(0), oe = n.useCallback(async () => {
    const s = ++$e.current;
    try {
      const l = /* @__PURE__ */ new Date(), p = new Date(l.getFullYear(), l.getMonth(), 1).toISOString(), [S, R] = await Promise.all([
        Ue({ maxResultCount: 1, skipCount: 0, expiringWithinDays: 30 }, { abpHandleError: !1 }),
        Ue({ maxResultCount: 1, skipCount: 0, uploadedAfter: p }, { abpHandleError: !1 })
      ]);
      if (s !== $e.current) return;
      w(S.totalCount ?? 0), t(R.totalCount ?? 0);
    } catch (l) {
      if (s !== $e.current) return;
      w(null), t(null), console.error("[Documents] loadKpis", l);
    }
  }, []);
  n.useEffect(() => {
    oe();
  }, [oe]);
  const te = Ls(V), Va = n.useMemo(() => {
    var l;
    const s = (((l = te.overview) == null ? void 0 : l.checklists) ?? []).flatMap((p) => (p.items ?? []).filter((S) => S.status === 2).map((S) => ({ ...S, assignmentId: p.assignmentId })));
    return m.kind === "workstep" ? s.filter((p) => p.workStepId === m.workStepId) : s;
  }, [te.overview, m.kind, m.workStepId]), Pe = n.useRef(te);
  Pe.current = te;
  const Qa = n.useCallback((s) => {
    var p;
    const l = Pe.current;
    !s || l.loading || Ms(s, (p = l.overview) == null ? void 0 : p.summary) || l.reload();
  }, []), ma = n.useRef(V);
  ma.current = V;
  const be = n.useRef(0), pe = n.useCallback(async () => {
    const s = ++be.current;
    ia(!0);
    try {
      const l = await Ks(ma.current, { abpHandleError: !1 });
      if (s !== be.current) return;
      la(l), oa(null);
    } catch (l) {
      if (s !== be.current) return;
      la(null), oa(l), console.error("[Documents] loadSuggestions", l);
    } finally {
      s === be.current && ia(!1);
    }
  }, []);
  n.useEffect(() => {
    pe();
  }, [V, pe]), n.useEffect(() => {
    se && (async () => {
      try {
        Re(await Ws({ abpHandleError: !1 }));
      } catch (s) {
        console.error("[Documents] setupState", s);
      }
    })();
  }, [se]);
  const Fe = (s) => ({
    documentFileId: s.documentFileId,
    kind: s.kind,
    payload: s.payload
  }), Ae = async (s, l, p) => {
    ca(!0);
    try {
      await s(l), Y(p), await Promise.all([pe(), W(), J()]);
    } catch (S) {
      ee(S) || T("error", "Öneri işlenemedi."), console.error("[Documents] suggestion action", S);
    } finally {
      ca(!1);
    }
  }, Ne = n.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    i.forEach((S) => {
      s.has(S.projectId) || s.set(S.projectId, []), s.get(S.projectId).push(S);
    });
    const l = /* @__PURE__ */ new Map();
    a.forEach((S) => {
      const R = S.parentDocumentId || "root";
      l.has(R) || l.set(R, []), l.get(R).push(S);
    });
    const p = (S) => (l.get(S) || []).sort((R, X) => (R.sortOrder ?? 0) - (X.sortOrder ?? 0) || R.title.localeCompare(X.title, "tr")).map((R) => {
      const X = p(R.id), F = (R.projectId ? s.get(R.projectId) || [] : []).slice().sort((M, ps) => M.order - ps.order).map((M) => ({
        key: `step-${M.id}`,
        kind: "workstep",
        workStepId: M.id,
        projectId: M.projectId,
        label: `${M.order} · ${M.name}`,
        icon: "fa-diagram-next",
        count: M.documentCount,
        children: []
      }));
      return {
        key: `folder-${R.id}`,
        kind: "folder",
        documentId: R.id,
        projectId: R.projectId,
        label: R.title,
        icon: R.projectId ? "fa-diagram-project" : "fa-folder",
        children: [...F, ...X]
      };
    });
    return p("root");
  }, [a, i]), Le = n.useRef(!1);
  n.useEffect(() => {
    if (Le.current || u) return;
    Le.current = !0;
    const s = f.get("folder"), l = f.get("step"), p = f.get("projectId");
    if (!s && !l && !p) return;
    const S = (F) => F.flatMap((M) => [M, ...S(M.children || [])]), R = (F, M) => String(F ?? "").toLowerCase() === String(M ?? "").toLowerCase(), X = S(Ne), Se = s ? X.find((F) => F.documentId === s) : l ? X.find((F) => F.workStepId === l) : X.find((F) => F.kind === "folder" && R(F.projectId, p));
    Se ? (h((F) => F === $.current ? Se : F), Qe((F) => /* @__PURE__ */ new Set([...F, Se.key]))) : Ne.length > 0 && (s || l) && h((F) => F === $.current ? { key: "all", kind: "all" } : F), I(!1);
  }, [u, Ne, f]), n.useEffect(() => {
    const s = new URLSearchParams();
    U !== "files" && s.set("tab", U), m.kind === "folder" ? s.set("folder", m.documentId) : m.kind === "workstep" ? s.set("step", m.workStepId) : m.kind === "project" ? s.set("projectId", m.projectId) : m.kind === "smart" && s.set("smart", m.smart), _.trim() && s.set("q", _.trim()), le !== "list" && s.set("view", le), ne !== "creationTime desc" && s.set("sort", ne), ie > 0 && s.set("page", String(ie));
    const l = s.toString();
    window.history.replaceState(null, "", l ? `${window.location.pathname}?${l}` : window.location.pathname);
  }, [U, m, _, le, ne, ie]);
  const ce = n.useRef(0), Za = n.useCallback(async (s) => {
    const l = ++ce.current;
    we(s.id), ea(!0);
    try {
      const p = await ja(s.id);
      l === ce.current && ve(p);
    } catch (p) {
      if (l !== ce.current) return;
      we(null), ve(null), T("error", "Belge detayı açılamadı."), console.error("[Documents] openDetail", p);
    } finally {
      l === ce.current && ea(!1);
    }
  }, []), Ja = async (s) => {
    const l = ce.current;
    aa(!0);
    try {
      await Qs(s.id, {
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
        fields: s.fields.map((S) => ({
          fieldId: S.fieldId,
          valueText: S.valueText ?? null,
          valueNumber: S.valueNumber ?? null,
          valueDate: S.valueDate ?? null
        })),
        tags: s.tags || []
      }), Y("Belge güncellendi.");
      const p = await ja(s.id);
      l === ce.current && ve(p), await W();
    } catch (p) {
      ee(p) || T("error", "Belge güncellenemedi."), console.error("[Documents] handleSave", p);
    } finally {
      aa(!1);
    }
  }, Xa = async () => {
    if (me)
      try {
        await Zs(me.id), Xe === me.id && (we(null), ve(null)), Y("Belge silindi."), await Promise.all([W(), oe()]);
      } catch (s) {
        ee(s) || T("error", "Belge silinemedi."), console.error("[Documents] handleDelete", s);
      } finally {
        Ce(null);
      }
  }, es = (s) => {
    ze.current = Q.has(s.id) ? Array.from(Q) : [s.id];
  }, as = async (s) => {
    const l = ze.current;
    if (l.length)
      try {
        l.length === 1 ? await _s(l[0], s) : await Na(l, s), Y(l.length === 1 ? "Belge taşındı." : `${l.length} belge taşındı.`), ae(/* @__PURE__ */ new Set()), await W();
      } catch (p) {
        ee(p) || T("error", "Taşıma başarısız oldu."), console.error("[Documents] move", p);
      } finally {
        ze.current = [];
      }
  }, ss = async () => {
    const s = window.prompt("Hedef klasör adını yazın:");
    if (!s) return;
    const l = a.find((p) => p.title.toLocaleLowerCase("tr") === s.toLocaleLowerCase("tr"));
    if (!l) {
      T("warn", "Klasör bulunamadı.");
      return;
    }
    try {
      await Na(Array.from(Q), l.id), Y(`${Q.size} belge taşındı.`), ae(/* @__PURE__ */ new Set()), await W();
    } catch (p) {
      ee(p) || T("error", "Toplu taşıma başarısız oldu."), console.error("[Documents] bulkMove", p);
    }
  }, ts = async () => {
    const s = window.prompt("Etiket(ler) — virgülle ayırın:");
    if (!s) return;
    const l = s.split(",").map((p) => p.trim()).filter(Boolean);
    if (l.length)
      try {
        await Vs(Array.from(Q), l), Y(`${Q.size} belge etiketlendi.`), ae(/* @__PURE__ */ new Set()), await W();
      } catch (p) {
        ee(p) || T("error", "Etiketleme başarısız oldu."), console.error("[Documents] bulkTag", p);
      }
  }, Me = async (s) => {
    if (!P || !(s != null && s.length)) return;
    const l = Te.current;
    Te.current = null, na(!0);
    try {
      let p = null;
      for (const S of Array.from(s)) {
        const R = await Ys(P, S);
        p = p ?? (R == null ? void 0 : R.documentFileId) ?? null;
      }
      l && p ? (await Hs({
        assignmentId: l.assignmentId,
        requirementId: l.requirementId,
        workStepId: l.workStepId || null,
        periodCode: l.periodCode || null,
        documentFileId: p
      }), Y(`Yüklendi ve "${l.title}" kalemine bağlandı.`)) : Y(s.length === 1 ? "Dosya yüklendi." : `${s.length} dosya yüklendi.`), await Promise.all([W(), oe(), J(), Pe.current.reload()]);
    } catch (p) {
      ee(p) || T("error", "Dosya yüklenemedi."), console.error("[Documents] upload", p);
    } finally {
      na(!1);
    }
  }, ns = async (s) => {
    try {
      await Gs(s.id), Y(`"${s.displayName}" geri alındı.`), await Promise.all([W(), oe(), J()]);
    } catch (l) {
      ee(l) || T("error", "Belge geri alınamadı."), console.error("[Documents] restore", l);
    }
  }, ls = (s) => {
    var l;
    if (!P) {
      T("warn", "Yükleme klasör bağlamında yapılır — soldan bir klasör seçin.");
      return;
    }
    Te.current = s, (l = De.current) == null || l.click();
  }, Ke = () => {
    const s = new window.abp.ModalManager(fe() + "Documents/CreateModal");
    s.open({ parentDocumentId: P || void 0 }), s.onResult(() => {
      J(), Y("Klasör oluşturuldu.");
    });
  }, is = () => {
    Le.current = !1, J();
  }, pa = (s) => Qe((l) => {
    const p = new Set(l);
    return p.has(s) ? p.delete(s) : p.add(s), p;
  }), rs = (s) => {
    var l;
    I(!1), h(s), ge(0), ae(/* @__PURE__ */ new Set()), (l = s.key) != null && l.startsWith("folder-") && pa(s.key);
  }, os = (s) => ae((l) => {
    const p = new Set(l);
    return p.has(s) ? p.delete(s) : p.add(s), p;
  }), cs = () => ae((s) => v.every((l) => s.has(l.id)) ? /* @__PURE__ */ new Set() : new Set(v.map((l) => l.id))), ds = (s, l) => {
    s !== "docs" && s !== "compliance" || (l.preventDefault(), Je(s === "docs" ? "files" : "compliance"));
  }, ya = () => {
    var s;
    return (s = De.current) == null ? void 0 : s.click();
  }, xa = !u && !c && a.length === 0;
  let We = null;
  se && !_.trim() && m.kind !== "smart" && (xa ? We = re ? /* @__PURE__ */ e.jsx(
    Ye,
    {
      primary: /* @__PURE__ */ e.jsx(D, { onClick: () => Re({ ...re, setupCompleted: !1 }), children: "Şemayı kur" }),
      link: { label: "veya boş klasörle başla", onClick: Ke }
    }
  ) : /* @__PURE__ */ e.jsx(Ye, { primary: /* @__PURE__ */ e.jsx(D, { onClick: Ke, children: "Yeni klasör" }) }) : P && (We = /* @__PURE__ */ e.jsx(
    Ye,
    {
      primary: /* @__PURE__ */ e.jsx(D, { leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }), onClick: ya, children: "Yükle" }),
      link: { label: "veya toplu yükleme ekranını aç", href: `${fe()}Documents/Upload?documentId=${P}` }
    }
  )));
  const us = xa ? "Klasör şemasını kurumun beklediği yapıya göre kurun; zorunlu belgeler ve meta alanları birlikte gelir." : P ? 'Dosyaları buraya sürükleyin ya da "Yükle" ile ekleyin.' : "Sol taraftan bir klasör seçin; yükleme klasör bağlamında yapılır.", fa = m.kind === "smart" && m.smart === "suggested", ha = fa && !!ra, qe = z || fa && Ua, Oe = ha ? ra : A, ga = fs(!qe && !Oe), ms = ga.retry(() => {
    oe(), ha ? pe() : W();
  });
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto",
      style: { maxWidth: 1560 },
      onDragOver: (s) => {
        P && s.preventDefault();
      },
      onDrop: (s) => {
        var l;
        !P || !((l = s.dataTransfer.files) != null && l.length) || (s.preventDefault(), Me(s.dataTransfer.files));
      },
      children: [
        /* @__PURE__ */ e.jsx(
          qs,
          {
            title: "Dokümanlar",
            description: "Klasörler, belgeler ve meta veri",
            primary: se && /* @__PURE__ */ e.jsx(
              D,
              {
                variant: "primary",
                isLoading: Ie,
                disabled: !P,
                title: P ? void 0 : "Önce bir klasör seçin",
                leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
                onClick: ya,
                children: "Yükle"
              }
            ),
            menuItems: se ? [
              { key: "folder", label: "Yeni klasör", icon: "fa-folder-plus", onSelect: Ke },
              {
                key: "bulk",
                label: "Toplu yükleme",
                icon: "fa-layer-group",
                href: `${fe()}Documents/Upload${P ? `?documentId=${P}` : ""}`
              },
              {
                key: "capture",
                label: "Belge yakala",
                icon: "fa-camera",
                // Telefonda sağ alttaki sabit düğme bu işi görüyor; menüde tekrar etmesin.
                className: "is-desktop-only",
                disabled: !P || Ie,
                hint: P ? null : "Önce bir klasör seçin",
                onSelect: () => {
                  var s;
                  return (s = Ee.current) == null ? void 0 : s.click();
                }
              }
            ] : []
          }
        ),
        /* @__PURE__ */ e.jsx(
          Os,
          {
            active: U === "compliance" ? "compliance" : "docs",
            projectId: V,
            compliance: te,
            onSelect: ds
          }
        ),
        se && /* @__PURE__ */ e.jsx(Ge, { children: /* @__PURE__ */ e.jsx(
          D,
          {
            variant: "secondary",
            className: "apya-doc-capture-btn",
            isLoading: Ie,
            disabled: !P,
            title: P ? void 0 : "Önce bir klasör seçin",
            leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-camera" }),
            onClick: () => {
              var s;
              return (s = Ee.current) == null ? void 0 : s.click();
            },
            children: "Belge yakala"
          }
        ) }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: De,
            type: "file",
            multiple: !0,
            hidden: !0,
            onChange: (s) => {
              Me(s.target.files), s.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: Ee,
            type: "file",
            accept: "image/*",
            capture: "environment",
            hidden: !0,
            onChange: (s) => {
              Me(s.target.files), s.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ e.jsx(
          Bt,
          {
            uploadedThisMonth: C,
            expiring: b,
            compliance: ((va = te.overview) == null ? void 0 : va.summary) ?? null,
            hasProject: !!V,
            complianceFailed: te.failed
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
            "aria-selected": U === s.key,
            className: B("apya-doc-tab", U === s.key && "is-active"),
            onClick: () => Je(s.key),
            children: s.label
          },
          s.key
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: B("apya-docs-shell", U !== "files" && "is-wide"), children: [
          /* @__PURE__ */ e.jsx(
            st,
            {
              loading: u,
              error: c,
              onRetry: is,
              tree: Ne,
              activeKey: m.key,
              expanded: Pa,
              onToggle: pa,
              onSelect: rs,
              onDropFiles: as,
              dragTarget: qa,
              setDragTarget: Oa
            }
          ),
          U === "compliance" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(
            jt,
            {
              projectId: V,
              periodCode: null,
              onSummaryChange: Qa,
              documentTypes: o
            }
          ) }) : U === "activity" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(St, { projectId: V, documentFileId: null }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            da && /* @__PURE__ */ e.jsx(
              zt,
              {
                summary: Z,
                busy: Ya,
                onApplyAll: () => Ae(
                  ba,
                  ((Z == null ? void 0 : Z.items) ?? []).map(Fe),
                  "Öneriler uygulandı."
                ),
                onApply: (s) => Ae(
                  ba,
                  [Fe(s)],
                  "Öneri uygulandı."
                ),
                onDismiss: (s) => Ae(
                  Us,
                  [Fe(s)],
                  "Öneri yoksayıldı."
                ),
                onReload: pe
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
                  value: ue,
                  onChange: (s) => Fa(s.target.value)
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-grid-count apya-numeric", children: [
                qe || Oe ? "—" : k,
                " belge"
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-viewtoggle", children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: B(le === "list" && "is-active"),
                    onClick: () => Ze("list"),
                    "aria-label": "Liste görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: B(le === "grid" && "is-active"),
                    onClick: () => Ze("grid"),
                    "aria-label": "Kart görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-border-all" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("div", { ref: ga.contentRef, tabIndex: -1, children: /* @__PURE__ */ e.jsx(
              ot,
              {
                loading: qe,
                loadError: Oe,
                onRetry: ms,
                files: v,
                totalCount: k,
                view: le,
                sorting: ne,
                onSort: (s) => {
                  Aa(s), ge(0);
                },
                selectedId: Xe,
                onSelect: Za,
                checkedIds: Q,
                onToggleCheck: os,
                onToggleAll: cs,
                page: ie,
                pageSize: _e,
                onPageChange: ge,
                onDragStart: es,
                emptyHint: us,
                emptyAction: We,
                missingItems: Va,
                onUploadMissing: ls,
                canUpload: se,
                isTrash: $a,
                onRestore: ns
              }
            ) }),
            Ha && /* @__PURE__ */ e.jsx(
              ct,
              {
                count: Q.size,
                onClear: () => ae(/* @__PURE__ */ new Set()),
                onMove: ss,
                onTag: ts
              }
            )
          ] }),
          U === "files" && /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx(
            pt,
            {
              detail: Ma,
              loading: Ka,
              canEdit: da,
              documentTypes: o,
              saving: Wa,
              onSave: Ja,
              onDelete: _a ? Ce : () => {
              }
            }
          ) })
        ] }),
        me && /* @__PURE__ */ e.jsx(
          Tt,
          {
            title: "Belge silinecek",
            message: `"${me.displayName}" ve tüm versiyonları çöp kutusuna taşınacak. Sol alttaki "Çöp kutusu"ndan geri alabilirsiniz.`,
            onConfirm: Xa,
            onCancel: () => Ce(null)
          }
        ),
        re && !re.setupCompleted && /* @__PURE__ */ e.jsx(
          Dt,
          {
            state: re,
            onDone: async () => {
              Re({ ...re, setupCompleted: !0 }), await Promise.all([J(), W()]);
            }
          }
        ),
        sa && /* @__PURE__ */ e.jsx(Rt, { message: sa, onDone: () => ta(null) })
      ]
    }
  );
}
const Da = document.getElementById("documents-island");
Da && hs(Da, "documents", /* @__PURE__ */ e.jsx($t, {}));
