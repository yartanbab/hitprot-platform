import { j as e, b as ge, r as n } from "./react-vendor.js";
/* empty css      */
import { S as I, c as ve, B as k, I as Ne, d as se, g as M, h as be } from "./Dialog.js";
import { E as oe } from "./EmptyState.js";
import { H as te } from "./Hint.js";
function G({ rows: a = 4, withLeading: r = !0, withTrailing: t = !0, className: i }) {
  return /* @__PURE__ */ e.jsx("ul", { className: ve("flex flex-col gap-2", i), "aria-busy": "true", children: Array.from({ length: a }).map((d, u) => /* @__PURE__ */ e.jsxs(
    "li",
    {
      className: "flex items-center gap-3 p-2 rounded-md border border-subtle bg-surface-base",
      children: [
        r && /* @__PURE__ */ e.jsx(I, { width: 32, height: 32, rounded: "md" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
          /* @__PURE__ */ e.jsx(I, { height: 12, className: u % 2 === 0 ? "w-3/4" : "w-2/3" }),
          /* @__PURE__ */ e.jsx(I, { height: 10, className: "w-1/2" })
        ] }),
        t && /* @__PURE__ */ e.jsx(I, { width: 64, height: 12, rounded: "sm" })
      ]
    },
    u
  )) });
}
const b = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toFixed(1) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
}, Y = (...a) => a.filter(Boolean).join(" "), ke = {
  1: { text: "Yüklendi", icon: "fa-upload", variant: "brand" },
  2: { text: "İndirildi", icon: "fa-download", variant: "positive" },
  3: { text: "Silindi", icon: "fa-trash", variant: "negative" }
}, re = () => {
  var a, r, t;
  return (t = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.documents) == null ? void 0 : t.document;
}, le = (a) => {
  var r, t;
  return (t = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.auth) == null ? void 0 : t.isGranted(a);
}, T = (a, r) => {
  var t, i, d;
  return (d = (i = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.notify) == null ? void 0 : i[a]) == null ? void 0 : d.call(i, r);
}, D = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function $(a) {
  return new Promise((r, t) => {
    window.abp.ajax(a).done(r).fail(t);
  });
}
const ce = (a, r = !1) => $({ url: `${D()}Documents?handler=Attachments&documentId=${a}&includeHistory=${r}`, type: "GET" }), we = (a) => $({ url: `${D()}Documents?handler=AccessLog&documentId=${a}`, type: "GET" }), De = (a, r) => {
  const t = new FormData();
  return t.append("documentId", a), t.append("file", r), $({
    url: `${D()}Documents?handler=UploadFile`,
    type: "POST",
    data: t,
    contentType: !1,
    processData: !1
  });
}, Se = (a) => $({ url: `${D()}Documents?handler=DeleteAttachment&attachmentId=${a}`, type: "POST" });
function de(a, r) {
  var i;
  const t = ((i = (r || "").split(".").pop()) == null ? void 0 : i.toLowerCase()) || "";
  return a != null && a.includes("pdf") || t === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(t) ? { icon: "fa-file-excel", color: "#10B981" } : a != null && a.includes("word") || ["docx", "doc"].includes(t) ? { icon: "fa-file-word", color: "#3B82F6" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(t) ? { icon: "fa-file-powerpoint", color: "#F59E0B" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif"].includes(t) ? { icon: "fa-file-image", color: "#8B5CF6" } : ["zip", "rar"].includes(t) ? { icon: "fa-file-zipper", color: "#6B7280" } : { icon: "fa-file", color: "#6B7280" };
}
function Ce() {
  const [a, r] = n.useState(() => window.matchMedia("(min-width: 992px)").matches);
  return n.useEffect(() => {
    const t = window.matchMedia("(min-width: 992px)"), i = (d) => r(d.matches);
    return t.addEventListener("change", i), () => t.removeEventListener("change", i);
  }, []), a;
}
function Ie({ message: a, onDone: r }) {
  return n.useEffect(() => {
    const t = setTimeout(r, 2800);
    return () => clearTimeout(t);
  }, [r]), /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-pop-in fixed bottom-5 right-5 z-[95] flex items-center gap-2.5 px-4 py-3 rounded-xl border",
      style: { background: "var(--apya-surface-elevated)", borderColor: "var(--apya-border-strong)", boxShadow: "var(--apya-shadow-lg)" },
      role: "status",
      children: [
        /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0",
            style: { background: "rgba(52,211,153,.15)", color: "var(--apya-positive-500)" },
            children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-check", style: { fontSize: 11 } })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: "text-xs text-[var(--apya-text-primary)]", children: a })
      ]
    }
  );
}
function ze({ title: a, message: r, confirmLabel: t = "Evet, Sil", onConfirm: i, onCancel: d }) {
  const [u, p] = n.useState(!1), j = async () => {
    p(!0), await i(), p(!1);
  };
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "apya-in fixed inset-0 z-[90] flex items-center justify-center p-5",
      style: { background: "var(--apya-surface-overlay)" },
      onClick: d,
      children: /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-pop-in w-full max-w-sm rounded-2xl border border-[var(--apya-border-strong)] p-6",
          style: { background: "var(--apya-surface-elevated)", boxShadow: "var(--apya-shadow-xl)" },
          onClick: (c) => c.stopPropagation(),
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
              /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                  style: { background: "rgba(248,113,113,.12)", color: "var(--apya-negative-500)" },
                  children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash", style: { fontSize: 16 }, "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-sm font-semibold text-[var(--apya-text-primary)]", children: a }),
                /* @__PURE__ */ e.jsx("div", { className: "text-xs text-[var(--apya-text-tertiary)] mt-1", children: r })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 justify-end", children: [
              /* @__PURE__ */ e.jsx(k, { variant: "outline", size: "sm", onClick: d, children: "Vazgeç" }),
              /* @__PURE__ */ e.jsx(k, { variant: "destructive", size: "sm", isLoading: u, onClick: j, children: t })
            ] })
          ]
        }
      )
    }
  );
}
function me({ node: a, depth: r, activeId: t, expanded: i, onToggle: d, onSelect: u }) {
  const p = a.children && a.children.length > 0, j = i.has(a.id);
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => u(a.id),
        className: Y("apya-md-item", t === a.id && "selected"),
        style: { paddingLeft: 10 + r * 16, borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              role: "button",
              tabIndex: -1,
              onClick: (c) => {
                c.stopPropagation(), p && d(a.id);
              },
              className: "w-4 h-4 flex items-center justify-center flex-shrink-0",
              style: { color: "var(--apya-text-tertiary)" },
              children: p && /* @__PURE__ */ e.jsx("i", { className: `fa fa-chevron-${j ? "down" : "right"}`, style: { fontSize: 9 } })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "flex-shrink-0", children: a.icon || (p ? "📁" : "📄") }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", style: { fontWeight: t === a.id ? 700 : 500 }, children: a.title }),
          typeof a.count == "number" && /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side text-[11px]", style: { color: "var(--apya-text-tertiary)" }, children: a.count })
        ]
      }
    ),
    p && j && /* @__PURE__ */ e.jsx("div", { children: a.children.map((c) => /* @__PURE__ */ e.jsx(me, { node: c, depth: r + 1, activeId: t, expanded: i, onToggle: d, onSelect: u }, c.id)) })
  ] });
}
function Be({ item: a, selected: r, onClick: t }) {
  const i = a.kind === "file", d = i ? de(a.contentType, a.fileName) : null, u = i ? null : ue(a.expiryDate);
  return /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: t, className: "apya-tile", style: { textAlign: "left", cursor: "pointer", ...r ? { borderColor: "var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {} }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-head", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-tile-icon-box", style: i ? { background: `${d.color}1a`, color: d.color } : void 0, children: i ? /* @__PURE__ */ e.jsx("i", { className: `fa ${d.icon}` }) : /* @__PURE__ */ e.jsx("span", { children: a.icon || (a.hasChildren ? "📁" : "📄") }) }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-tile-title", children: i ? a.fileName : a.title }),
          /* @__PURE__ */ e.jsx("div", { className: "apya-tile-sub", children: i ? b.size(a.fileSize) : a.hasChildren ? "Klasör" : "Sayfa" })
        ] })
      ] }),
      i && a.versionNumber > 1 && /* @__PURE__ */ e.jsxs(M, { variant: "brand", size: "sm", children: [
        "v",
        a.versionNumber
      ] })
    ] }),
    u && /* @__PURE__ */ e.jsx("div", { className: "apya-tile-foot", style: { borderTop: "none", paddingTop: 0 }, children: /* @__PURE__ */ e.jsxs("span", { className: "apya-chip apya-chip-warning apya-tile-days-chip", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
      u
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", children: [
      /* @__PURE__ */ e.jsx("span", { title: "Yükleyen", children: i ? a.uploaderName || "Sistem" : "—" }),
      /* @__PURE__ */ e.jsx("span", { children: b.date(a.creationTime) })
    ] })
  ] });
}
function ue(a) {
  const r = b.daysLeft(a);
  return r === null || r < 0 ? null : r === 0 ? "Bugün son gün" : `${r} gün kaldı`;
}
function ne({ item: a, onEdit: r, onDelete: t, onOpen: i, canViewLog: d }) {
  var N;
  const [u, p] = n.useState(null), [j, c] = n.useState(!1), [S, z] = n.useState(null), [V, B] = n.useState(!1), x = (a == null ? void 0 : a.kind) === "file";
  if (n.useEffect(() => {
    p(null), z(null), !(!a || !x) && (c(!0), ce(a.documentId, !0).then((f) => p((f ?? []).filter((v) => v.versionGroupId === a.versionGroupId))).catch(() => p([])).finally(() => c(!1)), d && (B(!0), we(a.documentId).then((f) => z((f ?? []).filter((v) => v.attachmentId === a.id))).catch(() => z([])).finally(() => B(!1))));
  }, [a == null ? void 0 : a.id, x, d]), !a)
    return /* @__PURE__ */ e.jsx(
      oe,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir dosya veya belge seçin",
        description: "Detayları, versiyon geçmişini ve etkinlik kaydını burada görürsünüz."
      }
    );
  const h = x ? de(a.contentType, a.fileName) : null, g = x ? null : ue(a.expiryDate);
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
      /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0",
          style: { background: x ? `${h.color}1a` : "var(--apya-accent-soft)", color: x ? h.color : "var(--apya-accent-500)" },
          children: x ? /* @__PURE__ */ e.jsx("i", { className: `fa ${h.icon}` }) : /* @__PURE__ */ e.jsx("span", { children: a.icon || "📄" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("div", { className: "text-sm font-semibold text-[var(--apya-text-primary)] break-words", children: x ? a.fileName : a.title }),
        a.projectName && /* @__PURE__ */ e.jsxs("div", { className: "text-[11px] mt-0.5", style: { color: "var(--apya-text-tertiary)" }, children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project me-1" }),
          a.projectName
        ] }),
        g && /* @__PURE__ */ e.jsxs(M, { variant: "warning", size: "sm", className: "mt-1.5", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
          " ",
          g
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "row g-3 mb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Tür" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-xs fw-semibold", children: x ? ((N = a.fileName.split(".").pop()) == null ? void 0 : N.toUpperCase()) || "—" : a.hasChildren ? "Klasör" : "Sayfa" })
      ] }),
      x && /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Boyut" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-xs fw-semibold", children: b.size(a.fileSize) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Yükleyen" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-xs fw-semibold", children: x ? a.uploaderName || "Sistem" : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Tarih" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-xs fw-semibold", children: b.date(a.creationTime) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2 mb-4", children: [
      x ? /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: be({ variant: "primary" }), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(k, { variant: "primary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-open" }), onClick: () => i(a), children: "Aç" }),
        /* @__PURE__ */ e.jsx(k, { variant: "secondary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-pencil" }), onClick: () => r(a), children: "Düzenle" })
      ] }),
      /* @__PURE__ */ e.jsx(k, { variant: "outline", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash text-[var(--apya-negative-500)]" }), onClick: () => t(a), children: "Sil" })
    ] }),
    x && /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Versiyon Geçmişi",
        /* @__PURE__ */ e.jsx(te, { text: "Versiyon dosya ADINA göre izlenir: aynı belgeye aynı isimli bir dosyayı yeniden yüklerseniz yeni versiyon olur ve öncekiler geçmişte kalır. Farklı isimle yüklerseniz ayrı bir dosya olarak eklenir." })
      ] }),
      j ? /* @__PURE__ */ e.jsx(G, { rows: 2 }) : !u || u.length <= 1 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11.5px]", style: { color: "var(--apya-text-tertiary)" }, children: "Bu dosyanın başka versiyonu yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1.5", children: u.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs(M, { variant: f.isLatest ? "brand" : "neutral", size: "sm", children: [
            "v",
            f.versionNumber
          ] }),
          /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-text-secondary)" }, children: f.uploaderName || "Sistem" })
        ] }),
        /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-text-tertiary)" }, children: b.date(f.creationTime) })
      ] }, f.id)) })
    ] }),
    x && d && /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Aktivite",
        /* @__PURE__ */ e.jsx(te, { text: "Bu dosyaya kimin ne zaman dokunduğunun kaydı: yükleme, indirme ve silme işlemleri tutulur. Salt görüntüleme kaydedilmez." })
      ] }),
      V ? /* @__PURE__ */ e.jsx(G, { rows: 3 }) : !S || S.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11.5px]", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz kayıtlı bir etkinlik yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1.5", children: S.map((f) => {
        const v = ke[f.action] || { text: "—", variant: "neutral" };
        return /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
          /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(M, { variant: v.variant, size: "sm", withDot: !0, children: v.text }),
            /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-text-secondary)" }, children: f.actorName })
          ] }),
          /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-text-tertiary)" }, children: b.dateTime(f.creationTime) })
        ] }, f.id);
      }) })
    ] })
  ] });
}
function Ae() {
  const [a, r] = n.useState([]), [t, i] = n.useState([]), [d, u] = n.useState(!0), [p, j] = n.useState(!1), [c, S] = n.useState(null), [z, V] = n.useState(null), [B, x] = n.useState(/* @__PURE__ */ new Set(["__projects__"])), [h, g] = n.useState(null), [N, f] = n.useState(""), [v, F] = n.useState(!1), [xe, H] = n.useState(!1), [y, A] = n.useState(null), [U, W] = n.useState(null), K = n.useRef(null), fe = Ce(), E = n.useCallback((s) => W(s), []), q = le("Platform.Documents.ViewAccessLog"), C = n.useCallback(async () => {
    u(!0);
    try {
      const s = await re().getList({ maxResultCount: 1e3, sorting: "title asc" });
      r(s.items ?? []);
    } catch (s) {
      T("error", "Belge listesi yüklenemedi."), console.error("[DocumentsIsland] loadTree error", s);
    } finally {
      u(!1);
    }
  }, []), J = n.useCallback(async (s) => {
    if (!s) {
      i([]);
      return;
    }
    j(!0);
    try {
      const l = await ce(s, !1);
      i(l ?? []);
    } catch (l) {
      console.error("[DocumentsIsland] loadAttachments error", l);
    } finally {
      j(!1);
    }
  }, []);
  n.useEffect(() => {
    C();
  }, [C]), n.useEffect(() => {
    g((s) => {
      if (!s || s.kind !== "document") return s;
      const l = a.find((o) => o.id === s.id);
      return l ? { ...l, kind: "document", hasChildren: a.some((o) => o.parentDocumentId === l.id) } : s;
    });
  }, [a]), n.useEffect(() => {
    J(c), g(null);
  }, [c, J]);
  const _ = n.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    a.forEach((o) => {
      const m = o.parentDocumentId || "root";
      s.has(m) || s.set(m, []), s.get(m).push(o);
    });
    const l = (o) => (s.get(o) || []).map((m) => ({ ...m, children: l(m.id) }));
    return l("root");
  }, [a]), P = n.useMemo(() => {
    const s = a.filter((o) => o.projectId);
    if (s.length === 0) return null;
    const l = /* @__PURE__ */ new Map();
    return s.forEach((o) => {
      const m = o.projectId;
      l.has(m) || l.set(m, { id: `project-${m}`, title: o.projectName || "Adsız Proje", icon: "🏗️", projectId: m, children: [], count: 0 });
      const L = l.get(m);
      L.count += 1, L.children.push({ ...o, children: a.filter((O) => O.parentDocumentId === o.id).map((O) => ({ ...O, children: [] })) });
    }), { id: "__projects__", title: "Projeler", icon: "📁", count: s.length, children: Array.from(l.values()) };
  }, [a]), Q = n.useMemo(() => P ? [P, ..._] : _, [P, _]), pe = n.useMemo(() => {
    const s = [];
    let l = c;
    const o = new Map(a.map((m) => [m.id, m]));
    for (; l; ) {
      const m = o.get(l);
      if (!m) break;
      s.unshift(m), l = m.parentDocumentId;
    }
    return s;
  }, [c, a]), X = n.useMemo(
    () => a.filter((s) => (s.parentDocumentId || null) === c).map((s) => ({ ...s, kind: "document", hasChildren: a.some((l) => l.parentDocumentId === s.id) })),
    [a, c]
  ), R = n.useMemo(() => {
    const s = [...X, ...t.map((o) => ({ ...o, kind: "file" }))];
    if (!N.trim()) return s;
    const l = N.trim().toLowerCase();
    return s.filter((o) => (o.kind === "file" ? o.fileName : o.title).toLowerCase().includes(l));
  }, [X, t, N]), Z = (s) => x((l) => {
    const o = new Set(l);
    return o.has(s) ? o.delete(s) : o.add(s), o;
  }), w = (s) => {
    if (s === "__projects__" || String(s).startsWith("project-")) {
      Z(s);
      return;
    }
    S(s), s && x((l) => new Set(l).add(s));
  }, ee = async (s) => {
    if (!(!c || !s || s.length === 0)) {
      H(!0);
      try {
        for (const l of Array.from(s)) {
          const o = await De(c, l);
          i((m) => [o, ...m.filter((L) => L.fileName !== o.fileName)]);
        }
        E("Dosya yüklendi.");
      } catch (l) {
        T("error", "Dosya yüklenemedi."), console.error("[DocumentsIsland] upload error", l);
      } finally {
        H(!1);
      }
    }
  }, he = () => {
    const s = new window.abp.ModalManager(D() + "Documents/CreateModal");
    s.open({ parentDocumentId: c || void 0 }), s.onResult(() => {
      C(), E("Belge oluşturuldu.");
    });
  }, ae = (s) => {
    const l = new window.abp.ModalManager(D() + "Documents/EditModal");
    l.open({ id: s.id }), l.onResult(() => {
      C(), E("Belge güncellendi.");
    });
  }, ye = async () => {
    if (y)
      try {
        y.kind === "file" ? (await Se(y.id), i((s) => s.filter((l) => l.id !== y.id))) : (await re().delete(y.id), await C()), (h == null ? void 0 : h.id) === y.id && g(null), E("Silindi.");
      } catch (s) {
        T("error", "Silme işlemi başarısız oldu."), console.error("[DocumentsIsland] delete error", s);
      } finally {
        A(null);
      }
  }, je = le("Platform.Documents.Create");
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 max-w-[1560px] mx-auto",
      onDragOver: (s) => {
        c && (s.preventDefault(), F(!0));
      },
      onDragLeave: () => F(!1),
      onDrop: (s) => {
        s.preventDefault(), F(!1), c && ee(s.dataTransfer.files);
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-4 mb-5", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("h1", { className: "text-xl font-bold tracking-tight text-[var(--apya-text-primary)] m-0", children: "Dokümanlar" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-xs text-[var(--apya-text-tertiary)] m-0", children: "Klasörler ve dosya yönetimi" })
          ] }),
          je && /* @__PURE__ */ e.jsx(k, { variant: "primary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }), onClick: he, children: "Yeni Belge" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-shell", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => w(null),
                className: Y("apya-md-item", c === null && "selected"),
                style: { borderRadius: 8, fontWeight: 700 },
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-tree", style: { fontSize: 12, color: "var(--apya-text-tertiary)" } }),
                  /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: "Tüm Dokümanlar" })
                ]
              }
            ),
            d ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(G, { rows: 5 }) }) : Q.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-6 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör/belge yok." }) : Q.map((s) => /* @__PURE__ */ e.jsx(me, { node: s, depth: 0, activeId: c, expanded: B, onToggle: Z, onSelect: w }, s.id))
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2 px-4 py-3", style: { borderBottom: "1px solid var(--apya-border-subtle)" }, children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 text-xs min-w-0", style: { color: "var(--apya-text-tertiary)" }, children: [
                /* @__PURE__ */ e.jsx("span", { className: Y("cursor-pointer", c === null && "fw-bold"), style: c === null ? { color: "var(--apya-text-primary)" } : void 0, onClick: () => w(null), children: "Tüm Dokümanlar" }),
                pe.map((s) => /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 min-w-0", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", style: { fontSize: 8 } }),
                  /* @__PURE__ */ e.jsx("span", { className: "cursor-pointer truncate", style: s.id === c ? { color: "var(--apya-text-primary)", fontWeight: 700 } : void 0, onClick: () => w(s.id), children: s.title })
                ] }, s.id))
              ] }),
              c && /* @__PURE__ */ e.jsx(k, { variant: "primary", size: "sm", isLoading: xe, leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }), onClick: () => {
                var s;
                return (s = K.current) == null ? void 0 : s.click();
              }, children: "Yükle" }),
              /* @__PURE__ */ e.jsx("input", { ref: K, type: "file", multiple: !0, hidden: !0, onChange: (s) => {
                ee(s.target.files), s.target.value = "";
              } })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "p-4 relative", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "apya-grid-toolbar", children: [
                /* @__PURE__ */ e.jsx(
                  Ne,
                  {
                    size: "sm",
                    className: "apya-grid-search",
                    leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
                    placeholder: "Ara veya klasör filtrele",
                    value: N,
                    onChange: (s) => f(s.target.value)
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "apya-grid-count", children: [
                  R.length,
                  " öge"
                ] })
              ] }),
              v && /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-2 z-10 rounded-xl border-2 border-dashed flex items-center justify-center text-sm font-semibold",
                  style: { borderColor: "var(--apya-accent-500)", background: "var(--apya-accent-soft)", color: "var(--apya-accent-500)" },
                  children: "Yüklemek için bırakın"
                }
              ),
              !c && /* @__PURE__ */ e.jsxs(
                "div",
                {
                  className: "mb-3 rounded-xl border border-dashed p-3 text-[11px] flex items-center gap-2",
                  style: { borderColor: "var(--apya-border-default)", color: "var(--apya-text-tertiary)" },
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-info" }),
                    " Dosya yükleyebilmek için önce bir klasör/belge açın."
                  ]
                }
              ),
              p ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid", children: Array.from({ length: 6 }).map((s, l) => /* @__PURE__ */ e.jsx(I, { height: 120, rounded: "lg" }, l)) }) : R.length === 0 ? /* @__PURE__ */ e.jsx(
                oe,
                {
                  icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
                  title: "Burada henüz bir şey yok",
                  description: c ? 'Dosya sürükleyip bırakın ya da "Yükle" butonunu kullanın.' : '"Yeni Belge" ile ilk klasörünüzü oluşturun.'
                }
              ) : /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid", children: R.map((s) => /* @__PURE__ */ e.jsx(
                Be,
                {
                  item: s,
                  selected: (h == null ? void 0 : h.id) === s.id,
                  onClick: () => g(s)
                },
                `${s.kind}-${s.id}`
              )) })
            ] })
          ] }),
          fe ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(ne, { item: h, onEdit: ae, onOpen: (s) => w(s.id), onDelete: A, canViewLog: q }) }) }) : /* @__PURE__ */ e.jsx(se, { open: !!h, onOpenChange: (s) => {
            s || g(null);
          }, children: /* @__PURE__ */ e.jsx(se.Content, { title: "Belge Detayı", children: /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", style: { overflowY: "auto" }, children: /* @__PURE__ */ e.jsx(ne, { item: h, onEdit: ae, onOpen: (s) => {
            w(s.id), g(null);
          }, onDelete: A, canViewLog: q }) }) }) })
        ] }),
        y && /* @__PURE__ */ e.jsx(
          ze,
          {
            title: y.kind === "file" ? "Dosya Silinecek" : "Belge Silinecek",
            message: `"${y.kind === "file" ? y.fileName : y.title}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
            onConfirm: ye,
            onCancel: () => A(null)
          }
        ),
        U && /* @__PURE__ */ e.jsx(Ie, { message: U, onDone: () => W(null) })
      ]
    }
  );
}
const ie = document.getElementById("documents-island");
ie && ge(ie).render(/* @__PURE__ */ e.jsx(Ae, {}));
