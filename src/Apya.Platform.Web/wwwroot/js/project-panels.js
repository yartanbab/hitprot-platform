import { r as f, j as e, b as Y } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { S as O, R as K } from "./RichTextEditorV3-D3Amhpsv.js";
function y() {
  var s, n, a;
  const t = (a = (n = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : n.tasks) == null ? void 0 : a.task;
  if (!t) throw new Error("ABP görev servisi yüklenmedi.");
  return t;
}
const j = (t) => Promise.resolve(t), k = {
  projectDocuments: (t) => j(y().getProjectDocuments(t)),
  projectForms: (t) => j(y().getProjectLinkedForms(t)),
  projectChecklist: (t) => j(y().getProjectChecklist(t)),
  projectDependencies: (t) => j(y().getProjectDependencies(t)),
  document: (t) => j(y().getDocument(t)),
  createDocument: (t, s) => j(y().createDocument(t, s)),
  updateDocument: (t, s) => j(y().updateDocument(t, s)),
  deleteDocument: (t) => j(y().deleteDocument(t)),
  addChecklistItem: (t, s) => j(y().addChecklistItem(t, s)),
  // PR-3a hiyerarşik kapsam: doğrudan projeye bağlı madde (TaskId boş).
  addProjectChecklistItem: (t, s) => j(y().addProjectChecklistItem(t, s)),
  toggleChecklistItem: (t) => j(y().toggleChecklistItem(t)),
  deleteChecklistItem: (t) => j(y().deleteChecklistItem(t))
}, B = /* @__PURE__ */ new Map();
function I(t, { force: s = !1 } = {}) {
  if (!s && B.has(t))
    return B.get(t);
  const n = j(y().getList({ projectId: t, maxResultCount: 1e3, rootOnly: !1 })).then((a) => (a == null ? void 0 : a.items) ?? []);
  return B.set(t, n), n.catch(() => {
    B.delete(t);
  }), n;
}
function V(t) {
  var s, n, a;
  (a = (n = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.taskDetail) == null ? void 0 : n.open) == null || a.call(n, t);
}
function T(t, s) {
  const [n, a] = f.useState(
    () => !!s && !s.classList.contains("d-none")
  );
  return f.useEffect(() => {
    if (n) return;
    const r = (o) => {
      var i;
      ((i = o == null ? void 0 : o.detail) == null ? void 0 : i.kind) === t && a(!0);
    };
    return document.addEventListener("apya:project-panel-shown", r), () => document.removeEventListener("apya:project-panel-shown", r);
  }, [t, n]), n;
}
function C(t, s) {
  const [n, a] = f.useState({ status: "idle", data: null, error: null }), r = f.useRef(t);
  r.current = t;
  const o = f.useCallback(() => (a((i) => ({ ...i, status: i.data ? "reloading" : "loading", error: null })), r.current().then(
    (i) => a({ status: "ready", data: i, error: null }),
    (i) => a({ status: "error", data: null, error: i })
  )), []);
  return f.useEffect(() => {
    s && n.status === "idle" && o();
  }, [s, n.status, o]), { ...n, reload: o };
}
function F(t, s, n) {
  const a = new Map(t.map((i) => [i.id, { task: i, records: [] }])), r = { task: null, records: [] };
  for (const i of s) {
    const m = a.get(n(i));
    (m ? m.records : r.records).push(i);
  }
  const o = [...a.values()].filter((i) => i.records.length > 0);
  return r.records.length > 0 && o.push(r), o;
}
function H(t, s, n = /* @__PURE__ */ new Date()) {
  const a = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  return t.filter((r) => {
    const o = s.get(r.predecessorTaskId);
    return !o || o.status === 4 ? !1 : !!o.dueDate && new Date(o.dueDate) < a;
  });
}
function D() {
  return /* @__PURE__ */ e.jsxs("div", { className: "p-5", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "h-10 w-1/3 rounded-lg bg-neutral-subtle animate-pulse mb-3" }),
    /* @__PURE__ */ e.jsx("div", { className: "h-36 rounded-xl bg-neutral-subtle animate-pulse" })
  ] });
}
function P({ onRetry: t }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 py-12 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-2xl text-warning" }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: "Panel yüklenemedi." }),
    /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: t,
        className: "mt-1 h-8 px-3.5 rounded-lg border border-default bg-surface-base text-[12.5px] font-semibold text-text-secondary cursor-pointer hover:bg-surface-hover",
        children: "Tekrar dene"
      }
    )
  ] });
}
function E({ icon: t, title: s, desc: n, action: a = null, tone: r = "primary" }) {
  const o = r === "success" ? "bg-success-subtle text-success" : "bg-primary-subtle text-primary";
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 py-14 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex h-11 w-11 items-center justify-center rounded-xl ${o}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[18px]`, "aria-hidden": "true" }) }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[14px] font-bold text-text-primary", children: s }),
    n && /* @__PURE__ */ e.jsx("span", { className: "max-w-[360px] text-[12px] leading-[1.55] text-text-secondary", children: n }),
    a && /* @__PURE__ */ e.jsx("div", { className: "mt-1.5", children: a })
  ] });
}
function L({ task: t, trailing: s = null }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 h-[42px] px-4 bg-surface-raised border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-list-check text-[11px] text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary truncate", children: t ? t.title : "Görevi bulunamayan kayıtlar" }),
    t && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-primary-subtle text-primary text-[10.5px] font-semibold font-mono", children: t.number > 0 ? `GRV-${t.number}` : "GRV-—" }),
    s && /* @__PURE__ */ e.jsx("span", { className: "ml-auto flex items-center gap-2", children: s })
  ] });
}
function q({ status: t }) {
  const s = O[t] ?? O[1];
  return /* @__PURE__ */ e.jsxs("span", { className: `h-5 inline-flex items-center gap-1 px-2 rounded-full text-[10.5px] font-semibold ${s.bg} ${s.fg}`, children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${s.icon} text-[9px]`, "aria-hidden": "true" }),
    s.label
  ] });
}
const N = {
  ok: (t) => {
    var s, n, a;
    return (a = (n = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.notify) == null ? void 0 : n.success) == null ? void 0 : a.call(n, t);
  },
  err: (t) => {
    var s, n, a;
    return (a = (n = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.notify) == null ? void 0 : n.error) == null ? void 0 : a.call(n, t);
  }
}, J = (t) => t ? new Date(t).toLocaleDateString("tr-TR") : "";
function U({ projectId: t, kind: s, mountEl: n }) {
  const a = T(s, n), r = C(
    () => Promise.all([I(t), k.projectDocuments(t)]),
    a
  ), [o, i] = f.useState(null), [m, d] = f.useState(!1);
  if (!a || r.status === "idle" || r.status === "loading")
    return /* @__PURE__ */ e.jsx(D, {});
  if (r.status === "error")
    return /* @__PURE__ */ e.jsx(P, { onRetry: r.reload });
  const [p, x] = r.data;
  if (o)
    return /* @__PURE__ */ e.jsx(
      W,
      {
        documentId: o,
        onBack: () => i(null),
        onChanged: () => r.reload(),
        onDeleted: () => {
          i(null), r.reload();
        }
      }
    );
  if (m)
    return /* @__PURE__ */ e.jsx(
      Q,
      {
        tasks: p,
        onCancel: () => d(!1),
        onCreated: (b) => {
          d(!1), r.reload(), i(b.id);
        }
      }
    );
  const l = /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => d(!0),
      className: "h-8 inline-flex items-center gap-1.5 px-3.5 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
      children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[10px]", "aria-hidden": "true" }),
        "Yeni belge"
      ]
    }
  );
  if (x.length === 0)
    return /* @__PURE__ */ e.jsx(
      E,
      {
        icon: "fa-file-lines",
        title: "Bu projede henüz belge yok",
        desc: "Belgeler görevlere bağlı yazılır; ilkini buradan bir görev seçerek oluşturabilirsiniz.",
        action: l
      }
    );
  const g = F(p, x, (b) => b.taskId);
  return /* @__PURE__ */ e.jsxs("div", { className: "pb-4", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-end px-4 py-3", children: l }),
    g.map((b) => {
      var v;
      return /* @__PURE__ */ e.jsxs("section", { children: [
        /* @__PURE__ */ e.jsx(L, { task: b.task }),
        /* @__PURE__ */ e.jsx("ul", { className: "m-0 p-0 list-none", children: b.records.map((u) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => i(u.id),
            className: "flex w-full items-center gap-2.5 min-h-[44px] pl-10 pr-4 border-b border-subtle text-left cursor-pointer hover:bg-surface-hover",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[12px] text-text-tertiary", "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: u.title }),
              u.contentLength === 0 && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-neutral-subtle text-text-tertiary text-[10.5px] font-semibold", children: "boş" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 text-[11px] text-text-tertiary", children: [
                u.editorName,
                " · ",
                J(u.lastModificationTime ?? u.creationTime)
              ] })
            ]
          }
        ) }, u.id)) })
      ] }, ((v = b.task) == null ? void 0 : v.id) ?? "orphan");
    })
  ] });
}
function Q({ tasks: t, onCancel: s, onCreated: n }) {
  var x;
  const [a, r] = f.useState(((x = t[0]) == null ? void 0 : x.id) ?? ""), [o, i] = f.useState(""), [m, d] = f.useState(!1), p = async () => {
    if (!(!a || !o.trim() || m)) {
      d(!0);
      try {
        const l = await k.createDocument(a, o.trim());
        N.ok("Belge oluşturuldu."), n(l);
      } catch (l) {
        N.err((l == null ? void 0 : l.message) || "Belge oluşturulamadı."), d(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "max-w-[480px] mx-auto my-8 px-4 flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[14px] font-bold text-text-primary", children: "Yeni belge" }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1 text-[11.5px] font-semibold text-text-secondary", children: [
      "Görev",
      /* @__PURE__ */ e.jsx(
        "select",
        {
          value: a,
          onChange: (l) => r(l.target.value),
          className: "h-9 px-2 rounded-lg border border-default bg-surface-base text-[12.5px] text-text-primary",
          children: t.map((l) => /* @__PURE__ */ e.jsx("option", { value: l.id, children: (l.number > 0 ? `GRV-${l.number} · ` : "") + l.title }, l.id))
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1 text-[11.5px] font-semibold text-text-secondary", children: [
      "Başlık",
      /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: o,
          onChange: (l) => i(l.target.value),
          onKeyDown: (l) => {
            l.key === "Enter" && p();
          },
          placeholder: "Toplantı notu, kapsam taslağı…",
          className: "h-9 px-2.5 rounded-lg border border-default bg-surface-base text-[12.5px] text-text-primary focus:outline-none focus:border-focus"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2 mt-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: s,
          className: "h-8 px-3.5 rounded-lg border border-default bg-surface-base text-[12.5px] font-semibold text-text-secondary cursor-pointer hover:bg-surface-hover",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: p,
          disabled: m || !o.trim() || !a,
          className: "h-8 px-4 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Oluştur"
        }
      )
    ] })
  ] });
}
function W({ documentId: t, onBack: s, onChanged: n, onDeleted: a }) {
  const r = C(() => k.document(t), !0), [o, i] = f.useState(null), [m, d] = f.useState(null), [p, x] = f.useState(!1);
  if (r.status !== "ready")
    return r.status === "error" ? /* @__PURE__ */ e.jsx(P, { onRetry: r.reload }) : /* @__PURE__ */ e.jsx(D, {});
  const l = o ?? r.data.title, g = o !== null || m !== null, b = async () => {
    if (!p) {
      x(!0);
      try {
        await k.updateDocument(t, {
          title: l,
          content: m ?? r.data.content
        }), N.ok("Belge kaydedildi."), n(), s();
      } catch (u) {
        N.err((u == null ? void 0 : u.message) || "Belge kaydedilemedi."), x(!1);
      }
    }
  }, v = async () => {
    if (!(p || !window.confirm("Belge silinecek (geri alınabilir arşive gider). Devam edilsin mi?"))) {
      x(!0);
      try {
        await k.deleteDocument(t), N.ok("Belge silindi."), a();
      } catch (u) {
        N.err((u == null ? void 0 : u.message) || "Belge silinemedi."), x(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "p-4 flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: s,
          className: "h-8 px-2.5 rounded-lg text-[12.5px] font-semibold text-text-secondary cursor-pointer hover:bg-surface-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-left text-[11px] mr-1.5", "aria-hidden": "true" }),
            "Belgeler"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: l,
          onChange: (u) => i(u.target.value),
          className: "flex-1 h-9 px-2.5 rounded-lg border border-default bg-surface-base text-[13.5px] font-bold text-text-primary focus:outline-none focus:border-focus",
          "aria-label": "Belge başlığı"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: v,
          disabled: p,
          title: "Belgeyi sil",
          className: "h-8 w-8 rounded-lg text-text-tertiary cursor-pointer hover:bg-negative-subtle hover:text-negative",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-trash text-[12px]", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: b,
          disabled: p || !g || !l.trim(),
          className: "h-8 px-4 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Kaydet"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      K,
      {
        value: r.data.content || "",
        onChange: d,
        placeholder: "Belge içeriği…"
      }
    )
  ] });
}
function X({ projectId: t, kind: s, mountEl: n }) {
  const a = T(s, n), r = C(
    () => Promise.all([I(t), k.projectForms(t)]),
    a
  );
  if (!a || r.status === "idle" || r.status === "loading")
    return /* @__PURE__ */ e.jsx(D, {});
  if (r.status === "error")
    return /* @__PURE__ */ e.jsx(P, { onRetry: r.reload });
  const [o, i] = r.data, m = F(o, i, (d) => d.taskId);
  return m.length === 0 ? /* @__PURE__ */ e.jsx(
    E,
    {
      icon: "fa-clipboard-list",
      title: "Henüz form bağlanmadı",
      desc: "Form Yönetimi'ndeki bir formu görev detayından bağlayın; yanıtlar o görev bağlamında toplansın."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: "pb-4", children: m.map((d) => {
    var p;
    return /* @__PURE__ */ e.jsxs("section", { children: [
      /* @__PURE__ */ e.jsx(L, { task: d.task }),
      /* @__PURE__ */ e.jsx("ul", { className: "m-0 p-0 list-none", children: d.records.map((x) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-2.5 min-h-[44px] pl-10 pr-4 border-b border-subtle", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clipboard-list text-[12px] text-text-tertiary", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: x.title }),
        x.isGuestFillable && /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-warning-subtle text-warning text-[10.5px] font-semibold",
            title: "Görevin dış paylaşım linkine açık",
            children: "dışa açık"
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-neutral-subtle text-text-secondary text-[10.5px] font-semibold font-mono", children: [
          x.responseCount,
          " yanıt"
        ] }),
        d.task && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => V(d.task.id),
            className: "shrink-0 text-[12px] font-semibold text-primary cursor-pointer hover:underline",
            children: "Görevde aç →"
          }
        )
      ] }, x.id)) })
    ] }, ((p = d.task) == null ? void 0 : p.id) ?? "orphan");
  }) });
}
const w = "__project__";
function Z({ projectId: t, kind: s, mountEl: n }) {
  const a = T(s, n), r = C(
    () => Promise.all([I(t), k.projectChecklist(t)]),
    a
  ), [o, i] = f.useState(null), [m, d] = f.useState(""), [p, x] = f.useState(!1);
  if (!a || r.status === "idle" || r.status === "loading")
    return /* @__PURE__ */ e.jsx(D, {});
  if (r.status === "error")
    return /* @__PURE__ */ e.jsx(P, { onRetry: r.reload });
  const [l, g] = r.data, b = g.filter((c) => !c.taskId), v = F(l, g.filter((c) => c.taskId), (c) => c.taskId), u = async (c) => {
    var h, S, _;
    x(!0);
    try {
      await c(), await r.reload();
    } catch (R) {
      (_ = (S = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : S.error) == null || _.call(S, (R == null ? void 0 : R.message) || "İşlem tamamlanamadı.");
    } finally {
      x(!1);
    }
  }, A = (c) => {
    const h = m.trim();
    if (!h) {
      i(null);
      return;
    }
    d(""), i(null), u(() => c === w ? k.addProjectChecklistItem(t, h) : k.addChecklistItem(c, h));
  }, G = (c) => /* @__PURE__ */ e.jsxs("li", { className: "group flex items-center gap-2.5 min-h-[38px] pl-10 pr-4 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: c.isDone,
        disabled: p,
        onChange: () => u(() => k.toggleChecklistItem(c.id)),
        className: "h-[15px] w-[15px] accent-[var(--apya-accent-500,#4F46E5)] cursor-pointer",
        "aria-label": c.text
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: `flex-1 text-[12.5px] ${c.isDone ? "text-text-tertiary line-through" : "text-text-primary"}`, children: c.text }),
    /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        title: "Maddeyi sil",
        disabled: p,
        onClick: () => u(() => k.deleteChecklistItem(c.id)),
        className: "opacity-0 group-hover:opacity-100 h-6 w-6 rounded-md text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[11px]", "aria-hidden": "true" })
      }
    )
  ] }, c.id), z = (c) => /* @__PURE__ */ e.jsx("li", { className: "flex items-center gap-2.5 min-h-[36px] pl-10 pr-4", children: o === c ? /* @__PURE__ */ e.jsx(
    "input",
    {
      autoFocus: !0,
      type: "text",
      value: m,
      onChange: (h) => d(h.target.value),
      onKeyDown: (h) => {
        h.key === "Enter" && A(c), h.key === "Escape" && (i(null), d(""));
      },
      onBlur: () => A(c),
      placeholder: "Madde yazın, Enter ile ekleyin",
      className: "flex-1 h-7 px-2 rounded-md border border-default bg-surface-base text-[12.5px] focus:outline-none focus:border-focus"
    }
  ) : /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: () => {
        i(c), d("");
      },
      className: "text-[12px] font-semibold text-primary cursor-pointer hover:underline",
      children: "＋ madde ekle…"
    }
  ) }, "add"), M = (c) => c.filter((h) => h.isDone).length, $ = b.length > 0 || o === w;
  return !$ && v.length === 0 ? /* @__PURE__ */ e.jsx(
    E,
    {
      icon: "fa-square-check",
      tone: "success",
      title: "Bu projede henüz kontrol listesi yok",
      desc: "Bir göreve bağlayın ya da doğrudan proje düzeyinde tutun — proje maddeleri görevlerden bağımsız yaşar.",
      action: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            i(w), d("");
          },
          className: "h-8 inline-flex items-center gap-1.5 px-3.5 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[10px]", "aria-hidden": "true" }),
            "Yeni proje maddesi"
          ]
        }
      )
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "pb-4", children: [
    $ ? /* @__PURE__ */ e.jsxs("section", { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 h-[42px] px-4 bg-surface-raised border-b border-subtle", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-diagram-project text-[11px] text-text-tertiary", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: "Proje maddeleri" }),
        b.length > 0 && /* @__PURE__ */ e.jsxs("span", { className: "ml-auto text-[11px] font-bold font-mono text-text-secondary", children: [
          M(b),
          "/",
          b.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("ul", { className: "m-0 p-0 list-none", children: [
        b.map(G),
        z(w)
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "flex justify-end px-4 py-2", children: /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          i(w), d("");
        },
        className: "text-[12px] font-semibold text-primary cursor-pointer hover:underline",
        children: "＋ Proje maddesi ekle…"
      }
    ) }),
    v.map((c) => {
      var h;
      return /* @__PURE__ */ e.jsxs("section", { children: [
        /* @__PURE__ */ e.jsx(
          L,
          {
            task: c.task,
            trailing: /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] font-bold font-mono text-text-secondary", children: [
              M(c.records),
              "/",
              c.records.length
            ] })
          }
        ),
        /* @__PURE__ */ e.jsxs("ul", { className: "m-0 p-0 list-none", children: [
          c.records.map(G),
          c.task && z(c.task.id)
        ] })
      ] }, ((h = c.task) == null ? void 0 : h.id) ?? "orphan");
    })
  ] });
}
function ee({ projectId: t, kind: s, mountEl: n }) {
  const a = T(s, n), r = C(
    () => Promise.all([I(t), k.projectDependencies(t)]),
    a
  );
  if (!a || r.status === "idle" || r.status === "loading")
    return /* @__PURE__ */ e.jsx(D, {});
  if (r.status === "error")
    return /* @__PURE__ */ e.jsx(P, { onRetry: r.reload });
  const [o, i] = r.data, m = new Map(o.map((l) => [l.id, l])), d = H(i, m), p = new Set(d.map((l) => l.predecessorTaskId + "→" + l.taskId));
  if (i.length === 0)
    return /* @__PURE__ */ e.jsx(
      E,
      {
        icon: "fa-link",
        title: "Bu projede görevler arası bağ yok",
        desc: "Öncül/ardıl bağlantıları görev detayının Bağımlılıklar sekmesinden kurulur."
      }
    );
  const x = ({ id: l }) => {
    const g = m.get(l);
    return g ? /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => V(g.id),
        className: "flex items-center gap-2 min-w-0 text-left cursor-pointer group",
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate group-hover:text-primary", children: g.title }),
          /* @__PURE__ */ e.jsx(q, { status: g.status })
        ]
      }
    ) : /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary", children: "(görünmeyen görev)" });
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "pb-4", children: [
    d.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 m-4 mb-0 px-3.5 py-3 rounded-xl bg-negative-subtle border border-negative/30", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[13px] text-negative mt-0.5", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12px] leading-[1.55] text-negative", children: [
        /* @__PURE__ */ e.jsxs("b", { children: [
          d.length,
          " bağlantı bloke ediyor:"
        ] }),
        " öncülü tamamlanmamış ve termini geçmiş görevler ardıllarını bekletiyor. Satırlarda ⚠ ile işaretli."
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex px-4 pt-4 pb-2 text-[10.5px] font-semibold tracking-[.06em] text-text-tertiary", children: [
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "ÖNCÜL (önce bitmeli)" }),
      /* @__PURE__ */ e.jsx("span", { className: "w-8" }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "ARDIL (bunu bekliyor)" })
    ] }),
    /* @__PURE__ */ e.jsx("ul", { className: "m-0 p-0 list-none", children: i.map((l) => {
      const g = p.has(l.predecessorTaskId + "→" + l.taskId);
      return /* @__PURE__ */ e.jsxs(
        "li",
        {
          className: "flex items-center min-h-[44px] px-4 border-b border-subtle",
          children: [
            /* @__PURE__ */ e.jsxs("span", { className: "flex-1 min-w-0 flex items-center gap-2", children: [
              g && /* @__PURE__ */ e.jsx(
                "i",
                {
                  className: "fa-solid fa-triangle-exclamation text-[11px] text-negative",
                  title: "Öncül tamamlanmadı ve termini geçti — ardılı bloke ediyor",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ e.jsx(x, { id: l.predecessorTaskId })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "w-8 text-center text-text-tertiary", "aria-hidden": "true", children: "→" }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0", children: /* @__PURE__ */ e.jsx(x, { id: l.taskId }) })
          ]
        },
        l.predecessorTaskId + l.taskId
      );
    }) })
  ] });
}
const te = [
  ["view-documents", "documents", U],
  ["view-forms", "forms", X],
  ["view-checklist", "checklist", Z],
  ["view-dependencies", "dependencies", ee]
];
for (const [t, s, n] of te) {
  const a = document.getElementById(t), r = a == null ? void 0 : a.getAttribute("data-project-id");
  a && r && Y(a).render(/* @__PURE__ */ e.jsx(n, { projectId: r, kind: s, mountEl: a }));
}
