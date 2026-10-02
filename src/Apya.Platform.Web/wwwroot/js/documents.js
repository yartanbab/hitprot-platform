import { r as t, j as e } from "./react-vendor-D7YDiBbi.js";
import { E as V, t as ze, R as Ns, u as Ss, w as ae, m as ws } from "./index-DgpuJ91w.js";
import { S as Ca, B as E, e as q, g as Cs, I as Y } from "./Dialog-BdrRxZcw.js";
import { u as zs, U as Is } from "./useDirtyGuard-BU_DDlEJ.js";
import { M as Ze } from "./ModalPortal-CVz5ohco.js";
import { a as he, g as Ds, b as Es, c as B, d as Rs, e as Ts, u as Bs, f as Fs, h as Ps, i as $s, j as fe, k as Ls, l as As, r as Ms, w as Ks, m as Ws, n as qs, o as Us, p as Os, q as Ys, s as Hs, t as _s, v as Ge, x as Gs, y as Vs, z as Js, A as Qs, B as za, E as Ve, D as Zs, P as Xs, C as et, F as Ia, G as at, H as st, I as tt, J as Da, K as nt, L as lt, M as it, N as rt } from "./ProcessRibbon-D9pM1s89.js";
import { S as ge } from "./SkeletonShape-Ds5M097Q.js";
import { d as La } from "./draggableActivation-Ybw9Upbh.js";
import { H as Je } from "./Hint-BhMztyJX.js";
const F = (...a) => a.filter(Boolean).join(" "), _ = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  money: (a, r) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + (r ? " " + ot(r) : ""),
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
};
function ot(a) {
  return { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }[a] || a;
}
const ue = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Kesin", chip: "apya-chip-positive" },
  3: { text: "Eşleşti", chip: "apya-chip-accent" },
  4: { text: "Süre dolan", chip: "apya-chip-negative" }
}, Ea = {
  1: { text: "Manuel", variant: "neutral" },
  2: { text: "OCR", variant: "brand" },
  3: { text: "AI", variant: "accent" },
  4: { text: "Kural", variant: "warning" }
}, ct = {
  1: "Yüklendi",
  2: "İndirildi",
  3: "Silindi",
  4: "Görüntülendi",
  5: "Meta değişti",
  6: "Taşındı"
};
function Xe(a, r) {
  var u;
  const n = ((u = (r || "").split(".").pop()) == null ? void 0 : u.toLowerCase()) || "";
  return a != null && a.includes("pdf") || n === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444", label: "PDF" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(n) ? { icon: "fa-file-excel", color: "#10B981", label: "XLS" } : a != null && a.includes("word") || ["docx", "doc"].includes(n) ? { icon: "fa-file-word", color: "#3B82F6", label: "DOC" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(n) ? { icon: "fa-file-powerpoint", color: "#F59E0B", label: "PPT" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(n) ? { icon: "fa-file-image", color: "#8B5CF6", label: "IMG" } : ["zip", "rar", "7z"].includes(n) ? { icon: "fa-file-zipper", color: "#6B7280", label: "ZIP" } : { icon: "fa-file", color: "#6B7280", label: "DOSYA" };
}
function dt(a) {
  const r = ["apya-chip-accent", "apya-chip-brand", "apya-chip-positive", "apya-chip-warning", "apya-chip-neutral"];
  let n = 0;
  for (let u = 0; u < a.length; u++) n = n * 31 + a.charCodeAt(u) >>> 0;
  return r[n % r.length];
}
const ut = [
  { key: "expiring", label: "Süresi dolanlar", icon: "fa-clock-rotate-left" },
  { key: "missing-meta", label: "Eksik meta", icon: "fa-triangle-exclamation" },
  { key: "suggested", label: "Öneri bekleyen", icon: "fa-wand-magic-sparkles" },
  { key: "trash", label: "Çöp kutusu", icon: "fa-trash-can" }
];
function Aa({
  node: a,
  depth: r,
  activeKey: n,
  expanded: u,
  onToggle: o,
  onSelect: y,
  onDropFiles: p,
  dragTarget: N,
  setDragTarget: i
}) {
  var k;
  const S = ((k = a.children) == null ? void 0 : k.length) > 0, v = u.has(a.key), j = N === a.documentId && a.documentId;
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => y(a),
        onDragOver: (g) => {
          a.documentId && (g.preventDefault(), i(a.documentId));
        },
        onDragLeave: () => i(null),
        onDrop: (g) => {
          a.documentId && (g.preventDefault(), i(null), p(a.documentId));
        },
        className: F("apya-md-item", n === a.key && "selected"),
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
              onClick: (g) => {
                g.stopPropagation(), S && o(a.key);
              },
              className: "w-3 flex-shrink-0",
              style: { color: "var(--apya-text-tertiary)" },
              children: S && /* @__PURE__ */ e.jsx("i", { className: `fa fa-chevron-${v ? "down" : "right"}`, style: { fontSize: 9 } })
            }
          ),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${a.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: a.label }),
          typeof a.count == "number" && /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: a.count })
        ]
      }
    ),
    S && v && a.children.map((g) => /* @__PURE__ */ e.jsx(
      Aa,
      {
        node: g,
        depth: r + 1,
        activeKey: n,
        expanded: u,
        onToggle: o,
        onSelect: y,
        onDropFiles: p,
        dragTarget: N,
        setDragTarget: i
      },
      g.key
    ))
  ] });
}
function mt({
  loading: a,
  error: r = null,
  onRetry: n,
  tree: u,
  activeKey: o,
  expanded: y,
  onToggle: p,
  onSelect: N,
  onDropFiles: i,
  dragTarget: S,
  setDragTarget: v
}) {
  const j = t.useId(), k = a && !!r;
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Bağlam" }),
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => N({ key: "all", kind: "all" }),
        className: F("apya-md-item", o === "all" && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-tree", style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", style: { fontWeight: 600 }, children: "Tüm Dokümanlar" })
        ]
      }
    ),
    a && !r ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(ge, { rows: 5 }) }) : r && u.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(V, { compact: !0, variant: "error", title: "Klasörler yüklenemedi", error: r, onRetry: n, retrying: k }) }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      r && /* @__PURE__ */ e.jsxs(
        "div",
        {
          role: "alert",
          className: "mx-1 mb-2 flex flex-wrap items-center gap-2 rounded-card border border-negative-100 bg-negative-50 px-3 py-2 text-[12.5px] text-negative-700",
          children: [
            /* @__PURE__ */ e.jsx("span", { id: j, className: "min-w-0 flex-1", children: ze("Documents:Tree:RefreshFailed", "Klasörler yenilenemedi.") }),
            /* @__PURE__ */ e.jsx(Ns, { onRetry: n, retrying: k, "aria-describedby": j })
          ]
        }
      ),
      u.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör yok." }) : u.map((g) => /* @__PURE__ */ e.jsx(
        Aa,
        {
          node: g,
          depth: 0,
          activeKey: o,
          expanded: y,
          onToggle: p,
          onSelect: N,
          onDropFiles: i,
          dragTarget: S,
          setDragTarget: v
        },
        g.key
      ))
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Akıllı klasörler" }),
    ut.map((g) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => N({ key: g.key, kind: "smart", smart: g.key }),
        className: F("apya-md-item", o === g.key && "selected"),
        style: { borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-3 flex-shrink-0" }),
          /* @__PURE__ */ e.jsx("i", { className: `fa ${g.icon}`, style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: g.label })
        ]
      },
      g.key
    ))
  ] });
}
const pt = [
  { key: "displayName", label: "Belge", sortable: !0 },
  { key: "workStep", label: "İş adımı", sortable: !1, className: "apya-doc-col-step" },
  { key: "type", label: "Tür", sortable: !1, className: "apya-doc-col-type" },
  { key: "amount", label: "Tutar", sortable: !0, align: "right" },
  { key: "documentDate", label: "Tarih", sortable: !0 },
  { key: "status", label: "Durum", sortable: !1 }
];
function yt({ column: a, sorting: r, onSort: n }) {
  if (!a.sortable)
    return /* @__PURE__ */ e.jsx("span", { className: a.className, style: { textAlign: a.align || "left" }, children: a.label });
  const [u, o] = (r || "").split(" "), y = u === a.key, p = y && o !== "desc" ? "desc" : "asc";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => n(`${a.key} ${p}`),
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
function xt({ item: a, onUpload: r, canUpload: n }) {
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
      a.isBlocking && /* @__PURE__ */ e.jsx(q, { variant: "warning", size: "sm", children: "teslimi bloke ediyor" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-step", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: u }),
    /* @__PURE__ */ e.jsx("span", { className: "text-truncate apya-doc-col-type", style: { fontSize: 12, color: "var(--apya-warning-700, #92400E)" }, children: a.documentTypeName || "—" }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right", color: "var(--apya-text-tertiary)" }, children: "—" }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-warning-700, #92400E)" }, children: "bekliyor" }),
    /* @__PURE__ */ e.jsx("span", { children: n ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-missing-upload", onClick: () => r(a), children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
      " Yükle"
    ] }) : /* @__PURE__ */ e.jsx("span", { className: "apya-chip apya-chip-warning", children: "Eksik" }) })
  ] });
}
function ft({ file: a, selected: r, checked: n, onSelect: u, onToggleCheck: o, onDragStart: y, isTrash: p, onRestore: N }) {
  const i = Xe(a.contentType, a.fileName), S = ue[a.status] || ue[1], v = La(() => u(a));
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !p,
      onDragStart: p ? void 0 : () => y(a),
      onPointerDown: p ? void 0 : v.onPointerDown,
      onClick: p ? void 0 : v.onClick,
      className: F("apya-doc-row", r && "is-selected", p && "is-trashed"),
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            onClick: p ? void 0 : (j) => {
              j.stopPropagation(), o(a.id);
            },
            onPointerDown: p ? void 0 : (j) => j.stopPropagation(),
            style: { cursor: p ? "default" : "pointer" },
            children: p ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash-can", style: { fontSize: 12, color: "var(--apya-text-tertiary)" } }) : /* @__PURE__ */ e.jsx(
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
              style: { width: 26, height: 26, borderRadius: 7, background: `${i.color}1a`, color: i.color, fontSize: 11 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${i.icon}` })
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
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, textAlign: "right" }, children: _.money(a.amount, a.currency) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: _.date(a.documentDate || a.creationTime) }),
        /* @__PURE__ */ e.jsx("span", { children: p ? /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => N(a), children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-rotate-left" }),
          " Geri al"
        ] }) : /* @__PURE__ */ e.jsx("span", { className: F("apya-chip", S.chip), children: S.text }) })
      ]
    }
  );
}
function ht({ file: a, selected: r, onSelect: n, onDragStart: u }) {
  const o = Xe(a.contentType, a.fileName), y = ue[a.status] || ue[1];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: !0,
      onDragStart: () => u(a),
      ...La(() => n(a)),
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
          /* @__PURE__ */ e.jsx("span", { className: F("apya-chip", y.chip), children: y.text }),
          a.amount !== null && a.amount !== void 0 && /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: _.money(a.amount, a.currency) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", children: a.uploaderName || "Sistem" }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", children: _.date(a.documentDate || a.creationTime) })
        ] })
      ]
    }
  );
}
function gt({
  loading: a,
  loadError: r = null,
  onRetry: n,
  files: u,
  totalCount: o,
  view: y,
  sorting: p,
  onSort: N,
  selectedId: i,
  onSelect: S,
  checkedIds: v,
  onToggleCheck: j,
  onToggleAll: k,
  page: g,
  pageSize: b,
  onPageChange: C,
  onDragStart: z,
  emptyHint: d,
  emptyAction: R = null,
  missingItems: M = [],
  onUploadMissing: f,
  canUpload: L = !1,
  isTrash: m = !1,
  onRestore: c
}) {
  const h = u.length > 0 && u.every((D) => v.has(D.id)), T = Math.max(1, Math.ceil(o / b)), A = g === 0 && y === "list" ? M : [];
  return a && !r ? y === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: Array.from({ length: 6 }).map((D, P) => /* @__PURE__ */ e.jsx(Ca, { height: 120, rounded: "lg" }, P)) }) : /* @__PURE__ */ e.jsx("div", { className: "p-3 d-flex flex-column gap-2", children: Array.from({ length: 8 }).map((D, P) => /* @__PURE__ */ e.jsx(Ca, { height: 40, rounded: "md" }, P)) }) : r ? /* @__PURE__ */ e.jsx(V, { variant: "error", title: "Belge listesi yüklenemedi", error: r, onRetry: n, retrying: a }) : u.length === 0 && A.length === 0 ? /* @__PURE__ */ e.jsx(
    V,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
      title: "Burada henüz belge yok",
      description: d,
      action: R
    }
  ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    y === "grid" ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid p-3", children: u.map((D) => /* @__PURE__ */ e.jsx(
      ht,
      {
        file: D,
        selected: i === D.id,
        onSelect: S,
        onDragStart: z
      },
      D.id
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
        pt.map((D) => /* @__PURE__ */ e.jsx(yt, { column: D, sorting: p, onSort: N }, D.key))
      ] }),
      A.map((D) => /* @__PURE__ */ e.jsx(
        xt,
        {
          item: D,
          onUpload: f,
          canUpload: L
        },
        `missing-${D.assignmentId}-${D.requirementId}-${D.workStepId || "none"}`
      )),
      u.map((D) => /* @__PURE__ */ e.jsx(
        ft,
        {
          file: D,
          selected: i === D.id,
          checked: v.has(D.id),
          onSelect: S,
          onToggleCheck: j,
          onDragStart: z,
          isTrash: m,
          onRestore: c
        },
        D.id
      ))
    ] }),
    T > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            g * b + 1,
            "–",
            Math.min((g + 1) * b, o),
            " / ",
            o
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: g === 0, onClick: () => C(g - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              g + 1,
              " / ",
              T
            ] }),
            /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: g + 1 >= T, onClick: () => C(g + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
function vt({ count: a, onClear: r, onMove: n, onTag: u, busy: o }) {
  return a === 0 ? null : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-bulkbar", children: [
    /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
      a,
      " belge seçildi"
    ] }),
    /* @__PURE__ */ e.jsx("span", { style: { width: 1, height: 18, background: "rgba(255,255,255,.18)" } }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: n, disabled: o, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-open" }),
      " Taşı"
    ] }),
    /* @__PURE__ */ e.jsxs("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: u, disabled: o, children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-tag" }),
      " Etiketle"
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
    /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-bulkbar-action", onClick: r, children: "Vazgeç" })
  ] });
}
function kt({ tags: a }) {
  return a != null && a.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1", children: a.map((r) => /* @__PURE__ */ e.jsx("span", { className: F("apya-chip", dt(r)), children: r }, r)) }) : null;
}
const Ra = {
  1: { icon: "fa-diagram-project", label: "Proje" },
  2: { icon: "fa-list-check", label: "İş adımı" },
  3: { icon: "fa-receipt", label: "Harcama", href: (a) => a ? `${he()}Expenses` : null },
  4: {
    icon: "fa-box-archive",
    label: "Teslim paketi",
    href: (a) => a ? `${he()}Documents/Deliveries?packageId=${a}` : null
  },
  5: { icon: "fa-clipboard-check", label: "Kontrol listesi kalemi" }
};
function jt({ field: a, value: r, onChange: n, disabled: u }) {
  const o = { size: "sm", disabled: u, value: r ?? "" };
  switch (a.fieldType) {
    case 2:
      return /* @__PURE__ */ e.jsx(Y, { ...o, type: "date", onChange: (y) => n({ valueDate: y.target.value || null }) });
    case 3:
    case 4:
    case 5:
      return /* @__PURE__ */ e.jsx(
        Y,
        {
          ...o,
          type: "number",
          step: a.fieldType === 3 ? "0.01" : "1",
          onChange: (y) => n({ valueNumber: y.target.value === "" ? null : Number(y.target.value) })
        }
      );
    default:
      return /* @__PURE__ */ e.jsx(Y, { ...o, onChange: (y) => n({ valueText: y.target.value || null }) });
  }
}
function bt(a) {
  return a.fieldType === 2 ? a.valueDate ? a.valueDate.substring(0, 10) : "" : [3, 4, 5].includes(a.fieldType) ? a.valueNumber ?? "" : a.valueText ?? "";
}
function Nt(a) {
  return { ...a, fields: (a.fields || []).map((r) => ({ ...r })) };
}
function Ta(a) {
  const r = (n) => (n ?? "").slice(0, 10);
  return JSON.stringify([
    a.documentTypeId || null,
    a.amount ?? null,
    r(a.documentDate),
    a.periodCode || null,
    (a.fields || []).map((n) => [n.fieldId, n.valueText || null, n.valueNumber ?? null, r(n.valueDate)])
  ]);
}
function St({
  detail: a,
  loading: r,
  canEdit: n,
  onSave: u,
  onDelete: o,
  saving: y,
  documentTypes: p,
  /* Taslak ve kirli durumu üst bileşene bildirilir ({ draft, dirty }): belge / sekme
     değişiminde ve sayfadan ayrılırken kaydedilmemiş değişiklik sorulsun (DOC-09). */
  onDraftChange: N
}) {
  var d, R, M;
  const [i, S] = t.useState(null);
  t.useEffect(() => {
    S(a ? Nt(a) : null);
  }, [a]);
  const v = !!(a && i) && i.id === a.id && Ta(i) !== Ta(a), j = t.useRef(N);
  if (j.current = N, t.useEffect(() => {
    var f;
    (f = j.current) == null || f.call(j, { draft: i, dirty: v });
  }, [i, v]), t.useEffect(() => () => {
    var f;
    return (f = j.current) == null ? void 0 : f.call(j, { draft: null, dirty: !1 });
  }, []), r)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(ge, { rows: 6 }) });
  if (!a || !i)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(
      V,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir belge seçin",
        description: "Künye, özel alanlar ve versiyon geçmişi burada görünür."
      }
    ) });
  const k = Xe(a.contentType, a.fileName), g = ue[i.status] || ue[1], b = _.daysLeft(i.expiryDate), C = (f, L) => {
    S((m) => ({
      ...m,
      fields: m.fields.map((c) => c.fieldId === f ? { ...c, valueText: null, valueNumber: null, valueDate: null, ...L } : c)
    }));
  }, z = i.fields.filter(
    (f) => f.isRequired && !f.valueText && f.valueNumber === null && !f.valueDate
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-md-detail", style: { overflowY: "auto" }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
      /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "d-grid place-items-center flex-shrink-0",
          style: { width: 48, height: 48, borderRadius: 14, background: `${k.color}1a`, color: k.color, fontSize: 20 },
          children: /* @__PURE__ */ e.jsx("i", { className: `fa ${k.icon}` })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 14, fontWeight: 600, wordBreak: "break-word" }, children: a.displayName }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric mt-1", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
          _.size(a.fileSize),
          " · ",
          k.label,
          a.versionCount > 1 && ` · v${a.versionCount}`
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-1 mt-1 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: F("apya-chip", g.chip), children: g.text }),
          b !== null && b >= 0 && b <= 30 && /* @__PURE__ */ e.jsxs(q, { variant: "warning", size: "sm", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
            " ",
            b,
            " gün"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-3", children: [
      a.downloadUrl && /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: Cs({ variant: "primary" }), style: { flex: 1 }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }),
      n && !a.isLocked && /* @__PURE__ */ e.jsx(E, { variant: "outline", onClick: () => o(a), title: "Sil", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash", style: { color: "var(--apya-negative-500)" } }) })
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
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: _.dateTime(a.creationTime) })
      ] }),
      a.retentionUntil && /* @__PURE__ */ e.jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Saklama" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric", style: { fontSize: 11.5 }, children: _.date(a.retentionUntil) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Özel alanlar",
        /* @__PURE__ */ e.jsx(Je, { text: "Alan şeması belge tipine bağlıdır. Tip değiştirdiğinizde kaydettikten sonra o tipin alanları görünür." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Belge tipi" }),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-select",
              disabled: !n || a.isLocked,
              value: i.documentTypeId || "",
              onChange: (f) => S({ ...i, documentTypeId: f.target.value || null }),
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "— Sınıflandırılmamış —" }),
                p.map((f) => /* @__PURE__ */ e.jsx("option", { value: f.id, children: f.name }, f.id))
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
              disabled: !n || a.isLocked,
              value: i.amount ?? "",
              onChange: (f) => S({ ...i, amount: f.target.value === "" ? null : Number(f.target.value) })
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
              disabled: !n || a.isLocked,
              value: i.documentDate ? i.documentDate.substring(0, 10) : "",
              onChange: (f) => S({ ...i, documentDate: f.target.value || null })
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
              disabled: !n || a.isLocked,
              value: i.periodCode ?? "",
              onChange: (f) => S({ ...i, periodCode: f.target.value || null })
            }
          )
        ] }),
        i.fields.map((f) => {
          var L, m;
          return /* @__PURE__ */ e.jsxs("label", { className: "d-flex flex-column gap-1", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              f.label,
              f.isRequired && /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-negative-500)" }, children: "*" }),
              /* @__PURE__ */ e.jsx(q, { variant: ((L = Ea[f.fillSource]) == null ? void 0 : L.variant) || "neutral", size: "sm", children: ((m = Ea[f.fillSource]) == null ? void 0 : m.text) || "—" }),
              f.confidence !== null && f.confidence !== void 0 && /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10 }, children: [
                "%",
                f.confidence
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              jt,
              {
                field: f,
                value: bt(f),
                disabled: !n || a.isLocked,
                onChange: (c) => C(f.fieldId, c)
              }
            )
          ] }, f.fieldId);
        })
      ] }),
      z.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", style: { fontSize: 11, color: "var(--apya-warning-500)" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation" }),
        " ",
        z.length,
        " zorunlu alan boş."
      ] }),
      n && !a.isLocked && /* @__PURE__ */ e.jsx(
        E,
        {
          variant: "primary",
          size: "sm",
          className: "mt-3 w-100",
          isLoading: y,
          onClick: () => u(i),
          children: "Kaydet"
        }
      )
    ] }),
    ((d = a.tags) == null ? void 0 : d.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Etiketler" }),
      /* @__PURE__ */ e.jsx(kt, { tags: a.tags })
    ] }),
    ((R = a.related) == null ? void 0 : R.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "İlişkili kayıtlar",
        /* @__PURE__ */ e.jsx(Je, { text: "Belgenin bağlandığı harcama, içinde gittiği teslim paketi ve karşıladığı kontrol listesi kalemleri." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.related.map((f, L) => {
        var T;
        const m = Ra[f.kind] ?? Ra[3], c = (T = m.href) == null ? void 0 : T.call(m, f.entityId), h = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: { width: 22, height: 22, borderRadius: 6, background: "var(--apya-surface-sunken)", color: "var(--apya-text-secondary)", fontSize: 10 },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa ${m.icon}` })
            }
          ),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12 }, children: f.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "d-block text-truncate apya-numeric",
                style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" },
                children: [m.label, f.detail].filter(Boolean).join(" · ")
              }
            )
          ] })
        ] });
        return c ? /* @__PURE__ */ e.jsx(
          "a",
          {
            href: c,
            className: "d-flex align-items-center gap-2 text-decoration-none",
            style: { color: "inherit" },
            children: h
          },
          `${f.kind}-${f.entityId}-${L}`
        ) : /* @__PURE__ */ e.jsx("div", { className: "d-flex align-items-center gap-2", children: h }, `${f.kind}-${L}`);
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Versiyonlar",
        /* @__PURE__ */ e.jsx(Je, { text: "Aynı klasöre aynı isimle yeniden yüklenen dosya yeni versiyon olur; önceki versiyonlar burada kalır." })
      ] }),
      (M = a.versions) != null && M.length ? /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1", children: a.versions.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsxs(q, { variant: f.isLatest ? "brand" : "neutral", size: "sm", children: [
            "v",
            f.versionNumber
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { color: "var(--apya-text-secondary)" }, children: f.uploaderName })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { color: "var(--apya-text-tertiary)" }, children: _.date(f.creationTime) })
      ] }, f.id)) }) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Versiyon kaydı yok." })
    ] })
  ] });
}
const Ma = [
  { value: 1, label: "Proje geneli" },
  { value: 2, label: "Her iş adımı için" },
  { value: 3, label: "Her dönem için" }
], Ka = [
  { value: 2, label: "Klasör şeması" },
  { value: 3, label: "Task eki" }
], wt = {
  title: "",
  scope: 1,
  documentTypeId: "",
  isBlocking: !1,
  order: 0,
  source: 2,
  sourceEntityId: ""
};
function Ct({ draft: a, setDraft: r, documentTypes: n, tasks: u, onSubmit: o, onCancel: y, busy: p }) {
  const N = Number(a.source) === 3;
  return /* @__PURE__ */ e.jsxs(
    "form",
    {
      className: "d-flex flex-column gap-2 p-2",
      style: { background: "var(--apya-surface-sunken)", borderRadius: 10 },
      onSubmit: (i) => {
        i.preventDefault(), o();
      },
      children: [
        /* @__PURE__ */ e.jsx(
          Y,
          {
            size: "sm",
            placeholder: "Kalem adı (ör. İmzalı hizmet sözleşmesi)",
            value: a.title,
            onChange: (i) => r({ ...a, title: i.target.value }),
            required: !0
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.source,
              onChange: (i) => r({ ...a, source: Number(i.target.value), sourceEntityId: "" }),
              "aria-label": "Kaynak",
              children: Ka.map((i) => /* @__PURE__ */ e.jsx("option", { value: i.value, children: i.label }, i.value))
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              className: "apya-doc-select",
              value: a.scope,
              onChange: (i) => r({ ...a, scope: Number(i.target.value) }),
              "aria-label": "Kapsam",
              children: Ma.map((i) => /* @__PURE__ */ e.jsx("option", { value: i.value, children: i.label }, i.value))
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              className: "apya-doc-select",
              value: a.documentTypeId || "",
              onChange: (i) => r({ ...a, documentTypeId: i.target.value }),
              "aria-label": "Belge tipi",
              disabled: N,
              title: N ? "Göreve bağlı kalem otomatik eşleşmez" : void 0,
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "Belge tipi: yok (elle bağlanır)" }),
                n.map((i) => /* @__PURE__ */ e.jsx("option", { value: i.id, children: i.name }, i.id))
              ]
            }
          )
        ] }),
        N && /* @__PURE__ */ e.jsxs(
          "select",
          {
            className: "apya-doc-select",
            value: a.sourceEntityId || "",
            onChange: (i) => r({ ...a, sourceEntityId: i.target.value }),
            "aria-label": "Görev",
            required: !0,
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Görev seçin…" }),
              u.map((i) => /* @__PURE__ */ e.jsxs("option", { value: i.id, children: [
                "#",
                i.number,
                " · ",
                i.title
              ] }, i.id))
            ]
          }
        ),
        N && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-warning-700, #92400E)" }, children: "Göreve bağlı kalem otomatik karşılanmaz; belge elle bağlanır." }),
        /* @__PURE__ */ e.jsxs("label", { className: "d-flex align-items-center gap-2", style: { fontSize: 12 }, children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: a.isBlocking,
              onChange: (i) => r({ ...a, isBlocking: i.target.checked })
            }
          ),
          "Eksikse teslim paketi üretimini bloke etsin"
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [
          /* @__PURE__ */ e.jsx(E, { type: "button", variant: "outline", size: "sm", onClick: y, children: "Vazgeç" }),
          /* @__PURE__ */ e.jsx(E, { type: "submit", size: "sm", isLoading: p, disabled: !a.title.trim(), children: "Kaydet" })
        ] })
      ]
    }
  );
}
function zt({ pkg: a, projectId: r, documentTypes: n, onClose: u, onChanged: o }) {
  const [y, p] = t.useState([]), [N, i] = t.useState([]), [S, v] = t.useState(!0), [j, k] = t.useState(!1), [g, b] = t.useState({
    name: a.name,
    issuer: a.issuer,
    description: a.description || "",
    order: a.order || 0
  }), [C, z] = t.useState(null), [d, R] = t.useState(null), M = t.useCallback(async () => {
    v(!0);
    try {
      const [h, T] = await Promise.all([
        Ds(a.id),
        // Görev listesi yalnız proje bağlamında anlamlı; yoksa "task eki"
        // kaynağı seçilebilir ama liste boş kalır.
        r ? Es(r) : Promise.resolve([])
      ]);
      p(h ?? []), i(T ?? []);
    } catch (h) {
      B("error", "Paket kalemleri yüklenemedi."), console.error("[Documents] package requirements", h);
    } finally {
      v(!1);
    }
  }, [a.id, r]);
  t.useEffect(() => {
    M();
  }, [M]);
  const f = async () => {
    k(!0);
    try {
      await Bs(a.id, {
        name: g.name,
        issuer: g.issuer,
        description: g.description || null,
        order: g.order
      }), B("success", "Paket güncellendi."), o == null || o();
    } catch (h) {
      B("error", "Paket güncellenemedi."), console.error("[Documents] update package", h);
    } finally {
      k(!1);
    }
  }, L = async () => {
    k(!0);
    try {
      const h = {
        title: C.title.trim(),
        scope: Number(C.scope),
        documentTypeId: C.documentTypeId || null,
        isBlocking: C.isBlocking,
        order: Number(C.order) || y.length,
        source: Number(C.source),
        sourceEntityId: C.sourceEntityId || null
      };
      d ? await Ps(d, h) : await $s(a.id, h), z(null), R(null), await M(), o == null || o();
    } catch (h) {
      B("error", "Kalem kaydedilemedi."), console.error("[Documents] save requirement", h);
    } finally {
      k(!1);
    }
  }, m = async (h) => {
    k(!0);
    try {
      await Fs(h), await M(), o == null || o();
    } catch (T) {
      B("error", "Kalem silinemedi."), console.error("[Documents] delete requirement", T);
    } finally {
      k(!1);
    }
  }, c = async () => {
    var h, T;
    if (window.confirm(`"${a.name}" paketi silinecek. Emin misiniz?`)) {
      k(!0);
      try {
        await Ts(a.id), o == null || o(), u();
      } catch (A) {
        B("error", ((T = (h = A == null ? void 0 : A.responseJSON) == null ? void 0 : h.error) == null ? void 0 : T.message) || "Paket silinemedi."), console.error("[Documents] delete package", A);
      } finally {
        k(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Paketi düzenle" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: c, disabled: j, children: "Paketi sil" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: u, children: "Kapat" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx(
        Y,
        {
          size: "sm",
          placeholder: "Paket adı",
          value: g.name,
          onChange: (h) => b({ ...g, name: h.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(
        Y,
        {
          size: "sm",
          placeholder: "İsteyen taraf (ör. İç politika)",
          value: g.issuer,
          onChange: (h) => b({ ...g, issuer: h.target.value })
        }
      ),
      /* @__PURE__ */ e.jsx(E, { size: "sm", variant: "outline", isLoading: j, onClick: f, children: "Kaydet" })
    ] }),
    S ? /* @__PURE__ */ e.jsx(ge, { rows: 4 }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-list", children: [
      y.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "p-2", style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette henüz kalem yok." }),
      y.map((h) => {
        var T, A;
        return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", children: [
          /* @__PURE__ */ e.jsx("span", { className: F("apya-chip", h.isBlocking ? "apya-chip-warning" : "apya-chip-neutral"), children: h.isBlocking ? "bloke eden" : "normal" }),
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: h.title }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              ((T = Ka.find((D) => D.value === h.source)) == null ? void 0 : T.label) || "kurum şablonu",
              h.sourceEntityName && ` · ${h.sourceEntityName}`,
              " · ",
              (A = Ma.find((D) => D.value === h.scope)) == null ? void 0 : A.label,
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
                  R(h.id), z({
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
                onClick: () => m(h.id),
                children: "Sil"
              }
            )
          ] })
        ] }, h.id);
      })
    ] }),
    C ? /* @__PURE__ */ e.jsx(
      Ct,
      {
        draft: C,
        setDraft: z,
        documentTypes: n,
        tasks: N,
        onSubmit: L,
        onCancel: () => {
          z(null), R(null);
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
          R(null), z({ ...wt, order: y.length });
        },
        children: "Kalem ekle"
      }
    )
  ] });
}
function It({ packages: a, projectId: r, documentTypes: n, onChanged: u }) {
  const [o, y] = t.useState(null), [p, N] = t.useState(!1), [i, S] = t.useState(""), [v, j] = t.useState(!1), k = a.filter((b) => b.isEditable), g = async () => {
    j(!0);
    try {
      const b = await Rs({
        name: i.trim(),
        issuer: "İç politika",
        description: null,
        order: k.length
      });
      S(""), N(!1), u == null || u(), y(b);
    } catch (b) {
      B("error", "Paket oluşturulamadı."), console.error("[Documents] create package", b);
    } finally {
      j(!1);
    }
  };
  return o ? /* @__PURE__ */ e.jsx(
    zt,
    {
      pkg: o,
      projectId: r,
      documentTypes: n,
      onClose: () => y(null),
      onChanged: u
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Kendi paketleriniz" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      !p && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => N(!0), children: "+ Yeni paket" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Kurum paketleri (KOSGEB, TÜBİTAK) sistemde tanımlıdır ve değiştirilemez. Kendi klasör şemanız ve göreve bağlı ekleriniz için buradan paket kurun." }),
    p && /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        Y,
        {
          size: "sm",
          autoFocus: !0,
          placeholder: "Paket adı (ör. Şirket klasör şeması)",
          value: i,
          onChange: (b) => S(b.target.value),
          onKeyDown: (b) => {
            b.key === "Enter" && i.trim() && g();
          }
        }
      ),
      /* @__PURE__ */ e.jsx(E, { size: "sm", isLoading: v, disabled: !i.trim(), onClick: g, children: "Oluştur" }),
      /* @__PURE__ */ e.jsx(E, { size: "sm", variant: "outline", onClick: () => {
        N(!1), S("");
      }, children: "Vazgeç" })
    ] }),
    k.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Henüz kendi paketiniz yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: k.map((b) => /* @__PURE__ */ e.jsxs(E, { variant: "outline", size: "sm", onClick: () => y(b), children: [
      b.name,
      /* @__PURE__ */ e.jsx(q, { variant: "neutral", size: "sm", children: b.requirementCount })
    ] }, b.id)) })
  ] });
}
const Ba = {
  1: { text: "Karşılandı", chip: "apya-chip-positive", icon: "fa-check" },
  2: { text: "Eksik", chip: "apya-chip-warning", icon: "fa-triangle-exclamation" },
  3: { text: "Feragat", chip: "apya-chip-neutral", icon: "fa-ban" }
}, Dt = { 1: "Proje", 2: "İş adımı", 3: "Dönem" }, Fa = {
  1: "kurum şablonu",
  2: "klasör şeması",
  3: "task eki"
};
function Et({ percent: a, blocking: r }) {
  const n = r > 0 ? "var(--apya-negative-500)" : a >= 90 ? "var(--apya-positive-500)" : "var(--apya-warning-500)";
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", role: "progressbar", "aria-valuenow": a, "aria-valuemin": 0, "aria-valuemax": 100, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a}%`, background: n } }) });
}
function Rt({ item: a, canManage: r, onWaive: n, busy: u }) {
  const o = Ba[a.status] || Ba[2], y = a.workStepName ? `${a.workStepOrder} · ${a.workStepName}` : a.periodCode || Dt[a.scope];
  return /* @__PURE__ */ e.jsxs("div", { className: F("apya-doc-check-row", a.status === 2 && a.isBlocking && "is-blocking"), children: [
    /* @__PURE__ */ e.jsxs("span", { className: F("apya-chip", o.chip), children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa ${o.icon}` }),
      " ",
      o.text
    ] }),
    /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 13, fontWeight: 500 }, children: a.title }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
        Fa[a.source] || Fa[1],
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
          disabled: u,
          onClick: () => n(a, a.status !== 3),
          children: a.status === 3 ? "Feragati kaldır" : "Feragat et"
        }
      )
    ] })
  ] });
}
function Tt({ projectId: a, periodCode: r, onSummaryChange: n, documentTypes: u = [] }) {
  const [o, y] = t.useState(null), [p, N] = t.useState([]), [i, S] = t.useState(!0), [v, j] = t.useState(null), [k, g] = t.useState(!1), b = fe("Platform.Documents.ManageCompliance"), C = t.useRef(0), z = t.useCallback(async () => {
    const m = ++C.current;
    if (!a) {
      y(null), j(null), S(!1);
      return;
    }
    S(!0);
    try {
      const [c, h] = await Promise.all([
        Ls(a, r, { abpHandleError: !1 }),
        As(a, { abpHandleError: !1 })
      ]);
      if (m !== C.current) return;
      y(c), N(h ?? []), j(null), n == null || n((c == null ? void 0 : c.summary) ?? null);
    } catch (c) {
      if (m !== C.current) return;
      j(c), console.error("[Documents] compliance load", c);
    } finally {
      m === C.current && S(!1);
    }
  }, [a, r, n]);
  t.useEffect(() => {
    z();
  }, [z]);
  const d = async (m) => {
    g(!0);
    try {
      await Ws(a, m, r || null), await z();
    } catch (c) {
      B("error", "Paket uygulanamadı."), console.error("[Documents] applyPackage", c);
    } finally {
      g(!1);
    }
  }, R = async (m) => {
    g(!0);
    try {
      await Ms(m), await z();
    } catch (c) {
      B("error", "Paket kaldırılamadı."), console.error("[Documents] removeAssignment", c);
    } finally {
      g(!1);
    }
  }, M = async (m, c, h) => {
    const T = h ? window.prompt("Feragat gerekçesi:") : null;
    if (!(h && !T)) {
      g(!0);
      try {
        await Ks({
          assignmentId: m.assignmentId,
          requirementId: c.requirementId,
          workStepId: c.workStepId,
          periodCode: c.periodCode,
          waive: h,
          reason: T
        }), await z();
      } catch (A) {
        B("error", "İşlem başarısız oldu."), console.error("[Documents] waive", A);
      } finally {
        g(!1);
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
  if (i && !v)
    return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(ge, { rows: 6 }) });
  if (v)
    return /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(V, { variant: "error", title: "Uygunluk verisi yüklenemedi", error: v, onRetry: z, retrying: i }) });
  const f = (o == null ? void 0 : o.checklists) ?? [], L = p.filter((m) => !m.isApplied);
  return /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
    f.length === 0 ? /* @__PURE__ */ e.jsx(
      V,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clipboard-list" }),
        title: "Bu projeye henüz kurum paketi uygulanmadı",
        description: "Aşağıdan bir paket seçerek kontrol listesini başlatın."
      }
    ) : f.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
        /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e.jsx("div", { style: { fontSize: 13.5, fontWeight: 600 }, children: m.packageName }),
          /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            m.issuer,
            m.periodCode && ` · ${m.periodCode}`
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 15, fontWeight: 500 }, children: [
            "%",
            m.summary.percent
          ] }),
          m.summary.blockingMissingCount > 0 && /* @__PURE__ */ e.jsxs(q, { variant: "negative", size: "sm", children: [
            m.summary.blockingMissingCount,
            " bloke"
          ] }),
          b && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: k,
              onClick: () => R(m.assignmentId),
              children: "Kaldır"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(Et, { percent: m.summary.percent, blocking: m.summary.blockingMissingCount }),
      /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
        m.summary.satisfiedCount,
        " / ",
        m.summary.totalCount - m.summary.waivedCount,
        " kalem tamam",
        m.summary.waivedCount > 0 && ` · ${m.summary.waivedCount} feragat`
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-list", children: m.items.map((c, h) => /* @__PURE__ */ e.jsx(
        Rt,
        {
          item: c,
          canManage: b,
          busy: k,
          onWaive: (T, A) => M(m, T, A)
        },
        `${c.requirementId}-${c.workStepId || c.periodCode || h}`
      )) })
    ] }, m.assignmentId)),
    b && /* @__PURE__ */ e.jsx(
      It,
      {
        packages: p,
        projectId: a,
        documentTypes: u,
        onChanged: z
      }
    ),
    b && L.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Uygulanabilir paketler" }),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: L.map((m) => /* @__PURE__ */ e.jsxs(
        E,
        {
          variant: "outline",
          size: "sm",
          disabled: k,
          leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          onClick: () => d(m.id),
          children: [
            m.name,
            " (",
            m.requirementCount,
            ")"
          ]
        },
        m.id
      )) })
    ] })
  ] });
}
const xe = 25, Bt = {
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
}, Ft = [
  { value: "", label: "Tümü" },
  { value: "1", label: "Yüklendi" },
  { value: "2", label: "İndirildi" },
  { value: "5", label: "Meta değişti" },
  { value: "3", label: "Silindi" }
];
function Pt({ projectId: a, documentFileId: r }) {
  const [n, u] = t.useState([]), [o, y] = t.useState(0), [p, N] = t.useState(0), [i, S] = t.useState(""), [v, j] = t.useState(!0), [k, g] = t.useState(null), b = t.useRef(0), C = t.useCallback(async () => {
    const d = ++b.current;
    j(!0);
    try {
      const R = await qs({
        maxResultCount: xe,
        skipCount: p * xe,
        projectId: a || void 0,
        documentFileId: r || void 0,
        action: i || void 0
      }, { abpHandleError: !1 });
      if (d !== b.current) return;
      u(R.items ?? []), y(R.totalCount ?? 0), g(null);
    } catch (R) {
      if (d !== b.current) return;
      g(R), console.error("[Documents] activity load", R);
    } finally {
      d === b.current && j(!1);
    }
  }, [a, r, i, p]);
  t.useEffect(() => {
    C();
  }, [C]);
  const z = Math.max(1, Math.ceil(o / xe));
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center gap-2 flex-wrap px-3 py-2",
        style: { borderBottom: "1px solid var(--apya-border-subtle)" },
        children: [
          Ft.map((d) => /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: F("apya-doc-filterchip", i === d.value && "is-active"),
              onClick: () => {
                S(d.value), N(0);
              },
              children: d.label
            },
            d.value
          )),
          /* @__PURE__ */ e.jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            v || k ? "—" : o,
            " kayıt"
          ] })
        ]
      }
    ),
    v && !k ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(ge, { rows: 8 }) }) : k ? /* @__PURE__ */ e.jsx(V, { variant: "error", title: "Etkinlik kaydı yüklenemedi", error: k, onRetry: C, retrying: v }) : n.length === 0 ? /* @__PURE__ */ e.jsx(
      V,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left" }),
        title: "Henüz kayıtlı etkinlik yok",
        description: "Yükleme, indirme, meta değişikliği ve silme işlemleri burada iz bırakır."
      }
    ) : /* @__PURE__ */ e.jsx("div", { children: n.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", children: [
      /* @__PURE__ */ e.jsx("span", { className: F("apya-chip", Bt[d.action] || "apya-chip-neutral"), children: ct[d.action] || "—" }),
      /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: d.documentFileName || d.folderName || "—" }),
        d.detail && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: d.detail })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12 }, children: d.actorName }),
        d.actorRole && /* @__PURE__ */ e.jsx(q, { variant: "neutral", size: "sm", children: d.actorRole })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: _.dateTime(d.creationTime) })
    ] }, d.id)) }),
    !k && z > 1 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex align-items-center justify-content-between px-3 py-2",
        style: { borderTop: "1px solid var(--apya-border-subtle)" },
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
            p * xe + 1,
            "–",
            Math.min((p + 1) * xe, o),
            " / ",
            o
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: p === 0, onClick: () => N(p - 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: [
              p + 1,
              " / ",
              z
            ] }),
            /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: p + 1 >= z, onClick: () => N(p + 1), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right" }) })
          ] })
        ]
      }
    )
  ] });
}
const Pa = {
  1: "klasör",
  2: "belge tipi",
  3: "iş adımı",
  4: "dönem",
  5: "harcama kalemi"
};
function $t(a) {
  return a >= 90 ? "positive" : a >= 70 ? "brand" : "warning";
}
function Lt({ summary: a, busy: r, onApplyAll: n, onApply: u, onDismiss: o, onReload: y }) {
  const [p, N] = t.useState(!1), i = (a == null ? void 0 : a.items) ?? [];
  if (i.length === 0) return null;
  const S = [...new Set(i.map((v) => Pa[v.kind]).filter(Boolean))];
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-suggestion-banner", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-suggestion-icon", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-wand-magic-sparkles" }) }),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
          a.documentCount,
          " dosya için ",
          S.join(", "),
          " önerisi hazır"
        ] }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Kural motoru ve harcama eşleşmesinden üretildi — uygulanmadan önce onayınızı bekler." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", onClick: () => N((v) => !v), children: p ? "Gizle" : "İncele" }),
      /* @__PURE__ */ e.jsx(E, { size: "sm", isLoading: r, onClick: n, children: "Tümünü uygula" })
    ] }),
    p && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-suggestion-list", children: [
      i.map((v) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-doc-suggestion-row",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5, minWidth: 0 }, children: v.documentFileName }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: [
              Pa[v.kind],
              " → ",
              /* @__PURE__ */ e.jsx("strong", { children: v.targetName || v.payload })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: v.reason }),
            /* @__PURE__ */ e.jsxs(q, { variant: $t(v.confidence), size: "sm", children: [
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
      /* @__PURE__ */ e.jsx("button", { type: "button", className: F("apya-doc-linkbtn", "mt-1"), onClick: y, children: "Yenile" })
    ] })
  ] });
}
const At = [
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
function Mt(a, r) {
  const n = (r == null ? void 0 : r.workStepCount) ?? 0, u = Array.from({ length: n }, (o, y) => `${y + 1} · iş adımı`);
  if (a === 1) return u;
  if (a === 2) {
    const o = (/* @__PURE__ */ new Date()).getFullYear();
    return [1, 2, 3, 4].map((y) => `${o} Q${y}`);
  }
  return [...u, "Finans", "Personel / İK", "Sözleşmeler"];
}
function Kt({ state: a, onDone: r }) {
  var z;
  const [n, u] = t.useState(0), [o, y] = t.useState(""), [p, N] = t.useState(((z = a.projects[0]) == null ? void 0 : z.id) ?? ""), [i, S] = t.useState(3), [v, j] = t.useState(!1), k = a.projects.find((d) => d.id === p), g = Mt(i, k), b = async () => {
    j(!0);
    try {
      await Us(), r();
    } finally {
      j(!1);
    }
  }, C = async () => {
    j(!0);
    try {
      const d = await Os({
        projectId: p,
        schema: i,
        compliancePackageId: o || null,
        periodCode: null
      });
      B("success", `${d.createdFolderCount} klasör kuruldu.`), r();
    } catch (d) {
      B("error", "Kurulum tamamlanamadı."), console.error("[Documents] setup", d);
    } finally {
      j(!1);
    }
  };
  return /* @__PURE__ */ e.jsx(Ze, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-setup", onClick: (d) => d.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-setup-icon", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-wand-magic-sparkles" }) }),
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: "Dokümanlar kurulumu" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Klasör şemasını kurumun beklediği yapıya göre kurun. Sonradan da değiştirebilirsiniz." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: b, disabled: v, children: "Atla" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-setup-steps", children: ["Kurum ve program", "Klasör şeması", "Ekip ve kutu"].map((d, R) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        className: F("apya-doc-setup-step", R === n && "is-active", R < n && "is-done"),
        onClick: () => u(R),
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-doc-setup-step-no", children: R + 1 }),
          d
        ]
      },
      d
    )) }),
    n === 0 && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
      /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: "Zorunlu belge listesi buradan gelir. Şimdi seçmeyip sonra Uygunluk sekmesinden de uygulayabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: F("apya-doc-filterchip", !o && "is-active"),
            onClick: () => y(""),
            children: "Şimdilik yok"
          }
        ),
        a.packages.map((d) => /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: F("apya-doc-filterchip", o === d.id && "is-active"),
            onClick: () => y(d.id),
            children: [
              d.name,
              /* @__PURE__ */ e.jsx(q, { variant: "neutral", size: "sm", children: d.requirementCount })
            ]
          },
          d.id
        ))
      ] })
    ] }),
    n === 1 && /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", children: a.projects.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kiracıda proje yok — klasör şeması bir projeye kurulur. Önce bir proje oluşturun." }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: p,
          onChange: (d) => N(d.target.value),
          "aria-label": "Proje",
          children: a.projects.map((d) => /* @__PURE__ */ e.jsxs("option", { value: d.id, children: [
            d.name,
            d.hasFolders ? " — zaten klasörü var" : ""
          ] }, d.id))
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-2", children: At.map((d) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: F("apya-doc-filterchip", i === d.value && "is-active"),
          onClick: () => S(d.value),
          title: d.detail,
          children: d.label
        },
        d.value
      )) }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-setup-preview", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Kurulacak klasörler" }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12 }, children: k == null ? void 0 : k.name }),
        g.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Bu projede iş adımı tanımlı değil; yalnız proje klasörü kurulur." }) : g.map((d) => /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-secondary)", paddingLeft: 12 }, children: d }, d))
      ] })
    ] }) }),
    n === 2 && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", style: { fontSize: 12 }, children: [
      /* @__PURE__ */ e.jsx("div", { style: { color: "var(--apya-text-secondary)" }, children: "Ekip üyeleri ve alan bazlı izinler kimlik yönetiminden, alan izinleri ise Dokümanlar → Yönetim ekranından tanımlanır." }),
      /* @__PURE__ */ e.jsx("div", { style: { color: "var(--apya-text-tertiary)" }, children: "Belge e-posta kutusu (gelen ekleri otomatik klasörleme) henüz kullanıma açık değil; Entegrasyonlar ekranında yer ayrıldı." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end mt-3", children: [
      n > 0 && /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", onClick: () => u(n - 1), children: "Geri" }),
      n < 2 ? /* @__PURE__ */ e.jsx(E, { size: "sm", onClick: () => u(n + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(
        E,
        {
          size: "sm",
          isLoading: v,
          disabled: a.projects.length === 0 || !p,
          onClick: C,
          children: "Şemayı kur"
        }
      )
    ] })
  ] }) }) });
}
const Qe = 25, Wt = "00000000-0000-0000-0000-000000000000";
function qt({ message: a, onDone: r }) {
  return t.useEffect(() => {
    const n = setTimeout(r, 2800);
    return () => clearTimeout(n);
  }, [r]), /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-check", style: { fontSize: 11, color: "var(--apya-positive-500)" } }),
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: a })
  ] });
}
function Ut({ title: a, message: r, onConfirm: n, onCancel: u }) {
  const [o, y] = t.useState(!1);
  return /* @__PURE__ */ e.jsx(Ze, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: u, children: /* @__PURE__ */ e.jsxs("div", { className: "apya-pop-in apya-doc-dialog", onClick: (p) => p.stopPropagation(), children: [
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
      /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", onClick: u, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        E,
        {
          variant: "destructive",
          size: "sm",
          isLoading: o,
          onClick: async () => {
            y(!0), await n(), y(!1);
          },
          children: "Evet, sil"
        }
      )
    ] })
  ] }) }) });
}
function Ot({ uploadedThisMonth: a, expiring: r, compliance: n, hasProject: u, complianceFailed: o }) {
  const y = [
    {
      key: "compliance",
      label: "Uygunluk",
      value: n ? `%${n.percent}` : "—",
      icon: "fa-clipboard-check",
      tone: "positive",
      foot: n ? `${n.satisfiedCount} / ${n.totalCount - n.waivedCount} kalem tamam` : u ? o ? "Yüklenemedi" : null : "Proje bağlamı seçin"
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
    { key: "expiring", label: "Süresi dolan", value: r ?? "—", icon: "fa-clock-rotate-left", tone: "negative" }
  ];
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-kpis", children: y.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("span", { className: F("apya-doc-kpi-icon", `is-${p.tone}`), children: /* @__PURE__ */ e.jsx("i", { className: `fa ${p.icon}` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: p.label })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: p.value }),
    p.foot && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: p.foot })
  ] }, p.key)) });
}
function Yt() {
  var wa;
  const [a, r] = t.useState([]), [n, u] = t.useState([]), [o, y] = t.useState([]), [p, N] = t.useState(!0), [i, S] = t.useState(null), [v, j] = t.useState([]), [k, g] = t.useState(0), [b, C] = t.useState(null), [z, d] = t.useState(null), [R, M] = t.useState(!0), [f, L] = t.useState(null), m = t.useMemo(() => new URLSearchParams(window.location.search), []), [c, h] = t.useState(() => {
    const s = m.get("smart");
    if (s) return { key: s, kind: "smart", smart: s };
    const l = m.get("folder");
    if (l) return { key: `folder-${l}`, kind: "folder", documentId: l };
    const x = m.get("step");
    if (x) return { key: `step-${x}`, kind: "workstep", workStepId: x };
    const w = m.get("projectId");
    return w ? { key: `project-${w}`, kind: "project", projectId: w } : { key: "all", kind: "all" };
  }), T = t.useRef(c), [A, D] = t.useState(() => c.kind === "project"), P = c.kind === "folder" ? c.documentId : null, J = c.projectId || null, Wa = c.kind === "smart" && c.smart === "trash", [qa, ea] = t.useState(/* @__PURE__ */ new Set()), [me, Ua] = t.useState(m.get("q") || ""), [le, Oa] = t.useState(m.get("sort") || "creationTime desc"), [ie, aa] = t.useState(m.get("view") === "grid" ? "grid" : "list"), [re, ve] = t.useState(Number(m.get("page")) || 0), [G, Ya] = t.useState(me);
  t.useEffect(() => {
    if (me === G) return;
    const s = setTimeout(() => {
      Ya(me), ve(0);
    }, 300);
    return () => clearTimeout(s);
  }, [me, G]);
  const [U, Ha] = t.useState(() => {
    const s = m.get("tab");
    return ["files", "compliance", "activity"].includes(s) ? s : "files";
  }), [Ie, De] = t.useState(null), [_a, ke] = t.useState(null), [Ga, sa] = t.useState(!1), [ta, na] = t.useState(!1), O = zs(), la = t.useRef(null), [Va, je] = t.useState(!1), Ja = t.useCallback(({ draft: s, dirty: l }) => {
    la.current = s, l ? O.markDirty() : O.markClean();
  }, [O.markDirty, O.markClean]), [Q, se] = t.useState(/* @__PURE__ */ new Set()), [Qa, Za] = t.useState(null), Ee = t.useRef([]), [pe, Re] = t.useState(null), [ia, ra] = t.useState(null), [Te, oa] = t.useState(!1), Be = t.useRef(null), Fe = t.useRef(null), [oe, Pe] = t.useState(null), [Z, ca] = t.useState(null), [Xa, da] = t.useState(!1), [ua, ma] = t.useState(null), [es, pa] = t.useState(!1), $e = t.useRef(null), te = fe("Platform.Documents.Create"), ya = fe("Platform.Documents.ManageMeta"), as = fe("Platform.Documents.BulkOperations"), ss = fe("Platform.Documents.Delete"), H = t.useCallback((s) => ra(s), []), be = t.useRef(0), X = t.useCallback(async () => {
    const s = ++be.current;
    N(!0);
    try {
      const [l, x, w] = await Promise.all([
        Ys().getList({ maxResultCount: 1e3, sorting: "title asc" }, { abpHandleError: !1 }),
        Hs(null, { abpHandleError: !1 }).catch(() => []),
        _s({ abpHandleError: !1 }).catch(() => [])
      ]);
      if (s !== be.current) return;
      r(l.items ?? []), u(x ?? []), y(w ?? []), S(null);
    } catch (l) {
      if (s !== be.current) return;
      S(l), console.error("[Documents] loadTree", l);
    } finally {
      s === be.current && N(!1);
    }
  }, []);
  t.useEffect(() => {
    X();
  }, [X]);
  const Le = t.useMemo(() => {
    const s = { maxResultCount: Qe, skipCount: re * Qe, sorting: le };
    return G.trim() && (s.filterText = G.trim()), c.kind === "folder" ? (s.documentId = c.documentId, s.includeSubFolders = !0) : c.kind === "workstep" ? s.workStepId = c.workStepId : c.kind === "project" ? s.projectId = c.projectId : c.kind === "smart" && c.smart === "expiring" ? s.expiringWithinDays = 30 : c.kind === "smart" && c.smart === "missing-meta" ? s.missingRequiredFields = !0 : c.kind === "smart" && c.smart === "trash" ? s.onlyDeleted = !0 : c.kind === "smart" && c.smart === "suggested" && (s.documentFileIds = [...new Set(((Z == null ? void 0 : Z.items) ?? []).map((l) => l.documentFileId))], s.documentFileIds.length === 0 && (s.documentFileIds = [Wt])), s;
  }, [c, re, le, G, Z]), xa = t.useRef(Le);
  xa.current = Le;
  const Ne = t.useRef(0), W = t.useCallback(async () => {
    const s = ++Ne.current;
    M(!0);
    try {
      const l = await Ge(xa.current, { abpHandleError: !1 });
      if (s !== Ne.current) return;
      j(l.items ?? []), g(l.totalCount ?? 0), L(null);
    } catch (l) {
      if (s !== Ne.current) return;
      L(l), console.error("[Documents] loadFiles", l);
    } finally {
      s === Ne.current && M(!1);
    }
  }, []), ts = JSON.stringify(Le);
  t.useEffect(() => {
    A || W();
  }, [ts, A, W]);
  const Ae = t.useRef(0), ce = t.useCallback(async () => {
    const s = ++Ae.current;
    try {
      const l = /* @__PURE__ */ new Date(), x = new Date(l.getFullYear(), l.getMonth(), 1).toISOString(), [w, I] = await Promise.all([
        Ge({ maxResultCount: 1, skipCount: 0, expiringWithinDays: 30 }, { abpHandleError: !1 }),
        Ge({ maxResultCount: 1, skipCount: 0, uploadedAfter: x }, { abpHandleError: !1 })
      ]);
      if (s !== Ae.current) return;
      C(w.totalCount ?? 0), d(I.totalCount ?? 0);
    } catch (l) {
      if (s !== Ae.current) return;
      C(null), d(null), console.error("[Documents] loadKpis", l);
    }
  }, []);
  t.useEffect(() => {
    ce();
  }, [ce]);
  const ne = Gs(J), ns = t.useMemo(() => {
    var l;
    const s = (((l = ne.overview) == null ? void 0 : l.checklists) ?? []).flatMap((x) => (x.items ?? []).filter((w) => w.status === 2).map((w) => ({ ...w, assignmentId: x.assignmentId })));
    return c.kind === "workstep" ? s.filter((x) => x.workStepId === c.workStepId) : s;
  }, [ne.overview, c.kind, c.workStepId]), Me = t.useRef(ne);
  Me.current = ne;
  const ls = t.useCallback((s) => {
    var x;
    const l = Me.current;
    !s || l.loading || Vs(s, (x = l.overview) == null ? void 0 : x.summary) || l.reload();
  }, []), fa = t.useRef(J);
  fa.current = J;
  const Se = t.useRef(0), ye = t.useCallback(async () => {
    const s = ++Se.current;
    da(!0);
    try {
      const l = await Js(fa.current, { abpHandleError: !1 });
      if (s !== Se.current) return;
      ca(l), ma(null);
    } catch (l) {
      if (s !== Se.current) return;
      ca(null), ma(l), console.error("[Documents] loadSuggestions", l);
    } finally {
      s === Se.current && da(!1);
    }
  }, []);
  t.useEffect(() => {
    ye();
  }, [J, ye]), t.useEffect(() => {
    te && (async () => {
      try {
        Pe(await Qs({ abpHandleError: !1 }));
      } catch (s) {
        console.error("[Documents] setupState", s);
      }
    })();
  }, [te]);
  const Ke = (s) => ({
    documentFileId: s.documentFileId,
    kind: s.kind,
    payload: s.payload
  }), We = async (s, l, x) => {
    pa(!0);
    try {
      await s(l), H(x), await Promise.all([ye(), W(), X()]);
    } catch (w) {
      ae(w) || B("error", "Öneri işlenemedi."), console.error("[Documents] suggestion action", w);
    } finally {
      pa(!1);
    }
  }, we = t.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    n.forEach((w) => {
      s.has(w.projectId) || s.set(w.projectId, []), s.get(w.projectId).push(w);
    });
    const l = /* @__PURE__ */ new Map();
    a.forEach((w) => {
      const I = w.parentDocumentId || "root";
      l.has(I) || l.set(I, []), l.get(I).push(w);
    });
    const x = (w) => (l.get(w) || []).sort((I, ee) => (I.sortOrder ?? 0) - (ee.sortOrder ?? 0) || I.title.localeCompare(ee.title, "tr")).map((I) => {
      const ee = x(I.id), $ = (I.projectId ? s.get(I.projectId) || [] : []).slice().sort((K, bs) => K.order - bs.order).map((K) => ({
        key: `step-${K.id}`,
        kind: "workstep",
        workStepId: K.id,
        projectId: K.projectId,
        label: `${K.order} · ${K.name}`,
        icon: "fa-diagram-next",
        count: K.documentCount,
        children: []
      }));
      return {
        key: `folder-${I.id}`,
        kind: "folder",
        documentId: I.id,
        projectId: I.projectId,
        label: I.title,
        icon: I.projectId ? "fa-diagram-project" : "fa-folder",
        children: [...$, ...ee]
      };
    });
    return x("root");
  }, [a, n]), qe = t.useRef(!1);
  t.useEffect(() => {
    if (qe.current || p) return;
    qe.current = !0;
    const s = m.get("folder"), l = m.get("step"), x = m.get("projectId");
    if (!s && !l && !x) return;
    const w = ($) => $.flatMap((K) => [K, ...w(K.children || [])]), I = ($, K) => String($ ?? "").toLowerCase() === String(K ?? "").toLowerCase(), ee = w(we), Ce = s ? ee.find(($) => $.documentId === s) : l ? ee.find(($) => $.workStepId === l) : ee.find(($) => $.kind === "folder" && I($.projectId, x));
    Ce ? (h(($) => $ === T.current ? Ce : $), ea(($) => /* @__PURE__ */ new Set([...$, Ce.key]))) : we.length > 0 && (s || l) && h(($) => $ === T.current ? { key: "all", kind: "all" } : $), D(!1);
  }, [p, we, m]), t.useEffect(() => {
    const s = new URLSearchParams();
    U !== "files" && s.set("tab", U), c.kind === "folder" ? s.set("folder", c.documentId) : c.kind === "workstep" ? s.set("step", c.workStepId) : c.kind === "project" ? s.set("projectId", c.projectId) : c.kind === "smart" && s.set("smart", c.smart), G.trim() && s.set("q", G.trim()), ie !== "list" && s.set("view", ie), le !== "creationTime desc" && s.set("sort", le), re > 0 && s.set("page", String(re));
    const l = s.toString();
    window.history.replaceState(null, "", l ? `${window.location.pathname}?${l}` : window.location.pathname);
  }, [U, c, G, ie, le, re]);
  const de = t.useRef(0), is = t.useCallback(async (s) => {
    const l = ++de.current;
    De(s.id), sa(!0);
    try {
      const x = await za(s.id);
      l === de.current && ke(x);
    } catch (x) {
      if (l !== de.current) return;
      De(null), ke(null), B("error", "Belge detayı açılamadı."), console.error("[Documents] openDetail", x);
    } finally {
      l === de.current && sa(!1);
    }
  }, []), rs = (s) => {
    s.id === Ie && O.isDirty || (je(!1), O.requestClose(() => is(s)));
  }, ha = (s) => {
    s !== U && (je(!1), O.requestClose(() => Ha(s)));
  }, ga = async (s) => {
    const l = de.current;
    let x = !1;
    na(!0);
    try {
      await it(s.id, {
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
        fields: s.fields.map((I) => ({
          fieldId: I.fieldId,
          valueText: I.valueText ?? null,
          valueNumber: I.valueNumber ?? null,
          valueDate: I.valueDate ?? null
        })),
        tags: s.tags || []
      }), x = !0, H("Belge güncellendi.");
      const w = await za(s.id);
      return l === de.current && ke(w), await W(), !0;
    } catch (w) {
      return ae(w) || B("error", "Belge güncellenemedi."), console.error("[Documents] handleSave", w), x;
    } finally {
      na(!1);
    }
  }, os = async () => {
    if (pe)
      try {
        await rt(pe.id), Ie === pe.id && (De(null), ke(null)), H("Belge silindi."), await Promise.all([W(), ce()]);
      } catch (s) {
        ae(s) || B("error", "Belge silinemedi."), console.error("[Documents] handleDelete", s);
      } finally {
        Re(null);
      }
  }, cs = (s) => {
    Ee.current = Q.has(s.id) ? Array.from(Q) : [s.id];
  }, ds = async (s) => {
    const l = Ee.current;
    if (l.length)
      try {
        l.length === 1 ? await tt(l[0], s) : await Da(l, s), H(l.length === 1 ? "Belge taşındı." : `${l.length} belge taşındı.`), se(/* @__PURE__ */ new Set()), await W();
      } catch (x) {
        ae(x) || B("error", "Taşıma başarısız oldu."), console.error("[Documents] move", x);
      } finally {
        Ee.current = [];
      }
  }, us = async () => {
    const s = window.prompt("Hedef klasör adını yazın:");
    if (!s) return;
    const l = a.find((x) => x.title.toLocaleLowerCase("tr") === s.toLocaleLowerCase("tr"));
    if (!l) {
      B("warn", "Klasör bulunamadı.");
      return;
    }
    try {
      await Da(Array.from(Q), l.id), H(`${Q.size} belge taşındı.`), se(/* @__PURE__ */ new Set()), await W();
    } catch (x) {
      ae(x) || B("error", "Toplu taşıma başarısız oldu."), console.error("[Documents] bulkMove", x);
    }
  }, ms = async () => {
    const s = window.prompt("Etiket(ler) — virgülle ayırın:");
    if (!s) return;
    const l = s.split(",").map((x) => x.trim()).filter(Boolean);
    if (l.length)
      try {
        await lt(Array.from(Q), l), H(`${Q.size} belge etiketlendi.`), se(/* @__PURE__ */ new Set()), await W();
      } catch (x) {
        ae(x) || B("error", "Etiketleme başarısız oldu."), console.error("[Documents] bulkTag", x);
      }
  }, Ue = async (s) => {
    if (!P || !(s != null && s.length)) return;
    const l = $e.current;
    $e.current = null, oa(!0);
    try {
      let x = null;
      for (const w of Array.from(s)) {
        const I = await at(P, w);
        x = x ?? (I == null ? void 0 : I.documentFileId) ?? null;
      }
      l && x ? (await st({
        assignmentId: l.assignmentId,
        requirementId: l.requirementId,
        workStepId: l.workStepId || null,
        periodCode: l.periodCode || null,
        documentFileId: x
      }), H(`Yüklendi ve "${l.title}" kalemine bağlandı.`)) : H(s.length === 1 ? "Dosya yüklendi." : `${s.length} dosya yüklendi.`), await Promise.all([W(), ce(), X(), Me.current.reload()]);
    } catch (x) {
      ae(x) || B("error", "Dosya yüklenemedi."), console.error("[Documents] upload", x);
    } finally {
      oa(!1);
    }
  }, ps = async (s) => {
    try {
      await nt(s.id), H(`"${s.displayName}" geri alındı.`), await Promise.all([W(), ce(), X()]);
    } catch (l) {
      ae(l) || B("error", "Belge geri alınamadı."), console.error("[Documents] restore", l);
    }
  }, ys = (s) => {
    var l;
    if (!P) {
      B("warn", "Yükleme klasör bağlamında yapılır — soldan bir klasör seçin.");
      return;
    }
    $e.current = s, (l = Be.current) == null || l.click();
  }, Oe = () => {
    const s = new window.abp.ModalManager(he() + "Documents/CreateModal");
    s.open({ parentDocumentId: P || void 0 }), s.onResult(() => {
      X(), H("Klasör oluşturuldu.");
    });
  }, xs = () => {
    qe.current = !1, X();
  }, va = (s) => ea((l) => {
    const x = new Set(l);
    return x.has(s) ? x.delete(s) : x.add(s), x;
  }), fs = (s) => {
    var l;
    D(!1), h(s), ve(0), se(/* @__PURE__ */ new Set()), (l = s.key) != null && l.startsWith("folder-") && va(s.key);
  }, hs = (s) => se((l) => {
    const x = new Set(l);
    return x.has(s) ? x.delete(s) : x.add(s), x;
  }), gs = () => se((s) => v.every((l) => s.has(l.id)) ? /* @__PURE__ */ new Set() : new Set(v.map((l) => l.id))), vs = (s, l) => {
    s !== "docs" && s !== "compliance" || (l.preventDefault(), ha(s === "docs" ? "files" : "compliance"));
  }, ka = () => {
    var s;
    return (s = Be.current) == null ? void 0 : s.click();
  }, ja = !p && !i && a.length === 0;
  let Ye = null;
  te && !G.trim() && c.kind !== "smart" && (ja ? Ye = oe ? /* @__PURE__ */ e.jsx(
    Ve,
    {
      primary: /* @__PURE__ */ e.jsx(E, { onClick: () => Pe({ ...oe, setupCompleted: !1 }), children: "Şemayı kur" }),
      link: { label: "veya boş klasörle başla", onClick: Oe }
    }
  ) : /* @__PURE__ */ e.jsx(Ve, { primary: /* @__PURE__ */ e.jsx(E, { onClick: Oe, children: "Yeni klasör" }) }) : P && (Ye = /* @__PURE__ */ e.jsx(
    Ve,
    {
      primary: /* @__PURE__ */ e.jsx(E, { leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }), onClick: ka, children: "Yükle" }),
      link: { label: "veya toplu yükleme ekranını aç", href: `${he()}Documents/Upload?documentId=${P}` }
    }
  )));
  const ks = ja ? "Klasör şemasını kurumun beklediği yapıya göre kurun; zorunlu belgeler ve meta alanları birlikte gelir." : P ? 'Dosyaları buraya sürükleyin ya da "Yükle" ile ekleyin.' : "Sol taraftan bir klasör seçin; yükleme klasör bağlamında yapılır.", ba = c.kind === "smart" && c.smart === "suggested", Na = ba && !!ua, He = R || ba && Xa, _e = Na ? ua : f, Sa = Ss(!He && !_e), js = Sa.retry(() => {
    ce(), Na ? ye() : W();
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
        !P || !((l = s.dataTransfer.files) != null && l.length) || (s.preventDefault(), Ue(s.dataTransfer.files));
      },
      children: [
        /* @__PURE__ */ e.jsx(
          Zs,
          {
            title: "Dokümanlar",
            description: "Klasörler, belgeler ve meta veri",
            primary: te && /* @__PURE__ */ e.jsx(
              E,
              {
                variant: "primary",
                isLoading: Te,
                disabled: !P,
                title: P ? void 0 : "Önce bir klasör seçin",
                leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
                onClick: ka,
                children: "Yükle"
              }
            ),
            menuItems: te ? [
              { key: "folder", label: "Yeni klasör", icon: "fa-folder-plus", onSelect: Oe },
              {
                key: "bulk",
                label: "Toplu yükleme",
                icon: "fa-layer-group",
                href: `${he()}Documents/Upload${P ? `?documentId=${P}` : ""}`
              },
              {
                key: "capture",
                label: "Belge yakala",
                icon: "fa-camera",
                // Telefonda sağ alttaki sabit düğme bu işi görüyor; menüde tekrar etmesin.
                className: "is-desktop-only",
                disabled: !P || Te,
                hint: P ? null : "Önce bir klasör seçin",
                onSelect: () => {
                  var s;
                  return (s = Fe.current) == null ? void 0 : s.click();
                }
              }
            ] : []
          }
        ),
        /* @__PURE__ */ e.jsx(
          Xs,
          {
            active: U === "compliance" ? "compliance" : "docs",
            projectId: J,
            compliance: ne,
            onSelect: vs
          }
        ),
        te && /* @__PURE__ */ e.jsx(Ze, { children: /* @__PURE__ */ e.jsx(
          E,
          {
            variant: "secondary",
            className: "apya-doc-capture-btn",
            isLoading: Te,
            disabled: !P,
            title: P ? void 0 : "Önce bir klasör seçin",
            leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-camera" }),
            onClick: () => {
              var s;
              return (s = Fe.current) == null ? void 0 : s.click();
            },
            children: "Belge yakala"
          }
        ) }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: Be,
            type: "file",
            multiple: !0,
            hidden: !0,
            onChange: (s) => {
              Ue(s.target.files), s.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: Fe,
            type: "file",
            accept: "image/*",
            capture: "environment",
            hidden: !0,
            onChange: (s) => {
              Ue(s.target.files), s.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ e.jsx(
          Ot,
          {
            uploadedThisMonth: z,
            expiring: b,
            compliance: ((wa = ne.overview) == null ? void 0 : wa.summary) ?? null,
            hasProject: !!J,
            complianceFailed: ne.failed
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
            className: F("apya-doc-tab", U === s.key && "is-active"),
            onClick: () => ha(s.key),
            children: s.label
          },
          s.key
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: F("apya-docs-shell", U !== "files" && "is-wide"), children: [
          /* @__PURE__ */ e.jsx(
            mt,
            {
              loading: p,
              error: i,
              onRetry: xs,
              tree: we,
              activeKey: c.key,
              expanded: qa,
              onToggle: va,
              onSelect: fs,
              onDropFiles: ds,
              dragTarget: Qa,
              setDragTarget: Za
            }
          ),
          U === "compliance" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(
            Tt,
            {
              projectId: J,
              periodCode: null,
              onSummaryChange: ls,
              documentTypes: o
            }
          ) }) : U === "activity" ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: /* @__PURE__ */ e.jsx(Pt, { projectId: J, documentFileId: null }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            ya && /* @__PURE__ */ e.jsx(
              Lt,
              {
                summary: Z,
                busy: es,
                onApplyAll: () => We(
                  Ia,
                  ((Z == null ? void 0 : Z.items) ?? []).map(Ke),
                  "Öneriler uygulandı."
                ),
                onApply: (s) => We(
                  Ia,
                  [Ke(s)],
                  "Öneri uygulandı."
                ),
                onDismiss: (s) => We(
                  et,
                  [Ke(s)],
                  "Öneri yoksayıldı."
                ),
                onReload: ye
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "apya-grid-toolbar", style: { padding: "12px 14px", borderBottom: "1px solid var(--apya-border-subtle)" }, children: [
              /* @__PURE__ */ e.jsx(
                Y,
                {
                  size: "sm",
                  className: "apya-grid-search",
                  leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
                  placeholder: "Bu bağlamda filtrele",
                  value: me,
                  onChange: (s) => Ua(s.target.value)
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-grid-count apya-numeric", children: [
                He || _e ? "—" : k,
                " belge"
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-viewtoggle", children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: F(ie === "list" && "is-active"),
                    onClick: () => aa("list"),
                    "aria-label": "Liste görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: F(ie === "grid" && "is-active"),
                    onClick: () => aa("grid"),
                    "aria-label": "Kart görünümü",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-border-all" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("div", { ref: Sa.contentRef, tabIndex: -1, children: /* @__PURE__ */ e.jsx(
              gt,
              {
                loading: He,
                loadError: _e,
                onRetry: js,
                files: v,
                totalCount: k,
                view: ie,
                sorting: le,
                onSort: (s) => {
                  Oa(s), ve(0);
                },
                selectedId: Ie,
                onSelect: rs,
                checkedIds: Q,
                onToggleCheck: hs,
                onToggleAll: gs,
                page: re,
                pageSize: Qe,
                onPageChange: ve,
                onDragStart: cs,
                emptyHint: ks,
                emptyAction: Ye,
                missingItems: ns,
                onUploadMissing: ys,
                canUpload: te,
                isTrash: Wa,
                onRestore: ps
              }
            ) }),
            as && /* @__PURE__ */ e.jsx(
              vt,
              {
                count: Q.size,
                onClear: () => se(/* @__PURE__ */ new Set()),
                onMove: us,
                onTag: ms
              }
            )
          ] }),
          U === "files" && /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx(
            St,
            {
              detail: _a,
              loading: Ga,
              canEdit: ya,
              documentTypes: o,
              saving: ta,
              onSave: ga,
              onDelete: ss ? Re : () => {
              },
              onDraftChange: Ja
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsx(
          Is,
          {
            open: O.pendingClose,
            isSaving: ta,
            description: ze("Documents:Detail:Unsaved:Body", "Bu belgede yaptığınız değişiklikler kaydedilmedi. Devam ederseniz kaybolur."),
            saveLabel: ze("Common:Unsaved:SaveAndContinue", "Kaydet ve devam et"),
            errorText: Va ? ze("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
            onStay: () => O.resolvePendingClose("stay"),
            onDiscard: () => O.resolvePendingClose("discard"),
            onSave: async () => {
              je(!1), await ga(la.current) ? O.resolvePendingClose("saved") : je(!0);
            }
          }
        ),
        pe && /* @__PURE__ */ e.jsx(
          Ut,
          {
            title: "Belge silinecek",
            message: `"${pe.displayName}" ve tüm versiyonları çöp kutusuna taşınacak. Sol alttaki "Çöp kutusu"ndan geri alabilirsiniz.`,
            onConfirm: os,
            onCancel: () => Re(null)
          }
        ),
        oe && !oe.setupCompleted && /* @__PURE__ */ e.jsx(
          Kt,
          {
            state: oe,
            onDone: async () => {
              Pe({ ...oe, setupCompleted: !0 }), await Promise.all([X(), W()]);
            }
          }
        ),
        ia && /* @__PURE__ */ e.jsx(qt, { message: ia, onDone: () => ra(null) })
      ]
    }
  );
}
const $a = document.getElementById("documents-island");
$a && ws($a, "documents", /* @__PURE__ */ e.jsx(Yt, {}));
