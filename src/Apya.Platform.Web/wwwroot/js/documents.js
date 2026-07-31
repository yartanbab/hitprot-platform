import { b as je, j as e, r as l } from "./react-vendor.js";
/* empty css      */
import { B as k, I as ve, S as ge, j as ae, e as L, k as Ne } from "./Sheet.js";
import { b as T, E as ie } from "./EmptyState.js";
import { H as se } from "./Hint.js";
const b = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toFixed(1) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
}, G = (...a) => a.filter(Boolean).join(" "), be = {
  1: { text: "Yüklendi", icon: "fa-upload", variant: "brand" },
  2: { text: "İndirildi", icon: "fa-download", variant: "positive" },
  3: { text: "Silindi", icon: "fa-trash", variant: "negative" }
}, te = () => {
  var a, r, t;
  return (t = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.documents) == null ? void 0 : t.document;
}, ne = (a) => {
  var r, t;
  return (t = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.auth) == null ? void 0 : t.isGranted(a);
}, O = (a, r) => {
  var t, i, m;
  return (m = (i = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.notify) == null ? void 0 : i[a]) == null ? void 0 : m.call(i, r);
}, D = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function M(a) {
  return new Promise((r, t) => {
    window.abp.ajax(a).done(r).fail(t);
  });
}
const oe = (a, r = !1) => M({ url: `${D()}Documents?handler=Attachments&documentId=${a}&includeHistory=${r}`, type: "GET" }), ke = (a) => M({ url: `${D()}Documents?handler=AccessLog&documentId=${a}`, type: "GET" }), we = (a, r) => {
  const t = new FormData();
  return t.append("documentId", a), t.append("file", r), M({
    url: `${D()}Documents?handler=UploadFile`,
    type: "POST",
    data: t,
    contentType: !1,
    processData: !1
  });
}, De = (a) => M({ url: `${D()}Documents?handler=DeleteAttachment&attachmentId=${a}`, type: "POST" });
function ce(a, r) {
  var i;
  const t = ((i = (r || "").split(".").pop()) == null ? void 0 : i.toLowerCase()) || "";
  return a != null && a.includes("pdf") || t === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(t) ? { icon: "fa-file-excel", color: "#10B981" } : a != null && a.includes("word") || ["docx", "doc"].includes(t) ? { icon: "fa-file-word", color: "#3B82F6" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(t) ? { icon: "fa-file-powerpoint", color: "#F59E0B" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif"].includes(t) ? { icon: "fa-file-image", color: "#8B5CF6" } : ["zip", "rar"].includes(t) ? { icon: "fa-file-zipper", color: "#6B7280" } : { icon: "fa-file", color: "#6B7280" };
}
function Se() {
  const [a, r] = l.useState(() => window.matchMedia("(min-width: 992px)").matches);
  return l.useEffect(() => {
    const t = window.matchMedia("(min-width: 992px)"), i = (m) => r(m.matches);
    return t.addEventListener("change", i), () => t.removeEventListener("change", i);
  }, []), a;
}
function Ce({ message: a, onDone: r }) {
  return l.useEffect(() => {
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
function Ie({ title: a, message: r, confirmLabel: t = "Evet, Sil", onConfirm: i, onCancel: m }) {
  const [x, p] = l.useState(!1), j = async () => {
    p(!0), await i(), p(!1);
  };
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "apya-in fixed inset-0 z-[90] flex items-center justify-center p-5",
      style: { background: "var(--apya-surface-overlay)" },
      onClick: m,
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
              /* @__PURE__ */ e.jsx(k, { variant: "outline", size: "sm", onClick: m, children: "Vazgeç" }),
              /* @__PURE__ */ e.jsx(k, { variant: "destructive", size: "sm", isLoading: x, onClick: j, children: t })
            ] })
          ]
        }
      )
    }
  );
}
function de({ node: a, depth: r, activeId: t, expanded: i, onToggle: m, onSelect: x }) {
  const p = a.children && a.children.length > 0, j = i.has(a.id);
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => x(a.id),
        className: G("apya-md-item", t === a.id && "selected"),
        style: { paddingLeft: 10 + r * 16, borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              role: "button",
              tabIndex: -1,
              onClick: (c) => {
                c.stopPropagation(), p && m(a.id);
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
    p && j && /* @__PURE__ */ e.jsx("div", { children: a.children.map((c) => /* @__PURE__ */ e.jsx(de, { node: c, depth: r + 1, activeId: t, expanded: i, onToggle: m, onSelect: x }, c.id)) })
  ] });
}
function ze({ item: a, selected: r, onClick: t }) {
  const i = a.kind === "file", m = i ? ce(a.contentType, a.fileName) : null, x = i ? null : me(a.expiryDate);
  return /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: t, className: "apya-tile", style: { textAlign: "left", cursor: "pointer", ...r ? { borderColor: "var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {} }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-head", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-tile-icon-box", style: i ? { background: `${m.color}1a`, color: m.color } : void 0, children: i ? /* @__PURE__ */ e.jsx("i", { className: `fa ${m.icon}` }) : /* @__PURE__ */ e.jsx("span", { children: a.icon || (a.hasChildren ? "📁" : "📄") }) }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-tile-title", children: i ? a.fileName : a.title }),
          /* @__PURE__ */ e.jsx("div", { className: "apya-tile-sub", children: i ? b.size(a.fileSize) : a.hasChildren ? "Klasör" : "Sayfa" })
        ] })
      ] }),
      i && a.versionNumber > 1 && /* @__PURE__ */ e.jsxs(L, { variant: "brand", size: "sm", children: [
        "v",
        a.versionNumber
      ] })
    ] }),
    x && /* @__PURE__ */ e.jsx("div", { className: "apya-tile-foot", style: { borderTop: "none", paddingTop: 0 }, children: /* @__PURE__ */ e.jsxs("span", { className: "apya-chip apya-chip-warning apya-tile-days-chip", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
      x
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", children: [
      /* @__PURE__ */ e.jsx("span", { title: "Yükleyen", children: i ? a.uploaderName || "Sistem" : "—" }),
      /* @__PURE__ */ e.jsx("span", { children: b.date(a.creationTime) })
    ] })
  ] });
}
function me(a) {
  const r = b.daysLeft(a);
  return r === null || r < 0 ? null : r === 0 ? "Bugün son gün" : `${r} gün kaldı`;
}
function re({ item: a, onEdit: r, onDelete: t, onOpen: i, canViewLog: m }) {
  var N;
  const [x, p] = l.useState(null), [j, c] = l.useState(!1), [S, I] = l.useState(null), [Y, z] = l.useState(!1), u = (a == null ? void 0 : a.kind) === "file";
  if (l.useEffect(() => {
    p(null), I(null), !(!a || !u) && (c(!0), oe(a.documentId, !0).then((f) => p((f ?? []).filter((g) => g.versionGroupId === a.versionGroupId))).catch(() => p([])).finally(() => c(!1)), m && (z(!0), ke(a.documentId).then((f) => I((f ?? []).filter((g) => g.attachmentId === a.id))).catch(() => I([])).finally(() => z(!1))));
  }, [a == null ? void 0 : a.id, u, m]), !a)
    return /* @__PURE__ */ e.jsx(
      ie,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir dosya veya belge seçin",
        description: "Detayları, versiyon geçmişini ve etkinlik kaydını burada görürsünüz."
      }
    );
  const h = u ? ce(a.contentType, a.fileName) : null, v = u ? null : me(a.expiryDate);
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
      /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0",
          style: { background: u ? `${h.color}1a` : "var(--apya-accent-soft)", color: u ? h.color : "var(--apya-accent-500)" },
          children: u ? /* @__PURE__ */ e.jsx("i", { className: `fa ${h.icon}` }) : /* @__PURE__ */ e.jsx("span", { children: a.icon || "📄" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("div", { className: "text-sm font-semibold text-[var(--apya-text-primary)] break-words", children: u ? a.fileName : a.title }),
        a.projectName && /* @__PURE__ */ e.jsxs("div", { className: "text-[11px] mt-0.5", style: { color: "var(--apya-text-tertiary)" }, children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project me-1" }),
          a.projectName
        ] }),
        v && /* @__PURE__ */ e.jsxs(L, { variant: "warning", size: "sm", className: "mt-1.5", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-hourglass-half" }),
          " ",
          v
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "row g-3 mb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Tür" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-xs fw-semibold", children: u ? ((N = a.fileName.split(".").pop()) == null ? void 0 : N.toUpperCase()) || "—" : a.hasChildren ? "Klasör" : "Sayfa" })
      ] }),
      u && /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Boyut" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-xs fw-semibold", children: b.size(a.fileSize) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Yükleyen" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-xs fw-semibold", children: u ? a.uploaderName || "Sistem" : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Tarih" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-xs fw-semibold", children: b.date(a.creationTime) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2 mb-4", children: [
      u ? /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: Ne({ variant: "primary" }), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(k, { variant: "primary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-open" }), onClick: () => i(a), children: "Aç" }),
        /* @__PURE__ */ e.jsx(k, { variant: "secondary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-pencil" }), onClick: () => r(a), children: "Düzenle" })
      ] }),
      /* @__PURE__ */ e.jsx(k, { variant: "outline", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash text-[var(--apya-negative-500)]" }), onClick: () => t(a), children: "Sil" })
    ] }),
    u && /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Versiyon Geçmişi",
        /* @__PURE__ */ e.jsx(se, { text: "Versiyon dosya ADINA göre izlenir: aynı belgeye aynı isimli bir dosyayı yeniden yüklerseniz yeni versiyon olur ve öncekiler geçmişte kalır. Farklı isimle yüklerseniz ayrı bir dosya olarak eklenir." })
      ] }),
      j ? /* @__PURE__ */ e.jsx(T, { rows: 2 }) : !x || x.length <= 1 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11.5px]", style: { color: "var(--apya-text-tertiary)" }, children: "Bu dosyanın başka versiyonu yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1.5", children: x.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
        /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs(L, { variant: f.isLatest ? "brand" : "neutral", size: "sm", children: [
            "v",
            f.versionNumber
          ] }),
          /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-text-secondary)" }, children: f.uploaderName || "Sistem" })
        ] }),
        /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-text-tertiary)" }, children: b.date(f.creationTime) })
      ] }, f.id)) })
    ] }),
    u && m && /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2 d-flex align-items-center", children: [
        "Aktivite",
        /* @__PURE__ */ e.jsx(se, { text: "Bu dosyaya kimin ne zaman dokunduğunun kaydı: yükleme, indirme ve silme işlemleri tutulur. Salt görüntüleme kaydedilmez." })
      ] }),
      Y ? /* @__PURE__ */ e.jsx(T, { rows: 3 }) : !S || S.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11.5px]", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz kayıtlı bir etkinlik yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1.5", children: S.map((f) => {
        const g = be[f.action] || { text: "—", variant: "neutral" };
        return /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", style: { fontSize: 11.5 }, children: [
          /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(L, { variant: g.variant, size: "sm", withDot: !0, children: g.text }),
            /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-text-secondary)" }, children: f.actorName })
          ] }),
          /* @__PURE__ */ e.jsx("span", { style: { color: "var(--apya-text-tertiary)" }, children: b.dateTime(f.creationTime) })
        ] }, f.id);
      }) })
    ] })
  ] });
}
function Be() {
  const [a, r] = l.useState([]), [t, i] = l.useState([]), [m, x] = l.useState(!0), [p, j] = l.useState(!1), [c, S] = l.useState(null), [I, Y] = l.useState(null), [z, u] = l.useState(/* @__PURE__ */ new Set(["__projects__"])), [h, v] = l.useState(null), [N, f] = l.useState(""), [g, $] = l.useState(!1), [ue, V] = l.useState(!1), [y, B] = l.useState(null), [H, U] = l.useState(null), W = l.useRef(null), fe = Se(), A = l.useCallback((s) => U(s), []), K = ne("Platform.Documents.ViewAccessLog"), C = l.useCallback(async () => {
    x(!0);
    try {
      const s = await te().getList({ maxResultCount: 1e3, sorting: "title asc" });
      r(s.items ?? []);
    } catch (s) {
      O("error", "Belge listesi yüklenemedi."), console.error("[DocumentsIsland] loadTree error", s);
    } finally {
      x(!1);
    }
  }, []), q = l.useCallback(async (s) => {
    if (!s) {
      i([]);
      return;
    }
    j(!0);
    try {
      const n = await oe(s, !1);
      i(n ?? []);
    } catch (n) {
      console.error("[DocumentsIsland] loadAttachments error", n);
    } finally {
      j(!1);
    }
  }, []);
  l.useEffect(() => {
    C();
  }, [C]), l.useEffect(() => {
    v((s) => {
      if (!s || s.kind !== "document") return s;
      const n = a.find((o) => o.id === s.id);
      return n ? { ...n, kind: "document", hasChildren: a.some((o) => o.parentDocumentId === n.id) } : s;
    });
  }, [a]), l.useEffect(() => {
    q(c), v(null);
  }, [c, q]);
  const F = l.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    a.forEach((o) => {
      const d = o.parentDocumentId || "root";
      s.has(d) || s.set(d, []), s.get(d).push(o);
    });
    const n = (o) => (s.get(o) || []).map((d) => ({ ...d, children: n(d.id) }));
    return n("root");
  }, [a]), _ = l.useMemo(() => {
    const s = a.filter((o) => o.projectId);
    if (s.length === 0) return null;
    const n = /* @__PURE__ */ new Map();
    return s.forEach((o) => {
      const d = o.projectId;
      n.has(d) || n.set(d, { id: `project-${d}`, title: o.projectName || "Adsız Proje", icon: "🏗️", projectId: d, children: [], count: 0 });
      const E = n.get(d);
      E.count += 1, E.children.push({ ...o, children: a.filter((R) => R.parentDocumentId === o.id).map((R) => ({ ...R, children: [] })) });
    }), { id: "__projects__", title: "Projeler", icon: "📁", count: s.length, children: Array.from(n.values()) };
  }, [a]), J = l.useMemo(() => _ ? [_, ...F] : F, [_, F]), xe = l.useMemo(() => {
    const s = [];
    let n = c;
    const o = new Map(a.map((d) => [d.id, d]));
    for (; n; ) {
      const d = o.get(n);
      if (!d) break;
      s.unshift(d), n = d.parentDocumentId;
    }
    return s;
  }, [c, a]), Q = l.useMemo(
    () => a.filter((s) => (s.parentDocumentId || null) === c).map((s) => ({ ...s, kind: "document", hasChildren: a.some((n) => n.parentDocumentId === s.id) })),
    [a, c]
  ), P = l.useMemo(() => {
    const s = [...Q, ...t.map((o) => ({ ...o, kind: "file" }))];
    if (!N.trim()) return s;
    const n = N.trim().toLowerCase();
    return s.filter((o) => (o.kind === "file" ? o.fileName : o.title).toLowerCase().includes(n));
  }, [Q, t, N]), X = (s) => u((n) => {
    const o = new Set(n);
    return o.has(s) ? o.delete(s) : o.add(s), o;
  }), w = (s) => {
    if (s === "__projects__" || String(s).startsWith("project-")) {
      X(s);
      return;
    }
    S(s), s && u((n) => new Set(n).add(s));
  }, Z = async (s) => {
    if (!(!c || !s || s.length === 0)) {
      V(!0);
      try {
        for (const n of Array.from(s)) {
          const o = await we(c, n);
          i((d) => [o, ...d.filter((E) => E.fileName !== o.fileName)]);
        }
        A("Dosya yüklendi.");
      } catch (n) {
        O("error", "Dosya yüklenemedi."), console.error("[DocumentsIsland] upload error", n);
      } finally {
        V(!1);
      }
    }
  }, pe = () => {
    const s = new window.abp.ModalManager(D() + "Documents/CreateModal");
    s.open({ parentDocumentId: c || void 0 }), s.onResult(() => {
      C(), A("Belge oluşturuldu.");
    });
  }, ee = (s) => {
    const n = new window.abp.ModalManager(D() + "Documents/EditModal");
    n.open({ id: s.id }), n.onResult(() => {
      C(), A("Belge güncellendi.");
    });
  }, he = async () => {
    if (y)
      try {
        y.kind === "file" ? (await De(y.id), i((s) => s.filter((n) => n.id !== y.id))) : (await te().delete(y.id), await C()), (h == null ? void 0 : h.id) === y.id && v(null), A("Silindi.");
      } catch (s) {
        O("error", "Silme işlemi başarısız oldu."), console.error("[DocumentsIsland] delete error", s);
      } finally {
        B(null);
      }
  }, ye = ne("Platform.Documents.Create");
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in px-7 py-7 max-w-[1560px] mx-auto",
      onDragOver: (s) => {
        c && (s.preventDefault(), $(!0));
      },
      onDragLeave: () => $(!1),
      onDrop: (s) => {
        s.preventDefault(), $(!1), c && Z(s.dataTransfer.files);
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-4 mb-5", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("h1", { className: "text-xl font-bold tracking-tight text-[var(--apya-text-primary)] m-0", children: "Dokümanlar" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-xs text-[var(--apya-text-tertiary)] m-0", children: "Klasörler ve dosya yönetimi" })
          ] }),
          ye && /* @__PURE__ */ e.jsx(k, { variant: "primary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }), onClick: pe, children: "Yeni Belge" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-shell", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => w(null),
                className: G("apya-md-item", c === null && "selected"),
                style: { borderRadius: 8, fontWeight: 700 },
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-tree", style: { fontSize: 12, color: "var(--apya-text-tertiary)" } }),
                  /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: "Tüm Dokümanlar" })
                ]
              }
            ),
            m ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(T, { rows: 5 }) }) : J.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-6 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör/belge yok." }) : J.map((s) => /* @__PURE__ */ e.jsx(de, { node: s, depth: 0, activeId: c, expanded: z, onToggle: X, onSelect: w }, s.id))
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2 px-4 py-3", style: { borderBottom: "1px solid var(--apya-border-subtle)" }, children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 text-xs min-w-0", style: { color: "var(--apya-text-tertiary)" }, children: [
                /* @__PURE__ */ e.jsx("span", { className: G("cursor-pointer", c === null && "fw-bold"), style: c === null ? { color: "var(--apya-text-primary)" } : void 0, onClick: () => w(null), children: "Tüm Dokümanlar" }),
                xe.map((s) => /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 min-w-0", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", style: { fontSize: 8 } }),
                  /* @__PURE__ */ e.jsx("span", { className: "cursor-pointer truncate", style: s.id === c ? { color: "var(--apya-text-primary)", fontWeight: 700 } : void 0, onClick: () => w(s.id), children: s.title })
                ] }, s.id))
              ] }),
              c && /* @__PURE__ */ e.jsx(k, { variant: "primary", size: "sm", isLoading: ue, leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }), onClick: () => {
                var s;
                return (s = W.current) == null ? void 0 : s.click();
              }, children: "Yükle" }),
              /* @__PURE__ */ e.jsx("input", { ref: W, type: "file", multiple: !0, hidden: !0, onChange: (s) => {
                Z(s.target.files), s.target.value = "";
              } })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "p-4 relative", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "apya-grid-toolbar", children: [
                /* @__PURE__ */ e.jsx(
                  ve,
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
                  P.length,
                  " öge"
                ] })
              ] }),
              g && /* @__PURE__ */ e.jsx(
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
              p ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid", children: Array.from({ length: 6 }).map((s, n) => /* @__PURE__ */ e.jsx(ge, { height: 120, rounded: "lg" }, n)) }) : P.length === 0 ? /* @__PURE__ */ e.jsx(
                ie,
                {
                  icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
                  title: "Burada henüz bir şey yok",
                  description: c ? 'Dosya sürükleyip bırakın ya da "Yükle" butonunu kullanın.' : '"Yeni Belge" ile ilk klasörünüzü oluşturun.'
                }
              ) : /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid", children: P.map((s) => /* @__PURE__ */ e.jsx(
                ze,
                {
                  item: s,
                  selected: (h == null ? void 0 : h.id) === s.id,
                  onClick: () => v(s)
                },
                `${s.kind}-${s.id}`
              )) })
            ] })
          ] }),
          fe ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(re, { item: h, onEdit: ee, onOpen: (s) => w(s.id), onDelete: B, canViewLog: K }) }) }) : /* @__PURE__ */ e.jsx(ae, { open: !!h, onOpenChange: (s) => {
            s || v(null);
          }, children: /* @__PURE__ */ e.jsx(ae.Content, { title: "Belge Detayı", children: /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", style: { overflowY: "auto" }, children: /* @__PURE__ */ e.jsx(re, { item: h, onEdit: ee, onOpen: (s) => {
            w(s.id), v(null);
          }, onDelete: B, canViewLog: K }) }) }) })
        ] }),
        y && /* @__PURE__ */ e.jsx(
          Ie,
          {
            title: y.kind === "file" ? "Dosya Silinecek" : "Belge Silinecek",
            message: `"${y.kind === "file" ? y.fileName : y.title}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
            onConfirm: he,
            onCancel: () => B(null)
          }
        ),
        H && /* @__PURE__ */ e.jsx(Ce, { message: H, onDone: () => U(null) })
      ]
    }
  );
}
const le = document.getElementById("documents-island");
le && je(le).render(/* @__PURE__ */ e.jsx(Be, {}));
