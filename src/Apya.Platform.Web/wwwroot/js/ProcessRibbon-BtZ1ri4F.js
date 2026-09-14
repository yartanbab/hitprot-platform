import { r as f, j as t } from "./react-vendor-D57GAUXd.js";
import { R as P, T as S, P as N, C as T } from "./ui-vendor-DaE-uom6.js";
import { B as v } from "./Dialog-Bky2XNdc.js";
const g = (...e) => e.filter(Boolean).join(" ");
function D({ items: e, size: n = "md", label: a = "Diğer eylemler" }) {
  const [s, o] = f.useState(!1), c = (e ?? []).filter(Boolean);
  return c.length === 0 ? null : /* @__PURE__ */ t.jsxs(P, { open: s, onOpenChange: o, children: [
    /* @__PURE__ */ t.jsx(S, { asChild: !0, children: /* @__PURE__ */ t.jsx(
      v,
      {
        variant: "secondary",
        size: n === "sm" ? "sm" : "icon",
        className: n === "sm" ? "w-8 px-0" : void 0,
        "aria-label": a,
        title: a,
        children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
      }
    ) }),
    /* @__PURE__ */ t.jsx(N, { children: /* @__PURE__ */ t.jsx(T, { align: "end", sideOffset: 6, collisionPadding: 12, className: "apya-docs-menu", children: c.map((i) => {
      const u = /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        i.icon && /* @__PURE__ */ t.jsx("i", { className: g("fa", i.icon, "apya-console-menu-icon"), "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsxs("span", { className: "apya-docs-menu-text", children: [
          /* @__PURE__ */ t.jsx("span", { children: i.label }),
          i.hint && /* @__PURE__ */ t.jsx("span", { className: "apya-docs-menu-hint", children: i.hint })
        ] })
      ] });
      return i.href && !i.disabled ? /* @__PURE__ */ t.jsx(
        "a",
        {
          href: i.href,
          className: g("apya-console-menu-item", i.className),
          onClick: () => o(!1),
          children: u
        },
        i.key
      ) : /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          className: g("apya-console-menu-item", i.className),
          disabled: i.disabled,
          onClick: () => {
            var y;
            o(!1), (y = i.onSelect) == null || y.call(i);
          },
          children: u
        },
        i.key
      );
    }) }) })
  ] });
}
function L({ title: e, description: n, primary: a, menuItems: s, aside: o }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "apya-docs-pagehead", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "apya-docs-pagehead-text", children: [
      /* @__PURE__ */ t.jsx("h1", { className: "apya-docs-pagehead-title", children: e }),
      n && /* @__PURE__ */ t.jsx("p", { className: "apya-docs-pagehead-desc", children: n })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "apya-docs-pagehead-actions", children: [
      o,
      a,
      /* @__PURE__ */ t.jsx(D, { items: s })
    ] })
  ] });
}
function z({ primary: e, link: n }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "apya-docs-empty-actions", children: [
    e,
    n && (n.href ? /* @__PURE__ */ t.jsx("a", { className: "apya-doc-linkbtn", href: n.href, children: n.label }) : /* @__PURE__ */ t.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: n.onClick, children: n.label }))
  ] });
}
const H = () => {
  var e, n, a;
  return (a = (n = (e = window == null ? void 0 : window.apya) == null ? void 0 : e.platform) == null ? void 0 : n.documents) == null ? void 0 : a.document;
}, W = (e) => {
  var n, a;
  return (a = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.auth) == null ? void 0 : a.isGranted(e);
}, J = (e, n) => {
  var a, s, o;
  return (o = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.notify) == null ? void 0 : s[e]) == null ? void 0 : o.call(s, n);
}, b = () => {
  var e;
  return ((e = window == null ? void 0 : window.abp) == null ? void 0 : e.appPath) ?? "/";
};
function r(e) {
  return new Promise((n, a) => {
    window.abp.ajax(e).done(n).fail(a);
  });
}
const l = (e, n = {}) => {
  const a = new URLSearchParams();
  Object.entries(n).forEach(([o, c]) => {
    if (!(c == null || c === "")) {
      if (Array.isArray(c)) {
        c.forEach((i) => a.append(o, i));
        return;
      }
      a.append(o, c);
    }
  });
  const s = a.toString();
  return `${b()}Documents?handler=${e}${s ? "&" + s : ""}`;
}, p = (e, n) => r({ url: e, type: "POST", contentType: "application/json", data: JSON.stringify(n) }), Y = (e) => r({ url: l("Files", e), type: "GET" }), _ = (e) => r({ url: l("File", { id: e }), type: "GET" }), I = (e, n) => p(l("UpdateFileMeta", { id: e }), n), Q = (e, n) => r({ url: l("MoveFile", { id: e, targetDocumentId: n }), type: "POST" }), V = (e, n) => p(l("BulkMove"), { documentFileIds: e, targetDocumentId: n }), X = (e, n, a = !1) => p(l("BulkTag"), { documentFileIds: e, tags: n, remove: a }), Z = (e) => r({ url: l("DeleteFile", { id: e }), type: "POST" }), ee = (e) => r({ url: l("RestoreFile", { id: e }), type: "POST" }), ne = () => r({ url: l("DocumentTypes"), type: "GET" }), ae = (e) => r({ url: l("WorkSteps", { projectId: e }), type: "GET" }), te = (e) => r({ url: l("CompliancePackages", { projectId: e }), type: "GET" }), R = (e, n) => r({ url: l("ComplianceOverview", { projectId: e, periodCode: n }), type: "GET" }), se = (e, n, a) => p(l("ApplyCompliancePackage"), { projectId: e, packageId: n, periodCode: a }), le = (e) => r({ url: l("RemoveComplianceAssignment", { assignmentId: e }), type: "POST" }), oe = (e) => p(l("WaiveComplianceItem"), e), ie = (e) => p(l("LinkComplianceDocument"), e), ce = () => r({ url: l("SetupState"), type: "GET" }), re = (e) => p(l("ApplySetup"), e), ue = () => r({ url: l("CompleteSetup"), type: "POST" }), pe = (e) => r({ url: l("Suggestions", { projectId: e }), type: "GET" }), de = (e) => p(l("ApplySuggestions"), { suggestions: e }), me = (e) => p(l("DismissSuggestions"), { suggestions: e }), fe = (e) => r({ url: l("ProjectTasks", { projectId: e }), type: "GET" }), ye = (e) => r({ url: l("ComplianceRequirements", { packageId: e }), type: "GET" }), ge = (e) => p(l("CreateCompliancePackage"), e), he = (e, n) => p(l("UpdateCompliancePackage", { id: e }), n), xe = (e) => r({ url: l("DeleteCompliancePackage", { id: e }), type: "POST" }), ke = (e, n) => p(l("AddComplianceRequirement", { packageId: e }), n), Ce = (e, n) => p(l("UpdateComplianceRequirement", { id: e }), n), be = (e) => r({ url: l("DeleteComplianceRequirement", { id: e }), type: "POST" }), we = (e) => r({ url: l("Activity", e), type: "GET" }), je = (e, n) => {
  const a = new FormData();
  return a.append("documentId", e), a.append("file", n), r({
    url: l("UploadFile"),
    type: "POST",
    data: a,
    contentType: !1,
    processData: !1
  });
}, h = [
  { key: "docs", no: 1, label: "Belgeler", sub: "Yükle · sınıflandır", path: "Documents" },
  { key: "compliance", no: 2, label: "Uygunluk", sub: "Kontrol listesi", path: "Documents", query: { tab: "compliance" } },
  { key: "report", no: 3, label: "Derle", sub: "Bölüm seç · önizle", path: "Documents/ReportBuilder" },
  { key: "deliver", no: 4, label: "Teslim", sub: "Son kontrol + paket", path: "Documents/Deliveries" }
], O = 2;
function E(e, n, a = "/") {
  const s = h.find((i) => i.key === e);
  if (!s) return null;
  const o = new URLSearchParams(s.query ?? {});
  n && o.set("projectId", n);
  const c = o.toString();
  return `${a}${s.path}${c ? `?${c}` : ""}`;
}
function F(e, n, a) {
  const s = n - a;
  return s <= 0 ? 100 : Math.round(e * 100 / s);
}
function $(e) {
  const n = e.totalCount - e.waivedCount, a = Math.min(e.satisfiedCount + 1, Math.max(n, 0));
  return F(a, e.totalCount, e.waivedCount);
}
function A(e) {
  const n = ((e == null ? void 0 : e.checklists) ?? []).flatMap((a) => a.items ?? []).filter((a) => a.status === O);
  return n.find((a) => a.isBlocking) ?? n[0] ?? null;
}
function Pe(e, n) {
  return !e || !n ? e === n : e.totalCount === n.totalCount && e.satisfiedCount === n.satisfiedCount && e.waivedCount === n.waivedCount && e.missingCount === n.missingCount && e.blockingMissingCount === n.blockingMissingCount && e.percent === n.percent;
}
function q({ hasProject: e, loading: n, overview: a }) {
  var c;
  if (!e) return "Proje seçin";
  if (n || !a) return "Kontrol listesi";
  if (!((c = a.checklists) != null && c.length)) return "Paket uygulanmadı";
  const { percent: s, missingCount: o } = a.summary;
  return o > 0 ? `%${s} · ${o} eksik` : `%${s} · tamam`;
}
function M(e, { hasProject: n, loading: a, overview: s }) {
  var u;
  if (!n) return { text: "Proje bağlamı seçin", tone: "neutral" };
  if (a) return { text: "…", tone: "neutral", pending: !0 };
  if (!s) return null;
  const o = s.summary ?? {}, c = (((u = s.checklists) == null ? void 0 : u.length) ?? 0) > 0;
  if (e === "report")
    return { text: "Önizle ve teslime geç", tone: "accent" };
  if (e === "deliver")
    return o.blockingMissingCount > 0 ? { text: `${o.blockingMissingCount} bloke kalemi çöz, paketi üret`, tone: "warning" } : { text: "Paketi üret", tone: "accent" };
  if (!c) return { text: "Kurum paketi uygula", tone: "accent" };
  if (e === "compliance")
    return o.missingCount > 0 ? { text: `${o.missingCount} eksik belgeyi yükle`, tone: "warning" } : { text: "Raporu derle", tone: "accent" };
  const i = A(s);
  return i ? { text: `Yükle: ${i.title} → uygunluk %${$(o)}`, tone: "warning" } : { text: "Raporu derle", tone: "accent" };
}
function G(e) {
  const [n, a] = f.useState({ projectId: null, overview: null, loading: !1, failed: !1 }), s = f.useRef(0), o = f.useCallback(async () => {
    const i = ++s.current;
    if (!e) {
      a({ projectId: null, overview: null, loading: !1, failed: !1 });
      return;
    }
    a((u) => ({
      projectId: e,
      overview: u.projectId === e ? u.overview : null,
      loading: !0,
      failed: !1
    }));
    try {
      const u = await R(e, null);
      i === s.current && a({ projectId: e, overview: u ?? null, loading: !1, failed: !1 });
    } catch (u) {
      i === s.current && a({ projectId: e, overview: null, loading: !1, failed: !0 }), console.error("[Documents] compliance overview", u);
    }
  }, [e]);
  f.useEffect(() => {
    o();
  }, [o]);
  const c = n.projectId === (e || null);
  return {
    overview: c ? n.overview : null,
    loading: e ? !c || n.loading : !1,
    failed: c && n.failed,
    reload: o
  };
}
const C = (...e) => e.filter(Boolean).join(" ");
function Se({ active: e = null, projectId: n = null, compliance: a, onSelect: s }) {
  const o = G(a ? null : n), c = a ?? o, i = { hasProject: !!n, loading: c.loading, overview: c.overview }, u = M(e, i), y = b(), w = (d, m) => {
    m.button !== 0 || m.metaKey || m.ctrlKey || m.shiftKey || m.altKey || s == null || s(d, m);
  };
  return /* @__PURE__ */ t.jsxs("nav", { className: "apya-flow", "aria-label": "Doküman süreci", children: [
    /* @__PURE__ */ t.jsx("ol", { className: "apya-flow-steps", children: h.map((d, m) => {
      const x = d.key === e, k = d.key === "compliance" ? q(i) : d.sub;
      return /* @__PURE__ */ t.jsxs("li", { className: C("apya-flow-step", x && "is-active"), children: [
        /* @__PURE__ */ t.jsxs(
          "a",
          {
            className: "apya-flow-link",
            href: E(d.key, n, y),
            "aria-current": x ? "step" : void 0,
            "aria-label": `${d.no}. ${d.label} · ${k}`,
            onClick: (j) => w(d.key, j),
            children: [
              /* @__PURE__ */ t.jsx("span", { className: "apya-flow-no", "aria-hidden": "true", children: d.no }),
              /* @__PURE__ */ t.jsxs("span", { className: "apya-flow-text", "aria-hidden": "true", children: [
                /* @__PURE__ */ t.jsx("span", { className: "apya-flow-label", children: d.label }),
                /* @__PURE__ */ t.jsx("span", { className: "apya-flow-sub", children: k })
              ] })
            ]
          }
        ),
        m < h.length - 1 && /* @__PURE__ */ t.jsx("span", { className: "apya-flow-arrow", "aria-hidden": "true", children: "→" })
      ] }, d.key);
    }) }),
    u && /* @__PURE__ */ t.jsxs("p", { className: C("apya-flow-next", `is-${u.tone}`), children: [
      /* @__PURE__ */ t.jsx("span", { className: "apya-flow-next-label", children: "Sırada:" }),
      /* @__PURE__ */ t.jsx("span", { className: "apya-flow-next-text", title: u.pending ? void 0 : u.text, children: u.text })
    ] })
  ] });
}
export {
  ce as A,
  _ as B,
  me as C,
  L as D,
  z as E,
  de as F,
  je as G,
  ie as H,
  Q as I,
  V as J,
  ee as K,
  X as L,
  I as M,
  Z as N,
  D as O,
  Se as P,
  b as a,
  fe as b,
  J as c,
  ge as d,
  xe as e,
  be as f,
  ye as g,
  Ce as h,
  ke as i,
  W as j,
  R as k,
  te as l,
  se as m,
  we as n,
  ue as o,
  re as p,
  H as q,
  le as r,
  ae as s,
  ne as t,
  he as u,
  Y as v,
  oe as w,
  G as x,
  Pe as y,
  pe as z
};
