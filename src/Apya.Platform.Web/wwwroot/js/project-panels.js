import { r as f, j as e, b as M } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { S as A, R as $ } from "./RichTextEditorV3-D3Amhpsv.js";
function g() {
  var a, r, s;
  const t = (s = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.tasks) == null ? void 0 : s.task;
  if (!t) throw new Error("ABP görev servisi yüklenmedi.");
  return t;
}
const y = (t) => Promise.resolve(t), v = {
  projectDocuments: (t) => y(g().getProjectDocuments(t)),
  projectForms: (t) => y(g().getProjectLinkedForms(t)),
  projectChecklist: (t) => y(g().getProjectChecklist(t)),
  projectDependencies: (t) => y(g().getProjectDependencies(t)),
  document: (t) => y(g().getDocument(t)),
  createDocument: (t, a) => y(g().createDocument(t, a)),
  updateDocument: (t, a) => y(g().updateDocument(t, a)),
  deleteDocument: (t) => y(g().deleteDocument(t)),
  addChecklistItem: (t, a) => y(g().addChecklistItem(t, a)),
  toggleChecklistItem: (t) => y(g().toggleChecklistItem(t)),
  deleteChecklistItem: (t) => y(g().deleteChecklistItem(t))
}, I = /* @__PURE__ */ new Map();
function P(t, { force: a = !1 } = {}) {
  if (!a && I.has(t))
    return I.get(t);
  const r = y(g().getList({ projectId: t, maxResultCount: 1e3, rootOnly: !1 })).then((s) => (s == null ? void 0 : s.items) ?? []);
  return I.set(t, r), r.catch(() => {
    I.delete(t);
  }), r;
}
function G(t) {
  var a, r, s;
  (s = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.taskDetail) == null ? void 0 : r.open) == null || s.call(r, t);
}
function E(t, a) {
  const [r, s] = f.useState(
    () => !!a && !a.classList.contains("d-none")
  );
  return f.useEffect(() => {
    if (r) return;
    const n = (o) => {
      var i;
      ((i = o == null ? void 0 : o.detail) == null ? void 0 : i.kind) === t && s(!0);
    };
    return document.addEventListener("apya:project-panel-shown", n), () => document.removeEventListener("apya:project-panel-shown", n);
  }, [t, r]), r;
}
function B(t, a) {
  const [r, s] = f.useState({ status: "idle", data: null, error: null }), n = f.useRef(t);
  n.current = t;
  const o = f.useCallback(() => (s((i) => ({ ...i, status: i.data ? "reloading" : "loading", error: null })), n.current().then(
    (i) => s({ status: "ready", data: i, error: null }),
    (i) => s({ status: "error", data: null, error: i })
  )), []);
  return f.useEffect(() => {
    a && r.status === "idle" && o();
  }, [a, r.status, o]), { ...r, reload: o };
}
function F(t, a, r) {
  const s = new Map(t.map((i) => [i.id, { task: i, records: [] }])), n = { task: null, records: [] };
  for (const i of a) {
    const x = s.get(r(i));
    (x ? x.records : n.records).push(i);
  }
  const o = [...s.values()].filter((i) => i.records.length > 0);
  return n.records.length > 0 && o.push(n), o;
}
function z(t, a, r = /* @__PURE__ */ new Date()) {
  const s = new Date(r.getFullYear(), r.getMonth(), r.getDate());
  return t.filter((n) => {
    const o = a.get(n.predecessorTaskId);
    return !o || o.status === 4 ? !1 : !!o.dueDate && new Date(o.dueDate) < s;
  });
}
function S() {
  return /* @__PURE__ */ e.jsxs("div", { className: "p-5", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "h-10 w-1/3 rounded-lg bg-neutral-subtle animate-pulse mb-3" }),
    /* @__PURE__ */ e.jsx("div", { className: "h-36 rounded-xl bg-neutral-subtle animate-pulse" })
  ] });
}
function T({ onRetry: t }) {
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
function R({ icon: t, title: a, desc: r, action: s = null, tone: n = "primary" }) {
  const o = n === "success" ? "bg-success-subtle text-success" : "bg-primary-subtle text-primary";
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 py-14 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex h-11 w-11 items-center justify-center rounded-xl ${o}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[18px]`, "aria-hidden": "true" }) }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[14px] font-bold text-text-primary", children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "max-w-[360px] text-[12px] leading-[1.55] text-text-secondary", children: r }),
    s && /* @__PURE__ */ e.jsx("div", { className: "mt-1.5", children: s })
  ] });
}
function L({ task: t, trailing: a = null }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 h-[42px] px-4 bg-surface-raised border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-list-check text-[11px] text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary truncate", children: t ? t.title : "Görevi bulunamayan kayıtlar" }),
    t && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-primary-subtle text-primary text-[10.5px] font-semibold font-mono", children: t.number > 0 ? `GRV-${t.number}` : "GRV-—" }),
    a && /* @__PURE__ */ e.jsx("span", { className: "ml-auto flex items-center gap-2", children: a })
  ] });
}
function V({ status: t }) {
  const a = A[t] ?? A[1];
  return /* @__PURE__ */ e.jsxs("span", { className: `h-5 inline-flex items-center gap-1 px-2 rounded-full text-[10.5px] font-semibold ${a.bg} ${a.fg}`, children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${a.icon} text-[9px]`, "aria-hidden": "true" }),
    a.label
  ] });
}
const C = {
  ok: (t) => {
    var a, r, s;
    return (s = (r = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.notify) == null ? void 0 : r.success) == null ? void 0 : s.call(r, t);
  },
  err: (t) => {
    var a, r, s;
    return (s = (r = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.notify) == null ? void 0 : r.error) == null ? void 0 : s.call(r, t);
  }
}, Y = (t) => t ? new Date(t).toLocaleDateString("tr-TR") : "";
function K({ projectId: t, kind: a, mountEl: r }) {
  const s = E(a, r), n = B(
    () => Promise.all([P(t), v.projectDocuments(t)]),
    s
  ), [o, i] = f.useState(null), [x, c] = f.useState(!1);
  if (!s || n.status === "idle" || n.status === "loading")
    return /* @__PURE__ */ e.jsx(S, {});
  if (n.status === "error")
    return /* @__PURE__ */ e.jsx(T, { onRetry: n.reload });
  const [m, d] = n.data;
  if (o)
    return /* @__PURE__ */ e.jsx(
      H,
      {
        documentId: o,
        onBack: () => i(null),
        onChanged: () => n.reload(),
        onDeleted: () => {
          i(null), n.reload();
        }
      }
    );
  if (x)
    return /* @__PURE__ */ e.jsx(
      O,
      {
        tasks: m,
        onCancel: () => c(!1),
        onCreated: (b) => {
          c(!1), n.reload(), i(b.id);
        }
      }
    );
  const l = /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => c(!0),
      className: "h-8 inline-flex items-center gap-1.5 px-3.5 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
      children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[10px]", "aria-hidden": "true" }),
        "Yeni belge"
      ]
    }
  );
  if (d.length === 0)
    return /* @__PURE__ */ e.jsx(
      R,
      {
        icon: "fa-file-lines",
        title: "Bu projede henüz belge yok",
        desc: "Belgeler görevlere bağlı yazılır; ilkini buradan bir görev seçerek oluşturabilirsiniz.",
        action: l
      }
    );
  const h = F(m, d, (b) => b.taskId);
  return /* @__PURE__ */ e.jsxs("div", { className: "pb-4", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-end px-4 py-3", children: l }),
    h.map((b) => {
      var N;
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
                Y(u.lastModificationTime ?? u.creationTime)
              ] })
            ]
          }
        ) }, u.id)) })
      ] }, ((N = b.task) == null ? void 0 : N.id) ?? "orphan");
    })
  ] });
}
function O({ tasks: t, onCancel: a, onCreated: r }) {
  var d;
  const [s, n] = f.useState(((d = t[0]) == null ? void 0 : d.id) ?? ""), [o, i] = f.useState(""), [x, c] = f.useState(!1), m = async () => {
    if (!(!s || !o.trim() || x)) {
      c(!0);
      try {
        const l = await v.createDocument(s, o.trim());
        C.ok("Belge oluşturuldu."), r(l);
      } catch (l) {
        C.err((l == null ? void 0 : l.message) || "Belge oluşturulamadı."), c(!1);
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
          value: s,
          onChange: (l) => n(l.target.value),
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
            l.key === "Enter" && m();
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
          onClick: a,
          className: "h-8 px-3.5 rounded-lg border border-default bg-surface-base text-[12.5px] font-semibold text-text-secondary cursor-pointer hover:bg-surface-hover",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: m,
          disabled: x || !o.trim() || !s,
          className: "h-8 px-4 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Oluştur"
        }
      )
    ] })
  ] });
}
function H({ documentId: t, onBack: a, onChanged: r, onDeleted: s }) {
  const n = B(() => v.document(t), !0), [o, i] = f.useState(null), [x, c] = f.useState(null), [m, d] = f.useState(!1);
  if (n.status !== "ready")
    return n.status === "error" ? /* @__PURE__ */ e.jsx(T, { onRetry: n.reload }) : /* @__PURE__ */ e.jsx(S, {});
  const l = o ?? n.data.title, h = o !== null || x !== null, b = async () => {
    if (!m) {
      d(!0);
      try {
        await v.updateDocument(t, {
          title: l,
          content: x ?? n.data.content
        }), C.ok("Belge kaydedildi."), r(), a();
      } catch (u) {
        C.err((u == null ? void 0 : u.message) || "Belge kaydedilemedi."), d(!1);
      }
    }
  }, N = async () => {
    if (!(m || !window.confirm("Belge silinecek (geri alınabilir arşive gider). Devam edilsin mi?"))) {
      d(!0);
      try {
        await v.deleteDocument(t), C.ok("Belge silindi."), s();
      } catch (u) {
        C.err((u == null ? void 0 : u.message) || "Belge silinemedi."), d(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "p-4 flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: a,
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
          onClick: N,
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
          onClick: b,
          disabled: m || !h || !l.trim(),
          className: "h-8 px-4 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Kaydet"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      $,
      {
        value: n.data.content || "",
        onChange: c,
        placeholder: "Belge içeriği…"
      }
    )
  ] });
}
function q({ projectId: t, kind: a, mountEl: r }) {
  const s = E(a, r), n = B(
    () => Promise.all([P(t), v.projectForms(t)]),
    s
  );
  if (!s || n.status === "idle" || n.status === "loading")
    return /* @__PURE__ */ e.jsx(S, {});
  if (n.status === "error")
    return /* @__PURE__ */ e.jsx(T, { onRetry: n.reload });
  const [o, i] = n.data, x = F(o, i, (c) => c.taskId);
  return x.length === 0 ? /* @__PURE__ */ e.jsx(
    R,
    {
      icon: "fa-clipboard-list",
      title: "Henüz form bağlanmadı",
      desc: "Form Yönetimi'ndeki bir formu görev detayından bağlayın; yanıtlar o görev bağlamında toplansın."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: "pb-4", children: x.map((c) => {
    var m;
    return /* @__PURE__ */ e.jsxs("section", { children: [
      /* @__PURE__ */ e.jsx(L, { task: c.task }),
      /* @__PURE__ */ e.jsx("ul", { className: "m-0 p-0 list-none", children: c.records.map((d) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-2.5 min-h-[44px] pl-10 pr-4 border-b border-subtle", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clipboard-list text-[12px] text-text-tertiary", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: d.title }),
        d.isGuestFillable && /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-warning-subtle text-warning text-[10.5px] font-semibold",
            title: "Görevin dış paylaşım linkine açık",
            children: "dışa açık"
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-neutral-subtle text-text-secondary text-[10.5px] font-semibold font-mono", children: [
          d.responseCount,
          " yanıt"
        ] }),
        c.task && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => G(c.task.id),
            className: "shrink-0 text-[12px] font-semibold text-primary cursor-pointer hover:underline",
            children: "Görevde aç →"
          }
        )
      ] }, d.id)) })
    ] }, ((m = c.task) == null ? void 0 : m.id) ?? "orphan");
  }) });
}
function U({ projectId: t, kind: a, mountEl: r }) {
  const s = E(a, r), n = B(
    () => Promise.all([P(t), v.projectChecklist(t)]),
    s
  ), [o, i] = f.useState(null), [x, c] = f.useState(""), [m, d] = f.useState(!1);
  if (!s || n.status === "idle" || n.status === "loading")
    return /* @__PURE__ */ e.jsx(S, {});
  if (n.status === "error")
    return /* @__PURE__ */ e.jsx(T, { onRetry: n.reload });
  const [l, h] = n.data, b = F(l, h, (j) => j.taskId), N = async (j) => {
    var w, k, D;
    d(!0);
    try {
      await j(), await n.reload();
    } catch (p) {
      (D = (k = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : k.error) == null || D.call(k, (p == null ? void 0 : p.message) || "İşlem tamamlanamadı.");
    } finally {
      d(!1);
    }
  }, u = (j) => {
    const w = x.trim();
    if (!w) {
      i(null);
      return;
    }
    c(""), i(null), N(() => v.addChecklistItem(j, w));
  };
  return b.length === 0 ? /* @__PURE__ */ e.jsx(
    R,
    {
      icon: "fa-square-check",
      tone: "success",
      title: "Bu projede henüz kontrol listesi yok",
      desc: "Maddeler görevlerin kontrol listelerinden toplanır — bir görevi açıp ilk maddeyi ekleyin."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: "pb-4", children: b.map((j) => {
    var D;
    const w = j.records.filter((p) => p.isDone).length, k = (D = j.task) == null ? void 0 : D.id;
    return /* @__PURE__ */ e.jsxs("section", { children: [
      /* @__PURE__ */ e.jsx(
        L,
        {
          task: j.task,
          trailing: /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] font-bold font-mono text-text-secondary", children: [
            w,
            "/",
            j.records.length
          ] })
        }
      ),
      /* @__PURE__ */ e.jsxs("ul", { className: "m-0 p-0 list-none", children: [
        j.records.map((p) => /* @__PURE__ */ e.jsxs("li", { className: "group flex items-center gap-2.5 min-h-[38px] pl-10 pr-4 border-b border-subtle", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: p.isDone,
              disabled: m,
              onChange: () => N(() => v.toggleChecklistItem(p.id)),
              className: "h-[15px] w-[15px] accent-[var(--apya-accent-500,#4F46E5)] cursor-pointer",
              "aria-label": p.text
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: `flex-1 text-[12.5px] ${p.isDone ? "text-text-tertiary line-through" : "text-text-primary"}`, children: p.text }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Maddeyi sil",
              disabled: m,
              onClick: () => N(() => v.deleteChecklistItem(p.id)),
              className: "opacity-0 group-hover:opacity-100 h-6 w-6 rounded-md text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[11px]", "aria-hidden": "true" })
            }
          )
        ] }, p.id)),
        k && /* @__PURE__ */ e.jsx("li", { className: "flex items-center gap-2.5 min-h-[36px] pl-10 pr-4", children: o === k ? /* @__PURE__ */ e.jsx(
          "input",
          {
            autoFocus: !0,
            type: "text",
            value: x,
            onChange: (p) => c(p.target.value),
            onKeyDown: (p) => {
              p.key === "Enter" && u(k), p.key === "Escape" && (i(null), c(""));
            },
            onBlur: () => u(k),
            placeholder: "Madde yazın, Enter ile ekleyin",
            className: "flex-1 h-7 px-2 rounded-md border border-default bg-surface-base text-[12.5px] focus:outline-none focus:border-focus"
          }
        ) : /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              i(k), c("");
            },
            className: "text-[12px] font-semibold text-primary cursor-pointer hover:underline",
            children: "＋ madde ekle…"
          }
        ) })
      ] })
    ] }, k ?? "orphan");
  }) });
}
function _({ projectId: t, kind: a, mountEl: r }) {
  const s = E(a, r), n = B(
    () => Promise.all([P(t), v.projectDependencies(t)]),
    s
  );
  if (!s || n.status === "idle" || n.status === "loading")
    return /* @__PURE__ */ e.jsx(S, {});
  if (n.status === "error")
    return /* @__PURE__ */ e.jsx(T, { onRetry: n.reload });
  const [o, i] = n.data, x = new Map(o.map((l) => [l.id, l])), c = z(i, x), m = new Set(c.map((l) => l.predecessorTaskId + "→" + l.taskId));
  if (i.length === 0)
    return /* @__PURE__ */ e.jsx(
      R,
      {
        icon: "fa-link",
        title: "Bu projede görevler arası bağ yok",
        desc: "Öncül/ardıl bağlantıları görev detayının Bağımlılıklar sekmesinden kurulur."
      }
    );
  const d = ({ id: l }) => {
    const h = x.get(l);
    return h ? /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => G(h.id),
        className: "flex items-center gap-2 min-w-0 text-left cursor-pointer group",
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate group-hover:text-primary", children: h.title }),
          /* @__PURE__ */ e.jsx(V, { status: h.status })
        ]
      }
    ) : /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary", children: "(görünmeyen görev)" });
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "pb-4", children: [
    c.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 m-4 mb-0 px-3.5 py-3 rounded-xl bg-negative-subtle border border-negative/30", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[13px] text-negative mt-0.5", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12px] leading-[1.55] text-negative", children: [
        /* @__PURE__ */ e.jsxs("b", { children: [
          c.length,
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
      const h = m.has(l.predecessorTaskId + "→" + l.taskId);
      return /* @__PURE__ */ e.jsxs(
        "li",
        {
          className: "flex items-center min-h-[44px] px-4 border-b border-subtle",
          children: [
            /* @__PURE__ */ e.jsxs("span", { className: "flex-1 min-w-0 flex items-center gap-2", children: [
              h && /* @__PURE__ */ e.jsx(
                "i",
                {
                  className: "fa-solid fa-triangle-exclamation text-[11px] text-negative",
                  title: "Öncül tamamlanmadı ve termini geçti — ardılı bloke ediyor",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ e.jsx(d, { id: l.predecessorTaskId })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "w-8 text-center text-text-tertiary", "aria-hidden": "true", children: "→" }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0", children: /* @__PURE__ */ e.jsx(d, { id: l.taskId }) })
          ]
        },
        l.predecessorTaskId + l.taskId
      );
    }) })
  ] });
}
const J = [
  ["view-documents", "documents", K],
  ["view-forms", "forms", q],
  ["view-checklist", "checklist", U],
  ["view-dependencies", "dependencies", _]
];
for (const [t, a, r] of J) {
  const s = document.getElementById(t), n = s == null ? void 0 : s.getAttribute("data-project-id");
  s && n && M(s).render(/* @__PURE__ */ e.jsx(r, { projectId: n, kind: a, mountEl: s }));
}
