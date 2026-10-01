import { r as y, j as t } from "./react-vendor-D7YDiBbi.js";
import { R as N, T, P as v, C as R } from "./ui-vendor-UYevF8mE.js";
import { B as D } from "./Dialog-BdrRxZcw.js";
import { t as E, R as F } from "./index-DgpuJ91w.js";
const g = (...e) => e.filter(Boolean).join(" ");
function O({ items: e, size: a = "md", label: n = "Diğer eylemler" }) {
  const [s, o] = y.useState(!1), c = (e ?? []).filter(Boolean);
  return c.length === 0 ? null : /* @__PURE__ */ t.jsxs(N, { open: s, onOpenChange: o, children: [
    /* @__PURE__ */ t.jsx(T, { asChild: !0, children: /* @__PURE__ */ t.jsx(
      D,
      {
        variant: "secondary",
        size: a === "sm" ? "sm" : "icon",
        className: a === "sm" ? "w-8 px-0" : void 0,
        "aria-label": n,
        title: n,
        children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
      }
    ) }),
    /* @__PURE__ */ t.jsx(v, { children: /* @__PURE__ */ t.jsx(R, { align: "end", sideOffset: 6, collisionPadding: 12, className: "apya-docs-menu", children: c.map((i) => {
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
            var m;
            o(!1), (m = i.onSelect) == null || m.call(i);
          },
          children: u
        },
        i.key
      );
    }) }) })
  ] });
}
function J({ title: e, description: a, primary: n, menuItems: s, aside: o }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "apya-docs-pagehead", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "apya-docs-pagehead-text", children: [
      /* @__PURE__ */ t.jsx("h1", { className: "apya-docs-pagehead-title", children: e }),
      a && /* @__PURE__ */ t.jsx("p", { className: "apya-docs-pagehead-desc", children: a })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "apya-docs-pagehead-actions", children: [
      o,
      n,
      /* @__PURE__ */ t.jsx(O, { items: s })
    ] })
  ] });
}
function Y({ primary: e, link: a }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "apya-docs-empty-actions", children: [
    e,
    a && (a.href ? /* @__PURE__ */ t.jsx("a", { className: "apya-doc-linkbtn", href: a.href, children: a.label }) : /* @__PURE__ */ t.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: a.onClick, children: a.label }))
  ] });
}
const _ = () => {
  var e, a, n;
  return (n = (a = (e = window == null ? void 0 : window.apya) == null ? void 0 : e.platform) == null ? void 0 : a.documents) == null ? void 0 : n.document;
}, Q = (e) => {
  var a, n;
  return (n = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : n.isGranted(e);
}, V = (e, a) => {
  var n, s, o;
  return (o = (s = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.notify) == null ? void 0 : s[e]) == null ? void 0 : o.call(s, a);
}, b = () => {
  var e;
  return ((e = window == null ? void 0 : window.abp) == null ? void 0 : e.appPath) ?? "/";
};
function r(e) {
  return new Promise((a, n) => {
    window.abp.ajax(e).done(a).fail(n);
  });
}
const l = (e, a = {}) => {
  const n = new URLSearchParams();
  Object.entries(a).forEach(([o, c]) => {
    if (!(c == null || c === "")) {
      if (Array.isArray(c)) {
        c.forEach((i) => n.append(o, i));
        return;
      }
      n.append(o, c);
    }
  });
  const s = n.toString();
  return `${b()}Documents?handler=${e}${s ? "&" + s : ""}`;
}, d = (e, a) => r({ url: e, type: "POST", contentType: "application/json", data: JSON.stringify(a) }), X = (e, a) => r({ url: l("Files", e), type: "GET", ...a }), Z = (e) => r({ url: l("File", { id: e }), type: "GET" }), ee = (e, a) => d(l("UpdateFileMeta", { id: e }), a), ae = (e, a) => r({ url: l("MoveFile", { id: e, targetDocumentId: a }), type: "POST" }), ne = (e, a) => d(l("BulkMove"), { documentFileIds: e, targetDocumentId: a }), te = (e, a, n = !1) => d(l("BulkTag"), { documentFileIds: e, tags: a, remove: n }), se = (e) => r({ url: l("DeleteFile", { id: e }), type: "POST" }), le = (e) => r({ url: l("RestoreFile", { id: e }), type: "POST" }), oe = (e) => r({ url: l("DocumentTypes"), type: "GET", ...e }), ie = (e, a) => r({ url: l("WorkSteps", { projectId: e }), type: "GET", ...a }), ce = (e, a) => r({ url: l("CompliancePackages", { projectId: e }), type: "GET", ...a }), $ = (e, a, n) => r({ url: l("ComplianceOverview", { projectId: e, periodCode: a }), type: "GET", ...n }), re = (e, a, n) => d(l("ApplyCompliancePackage"), { projectId: e, packageId: a, periodCode: n }), ue = (e) => r({ url: l("RemoveComplianceAssignment", { assignmentId: e }), type: "POST" }), pe = (e) => d(l("WaiveComplianceItem"), e), de = (e) => d(l("LinkComplianceDocument"), e), me = (e) => r({ url: l("SetupState"), type: "GET", ...e }), fe = (e) => d(l("ApplySetup"), e), ye = () => r({ url: l("CompleteSetup"), type: "POST" }), ge = (e, a) => r({ url: l("Suggestions", { projectId: e }), type: "GET", ...a }), he = (e) => d(l("ApplySuggestions"), { suggestions: e }), xe = (e) => d(l("DismissSuggestions"), { suggestions: e }), ke = (e) => r({ url: l("ProjectTasks", { projectId: e }), type: "GET" }), Ce = (e) => r({ url: l("ComplianceRequirements", { packageId: e }), type: "GET" }), be = (e) => d(l("CreateCompliancePackage"), e), we = (e, a) => d(l("UpdateCompliancePackage", { id: e }), a), je = (e) => r({ url: l("DeleteCompliancePackage", { id: e }), type: "POST" }), Pe = (e, a) => d(l("AddComplianceRequirement", { packageId: e }), a), Se = (e, a) => d(l("UpdateComplianceRequirement", { id: e }), a), Ne = (e) => r({ url: l("DeleteComplianceRequirement", { id: e }), type: "POST" }), Te = (e, a) => r({ url: l("Activity", e), type: "GET", ...a }), ve = (e, a) => {
  const n = new FormData();
  return n.append("documentId", e), n.append("file", a), r({
    url: l("UploadFile"),
    type: "POST",
    data: n,
    contentType: !1,
    processData: !1
  });
}, h = [
  { key: "docs", no: 1, label: "Belgeler", sub: "Yükle · sınıflandır", path: "Documents" },
  { key: "compliance", no: 2, label: "Uygunluk", sub: "Kontrol listesi", path: "Documents", query: { tab: "compliance" } },
  { key: "report", no: 3, label: "Derle", sub: "Bölüm seç · önizle", path: "Documents/ReportBuilder" },
  { key: "deliver", no: 4, label: "Teslim", sub: "Son kontrol + paket", path: "Documents/Deliveries" }
], A = 2;
function q(e, a, n = "/") {
  const s = h.find((i) => i.key === e);
  if (!s) return null;
  const o = new URLSearchParams(s.query ?? {});
  a && o.set("projectId", a);
  const c = o.toString();
  return `${n}${s.path}${c ? `?${c}` : ""}`;
}
function M(e, a, n) {
  const s = a - n;
  return s <= 0 ? 100 : Math.round(e * 100 / s);
}
function B(e) {
  const a = e.totalCount - e.waivedCount, n = Math.min(e.satisfiedCount + 1, Math.max(a, 0));
  return M(n, e.totalCount, e.waivedCount);
}
function G(e) {
  const a = ((e == null ? void 0 : e.checklists) ?? []).flatMap((n) => n.items ?? []).filter((n) => n.status === A);
  return a.find((n) => n.isBlocking) ?? a[0] ?? null;
}
function Re(e, a) {
  return !e || !a ? e === a : e.totalCount === a.totalCount && e.satisfiedCount === a.satisfiedCount && e.waivedCount === a.waivedCount && e.missingCount === a.missingCount && e.blockingMissingCount === a.blockingMissingCount && e.percent === a.percent;
}
function K({ hasProject: e, loading: a, failed: n, overview: s }) {
  var i;
  if (!e) return "Proje seçin";
  if (n) return E("Common:LoadFailed", "Yüklenemedi");
  if (a || !s) return "Kontrol listesi";
  if (!((i = s.checklists) != null && i.length)) return "Paket uygulanmadı";
  const { percent: o, missingCount: c } = s.summary;
  return c > 0 ? `%${o} · ${c} eksik` : `%${o} · tamam`;
}
function U(e, { hasProject: a, loading: n, failed: s, overview: o }) {
  var m;
  if (!a) return { text: "Proje bağlamı seçin", tone: "neutral" };
  if (s) return null;
  if (n) return { text: "…", tone: "neutral", pending: !0 };
  if (!o) return null;
  const c = o.summary ?? {}, i = (((m = o.checklists) == null ? void 0 : m.length) ?? 0) > 0;
  if (e === "report")
    return { text: "Önizle ve teslime geç", tone: "accent" };
  if (e === "deliver")
    return c.blockingMissingCount > 0 ? { text: `${c.blockingMissingCount} bloke kalemi çöz, paketi üret`, tone: "warning" } : { text: "Paketi üret", tone: "accent" };
  if (!i) return { text: "Kurum paketi uygula", tone: "accent" };
  if (e === "compliance")
    return c.missingCount > 0 ? { text: `${c.missingCount} eksik belgeyi yükle`, tone: "warning" } : { text: "Raporu derle", tone: "accent" };
  const u = G(o);
  return u ? { text: `Yükle: ${u.title} → uygunluk %${B(c)}`, tone: "warning" } : { text: "Raporu derle", tone: "accent" };
}
function L(e) {
  const [a, n] = y.useState({ projectId: null, overview: null, loading: !1, failed: !1 }), s = y.useRef(0), o = y.useCallback(async () => {
    const i = ++s.current;
    if (!e) {
      n({ projectId: null, overview: null, loading: !1, failed: !1 });
      return;
    }
    n((u) => ({
      projectId: e,
      overview: u.projectId === e ? u.overview : null,
      loading: !0,
      // Aynı projede yeniden denenirken hata bayrağı kalır: şeridin "Tekrar dene"si
      // istek sürerken sökülmez (odak düğmede), "Yüklenemedi" nötr etikete dönmez.
      failed: u.projectId === e && u.failed
    }));
    try {
      const u = await $(e, null, { abpHandleError: !1 });
      i === s.current && n({ projectId: e, overview: u ?? null, loading: !1, failed: !1 });
    } catch (u) {
      i === s.current && n({ projectId: e, overview: null, loading: !1, failed: !0 }), console.error("[Documents] compliance overview", u);
    }
  }, [e]);
  y.useEffect(() => {
    o();
  }, [o]);
  const c = a.projectId === (e || null);
  return {
    overview: c ? a.overview : null,
    loading: e ? !c || a.loading : !1,
    failed: c && a.failed,
    reload: o
  };
}
const C = (...e) => e.filter(Boolean).join(" ");
function De({ active: e = null, projectId: a = null, compliance: n, onSelect: s }) {
  const o = L(n ? null : a), c = n ?? o, i = y.useId(), u = { hasProject: !!a, loading: c.loading, failed: c.failed, overview: c.overview }, m = U(e, u), w = !n && u.hasProject && o.failed, j = b(), P = (p, f) => {
    f.button !== 0 || f.metaKey || f.ctrlKey || f.shiftKey || f.altKey || s == null || s(p, f);
  };
  return /* @__PURE__ */ t.jsxs("nav", { className: "apya-flow", "aria-label": "Doküman süreci", children: [
    /* @__PURE__ */ t.jsx("ol", { className: "apya-flow-steps", children: h.map((p, f) => {
      const x = p.key === e, k = p.key === "compliance" ? K(u) : p.sub;
      return /* @__PURE__ */ t.jsxs("li", { className: C("apya-flow-step", x && "is-active"), children: [
        /* @__PURE__ */ t.jsxs(
          "a",
          {
            className: "apya-flow-link",
            href: q(p.key, a, j),
            "aria-current": x ? "step" : void 0,
            "aria-label": `${p.no}. ${p.label} · ${k}`,
            onClick: (S) => P(p.key, S),
            children: [
              /* @__PURE__ */ t.jsx("span", { className: "apya-flow-no", "aria-hidden": "true", children: p.no }),
              /* @__PURE__ */ t.jsxs(
                "span",
                {
                  className: "apya-flow-text",
                  "aria-hidden": "true",
                  id: p.key === "compliance" ? i : void 0,
                  children: [
                    /* @__PURE__ */ t.jsx("span", { className: "apya-flow-label", children: p.label }),
                    /* @__PURE__ */ t.jsx("span", { className: "apya-flow-sub", children: k })
                  ]
                }
              )
            ]
          }
        ),
        f < h.length - 1 && /* @__PURE__ */ t.jsx("span", { className: "apya-flow-arrow", "aria-hidden": "true", children: "→" })
      ] }, p.key);
    }) }),
    m ? /* @__PURE__ */ t.jsxs("p", { className: C("apya-flow-next", `is-${m.tone}`), children: [
      /* @__PURE__ */ t.jsx("span", { className: "apya-flow-next-label", children: "Sırada:" }),
      /* @__PURE__ */ t.jsx("span", { className: "apya-flow-next-text", title: m.pending ? void 0 : m.text, children: m.text })
    ] }) : w && // Yeniden deneme sürerken de durur (bayrak kancada korunur): odak düğmede kalır.
    /* @__PURE__ */ t.jsx("p", { className: "apya-flow-next", children: /* @__PURE__ */ t.jsx(F, { onRetry: o.reload, retrying: o.loading, "aria-describedby": i }) })
  ] });
}
export {
  me as A,
  Z as B,
  xe as C,
  J as D,
  Y as E,
  he as F,
  ve as G,
  de as H,
  ae as I,
  ne as J,
  le as K,
  te as L,
  ee as M,
  se as N,
  O,
  De as P,
  b as a,
  ke as b,
  V as c,
  be as d,
  je as e,
  Ne as f,
  Ce as g,
  Se as h,
  Pe as i,
  Q as j,
  $ as k,
  ce as l,
  re as m,
  Te as n,
  ye as o,
  fe as p,
  _ as q,
  ue as r,
  ie as s,
  oe as t,
  we as u,
  X as v,
  pe as w,
  L as x,
  Re as y,
  ge as z
};
