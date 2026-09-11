import { r as j, j as e, b as ee } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { S as W, R as te } from "./RichTextEditorV3-D3Amhpsv.js";
function k() {
  var s, n, r;
  const t = (r = (n = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : n.tasks) == null ? void 0 : r.task;
  if (!t) throw new Error("ABP görev servisi yüklenmedi.");
  return t;
}
const v = (t) => Promise.resolve(t), E = (t) => t ?? void 0, g = {
  projectDocuments: (t) => v(k().getProjectDocuments(E(t))),
  projectForms: (t) => v(k().getProjectLinkedForms(E(t))),
  projectChecklist: (t) => v(k().getProjectChecklist(E(t))),
  projectDependencies: (t) => v(k().getProjectDependencies(E(t))),
  /** Proje adı/kodu lookup'ı — çapraz-proje kipte grup başlıkları için
   *  (görevi olmayan projenin proje-seviyesi maddesi ada başka yerden ulaşamaz). */
  projectsLookup: () => v(k().getProjectsLookup()),
  document: (t) => v(k().getDocument(t)),
  createDocument: (t, s) => v(k().createDocument(t, s)),
  updateDocument: (t, s) => v(k().updateDocument(t, s)),
  deleteDocument: (t) => v(k().deleteDocument(t)),
  addChecklistItem: (t, s) => v(k().addChecklistItem(t, s)),
  // PR-3a hiyerarşik kapsam: doğrudan projeye bağlı madde (TaskId boş).
  addProjectChecklistItem: (t, s) => v(k().addProjectChecklistItem(t, s)),
  toggleChecklistItem: (t) => v(k().toggleChecklistItem(t)),
  deleteChecklistItem: (t) => v(k().deleteChecklistItem(t))
}, z = /* @__PURE__ */ new Map();
function _(t, { force: s = !1 } = {}) {
  const n = t ?? "__all__";
  if (!s && z.has(n))
    return z.get(n);
  const r = v(k().getList({ projectId: E(t), maxResultCount: 1e3, rootOnly: !1 })).then((o) => (o == null ? void 0 : o.items) ?? []);
  return z.set(n, r), r.catch(() => {
    z.delete(n);
  }), r;
}
function Z(t) {
  var s, n, r;
  (r = (n = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.taskDetail) == null ? void 0 : n.open) == null || r.call(n, t);
}
function $(t, s) {
  const [n, r] = j.useState(
    () => !!s && !s.classList.contains("d-none")
  );
  return j.useEffect(() => {
    if (n) return;
    const o = (a) => {
      var i;
      ((i = a == null ? void 0 : a.detail) == null ? void 0 : i.kind) === t && r(!0);
    };
    return document.addEventListener("apya:project-panel-shown", o), () => document.removeEventListener("apya:project-panel-shown", o);
  }, [t, n]), n;
}
function L(t, s) {
  const [n, r] = j.useState({ status: "idle", data: null, error: null }), o = j.useRef(t);
  o.current = t;
  const a = j.useCallback(() => (r((i) => ({ ...i, status: i.data ? "reloading" : "loading", error: null })), o.current().then(
    (i) => r({ status: "ready", data: i, error: null }),
    (i) => r({ status: "error", data: null, error: i })
  )), []);
  return j.useEffect(() => {
    s && n.status === "idle" && a();
  }, [s, n.status, a]), { ...n, reload: a };
}
function M(t, s, n) {
  const r = new Map(t.map((i) => [i.id, { task: i, records: [] }])), o = { task: null, records: [] };
  for (const i of s) {
    const p = r.get(n(i));
    (p ? p.records : o.records).push(i);
  }
  const a = [...r.values()].filter((i) => i.records.length > 0);
  return o.records.length > 0 && a.push(o), a;
}
function O(t, s, n, r, o = null) {
  const a = new Map(s.map((l) => [l.id, l])), i = new Map(t.map((l) => [l.id, { project: l, tasks: [], records: [] }])), p = (l, m) => (i.has(l) || i.set(l, { project: { id: l, name: m || "" }, tasks: [], records: [] }), i.get(l));
  for (const l of s)
    l.projectId && p(l.projectId, l.projectName).tasks.push(l);
  const b = { project: null, tasks: [], records: [] };
  for (const l of n) {
    const m = a.get(r(l)), c = (m == null ? void 0 : m.projectId) ?? (o ? o(l) : null);
    (c ? p(c, m == null ? void 0 : m.projectName) : b).records.push(l);
  }
  b.tasks = s.filter((l) => !l.projectId);
  const f = [...i.values()].filter((l) => l.records.length > 0);
  return b.records.length > 0 && f.push(b), f;
}
function se(t, s, n = /* @__PURE__ */ new Date()) {
  const r = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  return t.filter((o) => {
    const a = s.get(o.predecessorTaskId);
    return !a || a.status === 4 ? !1 : !!a.dueDate && new Date(a.dueDate) < r;
  });
}
function R() {
  return /* @__PURE__ */ e.jsxs("div", { className: "p-5", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "h-10 w-1/3 rounded-lg bg-neutral-subtle animate-pulse mb-3" }),
    /* @__PURE__ */ e.jsx("div", { className: "h-36 rounded-xl bg-neutral-subtle animate-pulse" })
  ] });
}
function F({ onRetry: t }) {
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
function G({ icon: t, title: s, desc: n, action: r = null, tone: o = "primary" }) {
  const a = o === "success" ? "bg-success-subtle text-success" : "bg-primary-subtle text-primary";
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 py-14 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex h-11 w-11 items-center justify-center rounded-xl ${a}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[18px]`, "aria-hidden": "true" }) }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[14px] font-bold text-text-primary", children: s }),
    n && /* @__PURE__ */ e.jsx("span", { className: "max-w-[360px] text-[12px] leading-[1.55] text-text-secondary", children: n }),
    r && /* @__PURE__ */ e.jsx("div", { className: "mt-1.5", children: r })
  ] });
}
function H({ project: t }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 h-[46px] px-4 bg-surface-raised border-t-2 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-diagram-project text-[12px] text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t ? t.name || "(adsız proje)" : "Projesiz görevler" }),
    (t == null ? void 0 : t.code) && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-neutral-subtle text-text-secondary text-[10.5px] font-semibold font-mono", children: t.code })
  ] });
}
function V({ task: t, trailing: s = null }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 h-[42px] px-4 bg-surface-raised border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-list-check text-[11px] text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary truncate", children: t ? t.title : "Görevi bulunamayan kayıtlar" }),
    t && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-primary-subtle text-primary text-[10.5px] font-semibold font-mono", children: t.number > 0 ? `GRV-${t.number}` : "GRV-—" }),
    s && /* @__PURE__ */ e.jsx("span", { className: "ml-auto flex items-center gap-2", children: s })
  ] });
}
function re({ status: t }) {
  const s = W[t] ?? W[1];
  return /* @__PURE__ */ e.jsxs("span", { className: `h-5 inline-flex items-center gap-1 px-2 rounded-full text-[10.5px] font-semibold ${s.bg} ${s.fg}`, children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${s.icon} text-[9px]`, "aria-hidden": "true" }),
    s.label
  ] });
}
const P = {
  ok: (t) => {
    var s, n, r;
    return (r = (n = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.notify) == null ? void 0 : n.success) == null ? void 0 : r.call(n, t);
  },
  err: (t) => {
    var s, n, r;
    return (r = (n = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.notify) == null ? void 0 : n.error) == null ? void 0 : r.call(n, t);
  }
}, ne = (t) => t ? new Date(t).toLocaleDateString("tr-TR") : "";
function ae({ projectId: t, kind: s, mountEl: n }) {
  const r = !t, o = $(s, n), a = L(
    () => Promise.all([
      _(t),
      g.projectDocuments(t),
      r ? g.projectsLookup() : Promise.resolve([])
    ]),
    o
  ), [i, p] = j.useState(null), [b, f] = j.useState(!1);
  if (!o || a.status === "idle" || a.status === "loading")
    return /* @__PURE__ */ e.jsx(R, {});
  if (a.status === "error")
    return /* @__PURE__ */ e.jsx(F, { onRetry: a.reload });
  const [l, m, c] = a.data;
  if (i)
    return /* @__PURE__ */ e.jsx(
      oe,
      {
        documentId: i,
        onBack: () => p(null),
        onChanged: () => a.reload(),
        onDeleted: () => {
          p(null), a.reload();
        }
      }
    );
  if (b)
    return /* @__PURE__ */ e.jsx(
      le,
      {
        tasks: l,
        showProject: r,
        onCancel: () => f(!1),
        onCreated: (d) => {
          f(!1), a.reload(), p(d.id);
        }
      }
    );
  const y = /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => f(!0),
      className: "h-8 inline-flex items-center gap-1.5 px-3.5 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
      children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[10px]", "aria-hidden": "true" }),
        "Yeni belge"
      ]
    }
  );
  if (m.length === 0)
    return /* @__PURE__ */ e.jsx(
      G,
      {
        icon: "fa-file-lines",
        title: r ? "Henüz belge yok" : "Bu projede henüz belge yok",
        desc: "Belgeler görevlere bağlı yazılır; ilkini buradan bir görev seçerek oluşturabilirsiniz.",
        action: y
      }
    );
  const h = (d, C) => M(d, C, (D) => D.taskId).map((D) => {
    var I;
    return /* @__PURE__ */ e.jsxs("section", { children: [
      /* @__PURE__ */ e.jsx(V, { task: D.task }),
      /* @__PURE__ */ e.jsx("ul", { className: "m-0 p-0 list-none", children: D.records.map((w) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => p(w.id),
          className: "flex w-full items-center gap-2.5 min-h-[44px] pl-10 pr-4 border-b border-subtle text-left cursor-pointer hover:bg-surface-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[12px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: w.title }),
            w.contentLength === 0 && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-neutral-subtle text-text-tertiary text-[10.5px] font-semibold", children: "boş" }),
            /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 text-[11px] text-text-tertiary", children: [
              w.editorName,
              " · ",
              ne(w.lastModificationTime ?? w.creationTime)
            ] })
          ]
        }
      ) }, w.id)) })
    ] }, ((I = D.task) == null ? void 0 : I.id) ?? "orphan");
  });
  return /* @__PURE__ */ e.jsxs("div", { className: "pb-4", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-end px-4 py-3", children: y }),
    r ? O(c, l, m, (d) => d.taskId).map((d) => {
      var C;
      return /* @__PURE__ */ e.jsxs("section", { children: [
        /* @__PURE__ */ e.jsx(H, { project: d.project }),
        h(d.tasks, d.records)
      ] }, ((C = d.project) == null ? void 0 : C.id) ?? "no-project");
    }) : h(l, m)
  ] });
}
function le({ tasks: t, showProject: s = !1, onCancel: n, onCreated: r }) {
  var m;
  const [o, a] = j.useState(((m = t[0]) == null ? void 0 : m.id) ?? ""), [i, p] = j.useState(""), [b, f] = j.useState(!1), l = async () => {
    if (!(!o || !i.trim() || b)) {
      f(!0);
      try {
        const c = await g.createDocument(o, i.trim());
        P.ok("Belge oluşturuldu."), r(c);
      } catch (c) {
        P.err((c == null ? void 0 : c.message) || "Belge oluşturulamadı."), f(!1);
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
          value: o,
          onChange: (c) => a(c.target.value),
          className: "h-9 px-2 rounded-lg border border-default bg-surface-base text-[12.5px] text-text-primary",
          children: t.map((c) => /* @__PURE__ */ e.jsx("option", { value: c.id, children: (s && c.projectName ? c.projectName + " — " : "") + (c.number > 0 ? `GRV-${c.number} · ` : "") + c.title }, c.id))
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
          value: i,
          onChange: (c) => p(c.target.value),
          onKeyDown: (c) => {
            c.key === "Enter" && l();
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
          onClick: n,
          className: "h-8 px-3.5 rounded-lg border border-default bg-surface-base text-[12.5px] font-semibold text-text-secondary cursor-pointer hover:bg-surface-hover",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: l,
          disabled: b || !i.trim() || !o,
          className: "h-8 px-4 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Oluştur"
        }
      )
    ] })
  ] });
}
function oe({ documentId: t, onBack: s, onChanged: n, onDeleted: r }) {
  const o = L(() => g.document(t), !0), [a, i] = j.useState(null), [p, b] = j.useState(null), [f, l] = j.useState(!1);
  if (o.status !== "ready")
    return o.status === "error" ? /* @__PURE__ */ e.jsx(F, { onRetry: o.reload }) : /* @__PURE__ */ e.jsx(R, {});
  const m = a ?? o.data.title, c = a !== null || p !== null, y = async () => {
    if (!f) {
      l(!0);
      try {
        await g.updateDocument(t, {
          title: m,
          content: p ?? o.data.content
        }), P.ok("Belge kaydedildi."), n(), s();
      } catch (d) {
        P.err((d == null ? void 0 : d.message) || "Belge kaydedilemedi."), l(!1);
      }
    }
  }, h = async () => {
    if (!(f || !window.confirm("Belge silinecek (geri alınabilir arşive gider). Devam edilsin mi?"))) {
      l(!0);
      try {
        await g.deleteDocument(t), P.ok("Belge silindi."), r();
      } catch (d) {
        P.err((d == null ? void 0 : d.message) || "Belge silinemedi."), l(!1);
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
          value: m,
          onChange: (d) => i(d.target.value),
          className: "flex-1 h-9 px-2.5 rounded-lg border border-default bg-surface-base text-[13.5px] font-bold text-text-primary focus:outline-none focus:border-focus",
          "aria-label": "Belge başlığı"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: h,
          disabled: f,
          title: "Belgeyi sil",
          className: "h-8 w-8 rounded-lg text-text-tertiary cursor-pointer hover:bg-negative-subtle hover:text-negative",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-trash text-[12px]", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: y,
          disabled: f || !c || !m.trim(),
          className: "h-8 px-4 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Kaydet"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      te,
      {
        value: o.data.content || "",
        onChange: b,
        placeholder: "Belge içeriği…"
      }
    )
  ] });
}
function ie({ projectId: t, kind: s, mountEl: n }) {
  const r = !t, o = $(s, n), a = L(
    () => Promise.all([
      _(t),
      g.projectForms(t),
      r ? g.projectsLookup() : Promise.resolve([])
    ]),
    o
  );
  if (!o || a.status === "idle" || a.status === "loading")
    return /* @__PURE__ */ e.jsx(R, {});
  if (a.status === "error")
    return /* @__PURE__ */ e.jsx(F, { onRetry: a.reload });
  const [i, p, b] = a.data;
  if (p.length === 0)
    return /* @__PURE__ */ e.jsx(
      G,
      {
        icon: "fa-clipboard-list",
        title: "Henüz form bağlanmadı",
        desc: "Form Yönetimi'ndeki bir formu görev detayından bağlayın; yanıtlar o görev bağlamında toplansın."
      }
    );
  const f = (l, m) => M(l, m, (c) => c.taskId).map((c) => {
    var y;
    return /* @__PURE__ */ e.jsxs("section", { children: [
      /* @__PURE__ */ e.jsx(V, { task: c.task }),
      /* @__PURE__ */ e.jsx("ul", { className: "m-0 p-0 list-none", children: c.records.map((h) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-2.5 min-h-[44px] pl-10 pr-4 border-b border-subtle", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clipboard-list text-[12px] text-text-tertiary", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: h.title }),
        h.isGuestFillable && /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-warning-subtle text-warning text-[10.5px] font-semibold",
            title: "Görevin dış paylaşım linkine açık",
            children: "dışa açık"
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-neutral-subtle text-text-secondary text-[10.5px] font-semibold font-mono", children: [
          h.responseCount,
          " yanıt"
        ] }),
        c.task && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => Z(c.task.id),
            className: "shrink-0 text-[12px] font-semibold text-primary cursor-pointer hover:underline",
            children: "Görevde aç →"
          }
        )
      ] }, h.id)) })
    ] }, ((y = c.task) == null ? void 0 : y.id) ?? "orphan");
  });
  return /* @__PURE__ */ e.jsx("div", { className: "pb-4", children: r ? O(b, i, p, (l) => l.taskId).map((l) => {
    var m;
    return /* @__PURE__ */ e.jsxs("section", { children: [
      /* @__PURE__ */ e.jsx(H, { project: l.project }),
      f(l.tasks, l.records)
    ] }, ((m = l.project) == null ? void 0 : m.id) ?? "no-project");
  }) : f(i, p) });
}
const K = "__project__:", A = (t) => K + t;
function ce({ projectId: t, kind: s, mountEl: n }) {
  const r = !t, o = $(s, n), a = L(
    () => Promise.all([
      _(t),
      g.projectChecklist(t),
      r ? g.projectsLookup() : Promise.resolve([])
    ]),
    o
  ), [i, p] = j.useState(null), [b, f] = j.useState(""), [l, m] = j.useState(!1);
  if (!o || a.status === "idle" || a.status === "loading")
    return /* @__PURE__ */ e.jsx(R, {});
  if (a.status === "error")
    return /* @__PURE__ */ e.jsx(F, { onRetry: a.reload });
  const [c, y, h] = a.data, d = y.filter((x) => !x.taskId), C = M(c, y.filter((x) => x.taskId), (x) => x.taskId), D = async (x) => {
    var u, N, S;
    m(!0);
    try {
      await x(), await a.reload();
    } catch (B) {
      (S = (N = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : N.error) == null || S.call(N, (B == null ? void 0 : B.message) || "İşlem tamamlanamadı.");
    } finally {
      m(!1);
    }
  }, I = (x) => {
    const u = b.trim();
    if (!u) {
      p(null);
      return;
    }
    f(""), p(null), D(() => String(x).indexOf(K) === 0 ? g.addProjectChecklistItem(String(x).slice(K.length), u) : g.addChecklistItem(x, u));
  }, w = (x) => /* @__PURE__ */ e.jsxs("li", { className: "group flex items-center gap-2.5 min-h-[38px] pl-10 pr-4 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: x.isDone,
        disabled: l,
        onChange: () => D(() => g.toggleChecklistItem(x.id)),
        className: "h-[15px] w-[15px] accent-[var(--apya-accent-500,#4F46E5)] cursor-pointer",
        "aria-label": x.text
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: `flex-1 text-[12.5px] ${x.isDone ? "text-text-tertiary line-through" : "text-text-primary"}`, children: x.text }),
    /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        title: "Maddeyi sil",
        disabled: l,
        onClick: () => D(() => g.deleteChecklistItem(x.id)),
        className: "opacity-0 group-hover:opacity-100 h-6 w-6 rounded-md text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[11px]", "aria-hidden": "true" })
      }
    )
  ] }, x.id), Y = (x) => /* @__PURE__ */ e.jsx("li", { className: "flex items-center gap-2.5 min-h-[36px] pl-10 pr-4", children: i === x ? /* @__PURE__ */ e.jsx(
    "input",
    {
      autoFocus: !0,
      type: "text",
      value: b,
      onChange: (u) => f(u.target.value),
      onKeyDown: (u) => {
        u.key === "Enter" && I(x), u.key === "Escape" && (p(null), f(""));
      },
      onBlur: () => I(x),
      placeholder: "Madde yazın, Enter ile ekleyin",
      className: "flex-1 h-7 px-2 rounded-md border border-default bg-surface-base text-[12.5px] focus:outline-none focus:border-focus"
    }
  ) : /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: () => {
        p(x), f("");
      },
      className: "text-[12px] font-semibold text-primary cursor-pointer hover:underline",
      children: "＋ madde ekle…"
    }
  ) }, "add"), q = (x) => x.filter((u) => u.isDone).length, J = (x, u) => /* @__PURE__ */ e.jsxs("section", { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 h-[42px] px-4 bg-surface-raised border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-diagram-project text-[11px] text-text-tertiary", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: "Proje maddeleri" }),
      u.length > 0 && /* @__PURE__ */ e.jsxs("span", { className: "ml-auto text-[11px] font-bold font-mono text-text-secondary", children: [
        q(u),
        "/",
        u.length
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("ul", { className: "m-0 p-0 list-none", children: [
      u.map(w),
      Y(A(x))
    ] })
  ] }), U = (x) => x.map((u) => {
    var N;
    return /* @__PURE__ */ e.jsxs("section", { children: [
      /* @__PURE__ */ e.jsx(
        V,
        {
          task: u.task,
          trailing: /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] font-bold font-mono text-text-secondary", children: [
            q(u.records),
            "/",
            u.records.length
          ] })
        }
      ),
      /* @__PURE__ */ e.jsxs("ul", { className: "m-0 p-0 list-none", children: [
        u.records.map(w),
        u.task && Y(u.task.id)
      ] })
    ] }, ((N = u.task) == null ? void 0 : N.id) ?? "orphan");
  });
  if (r) {
    const x = O(h, c, y, (u) => u.taskId, (u) => u.projectId);
    return x.length === 0 ? /* @__PURE__ */ e.jsx(
      G,
      {
        icon: "fa-square-check",
        tone: "success",
        title: "Henüz kontrol listesi yok",
        desc: "Maddeler görev detayından ya da projenin Kontrol Listesi panelinden eklenir."
      }
    ) : /* @__PURE__ */ e.jsx("div", { className: "pb-4", children: x.map((u) => {
      var Q;
      const N = (Q = u.project) == null ? void 0 : Q.id, S = u.records.filter((T) => !T.taskId), B = M(u.tasks, u.records.filter((T) => T.taskId), (T) => T.taskId);
      return /* @__PURE__ */ e.jsxs("section", { children: [
        /* @__PURE__ */ e.jsx(H, { project: u.project }),
        !!N && S.length > 0 && J(N, S),
        U(B)
      ] }, N ?? "no-project");
    }) });
  }
  const X = d.length > 0 || i === A(t);
  return !X && C.length === 0 ? /* @__PURE__ */ e.jsx(
    G,
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
            p(A(t)), f("");
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
    X ? J(t, d) : /* @__PURE__ */ e.jsx("div", { className: "flex justify-end px-4 py-2", children: /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          p(A(t)), f("");
        },
        className: "text-[12px] font-semibold text-primary cursor-pointer hover:underline",
        children: "＋ Proje maddesi ekle…"
      }
    ) }),
    U(C)
  ] });
}
function de({ projectId: t, kind: s, mountEl: n }) {
  const r = !t, o = $(s, n), a = L(
    () => Promise.all([
      _(t),
      g.projectDependencies(t),
      r ? g.projectsLookup() : Promise.resolve([])
    ]),
    o
  );
  if (!o || a.status === "idle" || a.status === "loading")
    return /* @__PURE__ */ e.jsx(R, {});
  if (a.status === "error")
    return /* @__PURE__ */ e.jsx(F, { onRetry: a.reload });
  const [i, p, b] = a.data, f = new Map(i.map((h) => [h.id, h])), l = se(p, f), m = new Set(l.map((h) => h.predecessorTaskId + "→" + h.taskId));
  if (p.length === 0)
    return /* @__PURE__ */ e.jsx(
      G,
      {
        icon: "fa-link",
        title: r ? "Görevler arası bağ yok" : "Bu projede görevler arası bağ yok",
        desc: "Öncül/ardıl bağlantıları görev detayının Bağımlılıklar sekmesinden kurulur."
      }
    );
  const c = ({ id: h }) => {
    const d = f.get(h);
    return d ? /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => Z(d.id),
        className: "flex items-center gap-2 min-w-0 text-left cursor-pointer group",
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate group-hover:text-primary", children: d.title }),
          /* @__PURE__ */ e.jsx(re, { status: d.status })
        ]
      }
    ) : /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary", children: "(görünmeyen görev)" });
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "pb-4", children: [
    l.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 m-4 mb-0 px-3.5 py-3 rounded-xl bg-negative-subtle border border-negative/30", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[13px] text-negative mt-0.5", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12px] leading-[1.55] text-negative", children: [
        /* @__PURE__ */ e.jsxs("b", { children: [
          l.length,
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
    r ? O(b, i, p, (h) => h.taskId).map((h) => {
      var d;
      return /* @__PURE__ */ e.jsxs("section", { children: [
        /* @__PURE__ */ e.jsx(H, { project: h.project }),
        y(h.records)
      ] }, ((d = h.project) == null ? void 0 : d.id) ?? "no-project");
    }) : y(p)
  ] });
  function y(h) {
    return /* @__PURE__ */ e.jsx("ul", { className: "m-0 p-0 list-none", children: h.map((d) => {
      const C = m.has(d.predecessorTaskId + "→" + d.taskId);
      return /* @__PURE__ */ e.jsxs(
        "li",
        {
          className: "flex items-center min-h-[44px] px-4 border-b border-subtle",
          children: [
            /* @__PURE__ */ e.jsxs("span", { className: "flex-1 min-w-0 flex items-center gap-2", children: [
              C && /* @__PURE__ */ e.jsx(
                "i",
                {
                  className: "fa-solid fa-triangle-exclamation text-[11px] text-negative",
                  title: "Öncül tamamlanmadı ve termini geçti — ardılı bloke ediyor",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ e.jsx(c, { id: d.predecessorTaskId })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "w-8 text-center text-text-tertiary", "aria-hidden": "true", children: "→" }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0", children: /* @__PURE__ */ e.jsx(c, { id: d.taskId }) })
          ]
        },
        d.predecessorTaskId + d.taskId
      );
    }) });
  }
}
const ue = [
  ["view-documents", "documents", ae],
  ["view-forms", "forms", ie],
  ["view-checklist", "checklist", ce],
  ["view-dependencies", "dependencies", de]
];
for (const [t, s, n] of ue) {
  const r = document.getElementById(t), o = r == null ? void 0 : r.getAttribute("data-project-id");
  r && (o || r.getAttribute("data-scope") === "all") && ee(r).render(/* @__PURE__ */ e.jsx(n, { projectId: o || null, kind: s, mountEl: r }));
}
