import { j as e, r as x } from "./react-vendor-D7YDiBbi.js";
import { m as se } from "./index-DgpuJ91w.js";
import { a as D } from "./httpClient-BNoyY5yK.js";
import { f as ne } from "./publicFormLink-CJ_6ABDU.js";
import { p as re, b as ae, c as ie } from "./formChoices-CDoZfRj7.js";
import { h as E, w as Y } from "./formConditions-DsejDGE1.js";
const u = {
  LongText: 1,
  Select: 2,
  MultiSelect: 3,
  DatePicker: 4,
  FilePicker: 5,
  Number: 8,
  Email: 9,
  Phone: 10,
  TimePicker: 11,
  Rating: 12,
  Nps: 13,
  Address: 15,
  SectionHeader: 16,
  Paragraph: 17,
  Dropdown: 18
}, le = /* @__PURE__ */ new Set([u.SectionHeader, u.Paragraph]), C = (a) => {
  try {
    return typeof a == "string" ? JSON.parse(a) : a || {};
  } catch {
    return {};
  }
}, ce = "Bu form bulunamadı ya da yayından kaldırılmış. Bağlantıyı size gönderen kişiye başvurun.", G = (a, n) => (a == null ? void 0 : a.status) === 404 ? ce : (a == null ? void 0 : a.message) || n, y = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2.5 text-base text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft";
function oe({ block: a, value: n, onChange: P, choices: f, loading: b = !1 }) {
  const d = C(a.settings), h = f || a.choices, l = (t) => P(a.id, t);
  switch (a.type) {
    case u.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { rows: 4, className: y, placeholder: d.placeholder || "", value: n || "", onChange: (t) => l(t.target.value) });
    case u.Number:
      return /* @__PURE__ */ e.jsx("input", { type: "number", min: d.min ?? void 0, max: d.max ?? void 0, className: y, placeholder: d.placeholder || "", value: n || "", onChange: (t) => l(t.target.value) });
    case u.Email:
      return /* @__PURE__ */ e.jsx("input", { type: "email", className: y, placeholder: d.placeholder || "ornek@firma.com", value: n || "", onChange: (t) => l(t.target.value) });
    case u.Phone:
      return /* @__PURE__ */ e.jsx("input", { type: "tel", className: y, placeholder: d.placeholder || "", value: n || "", onChange: (t) => l(t.target.value) });
    case u.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "date", className: y, value: n || "", onChange: (t) => l(t.target.value) });
    case u.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "time", className: y, value: n || "", onChange: (t) => l(t.target.value) });
    case u.Dropdown:
      return Array.isArray(h) ? /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: y,
          value: (n == null ? void 0 : n.value) || "",
          disabled: h.length === 0,
          onChange: (t) => {
            const i = h.find((m) => m.value === t.target.value);
            l(i ? { value: i.value, label: i.label } : "");
          },
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: b ? "Yükleniyor…" : h.length ? "Seçiniz…" : ae(d.source) }),
            h.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.value, children: t.label }, t.value))
          ]
        }
      ) : /* @__PURE__ */ e.jsxs("select", { className: y, value: n || "", onChange: (t) => l(t.target.value), children: [
        /* @__PURE__ */ e.jsx("option", { value: "", children: "Seçiniz…" }),
        (d.options || []).map((t, i) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, i))
      ] });
    case u.Select:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (d.options || []).map((t, i) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "radio", name: a.id, checked: n === t, onChange: () => l(t), className: "h-4 w-4 text-accent" }),
        t
      ] }, i)) });
    case u.MultiSelect: {
      const t = Array.isArray(n) ? n : [], i = (m) => l(t.includes(m) ? t.filter((N) => N !== m) : [...t, m]);
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (d.options || []).map((m, N) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: t.includes(m), onChange: () => i(m), className: "h-4 w-4 rounded text-accent" }),
        m
      ] }, N)) });
    }
    case u.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((t) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => l(t), className: `flex h-11 w-11 items-center justify-center text-3xl ${(n || 0) >= t ? "text-warning" : "text-text-tertiary"}`, children: "★" }, t)) });
    case u.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Array.from({ length: 11 }, (t, i) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => l(i), className: `h-11 w-11 rounded-lg border text-sm font-medium ${n === i ? "border-focus bg-accent text-white" : "border-default text-text-secondary"}`, children: i }, i)) });
    case u.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: ["line", "district", "city", "zip"].map((t, i) => /* @__PURE__ */ e.jsx("input", { className: y, placeholder: ["Adres", "İlçe", "İl", "Posta kodu"][i], value: (n || {})[t] || "", onChange: (m) => l({ ...n || {}, [t]: m.target.value }) }, t)) });
    case u.FilePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "file", className: "block w-full text-sm text-text-secondary", onChange: (t) => {
        var i, m;
        return l(((m = (i = t.target.files) == null ? void 0 : i[0]) == null ? void 0 : m.name) || "");
      } });
    default:
      return /* @__PURE__ */ e.jsx("input", { type: "text", className: y, placeholder: d.placeholder || "", value: n || "", onChange: (t) => l(t.target.value) });
  }
}
function de({ slug: a }) {
  const [n, P] = x.useState(null), [f, b] = x.useState({}), [d, h] = x.useState("loading"), [l, t] = x.useState(""), [i, m] = x.useState(!1), [N, J] = x.useState({}), [T, M] = x.useState({}), [K, O] = x.useState({}), R = x.useRef({}), q = x.useRef(""), V = x.useRef((() => {
    const s = new URLSearchParams(window.location.search), r = s.get("shareToken"), c = s.get("taskId");
    return r && c ? { taskShareToken: r, taskId: c } : null;
  })()), U = x.useRef(Date.now()), k = x.useRef(ne(window.location.search));
  x.useEffect(() => {
    (async () => {
      try {
        const s = k.current ? `&tenantId=${k.current}` : "", r = await D.get(`/api/app/public-document/by-slug?slug=${encodeURIComponent(a)}${s}`);
        P(r), document.title = r.title || a;
        const c = {};
        for (const g of r.blocks || []) {
          if (!Array.isArray(g.choices) || !C(g.settings).urlPrefill) continue;
          const v = re(g.choices, window.location.search);
          v && (c[g.id] = v);
        }
        b(c), J(Object.fromEntries(Object.entries(c).map(([g, v]) => [g, v.value]))), h("ready"), U.current = Date.now();
      } catch (s) {
        t(G(s, "Form yüklenemedi.")), (s == null ? void 0 : s.status) === 404 && (document.title = "Form bulunamadı"), h("error");
      }
    })();
  }, [a]);
  const j = x.useMemo(
    () => ((n == null ? void 0 : n.blocks) || []).slice().sort((s, r) => s.order - r.order),
    [n]
  ), B = (s) => {
    const r = j.find((c) => c.id === s);
    return (r != null && r.dependsOnBlockId ? T[s] : r == null ? void 0 : r.choices) || [];
  }, $ = x.useMemo(
    () => E(j, f, B),
    [j, f, T]
  ), S = j.filter((s) => !le.has(s.type) && !$.has(s.id)), Q = S.filter((s) => {
    const r = f[s.id];
    return Array.isArray(r) ? r.length > 0 : r !== void 0 && r !== "" && r !== null;
  }).length, W = S.length ? Math.round(Q / S.length * 100) : 0, X = (s, r) => {
    const c = E(j, { ...f, [s]: r }, B), g = j.filter((o) => o.dependsOnBlockId === s || c.has(o.dependsOnBlockId));
    b((o) => {
      const w = { ...o, [s]: r };
      for (const I of g) delete w[I.id];
      return w;
    }), b((o) => Y(o, E(j, o, B)));
    const v = r && typeof r == "object" ? r.value : r;
    for (const o of g) {
      const w = o.dependsOnBlockId === s ? v : null, I = (R.current[o.id] || 0) + 1;
      R.current[o.id] = I;
      const _ = () => R.current[o.id] === I;
      if (M((p) => ({ ...p, [o.id]: [] })), !w) {
        O((p) => ({ ...p, [o.id]: !1 }));
        continue;
      }
      O((p) => ({ ...p, [o.id]: !0 }));
      const ee = k.current ? `&tenantId=${k.current}` : "", te = `/api/app/public-document/block-choices?slug=${encodeURIComponent(a)}&blockId=${o.id}&parentValue=${encodeURIComponent(w)}${ee}`, H = (p) => {
        _() && (M((z) => ({ ...z, [o.id]: p })), b((z) => ie(z, o.id, p)));
      };
      D.get(te).then((p) => H(p || [])).catch(() => H([])).finally(() => {
        _() && O((p) => ({ ...p, [o.id]: !1 }));
      });
    }
  }, Z = async () => {
    for (const s of S)
      if (C(s.settings).required) {
        const c = f[s.id];
        if (Array.isArray(c) ? c.length === 0 : c === void 0 || c === "" || c === null) {
          t("Lütfen tüm zorunlu alanları doldurun.");
          return;
        }
      }
    if (n != null && n.requireKvkk && !i) {
      t("Devam etmek için aydınlatma metnini onaylamanız gerekir.");
      return;
    }
    t(""), h("submitting");
    try {
      await D.post("/api/app/response/submit", {
        documentSlug: a,
        answers: JSON.stringify(Y(f, $)),
        completionSeconds: Math.round((Date.now() - U.current) / 1e3),
        kvkkConsent: i,
        website: q.current,
        // honeypot; boş kalmalı
        formTenantId: k.current,
        ...V.current ?? {}
      }), h("done");
    } catch (s) {
      t(G(s, "Gönderim başarısız.")), h("ready");
    }
  };
  if (d === "loading") return /* @__PURE__ */ e.jsx(F, { children: "Form yükleniyor…" });
  if (d === "error") return /* @__PURE__ */ e.jsx(F, { children: /* @__PURE__ */ e.jsx("span", { className: "text-negative-500", children: l }) });
  if (d === "done")
    return /* @__PURE__ */ e.jsx(F, { children: /* @__PURE__ */ e.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-positive-100 text-3xl", children: "✓" }),
      /* @__PURE__ */ e.jsx("h2", { className: "text-2xl font-bold text-text-primary", children: "Teşekkürler!" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-text-secondary", children: "Yanıtınız başarıyla gönderildi." })
    ] }) });
  const A = C(n == null ? void 0 : n.themeJson);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-app-bg py-8", children: [
    /* @__PURE__ */ e.jsx("div", { className: "fixed inset-x-0 top-0 z-10 h-1.5 bg-neutral-200", children: /* @__PURE__ */ e.jsx("div", { className: "h-full bg-accent transition-all duration-300", style: { width: `${W}%` } }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl bg-surface-raised shadow-sm", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle p-6", style: A.primary ? { borderTopColor: A.primary, borderTopWidth: 4 } : void 0, children: [
          /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-text-primary", children: n.title }),
          n.description && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-secondary", children: n.description })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 p-6", children: [
          j.map((s) => {
            var c;
            if ($.has(s.id)) return null;
            const r = C(s.settings);
            return s.type === u.SectionHeader ? /* @__PURE__ */ e.jsx("h2", { className: "border-b border-default pb-1 text-lg font-bold text-text-primary", children: s.content }, s.id) : s.type === u.Paragraph ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary", children: s.content }, s.id) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("label", { className: "text-sm font-semibold text-text-primary", children: [
                s.content,
                r.required && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative-500", children: "*" })
              ] }),
              r.helpText && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: r.helpText }),
              /* @__PURE__ */ e.jsx(oe, { block: s, value: f[s.id], onChange: X, choices: s.dependsOnBlockId ? T[s.id] || [] : null, loading: !!K[s.id] }),
              N[s.id] && ((c = f[s.id]) == null ? void 0 : c.value) === N[s.id] && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-secondary", children: "Bağlantıdan seçildi; değiştirebilirsiniz." })
            ] }, s.id);
          }),
          n.requireCaptcha && /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "text",
              tabIndex: -1,
              autoComplete: "off",
              "aria-hidden": "true",
              defaultValue: "",
              onChange: (s) => {
                q.current = s.target.value;
              },
              style: { position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }
            }
          ),
          n.requireKvkk && /* @__PURE__ */ e.jsxs("label", { className: "flex items-start gap-2 text-sm text-text-secondary", children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "checkbox",
                checked: i,
                onChange: (s) => m(s.target.checked),
                className: "mt-0.5 h-4 w-4 rounded text-accent"
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("a", { href: "/aydinlatma-metni", target: "_blank", rel: "noopener", className: "text-accent underline", children: "Aydınlatma metnini" }),
              " ",
              "okudum, kişisel verilerimin işlenmesini kabul ediyorum."
            ] })
          ] }),
          l && /* @__PURE__ */ e.jsx("p", { className: "text-sm font-medium text-negative-500", children: l }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: Z,
              disabled: d === "submitting",
              className: "mt-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-600 disabled:opacity-50",
              style: A.primary ? { backgroundColor: A.primary } : void 0,
              children: d === "submitting" ? "Gönderiliyor…" : "Gönder"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-center text-xs text-text-tertiary", children: "Apya Platform ile oluşturuldu" })
    ] })
  ] });
}
const F = ({ children: a }) => /* @__PURE__ */ e.jsx("div", { className: "flex min-h-screen items-center justify-center bg-surface-app-bg p-6 text-text-secondary", children: a }), L = document.getElementById("public-form-root");
if (L) {
  const a = L.getAttribute("data-slug");
  se(L, "public-form", /* @__PURE__ */ e.jsx(de, { slug: a }));
}
