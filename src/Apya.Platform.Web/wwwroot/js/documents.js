import { c as ae, j as e, r as o } from "./vendor.js";
const w = {
  date: (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(a)) : "—",
  size: (a) => !a && a !== 0 ? "—" : a < 1024 ? a + " B" : a < 1024 * 1024 ? (a / 1024).toFixed(0) + " KB" : (a / (1024 * 1024)).toFixed(1) + " MB"
}, h = (...a) => a.filter(Boolean).join(" "), H = () => {
  var a, l, s;
  return (s = (l = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : l.documents) == null ? void 0 : s.document;
}, te = (a) => {
  var l, s;
  return (s = (l = window == null ? void 0 : window.abp) == null ? void 0 : l.auth) == null ? void 0 : s.isGranted(a);
}, S = (a, l) => {
  var s, n, c;
  return (c = (n = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.notify) == null ? void 0 : n[a]) == null ? void 0 : c.call(n, l);
}, g = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function z(a) {
  return new Promise((l, s) => {
    window.abp.ajax(a).done(l).fail(s);
  });
}
const se = (a) => z({ url: `${g()}Documents?handler=Attachments&documentId=${a}`, type: "GET" }), re = (a, l) => {
  const s = new FormData();
  return s.append("documentId", a), s.append("file", l), z({
    url: `${g()}Documents?handler=UploadFile`,
    type: "POST",
    data: s,
    contentType: !1,
    processData: !1
  });
}, le = (a) => z({ url: `${g()}Documents?handler=DeleteAttachment&attachmentId=${a}`, type: "POST" });
function G(a, l) {
  var n;
  const s = ((n = (l || "").split(".").pop()) == null ? void 0 : n.toLowerCase()) || "";
  return a != null && a.includes("pdf") || s === "pdf" ? { icon: "fa-file-pdf", color: "#EF4444" } : a != null && a.includes("sheet") || a != null && a.includes("excel") || ["xlsx", "xls", "csv"].includes(s) ? { icon: "fa-file-excel", color: "#10B981" } : a != null && a.includes("word") || ["docx", "doc"].includes(s) ? { icon: "fa-file-word", color: "#3B82F6" } : a != null && a.includes("presentation") || ["pptx", "ppt"].includes(s) ? { icon: "fa-file-powerpoint", color: "#F59E0B" } : a != null && a.startsWith("image/") || ["png", "jpg", "jpeg", "gif"].includes(s) ? { icon: "fa-file-image", color: "#8B5CF6" } : ["zip", "rar"].includes(s) ? { icon: "fa-file-zipper", color: "#6B7280" } : { icon: "fa-file", color: "#6B7280" };
}
function U({ w: a = "100%", h: l = 14, r: s = 6 }) {
  return /* @__PURE__ */ e.jsx("div", { "aria-hidden": "true", className: "apya-skeleton", style: { width: a, height: l, borderRadius: s, flexShrink: 0 } });
}
function ne({ message: a, onDone: l }) {
  return o.useEffect(() => {
    const s = setTimeout(l, 2800);
    return () => clearTimeout(s);
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
function ie({ title: a, message: l, confirmLabel: s = "Evet, Sil", onConfirm: n, onCancel: c }) {
  const [u, f] = o.useState(!1), m = async () => {
    f(!0), await n(), f(!1);
  };
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "apya-in fixed inset-0 z-[90] flex items-center justify-center p-5",
      style: { background: "var(--apya-surface-overlay)" },
      onClick: c,
      children: /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-pop-in w-full max-w-sm rounded-2xl border border-[var(--apya-border-strong)] p-6",
          style: { background: "var(--apya-surface-elevated)", boxShadow: "var(--apya-shadow-xl)" },
          onClick: (i) => i.stopPropagation(),
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
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: c,
                  className: "h-9 px-4 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors",
                  children: "Vazgeç"
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: m,
                  disabled: u,
                  className: "h-9 px-4 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50",
                  style: { background: "var(--apya-negative-500)" },
                  children: [
                    u ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-spinner fa-spin me-1" }) : null,
                    s
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function V({ node: a, depth: l, activeId: s, expanded: n, onToggle: c, onSelect: u }) {
  const f = a.children.length > 0, m = n.has(a.id);
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        onClick: () => u(a.id),
        className: h(
          "flex items-center gap-1.5 h-8 pr-2 rounded-lg cursor-pointer text-[12.5px] transition-colors",
          s === a.id ? "bg-[var(--apya-accent-soft)] text-[var(--apya-accent-500)] font-semibold" : "text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)]"
        ),
        style: { paddingLeft: 8 + l * 16 },
        children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: (i) => {
                i.stopPropagation(), f && c(a.id);
              },
              className: "w-4 h-4 flex items-center justify-center flex-shrink-0 text-[var(--apya-text-tertiary)]",
              children: f && /* @__PURE__ */ e.jsx("i", { className: `fa fa-chevron-${m ? "down" : "right"}`, style: { fontSize: 9 } })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "flex-shrink-0", children: a.icon || (f ? "📁" : "📄") }),
          /* @__PURE__ */ e.jsx("span", { className: "truncate", children: a.title })
        ]
      }
    ),
    f && m && /* @__PURE__ */ e.jsx("div", { children: a.children.map((i) => /* @__PURE__ */ e.jsx(V, { node: i, depth: l + 1, activeId: s, expanded: n, onToggle: c, onSelect: u }, i.id)) })
  ] });
}
function oe({ item: a, selected: l, onClick: s }) {
  const n = a.kind === "file", c = n ? G(a.contentType, a.fileName) : null;
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: s,
      className: h(
        "flex flex-col items-start gap-2 p-3.5 rounded-xl border text-left transition-colors w-full",
        l ? "border-[var(--apya-accent-500)] bg-[var(--apya-accent-soft)]" : "border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] hover:bg-[var(--apya-border-subtle)]"
      ),
      children: [
        /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
            style: { background: n ? `${c.color}1a` : "var(--apya-accent-soft)", color: n ? c.color : "var(--apya-accent-500)" },
            children: n ? /* @__PURE__ */ e.jsx("i", { className: `fa ${c.icon}` }) : /* @__PURE__ */ e.jsx("span", { children: a.icon || (a.hasChildren ? "📁" : "📄") })
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 w-full", children: [
          /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-semibold text-[var(--apya-text-primary)] truncate", children: n ? a.fileName : a.title }),
          /* @__PURE__ */ e.jsxs("div", { className: "text-[10.5px] text-[var(--apya-text-tertiary)] mt-0.5", children: [
            n ? w.size(a.fileSize) : a.hasChildren ? "Klasör" : "Sayfa",
            " · ",
            w.date(a.creationTime)
          ] })
        ] })
      ]
    }
  );
}
function ce({ item: a, onEdit: l, onDelete: s, onOpen: n }) {
  var f;
  if (!a)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center px-6", style: { color: "var(--apya-text-tertiary)" }, children: [
      /* @__PURE__ */ e.jsx("div", { className: "w-12 h-12 rounded-2xl flex items-center justify-center mb-3", style: { background: "var(--apya-border-subtle)" }, children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-lines text-xl" }) }),
      /* @__PURE__ */ e.jsx("div", { className: "text-xs", children: "Bir dosya veya belge seçin" })
    ] });
  const c = a.kind === "file", u = c ? G(a.contentType, a.fileName) : null;
  return /* @__PURE__ */ e.jsxs("div", { className: "p-5 flex flex-col h-full", children: [
    /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4",
        style: { background: c ? `${u.color}1a` : "var(--apya-accent-soft)", color: c ? u.color : "var(--apya-accent-500)" },
        children: c ? /* @__PURE__ */ e.jsx("i", { className: `fa ${u.icon}` }) : /* @__PURE__ */ e.jsx("span", { children: a.icon || "📄" })
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "text-sm font-semibold text-[var(--apya-text-primary)] text-center break-words mb-4", children: c ? a.fileName : a.title }),
    /* @__PURE__ */ e.jsxs("div", { className: "space-y-2.5 text-xs flex-1", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[var(--apya-text-tertiary)]", children: "Tür" }),
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-[var(--apya-text-primary)]", children: c ? ((f = a.fileName.split(".").pop()) == null ? void 0 : f.toUpperCase()) || "—" : a.hasChildren ? "Klasör" : "Sayfa" })
      ] }),
      c && /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[var(--apya-text-tertiary)]", children: "Boyut" }),
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-[var(--apya-text-primary)]", children: w.size(a.fileSize) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[var(--apya-text-tertiary)]", children: "Yükleyen" }),
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-[var(--apya-text-primary)]", children: c ? a.uploaderName || "Sistem" : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[var(--apya-text-tertiary)]", children: "Tarih" }),
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-[var(--apya-text-primary)]", children: w.date(a.creationTime) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 mt-4", children: [
      c ? /* @__PURE__ */ e.jsxs(
        "a",
        {
          href: a.downloadUrl,
          target: "_blank",
          rel: "noreferrer",
          className: "h-9 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-colors",
          style: { background: "var(--apya-accent-500)" },
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-download" }),
            " İndir"
          ]
        }
      ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => n(a),
            className: "h-9 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-colors",
            style: { background: "var(--apya-accent-500)" },
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-open" }),
              " Aç"
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => l(a),
            className: "h-9 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] flex items-center justify-center gap-2 hover:bg-[var(--apya-border-subtle)] transition-colors",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-pencil" }),
              " Düzenle"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => s(a),
          className: "h-9 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-negative-500)] flex items-center justify-center gap-2 hover:bg-[var(--apya-border-subtle)] transition-colors",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash" }),
            " Sil"
          ]
        }
      )
    ] })
  ] });
}
function de() {
  const [a, l] = o.useState([]), [s, n] = o.useState([]), [c, u] = o.useState(!0), [f, m] = o.useState(!1), [i, _] = o.useState(null), [W, B] = o.useState(/* @__PURE__ */ new Set()), [y, j] = o.useState(null), [k, I] = o.useState("grid"), [q, D] = o.useState(!1), [E, A] = o.useState(!1), [p, C] = o.useState(null), [F, M] = o.useState(null), $ = o.useRef(null), N = o.useCallback((t) => M(t), []), b = o.useCallback(async () => {
    u(!0);
    try {
      const t = await H().getList({ maxResultCount: 1e3, sorting: "title asc" });
      l(t.items ?? []);
    } catch (t) {
      S("error", "Belge listesi yüklenemedi."), console.error("[DocumentsIsland] loadTree error", t);
    } finally {
      u(!1);
    }
  }, []), P = o.useCallback(async (t) => {
    if (!t) {
      n([]);
      return;
    }
    m(!0);
    try {
      const r = await se(t);
      n(r ?? []);
    } catch (r) {
      console.error("[DocumentsIsland] loadAttachments error", r);
    } finally {
      m(!1);
    }
  }, []);
  o.useEffect(() => {
    b();
  }, [b]), o.useEffect(() => {
    j((t) => {
      if (!t || t.kind !== "document") return t;
      const r = a.find((d) => d.id === t.id);
      return r ? { ...r, kind: "document", hasChildren: a.some((d) => d.parentDocumentId === r.id) } : t;
    });
  }, [a]), o.useEffect(() => {
    P(i), j(null);
  }, [i, P]);
  const R = o.useMemo(() => {
    const t = /* @__PURE__ */ new Map();
    a.forEach((d) => {
      const x = d.parentDocumentId || "root";
      t.has(x) || t.set(x, []), t.get(x).push(d);
    });
    const r = (d) => (t.get(d) || []).map((x) => ({ ...x, children: r(x.id) }));
    return r("root");
  }, [a]), J = o.useMemo(() => {
    const t = [];
    let r = i;
    const d = new Map(a.map((x) => [x.id, x]));
    for (; r; ) {
      const x = d.get(r);
      if (!x) break;
      t.unshift(x), r = x.parentDocumentId;
    }
    return t;
  }, [i, a]), O = o.useMemo(
    () => a.filter((t) => (t.parentDocumentId || null) === i).map((t) => ({ ...t, kind: "document", hasChildren: a.some((r) => r.parentDocumentId === t.id) })),
    [a, i]
  ), Y = o.useMemo(
    () => [...O, ...s.map((t) => ({ ...t, kind: "file" }))],
    [O, s]
  ), Q = (t) => B((r) => {
    const d = new Set(r);
    return d.has(t) ? d.delete(t) : d.add(t), d;
  }), v = (t) => {
    _(t), t && B((r) => new Set(r).add(t));
  }, L = async (t) => {
    if (!(!i || !t || t.length === 0)) {
      A(!0);
      try {
        for (const r of Array.from(t)) {
          const d = await re(i, r);
          n((x) => [d, ...x]);
        }
        N("Dosya yüklendi.");
      } catch (r) {
        S("error", "Dosya yüklenemedi."), console.error("[DocumentsIsland] upload error", r);
      } finally {
        A(!1);
      }
    }
  }, T = () => {
    const t = new window.abp.ModalManager(g() + "Documents/CreateModal");
    t.open({ parentDocumentId: i || void 0 }), t.onResult(() => {
      b(), N("Belge oluşturuldu.");
    });
  }, X = (t) => {
    const r = new window.abp.ModalManager(g() + "Documents/EditModal");
    r.open({ id: t.id }), r.onResult(() => {
      b(), N("Belge güncellendi.");
    });
  }, Z = async () => {
    if (p)
      try {
        p.kind === "file" ? (await le(p.id), n((t) => t.filter((r) => r.id !== p.id))) : (await H().delete(p.id), await b()), (y == null ? void 0 : y.id) === p.id && j(null), N("Silindi.");
      } catch (t) {
        S("error", "Silme işlemi başarısız oldu."), console.error("[DocumentsIsland] delete error", t);
      } finally {
        C(null);
      }
  }, ee = te("Platform.Documents.Create");
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in px-7 py-7 max-w-[1560px] mx-auto",
      onDragOver: (t) => {
        i && (t.preventDefault(), D(!0));
      },
      onDragLeave: () => D(!1),
      onDrop: (t) => {
        t.preventDefault(), D(!1), i && L(t.dataTransfer.files);
      },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-4 mb-5", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("h1", { className: "text-xl font-bold tracking-tight text-[var(--apya-text-primary)] m-0", children: "Dokümanlar" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-xs text-[var(--apya-text-tertiary)] m-0", children: "Klasörler ve dosya yönetimi" })
          ] }),
          ee && /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: T,
              className: "h-9 px-3.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 hover:opacity-90 transition-colors",
              style: { background: "var(--apya-accent-500)" },
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
                " Yeni Belge"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "grid gap-4", style: { gridTemplateColumns: "260px 1fr 300px", alignItems: "start" }, children: [
          /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: "rounded-2xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] p-2",
              style: { boxShadow: "var(--apya-shadow-sm)", maxHeight: 640, overflowY: "auto" },
              children: [
                /* @__PURE__ */ e.jsxs(
                  "div",
                  {
                    onClick: () => v(null),
                    className: h(
                      "flex items-center gap-2 h-8 px-2 rounded-lg cursor-pointer text-[12.5px] font-semibold mb-1 transition-colors",
                      i === null ? "bg-[var(--apya-accent-soft)] text-[var(--apya-accent-500)]" : "text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)]"
                    ),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa fa-folder-tree", style: { fontSize: 12 } }),
                      "Tüm Dokümanlar"
                    ]
                  }
                ),
                c ? /* @__PURE__ */ e.jsx("div", { className: "space-y-2 p-2", children: Array.from({ length: 5 }).map((t, r) => /* @__PURE__ */ e.jsx(U, { h: 20 }, r)) }) : R.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-[var(--apya-text-tertiary)] text-center py-6 px-2", children: "Henüz klasör/belge yok." }) : R.map((t) => /* @__PURE__ */ e.jsx(V, { node: t, depth: 0, activeId: i, expanded: W, onToggle: Q, onSelect: v }, t.id))
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: "rounded-2xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] overflow-hidden",
              style: { boxShadow: "var(--apya-shadow-sm)", minHeight: 460 },
              children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2 px-4 py-3 border-b border-[var(--apya-border-subtle)]", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-[var(--apya-text-tertiary)] min-w-0", children: [
                    /* @__PURE__ */ e.jsx("span", { className: h("cursor-pointer hover:text-[var(--apya-text-primary)]", i === null && "text-[var(--apya-text-primary)] font-semibold"), onClick: () => v(null), children: "Tüm Dokümanlar" }),
                    J.map((t) => /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 min-w-0", children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", style: { fontSize: 8 } }),
                      /* @__PURE__ */ e.jsx("span", { className: h("cursor-pointer hover:text-[var(--apya-text-primary)] truncate", t.id === i && "text-[var(--apya-text-primary)] font-semibold"), onClick: () => v(t.id), children: t.title })
                    ] }, t.id))
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex rounded-lg border border-[var(--apya-border-default)] overflow-hidden", children: [
                      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => I("grid"), className: h("w-7 h-7 flex items-center justify-center text-xs", k === "grid" ? "bg-[var(--apya-accent-soft)] text-[var(--apya-accent-500)]" : "text-[var(--apya-text-tertiary)]"), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-grip" }) }),
                      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => I("list"), className: h("w-7 h-7 flex items-center justify-center text-xs", k === "list" ? "bg-[var(--apya-accent-soft)] text-[var(--apya-accent-500)]" : "text-[var(--apya-text-tertiary)]"), children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list" }) })
                    ] }),
                    i && /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          var t;
                          return (t = $.current) == null ? void 0 : t.click();
                        },
                        disabled: E,
                        className: "h-8 px-3 rounded-lg text-xs font-semibold text-white flex items-center gap-2 hover:opacity-90 transition-colors disabled:opacity-50",
                        style: { background: "var(--apya-accent-500)" },
                        children: [
                          E ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-spinner fa-spin" }) : /* @__PURE__ */ e.jsx("i", { className: "fa fa-upload" }),
                          " Yükle"
                        ]
                      }
                    ),
                    /* @__PURE__ */ e.jsx("input", { ref: $, type: "file", multiple: !0, hidden: !0, onChange: (t) => {
                      L(t.target.files), t.target.value = "";
                    } })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "p-4 relative", style: { minHeight: 380 }, children: [
                  q && /* @__PURE__ */ e.jsx(
                    "div",
                    {
                      className: "absolute inset-2 z-10 rounded-xl border-2 border-dashed flex items-center justify-center text-sm font-semibold",
                      style: { borderColor: "var(--apya-accent-500)", background: "var(--apya-accent-soft)", color: "var(--apya-accent-500)" },
                      children: "Yüklemek için bırakın"
                    }
                  ),
                  !i && /* @__PURE__ */ e.jsxs("div", { className: "mb-4 rounded-xl border border-dashed border-[var(--apya-border-default)] p-3 text-[11px] text-[var(--apya-text-tertiary)] flex items-center gap-2", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-info" }),
                    " Dosya yükleyebilmek için önce bir klasör/belge açın."
                  ] }),
                  f ? /* @__PURE__ */ e.jsx("div", { className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }, children: Array.from({ length: 6 }).map((t, r) => /* @__PURE__ */ e.jsx(U, { h: 84, r: 12 }, r)) }) : Y.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-14 text-center", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox text-2xl" }) }),
                    /* @__PURE__ */ e.jsx("div", { className: "text-sm font-semibold text-[var(--apya-text-primary)]", children: "Burada henüz bir şey yok" }),
                    /* @__PURE__ */ e.jsx("div", { className: "text-xs text-[var(--apya-text-tertiary)] max-w-xs", children: i ? 'Dosya sürükleyip bırakın ya da "Yükle" butonunu kullanın.' : '"Yeni Belge" ile ilk klasörünüzü oluşturun.' })
                  ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid gap-3", style: { gridTemplateColumns: k === "grid" ? "repeat(auto-fill, minmax(140px, 1fr))" : "1fr" }, children: Y.map((t) => /* @__PURE__ */ e.jsx(
                    oe,
                    {
                      item: t,
                      selected: (y == null ? void 0 : y.id) === t.id,
                      onClick: () => j(t)
                    },
                    `${t.kind}-${t.id}`
                  )) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "div",
            {
              className: "rounded-2xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)]",
              style: { boxShadow: "var(--apya-shadow-sm)", minHeight: 460 },
              children: /* @__PURE__ */ e.jsx(ce, { item: y, onEdit: X, onOpen: (t) => v(t.id), onDelete: C })
            }
          )
        ] }),
        p && /* @__PURE__ */ e.jsx(
          ie,
          {
            title: p.kind === "file" ? "Dosya Silinecek" : "Belge Silinecek",
            message: `"${p.kind === "file" ? p.fileName : p.title}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
            onConfirm: Z,
            onCancel: () => C(null)
          }
        ),
        F && /* @__PURE__ */ e.jsx(ne, { message: F, onDone: () => M(null) })
      ]
    }
  );
}
const K = document.getElementById("documents-island");
K && ae(K).render(/* @__PURE__ */ e.jsx(de, {}));
