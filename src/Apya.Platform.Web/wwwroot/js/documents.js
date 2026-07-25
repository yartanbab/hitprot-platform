import { b as ye, j as e, r as n } from "./react-vendor.js";
/* empty css      */
import { B as k, I as je, S as ve, j as ae, e as L, k as ge } from "./Sheet.js";
import { b as T, E as ne } from "./EmptyState.js";
const b = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(a)) : "—",
  dateTime: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a)) : "—",
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toFixed(1) + " MB",
  daysLeft: (a) => a ? Math.ceil((new Date(a) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24)) : null
}, G = (...a) => a.filter(Boolean).join(" "), Ne = {
  1: { text: "Yüklendi", icon: "fa-upload", variant: "brand" },
  2: { text: "İndirildi", icon: "fa-download", variant: "positive" },
  3: { text: "Silindi", icon: "fa-trash", variant: "negative" }
}, se = () => {
  var a, l, t;
  return (t = (l = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : l.documents) == null ? void 0 : t.document;
}, te = (a) => {
  var l, t;
  return (t = (l = window == null ? void 0 : window.abp) == null ? void 0 : l.auth) == null ? void 0 : t.isGranted(a);
}, O = (a, l) => {
  var t, i, u;
  return (u = (i = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.notify) == null ? void 0 : i[a]) == null ? void 0 : u.call(i, l);
}, D = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function M(a) {
  return new Promise((l, t) => {
    window.abp.ajax(a).done(l).fail(t);
  });
}
const ie = (a, l = !1) => M({ url: `${D()}Documents?handler=Attachments&documentId=${a}&includeHistory=${l}`, type: "GET" }), be = (a) => M({ url: `${D()}Documents?handler=AccessLog&documentId=${a}`, type: "GET" }), ke = (a, l) => {
  const t = new FormData();
  return t.append("documentId", a), t.append("file", l), M({
    url: `${D()}Documents?handler=UploadFile`,
    type: "POST",
    data: t,
    contentType: !1,
    processData: !1
  });
}, we = (a) => M({ url: `${D()}Documents?handler=DeleteAttachment&attachmentId=${a}`, type: "POST" });
function oe(a, l) {
  var i;
  const t = ((i = (l || "").split(".").pop()) == null ? void 0 : i.toLowerCase()) || "";
  return a != null && a.includes("pdf") || t === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(t) ? { icon: "fa-file-excel", color: "#10B981" } : a != null && a.includes("word") || ["docx", "doc"].includes(t) ? { icon: "fa-file-word", color: "#3B82F6" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(t) ? { icon: "fa-file-powerpoint", color: "#F59E0B" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif"].includes(t) ? { icon: "fa-file-image", color: "#8B5CF6" } : ["zip", "rar"].includes(t) ? { icon: "fa-file-zipper", color: "#6B7280" } : { icon: "fa-file", color: "#6B7280" };
}
function De() {
  const [a, l] = n.useState(() => window.matchMedia("(min-width: 992px)").matches);
  return n.useEffect(() => {
    const t = window.matchMedia("(min-width: 992px)"), i = (u) => l(u.matches);
    return t.addEventListener("change", i), () => t.removeEventListener("change", i);
  }, []), a;
}
function Se({ message: a, onDone: l }) {
  return n.useEffect(() => {
    const t = setTimeout(l, 2800);
    return () => clearTimeout(t);
  }, [l]), /* @__PURE__ */ e.jsxs(
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
function Ce({ title: a, message: l, confirmLabel: t = "Evet, Sil", onConfirm: i, onCancel: u }) {
  const [x, p] = n.useState(!1), j = async () => {
    p(!0), await i(), p(!1);
  };
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "apya-in fixed inset-0 z-[90] flex items-center justify-center p-5",
      style: { background: "var(--apya-surface-overlay)" },
      onClick: u,
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
                /* @__PURE__ */ e.jsx("div", { className: "text-xs text-[var(--apya-text-tertiary)] mt-1", children: l })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 justify-end", children: [
              /* @__PURE__ */ e.jsx(k, { variant: "outline", size: "sm", onClick: u, children: "Vazgeç" }),
              /* @__PURE__ */ e.jsx(k, { variant: "destructive", size: "sm", isLoading: x, onClick: j, children: t })
            ] })
          ]
        }
      )
    }
  );
}
function ce({ node: a, depth: l, activeId: t, expanded: i, onToggle: u, onSelect: x }) {
  const p = a.children && a.children.length > 0, j = i.has(a.id);
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => x(a.id),
        className: G("apya-md-item", t === a.id && "selected"),
        style: { paddingLeft: 10 + l * 16, borderRadius: 8 },
        children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              role: "button",
              tabIndex: -1,
              onClick: (c) => {
                c.stopPropagation(), p && u(a.id);
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
    p && j && /* @__PURE__ */ e.jsx("div", { children: a.children.map((c) => /* @__PURE__ */ e.jsx(ce, { node: c, depth: l + 1, activeId: t, expanded: i, onToggle: u, onSelect: x }, c.id)) })
  ] });
}
function Ie({ item: a, selected: l, onClick: t }) {
  const i = a.kind === "file", u = i ? oe(a.contentType, a.fileName) : null, x = i ? null : de(a.expiryDate);
  return /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: t, className: "apya-tile", style: { textAlign: "left", cursor: "pointer", ...l ? { borderColor: "var(--apya-accent-500)", background: "var(--apya-accent-soft)" } : {} }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-head", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-tile-icon-box", style: i ? { background: `${u.color}1a`, color: u.color } : void 0, children: i ? /* @__PURE__ */ e.jsx("i", { className: `fa ${u.icon}` }) : /* @__PURE__ */ e.jsx("span", { children: a.icon || (a.hasChildren ? "📁" : "📄") }) }),
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
function de(a) {
  const l = b.daysLeft(a);
  return l === null || l < 0 ? null : l === 0 ? "Bugün son gün" : `${l} gün kaldı`;
}
function re({ item: a, onEdit: l, onDelete: t, onOpen: i, canViewLog: u }) {
  var N;
  const [x, p] = n.useState(null), [j, c] = n.useState(!1), [S, I] = n.useState(null), [Y, z] = n.useState(!1), m = (a == null ? void 0 : a.kind) === "file";
  if (n.useEffect(() => {
    p(null), I(null), !(!a || !m) && (c(!0), ie(a.documentId, !0).then((f) => p((f ?? []).filter((g) => g.versionGroupId === a.versionGroupId))).catch(() => p([])).finally(() => c(!1)), u && (z(!0), be(a.documentId).then((f) => I((f ?? []).filter((g) => g.attachmentId === a.id))).catch(() => I([])).finally(() => z(!1))));
  }, [a == null ? void 0 : a.id, m, u]), !a)
    return /* @__PURE__ */ e.jsx(
      ne,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines" }),
        title: "Bir dosya veya belge seçin",
        description: "Detayları, versiyon geçmişini ve etkinlik kaydını burada görürsünüz."
      }
    );
  const h = m ? oe(a.contentType, a.fileName) : null, v = m ? null : de(a.expiryDate);
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
      /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0",
          style: { background: m ? `${h.color}1a` : "var(--apya-accent-soft)", color: m ? h.color : "var(--apya-accent-500)" },
          children: m ? /* @__PURE__ */ e.jsx("i", { className: `fa ${h.icon}` }) : /* @__PURE__ */ e.jsx("span", { children: a.icon || "📄" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("div", { className: "text-sm font-semibold text-[var(--apya-text-primary)] break-words", children: m ? a.fileName : a.title }),
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
        /* @__PURE__ */ e.jsx("div", { className: "text-xs fw-semibold", children: m ? ((N = a.fileName.split(".").pop()) == null ? void 0 : N.toUpperCase()) || "—" : a.hasChildren ? "Klasör" : "Sayfa" })
      ] }),
      m && /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Boyut" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-xs fw-semibold", children: b.size(a.fileSize) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Yükleyen" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-xs fw-semibold", children: m ? a.uploaderName || "Sistem" : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "col-6", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Tarih" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-xs fw-semibold", children: b.date(a.creationTime) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2 mb-4", children: [
      m ? /* @__PURE__ */ e.jsxs("a", { href: a.downloadUrl, className: ge({ variant: "primary" }), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
        " İndir"
      ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(k, { variant: "primary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-open" }), onClick: () => i(a), children: "Aç" }),
        /* @__PURE__ */ e.jsx(k, { variant: "secondary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-pencil" }), onClick: () => l(a), children: "Düzenle" })
      ] }),
      /* @__PURE__ */ e.jsx(k, { variant: "outline", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash text-[var(--apya-negative-500)]" }), onClick: () => t(a), children: "Sil" })
    ] }),
    m && /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Versiyon Geçmişi" }),
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
    m && u && /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Aktivite" }),
      Y ? /* @__PURE__ */ e.jsx(T, { rows: 3 }) : !S || S.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11.5px]", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz kayıtlı bir etkinlik yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-1.5", children: S.map((f) => {
        const g = Ne[f.action] || { text: "—", variant: "neutral" };
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
function ze() {
  const [a, l] = n.useState([]), [t, i] = n.useState([]), [u, x] = n.useState(!0), [p, j] = n.useState(!1), [c, S] = n.useState(null), [I, Y] = n.useState(null), [z, m] = n.useState(/* @__PURE__ */ new Set(["__projects__"])), [h, v] = n.useState(null), [N, f] = n.useState(""), [g, $] = n.useState(!1), [ue, V] = n.useState(!1), [y, B] = n.useState(null), [U, W] = n.useState(null), K = n.useRef(null), me = De(), E = n.useCallback((s) => W(s), []), H = te("Platform.Documents.ViewAccessLog"), C = n.useCallback(async () => {
    x(!0);
    try {
      const s = await se().getList({ maxResultCount: 1e3, sorting: "title asc" });
      l(s.items ?? []);
    } catch (s) {
      O("error", "Belge listesi yüklenemedi."), console.error("[DocumentsIsland] loadTree error", s);
    } finally {
      x(!1);
    }
  }, []), q = n.useCallback(async (s) => {
    if (!s) {
      i([]);
      return;
    }
    j(!0);
    try {
      const r = await ie(s, !1);
      i(r ?? []);
    } catch (r) {
      console.error("[DocumentsIsland] loadAttachments error", r);
    } finally {
      j(!1);
    }
  }, []);
  n.useEffect(() => {
    C();
  }, [C]), n.useEffect(() => {
    v((s) => {
      if (!s || s.kind !== "document") return s;
      const r = a.find((o) => o.id === s.id);
      return r ? { ...r, kind: "document", hasChildren: a.some((o) => o.parentDocumentId === r.id) } : s;
    });
  }, [a]), n.useEffect(() => {
    q(c), v(null);
  }, [c, q]);
  const F = n.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    a.forEach((o) => {
      const d = o.parentDocumentId || "root";
      s.has(d) || s.set(d, []), s.get(d).push(o);
    });
    const r = (o) => (s.get(o) || []).map((d) => ({ ...d, children: r(d.id) }));
    return r("root");
  }, [a]), _ = n.useMemo(() => {
    const s = a.filter((o) => o.projectId);
    if (s.length === 0) return null;
    const r = /* @__PURE__ */ new Map();
    return s.forEach((o) => {
      const d = o.projectId;
      r.has(d) || r.set(d, { id: `project-${d}`, title: o.projectName || "Adsız Proje", icon: "🏗️", projectId: d, children: [], count: 0 });
      const A = r.get(d);
      A.count += 1, A.children.push({ ...o, children: a.filter((R) => R.parentDocumentId === o.id).map((R) => ({ ...R, children: [] })) });
    }), { id: "__projects__", title: "Projeler", icon: "📁", count: s.length, children: Array.from(r.values()) };
  }, [a]), J = n.useMemo(() => _ ? [_, ...F] : F, [_, F]), fe = n.useMemo(() => {
    const s = [];
    let r = c;
    const o = new Map(a.map((d) => [d.id, d]));
    for (; r; ) {
      const d = o.get(r);
      if (!d) break;
      s.unshift(d), r = d.parentDocumentId;
    }
    return s;
  }, [c, a]), Q = n.useMemo(
    () => a.filter((s) => (s.parentDocumentId || null) === c).map((s) => ({ ...s, kind: "document", hasChildren: a.some((r) => r.parentDocumentId === s.id) })),
    [a, c]
  ), P = n.useMemo(() => {
    const s = [...Q, ...t.map((o) => ({ ...o, kind: "file" }))];
    if (!N.trim()) return s;
    const r = N.trim().toLowerCase();
    return s.filter((o) => (o.kind === "file" ? o.fileName : o.title).toLowerCase().includes(r));
  }, [Q, t, N]), X = (s) => m((r) => {
    const o = new Set(r);
    return o.has(s) ? o.delete(s) : o.add(s), o;
  }), w = (s) => {
    if (s === "__projects__" || String(s).startsWith("project-")) {
      X(s);
      return;
    }
    S(s), s && m((r) => new Set(r).add(s));
  }, Z = async (s) => {
    if (!(!c || !s || s.length === 0)) {
      V(!0);
      try {
        for (const r of Array.from(s)) {
          const o = await ke(c, r);
          i((d) => [o, ...d.filter((A) => A.fileName !== o.fileName)]);
        }
        E("Dosya yüklendi.");
      } catch (r) {
        O("error", "Dosya yüklenemedi."), console.error("[DocumentsIsland] upload error", r);
      } finally {
        V(!1);
      }
    }
  }, xe = () => {
    const s = new window.abp.ModalManager(D() + "Documents/CreateModal");
    s.open({ parentDocumentId: c || void 0 }), s.onResult(() => {
      C(), E("Belge oluşturuldu.");
    });
  }, ee = (s) => {
    const r = new window.abp.ModalManager(D() + "Documents/EditModal");
    r.open({ id: s.id }), r.onResult(() => {
      C(), E("Belge güncellendi.");
    });
  }, pe = async () => {
    if (y)
      try {
        y.kind === "file" ? (await we(y.id), i((s) => s.filter((r) => r.id !== y.id))) : (await se().delete(y.id), await C()), (h == null ? void 0 : h.id) === y.id && v(null), E("Silindi.");
      } catch (s) {
        O("error", "Silme işlemi başarısız oldu."), console.error("[DocumentsIsland] delete error", s);
      } finally {
        B(null);
      }
  }, he = te("Platform.Documents.Create");
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
          he && /* @__PURE__ */ e.jsx(k, { variant: "primary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }), onClick: xe, children: "Yeni Belge" })
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
            u ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(T, { rows: 5 }) }) : J.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-6 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz klasör/belge yok." }) : J.map((s) => /* @__PURE__ */ e.jsx(ce, { node: s, depth: 0, activeId: c, expanded: z, onToggle: X, onSelect: w }, s.id))
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-main", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2 px-4 py-3", style: { borderBottom: "1px solid var(--apya-border-subtle)" }, children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 text-xs min-w-0", style: { color: "var(--apya-text-tertiary)" }, children: [
                /* @__PURE__ */ e.jsx("span", { className: G("cursor-pointer", c === null && "fw-bold"), style: c === null ? { color: "var(--apya-text-primary)" } : void 0, onClick: () => w(null), children: "Tüm Dokümanlar" }),
                fe.map((s) => /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 min-w-0", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", style: { fontSize: 8 } }),
                  /* @__PURE__ */ e.jsx("span", { className: "cursor-pointer truncate", style: s.id === c ? { color: "var(--apya-text-primary)", fontWeight: 700 } : void 0, onClick: () => w(s.id), children: s.title })
                ] }, s.id))
              ] }),
              c && /* @__PURE__ */ e.jsx(k, { variant: "primary", size: "sm", isLoading: ue, leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }), onClick: () => {
                var s;
                return (s = K.current) == null ? void 0 : s.click();
              }, children: "Yükle" }),
              /* @__PURE__ */ e.jsx("input", { ref: K, type: "file", multiple: !0, hidden: !0, onChange: (s) => {
                Z(s.target.files), s.target.value = "";
              } })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "p-4 relative", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "apya-grid-toolbar", children: [
                /* @__PURE__ */ e.jsx(
                  je,
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
              p ? /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid", children: Array.from({ length: 6 }).map((s, r) => /* @__PURE__ */ e.jsx(ve, { height: 120, rounded: "lg" }, r)) }) : P.length === 0 ? /* @__PURE__ */ e.jsx(
                ne,
                {
                  icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox" }),
                  title: "Burada henüz bir şey yok",
                  description: c ? 'Dosya sürükleyip bırakın ya da "Yükle" butonunu kullanın.' : '"Yeni Belge" ile ilk klasörünüzü oluşturun.'
                }
              ) : /* @__PURE__ */ e.jsx("div", { className: "apya-tile-grid", children: P.map((s) => /* @__PURE__ */ e.jsx(
                Ie,
                {
                  item: s,
                  selected: (h == null ? void 0 : h.id) === s.id,
                  onClick: () => v(s)
                },
                `${s.kind}-${s.id}`
              )) })
            ] })
          ] }),
          me ? /* @__PURE__ */ e.jsx("div", { className: "apya-docs-detail", children: /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", children: /* @__PURE__ */ e.jsx(re, { item: h, onEdit: ee, onOpen: (s) => w(s.id), onDelete: B, canViewLog: H }) }) }) : /* @__PURE__ */ e.jsx(ae, { open: !!h, onOpenChange: (s) => {
            s || v(null);
          }, children: /* @__PURE__ */ e.jsx(ae.Content, { title: "Belge Detayı", children: /* @__PURE__ */ e.jsx("div", { className: "apya-md-detail", style: { overflowY: "auto" }, children: /* @__PURE__ */ e.jsx(re, { item: h, onEdit: ee, onOpen: (s) => {
            w(s.id), v(null);
          }, onDelete: B, canViewLog: H }) }) }) })
        ] }),
        y && /* @__PURE__ */ e.jsx(
          Ce,
          {
            title: y.kind === "file" ? "Dosya Silinecek" : "Belge Silinecek",
            message: `"${y.kind === "file" ? y.fileName : y.title}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
            onConfirm: pe,
            onCancel: () => B(null)
          }
        ),
        U && /* @__PURE__ */ e.jsx(Se, { message: U, onDone: () => W(null) })
      ]
    }
  );
}
const le = document.getElementById("documents-island");
le && ye(le).render(/* @__PURE__ */ e.jsx(ze, {}));
