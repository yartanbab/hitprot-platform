import { r as j, j as e, b as se } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { o as ee } from "./dataChanged-DR0MWWqM.js";
import { S as Z, R as re } from "./RichTextEditorV3-mZ6z1BBZ.js";
function k() {
  var s, r, a;
  const t = (a = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : a.task;
  if (!t) throw new Error("ABP görev servisi yüklenmedi.");
  return t;
}
const v = (t) => Promise.resolve(t), L = (t) => t ?? void 0, g = {
  projectDocuments: (t) => v(k().getProjectDocuments(L(t))),
  projectForms: (t) => v(k().getProjectLinkedForms(L(t))),
  projectChecklist: (t) => v(k().getProjectChecklist(L(t))),
  projectDependencies: (t) => v(k().getProjectDependencies(L(t))),
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
}, R = /* @__PURE__ */ new Map();
ee(() => {
  R.clear();
}, "task");
function _(t, { force: s = !1 } = {}) {
  const r = t ?? "__all__";
  if (!s && R.has(r))
    return R.get(r);
  const a = v(k().getList({ projectId: L(t), maxResultCount: 1e3, rootOnly: !1 })).then((l) => (l == null ? void 0 : l.items) ?? []);
  return R.set(r, a), a.catch(() => {
    R.delete(r);
  }), a;
}
function te(t) {
  var s, r, a;
  (a = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.taskDetail) == null ? void 0 : r.open) == null || a.call(r, t);
}
function $(t, s) {
  const [r, a] = j.useState(
    () => !!s && !s.classList.contains("d-none")
  );
  return j.useEffect(() => {
    if (r) return;
    const l = (n) => {
      var c;
      ((c = n == null ? void 0 : n.detail) == null ? void 0 : c.kind) === t && a(!0);
    };
    return document.addEventListener("apya:project-panel-shown", l), () => document.removeEventListener("apya:project-panel-shown", l);
  }, [t, r]), r;
}
function G(t, s) {
  const [r, a] = j.useState({ status: "idle", data: null, error: null }), l = j.useRef(t);
  l.current = t;
  const n = j.useRef(0), c = j.useCallback((m) => {
    const o = ++n.current;
    return a((x) => ({ ...x, status: x.data ? "reloading" : "loading", error: null })), l.current().then(
      (x) => {
        o === n.current && a({ status: "ready", data: x, error: null });
      },
      (x) => {
        o === n.current && a((i) => m && i.data ? { status: "ready", data: i.data, error: null } : { status: "error", data: null, error: x });
      }
    );
  }, []), d = j.useCallback(() => c(!1), [c]), b = j.useCallback(() => c(!0), [c]);
  return j.useEffect(() => {
    s && r.status === "idle" && d();
  }, [s, r.status, d]), { ...r, reload: d, refresh: b };
}
function O(t, s, r) {
  const a = ["ready", "reloading", "error"].includes(r.status), { refresh: l } = r;
  j.useEffect(() => {
    if (!a) return;
    let n = null;
    const c = () => {
      n === null && (n = setTimeout(() => {
        n = null, l();
      }, 0));
    }, d = (m) => {
      var o;
      ((o = m == null ? void 0 : m.detail) == null ? void 0 : o.kind) === t && c();
    };
    document.addEventListener("apya:project-panel-shown", d);
    const b = ee(() => {
      (!s || !s.classList.contains("d-none")) && c();
    }, "task");
    return () => {
      n !== null && clearTimeout(n), document.removeEventListener("apya:project-panel-shown", d), b();
    };
  }, [t, s, a, l]);
}
function M(t, s, r) {
  const a = new Map(t.map((c) => [c.id, { task: c, records: [] }])), l = { task: null, records: [] };
  for (const c of s) {
    const d = a.get(r(c));
    (d ? d.records : l.records).push(c);
  }
  const n = [...a.values()].filter((c) => c.records.length > 0);
  return l.records.length > 0 && n.push(l), n;
}
function H(t, s, r, a, l = null) {
  const n = new Map(s.map((o) => [o.id, o])), c = new Map(t.map((o) => [o.id, { project: o, tasks: [], records: [] }])), d = (o, x) => (c.has(o) || c.set(o, { project: { id: o, name: x || "" }, tasks: [], records: [] }), c.get(o));
  for (const o of s)
    o.projectId && d(o.projectId, o.projectName).tasks.push(o);
  const b = { project: null, tasks: [], records: [] };
  for (const o of r) {
    const x = n.get(a(o)), i = (x == null ? void 0 : x.projectId) ?? (l ? l(o) : null);
    (i ? d(i, x == null ? void 0 : x.projectName) : b).records.push(o);
  }
  b.tasks = s.filter((o) => !o.projectId);
  const m = [...c.values()].filter((o) => o.records.length > 0);
  return b.records.length > 0 && m.push(b), m;
}
function ne(t, s, r = /* @__PURE__ */ new Date()) {
  const a = new Date(r.getFullYear(), r.getMonth(), r.getDate());
  return t.filter((l) => {
    const n = s.get(l.predecessorTaskId);
    return !n || n.status === 4 ? !1 : !!n.dueDate && new Date(n.dueDate) < a;
  });
}
function F() {
  return /* @__PURE__ */ e.jsxs("div", { className: "p-5", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "h-10 w-1/3 rounded-lg bg-neutral-subtle animate-pulse mb-3" }),
    /* @__PURE__ */ e.jsx("div", { className: "h-36 rounded-xl bg-neutral-subtle animate-pulse" })
  ] });
}
function z({ onRetry: t }) {
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
function E({ icon: t, title: s, desc: r, action: a = null, tone: l = "primary" }) {
  const n = l === "success" ? "bg-success-subtle text-success" : "bg-primary-subtle text-primary";
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 py-14 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex h-11 w-11 items-center justify-center rounded-xl ${n}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[18px]`, "aria-hidden": "true" }) }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[14px] font-bold text-text-primary", children: s }),
    r && /* @__PURE__ */ e.jsx("span", { className: "max-w-[360px] text-[12px] leading-[1.55] text-text-secondary", children: r }),
    a && /* @__PURE__ */ e.jsx("div", { className: "mt-1.5", children: a })
  ] });
}
function K({ project: t }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 h-[46px] px-4 bg-surface-raised border-t-2 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-diagram-project text-[12px] text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t ? t.name || "(adsız proje)" : "Projesiz görevler" }),
    (t == null ? void 0 : t.code) && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-neutral-subtle text-text-secondary text-[10.5px] font-semibold font-mono", children: t.code })
  ] });
}
function Y({ task: t, trailing: s = null }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 h-[42px] px-4 bg-surface-raised border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-list-check text-[11px] text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary truncate", children: t ? t.title : "Görevi bulunamayan kayıtlar" }),
    t && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-primary-subtle text-primary text-[10.5px] font-semibold font-mono", children: t.number > 0 ? `GRV-${t.number}` : "GRV-—" }),
    s && /* @__PURE__ */ e.jsx("span", { className: "ml-auto flex items-center gap-2", children: s })
  ] });
}
function ae({ status: t }) {
  const s = Z[t] ?? Z[1];
  return /* @__PURE__ */ e.jsxs("span", { className: `h-5 inline-flex items-center gap-1 px-2 rounded-full text-[10.5px] font-semibold ${s.bg} ${s.fg}`, children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${s.icon} text-[9px]`, "aria-hidden": "true" }),
    s.label
  ] });
}
const P = {
  ok: (t) => {
    var s, r, a;
    return (a = (r = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.notify) == null ? void 0 : r.success) == null ? void 0 : a.call(r, t);
  },
  err: (t) => {
    var s, r, a;
    return (a = (r = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.notify) == null ? void 0 : r.error) == null ? void 0 : a.call(r, t);
  }
}, oe = (t) => t ? new Date(t).toLocaleDateString("tr-TR") : "";
function le({ projectId: t, kind: s, mountEl: r }) {
  const a = !t, l = $(s, r), n = G(
    () => Promise.all([
      _(t),
      g.projectDocuments(t),
      a ? g.projectsLookup() : Promise.resolve([])
    ]),
    l
  ), [c, d] = j.useState(null), [b, m] = j.useState(!1);
  if (O(s, r, n), !l || n.status === "idle" || n.status === "loading")
    return /* @__PURE__ */ e.jsx(F, {});
  if (n.status === "error")
    return /* @__PURE__ */ e.jsx(z, { onRetry: n.reload });
  const [o, x, i] = n.data;
  if (c)
    return /* @__PURE__ */ e.jsx(
      ce,
      {
        documentId: c,
        onBack: () => d(null),
        onChanged: () => n.reload(),
        onDeleted: () => {
          d(null), n.reload();
        }
      }
    );
  if (b)
    return /* @__PURE__ */ e.jsx(
      ie,
      {
        tasks: o,
        showProject: a,
        onCancel: () => m(!1),
        onCreated: (u) => {
          m(!1), n.reload(), d(u.id);
        }
      }
    );
  const y = /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => m(!0),
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
        title: a ? "Henüz belge yok" : "Bu projede henüz belge yok",
        desc: "Belgeler görevlere bağlı yazılır; ilkini buradan bir görev seçerek oluşturabilirsiniz.",
        action: y
      }
    );
  const h = (u, C) => M(u, C, (D) => D.taskId).map((D) => {
    var I;
    return /* @__PURE__ */ e.jsxs("section", { children: [
      /* @__PURE__ */ e.jsx(Y, { task: D.task }),
      /* @__PURE__ */ e.jsx("ul", { className: "m-0 p-0 list-none", children: D.records.map((w) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => d(w.id),
          className: "flex w-full items-center gap-2.5 min-h-[44px] pl-10 pr-4 border-b border-subtle text-left cursor-pointer hover:bg-surface-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[12px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: w.title }),
            w.contentLength === 0 && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-neutral-subtle text-text-tertiary text-[10.5px] font-semibold", children: "boş" }),
            /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 text-[11px] text-text-tertiary", children: [
              w.editorName,
              " · ",
              oe(w.lastModificationTime ?? w.creationTime)
            ] })
          ]
        }
      ) }, w.id)) })
    ] }, ((I = D.task) == null ? void 0 : I.id) ?? "orphan");
  });
  return /* @__PURE__ */ e.jsxs("div", { className: "pb-4", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-end px-4 py-3", children: y }),
    a ? H(i, o, x, (u) => u.taskId).map((u) => {
      var C;
      return /* @__PURE__ */ e.jsxs("section", { children: [
        /* @__PURE__ */ e.jsx(K, { project: u.project }),
        h(u.tasks, u.records)
      ] }, ((C = u.project) == null ? void 0 : C.id) ?? "no-project");
    }) : h(o, x)
  ] });
}
function ie({ tasks: t, showProject: s = !1, onCancel: r, onCreated: a }) {
  var x;
  const [l, n] = j.useState(((x = t[0]) == null ? void 0 : x.id) ?? ""), [c, d] = j.useState(""), [b, m] = j.useState(!1), o = async () => {
    if (!(!l || !c.trim() || b)) {
      m(!0);
      try {
        const i = await g.createDocument(l, c.trim());
        P.ok("Belge oluşturuldu."), a(i);
      } catch (i) {
        P.err((i == null ? void 0 : i.message) || "Belge oluşturulamadı."), m(!1);
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
          value: l,
          onChange: (i) => n(i.target.value),
          className: "h-9 px-2 rounded-lg border border-default bg-surface-base text-[12.5px] text-text-primary",
          children: t.map((i) => /* @__PURE__ */ e.jsx("option", { value: i.id, children: (s && i.projectName ? i.projectName + " — " : "") + (i.number > 0 ? `GRV-${i.number} · ` : "") + i.title }, i.id))
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
          value: c,
          onChange: (i) => d(i.target.value),
          onKeyDown: (i) => {
            i.key === "Enter" && o();
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
          onClick: r,
          className: "h-8 px-3.5 rounded-lg border border-default bg-surface-base text-[12.5px] font-semibold text-text-secondary cursor-pointer hover:bg-surface-hover",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: o,
          disabled: b || !c.trim() || !l,
          className: "h-8 px-4 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Oluştur"
        }
      )
    ] })
  ] });
}
function ce({ documentId: t, onBack: s, onChanged: r, onDeleted: a }) {
  const l = G(() => g.document(t), !0), [n, c] = j.useState(null), [d, b] = j.useState(null), [m, o] = j.useState(!1);
  if (l.status !== "ready")
    return l.status === "error" ? /* @__PURE__ */ e.jsx(z, { onRetry: l.reload }) : /* @__PURE__ */ e.jsx(F, {});
  const x = n ?? l.data.title, i = n !== null || d !== null, y = async () => {
    if (!m) {
      o(!0);
      try {
        await g.updateDocument(t, {
          title: x,
          content: d ?? l.data.content
        }), P.ok("Belge kaydedildi."), r(), s();
      } catch (u) {
        P.err((u == null ? void 0 : u.message) || "Belge kaydedilemedi."), o(!1);
      }
    }
  }, h = async () => {
    if (!(m || !window.confirm("Belge silinecek (geri alınabilir arşive gider). Devam edilsin mi?"))) {
      o(!0);
      try {
        await g.deleteDocument(t), P.ok("Belge silindi."), a();
      } catch (u) {
        P.err((u == null ? void 0 : u.message) || "Belge silinemedi."), o(!1);
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
          value: x,
          onChange: (u) => c(u.target.value),
          className: "flex-1 h-9 px-2.5 rounded-lg border border-default bg-surface-base text-[13.5px] font-bold text-text-primary focus:outline-none focus:border-focus",
          "aria-label": "Belge başlığı"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: h,
          disabled: m,
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
          disabled: m || !i || !x.trim(),
          className: "h-8 px-4 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Kaydet"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      re,
      {
        value: l.data.content || "",
        onChange: b,
        placeholder: "Belge içeriği…"
      }
    )
  ] });
}
function de({ projectId: t, kind: s, mountEl: r }) {
  const a = !t, l = $(s, r), n = G(
    () => Promise.all([
      _(t),
      g.projectForms(t),
      a ? g.projectsLookup() : Promise.resolve([])
    ]),
    l
  );
  if (O(s, r, n), !l || n.status === "idle" || n.status === "loading")
    return /* @__PURE__ */ e.jsx(F, {});
  if (n.status === "error")
    return /* @__PURE__ */ e.jsx(z, { onRetry: n.reload });
  const [c, d, b] = n.data;
  if (d.length === 0)
    return /* @__PURE__ */ e.jsx(
      E,
      {
        icon: "fa-clipboard-list",
        title: "Henüz form bağlanmadı",
        desc: "Form Yönetimi'ndeki bir formu görev detayından bağlayın; yanıtlar o görev bağlamında toplansın."
      }
    );
  const m = (o, x) => M(o, x, (i) => i.taskId).map((i) => {
    var y;
    return /* @__PURE__ */ e.jsxs("section", { children: [
      /* @__PURE__ */ e.jsx(Y, { task: i.task }),
      /* @__PURE__ */ e.jsx("ul", { className: "m-0 p-0 list-none", children: i.records.map((h) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-2.5 min-h-[44px] pl-10 pr-4 border-b border-subtle", children: [
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
        i.task && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => te(i.task.id),
            className: "shrink-0 text-[12px] font-semibold text-primary cursor-pointer hover:underline",
            children: "Görevde aç →"
          }
        )
      ] }, h.id)) })
    ] }, ((y = i.task) == null ? void 0 : y.id) ?? "orphan");
  });
  return /* @__PURE__ */ e.jsx("div", { className: "pb-4", children: a ? H(b, c, d, (o) => o.taskId).map((o) => {
    var x;
    return /* @__PURE__ */ e.jsxs("section", { children: [
      /* @__PURE__ */ e.jsx(K, { project: o.project }),
      m(o.tasks, o.records)
    ] }, ((x = o.project) == null ? void 0 : x.id) ?? "no-project");
  }) : m(c, d) });
}
const V = "__project__:", A = (t) => V + t;
function ue({ projectId: t, kind: s, mountEl: r }) {
  const a = !t, l = $(s, r), n = G(
    () => Promise.all([
      _(t),
      g.projectChecklist(t),
      a ? g.projectsLookup() : Promise.resolve([])
    ]),
    l
  );
  O(s, r, n);
  const [c, d] = j.useState(null), [b, m] = j.useState(""), [o, x] = j.useState(!1);
  if (!l || n.status === "idle" || n.status === "loading")
    return /* @__PURE__ */ e.jsx(F, {});
  if (n.status === "error")
    return /* @__PURE__ */ e.jsx(z, { onRetry: n.reload });
  const [i, y, h] = n.data, u = y.filter((f) => !f.taskId), C = M(i, y.filter((f) => f.taskId), (f) => f.taskId), D = async (f) => {
    var p, N, S;
    x(!0);
    try {
      await f(), await n.reload();
    } catch (B) {
      (S = (N = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : N.error) == null || S.call(N, (B == null ? void 0 : B.message) || "İşlem tamamlanamadı.");
    } finally {
      x(!1);
    }
  }, I = (f) => {
    const p = b.trim();
    if (!p) {
      d(null);
      return;
    }
    m(""), d(null), D(() => String(f).indexOf(V) === 0 ? g.addProjectChecklistItem(String(f).slice(V.length), p) : g.addChecklistItem(f, p));
  }, w = (f) => /* @__PURE__ */ e.jsxs("li", { className: "group flex items-center gap-2.5 min-h-[38px] pl-10 pr-4 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: f.isDone,
        disabled: o,
        onChange: () => D(() => g.toggleChecklistItem(f.id)),
        className: "h-[15px] w-[15px] accent-[var(--apya-accent-500,#4F46E5)] cursor-pointer",
        "aria-label": f.text
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: `flex-1 text-[12.5px] ${f.isDone ? "text-text-tertiary line-through" : "text-text-primary"}`, children: f.text }),
    /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        title: "Maddeyi sil",
        disabled: o,
        onClick: () => D(() => g.deleteChecklistItem(f.id)),
        className: "opacity-0 group-hover:opacity-100 h-6 w-6 rounded-md text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[11px]", "aria-hidden": "true" })
      }
    )
  ] }, f.id), q = (f) => /* @__PURE__ */ e.jsx("li", { className: "flex items-center gap-2.5 min-h-[36px] pl-10 pr-4", children: c === f ? /* @__PURE__ */ e.jsx(
    "input",
    {
      autoFocus: !0,
      type: "text",
      value: b,
      onChange: (p) => m(p.target.value),
      onKeyDown: (p) => {
        p.key === "Enter" && I(f), p.key === "Escape" && (d(null), m(""));
      },
      onBlur: () => I(f),
      placeholder: "Madde yazın, Enter ile ekleyin",
      className: "flex-1 h-7 px-2 rounded-md border border-default bg-surface-base text-[12.5px] focus:outline-none focus:border-focus"
    }
  ) : /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: () => {
        d(f), m("");
      },
      className: "text-[12px] font-semibold text-primary cursor-pointer hover:underline",
      children: "＋ madde ekle…"
    }
  ) }, "add"), J = (f) => f.filter((p) => p.isDone).length, U = (f, p) => /* @__PURE__ */ e.jsxs("section", { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 h-[42px] px-4 bg-surface-raised border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-diagram-project text-[11px] text-text-tertiary", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: "Proje maddeleri" }),
      p.length > 0 && /* @__PURE__ */ e.jsxs("span", { className: "ml-auto text-[11px] font-bold font-mono text-text-secondary", children: [
        J(p),
        "/",
        p.length
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("ul", { className: "m-0 p-0 list-none", children: [
      p.map(w),
      q(A(f))
    ] })
  ] }), X = (f) => f.map((p) => {
    var N;
    return /* @__PURE__ */ e.jsxs("section", { children: [
      /* @__PURE__ */ e.jsx(
        Y,
        {
          task: p.task,
          trailing: /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] font-bold font-mono text-text-secondary", children: [
            J(p.records),
            "/",
            p.records.length
          ] })
        }
      ),
      /* @__PURE__ */ e.jsxs("ul", { className: "m-0 p-0 list-none", children: [
        p.records.map(w),
        p.task && q(p.task.id)
      ] })
    ] }, ((N = p.task) == null ? void 0 : N.id) ?? "orphan");
  });
  if (a) {
    const f = H(h, i, y, (p) => p.taskId, (p) => p.projectId);
    return f.length === 0 ? /* @__PURE__ */ e.jsx(
      E,
      {
        icon: "fa-square-check",
        tone: "success",
        title: "Henüz kontrol listesi yok",
        desc: "Maddeler görev detayından ya da projenin Kontrol Listesi panelinden eklenir."
      }
    ) : /* @__PURE__ */ e.jsx("div", { className: "pb-4", children: f.map((p) => {
      var W;
      const N = (W = p.project) == null ? void 0 : W.id, S = p.records.filter((T) => !T.taskId), B = M(p.tasks, p.records.filter((T) => T.taskId), (T) => T.taskId);
      return /* @__PURE__ */ e.jsxs("section", { children: [
        /* @__PURE__ */ e.jsx(K, { project: p.project }),
        !!N && S.length > 0 && U(N, S),
        X(B)
      ] }, N ?? "no-project");
    }) });
  }
  const Q = u.length > 0 || c === A(t);
  return !Q && C.length === 0 ? /* @__PURE__ */ e.jsx(
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
            d(A(t)), m("");
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
    Q ? U(t, u) : /* @__PURE__ */ e.jsx("div", { className: "flex justify-end px-4 py-2", children: /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          d(A(t)), m("");
        },
        className: "text-[12px] font-semibold text-primary cursor-pointer hover:underline",
        children: "＋ Proje maddesi ekle…"
      }
    ) }),
    X(C)
  ] });
}
function xe({ projectId: t, kind: s, mountEl: r }) {
  const a = !t, l = $(s, r), n = G(
    () => Promise.all([
      _(t),
      g.projectDependencies(t),
      a ? g.projectsLookup() : Promise.resolve([])
    ]),
    l
  );
  if (O(s, r, n), !l || n.status === "idle" || n.status === "loading")
    return /* @__PURE__ */ e.jsx(F, {});
  if (n.status === "error")
    return /* @__PURE__ */ e.jsx(z, { onRetry: n.reload });
  const [c, d, b] = n.data, m = new Map(c.map((h) => [h.id, h])), o = ne(d, m), x = new Set(o.map((h) => h.predecessorTaskId + "→" + h.taskId));
  if (d.length === 0)
    return /* @__PURE__ */ e.jsx(
      E,
      {
        icon: "fa-link",
        title: a ? "Görevler arası bağ yok" : "Bu projede görevler arası bağ yok",
        desc: "Öncül/ardıl bağlantıları görev detayının Bağımlılıklar sekmesinden kurulur."
      }
    );
  const i = ({ id: h }) => {
    const u = m.get(h);
    return u ? /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => te(u.id),
        className: "flex items-center gap-2 min-w-0 text-left cursor-pointer group",
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate group-hover:text-primary", children: u.title }),
          /* @__PURE__ */ e.jsx(ae, { status: u.status })
        ]
      }
    ) : /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary", children: "(görünmeyen görev)" });
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "pb-4", children: [
    o.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 m-4 mb-0 px-3.5 py-3 rounded-xl bg-negative-subtle border border-negative/30", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[13px] text-negative mt-0.5", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12px] leading-[1.55] text-negative", children: [
        /* @__PURE__ */ e.jsxs("b", { children: [
          o.length,
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
    a ? H(b, c, d, (h) => h.taskId).map((h) => {
      var u;
      return /* @__PURE__ */ e.jsxs("section", { children: [
        /* @__PURE__ */ e.jsx(K, { project: h.project }),
        y(h.records)
      ] }, ((u = h.project) == null ? void 0 : u.id) ?? "no-project");
    }) : y(d)
  ] });
  function y(h) {
    return /* @__PURE__ */ e.jsx("ul", { className: "m-0 p-0 list-none", children: h.map((u) => {
      const C = x.has(u.predecessorTaskId + "→" + u.taskId);
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
              /* @__PURE__ */ e.jsx(i, { id: u.predecessorTaskId })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "w-8 text-center text-text-tertiary", "aria-hidden": "true", children: "→" }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0", children: /* @__PURE__ */ e.jsx(i, { id: u.taskId }) })
          ]
        },
        u.predecessorTaskId + u.taskId
      );
    }) });
  }
}
const pe = [
  ["view-documents", "documents", le],
  ["view-forms", "forms", de],
  ["view-checklist", "checklist", ue],
  ["view-dependencies", "dependencies", xe]
];
for (const [t, s, r] of pe) {
  const a = document.getElementById(t), l = a == null ? void 0 : a.getAttribute("data-project-id");
  a && (l || a.getAttribute("data-scope") === "all") && se(a).render(/* @__PURE__ */ e.jsx(r, { projectId: l || null, kind: s, mountEl: a }));
}
