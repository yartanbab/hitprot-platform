import { b as te, j as e, r as x } from "./react-vendor-D57GAUXd.js";
import { a as z } from "./httpClient-DePjXdo1.js";
import { f as se } from "./publicFormLink-CJ_6ABDU.js";
import { p as ne, b as re, c as ae } from "./formChoices-CDoZfRj7.js";
import { h as D, w as G } from "./formConditions-DsejDGE1.js";
/* empty css               */
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
}, ie = /* @__PURE__ */ new Set([u.SectionHeader, u.Paragraph]), C = (o) => {
  try {
    return typeof o == "string" ? JSON.parse(o) : o || {};
  } catch {
    return {};
  }
}, y = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2.5 text-base text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft";
function ce({ block: o, value: n, onChange: P, choices: f, loading: b = !1 }) {
  const d = C(o.settings), h = f || o.choices, i = (s) => P(o.id, s);
  switch (o.type) {
    case u.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { rows: 4, className: y, placeholder: d.placeholder || "", value: n || "", onChange: (s) => i(s.target.value) });
    case u.Number:
      return /* @__PURE__ */ e.jsx("input", { type: "number", min: d.min ?? void 0, max: d.max ?? void 0, className: y, placeholder: d.placeholder || "", value: n || "", onChange: (s) => i(s.target.value) });
    case u.Email:
      return /* @__PURE__ */ e.jsx("input", { type: "email", className: y, placeholder: d.placeholder || "ornek@firma.com", value: n || "", onChange: (s) => i(s.target.value) });
    case u.Phone:
      return /* @__PURE__ */ e.jsx("input", { type: "tel", className: y, placeholder: d.placeholder || "", value: n || "", onChange: (s) => i(s.target.value) });
    case u.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "date", className: y, value: n || "", onChange: (s) => i(s.target.value) });
    case u.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "time", className: y, value: n || "", onChange: (s) => i(s.target.value) });
    case u.Dropdown:
      return Array.isArray(h) ? /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: y,
          value: (n == null ? void 0 : n.value) || "",
          disabled: h.length === 0,
          onChange: (s) => {
            const a = h.find((m) => m.value === s.target.value);
            i(a ? { value: a.value, label: a.label } : "");
          },
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: b ? "Yükleniyor…" : h.length ? "Seçiniz…" : re(d.source) }),
            h.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.value, children: s.label }, s.value))
          ]
        }
      ) : /* @__PURE__ */ e.jsxs("select", { className: y, value: n || "", onChange: (s) => i(s.target.value), children: [
        /* @__PURE__ */ e.jsx("option", { value: "", children: "Seçiniz…" }),
        (d.options || []).map((s, a) => /* @__PURE__ */ e.jsx("option", { value: s, children: s }, a))
      ] });
    case u.Select:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (d.options || []).map((s, a) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "radio", name: o.id, checked: n === s, onChange: () => i(s), className: "h-4 w-4 text-accent" }),
        s
      ] }, a)) });
    case u.MultiSelect: {
      const s = Array.isArray(n) ? n : [], a = (m) => i(s.includes(m) ? s.filter((N) => N !== m) : [...s, m]);
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (d.options || []).map((m, N) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: s.includes(m), onChange: () => a(m), className: "h-4 w-4 rounded text-accent" }),
        m
      ] }, N)) });
    }
    case u.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => i(s), className: `flex h-11 w-11 items-center justify-center text-3xl ${(n || 0) >= s ? "text-warning" : "text-text-tertiary"}`, children: "★" }, s)) });
    case u.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Array.from({ length: 11 }, (s, a) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => i(a), className: `h-11 w-11 rounded-lg border text-sm font-medium ${n === a ? "border-focus bg-accent text-white" : "border-default text-text-secondary"}`, children: a }, a)) });
    case u.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: ["line", "district", "city", "zip"].map((s, a) => /* @__PURE__ */ e.jsx("input", { className: y, placeholder: ["Adres", "İlçe", "İl", "Posta kodu"][a], value: (n || {})[s] || "", onChange: (m) => i({ ...n || {}, [s]: m.target.value }) }, s)) });
    case u.FilePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "file", className: "block w-full text-sm text-text-secondary", onChange: (s) => {
        var a, m;
        return i(((m = (a = s.target.files) == null ? void 0 : a[0]) == null ? void 0 : m.name) || "");
      } });
    default:
      return /* @__PURE__ */ e.jsx("input", { type: "text", className: y, placeholder: d.placeholder || "", value: n || "", onChange: (s) => i(s.target.value) });
  }
}
function le({ slug: o }) {
  const [n, P] = x.useState(null), [f, b] = x.useState({}), [d, h] = x.useState("loading"), [i, s] = x.useState(""), [a, m] = x.useState(!1), [N, J] = x.useState({}), [T, M] = x.useState({}), [K, R] = x.useState({}), O = x.useRef({}), F = x.useRef(""), V = x.useRef((() => {
    const t = new URLSearchParams(window.location.search), r = t.get("shareToken"), c = t.get("taskId");
    return r && c ? { taskShareToken: r, taskId: c } : null;
  })()), U = x.useRef(Date.now()), k = x.useRef(se(window.location.search));
  x.useEffect(() => {
    (async () => {
      try {
        const t = k.current ? `&tenantId=${k.current}` : "", r = await z.get(`/api/app/public-document/by-slug?slug=${encodeURIComponent(o)}${t}`);
        P(r);
        const c = {};
        for (const g of r.blocks || []) {
          if (!Array.isArray(g.choices) || !C(g.settings).urlPrefill) continue;
          const v = ne(g.choices, window.location.search);
          v && (c[g.id] = v);
        }
        b(c), J(Object.fromEntries(Object.entries(c).map(([g, v]) => [g, v.value]))), h("ready"), U.current = Date.now();
      } catch (t) {
        s((t == null ? void 0 : t.message) || "Form yüklenemedi."), h("error");
      }
    })();
  }, [o]);
  const j = x.useMemo(
    () => ((n == null ? void 0 : n.blocks) || []).slice().sort((t, r) => t.order - r.order),
    [n]
  ), $ = (t) => {
    const r = j.find((c) => c.id === t);
    return (r != null && r.dependsOnBlockId ? T[t] : r == null ? void 0 : r.choices) || [];
  }, B = x.useMemo(
    () => D(j, f, $),
    [j, f, T]
  ), S = j.filter((t) => !ie.has(t.type) && !B.has(t.id)), _ = S.filter((t) => {
    const r = f[t.id];
    return Array.isArray(r) ? r.length > 0 : r !== void 0 && r !== "" && r !== null;
  }).length, Q = S.length ? Math.round(_ / S.length * 100) : 0, W = (t, r) => {
    const c = D(j, { ...f, [t]: r }, $), g = j.filter((l) => l.dependsOnBlockId === t || c.has(l.dependsOnBlockId));
    b((l) => {
      const w = { ...l, [t]: r };
      for (const I of g) delete w[I.id];
      return w;
    }), b((l) => G(l, D(j, l, $)));
    const v = r && typeof r == "object" ? r.value : r;
    for (const l of g) {
      const w = l.dependsOnBlockId === t ? v : null, I = (O.current[l.id] || 0) + 1;
      O.current[l.id] = I;
      const H = () => O.current[l.id] === I;
      if (M((p) => ({ ...p, [l.id]: [] })), !w) {
        R((p) => ({ ...p, [l.id]: !1 }));
        continue;
      }
      R((p) => ({ ...p, [l.id]: !0 }));
      const Z = k.current ? `&tenantId=${k.current}` : "", ee = `/api/app/public-document/block-choices?slug=${encodeURIComponent(o)}&blockId=${l.id}&parentValue=${encodeURIComponent(w)}${Z}`, Y = (p) => {
        H() && (M((L) => ({ ...L, [l.id]: p })), b((L) => ae(L, l.id, p)));
      };
      z.get(ee).then((p) => Y(p || [])).catch(() => Y([])).finally(() => {
        H() && R((p) => ({ ...p, [l.id]: !1 }));
      });
    }
  }, X = async () => {
    for (const t of S)
      if (C(t.settings).required) {
        const c = f[t.id];
        if (Array.isArray(c) ? c.length === 0 : c === void 0 || c === "" || c === null) {
          s("Lütfen tüm zorunlu alanları doldurun.");
          return;
        }
      }
    if (n != null && n.requireKvkk && !a) {
      s("Devam etmek için aydınlatma metnini onaylamanız gerekir.");
      return;
    }
    s(""), h("submitting");
    try {
      await z.post("/api/app/response/submit", {
        documentSlug: o,
        answers: JSON.stringify(G(f, B)),
        completionSeconds: Math.round((Date.now() - U.current) / 1e3),
        kvkkConsent: a,
        website: F.current,
        // honeypot; boş kalmalı
        formTenantId: k.current,
        ...V.current ?? {}
      }), h("done");
    } catch (t) {
      s((t == null ? void 0 : t.message) || "Gönderim başarısız."), h("ready");
    }
  };
  if (d === "loading") return /* @__PURE__ */ e.jsx(E, { children: "Form yükleniyor…" });
  if (d === "error") return /* @__PURE__ */ e.jsx(E, { children: /* @__PURE__ */ e.jsx("span", { className: "text-negative-500", children: i }) });
  if (d === "done")
    return /* @__PURE__ */ e.jsx(E, { children: /* @__PURE__ */ e.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-positive-100 text-3xl", children: "✓" }),
      /* @__PURE__ */ e.jsx("h2", { className: "text-2xl font-bold text-text-primary", children: "Teşekkürler!" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-text-secondary", children: "Yanıtınız başarıyla gönderildi." })
    ] }) });
  const A = C(n == null ? void 0 : n.themeJson);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-app-bg py-8", children: [
    /* @__PURE__ */ e.jsx("div", { className: "fixed inset-x-0 top-0 z-10 h-1.5 bg-neutral-200", children: /* @__PURE__ */ e.jsx("div", { className: "h-full bg-accent transition-all duration-300", style: { width: `${Q}%` } }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl bg-surface-raised shadow-sm", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle p-6", style: A.primary ? { borderTopColor: A.primary, borderTopWidth: 4 } : void 0, children: [
          /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-text-primary", children: n.title }),
          n.description && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-secondary", children: n.description })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 p-6", children: [
          j.map((t) => {
            var c;
            if (B.has(t.id)) return null;
            const r = C(t.settings);
            return t.type === u.SectionHeader ? /* @__PURE__ */ e.jsx("h2", { className: "border-b border-default pb-1 text-lg font-bold text-text-primary", children: t.content }, t.id) : t.type === u.Paragraph ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary", children: t.content }, t.id) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("label", { className: "text-sm font-semibold text-text-primary", children: [
                t.content,
                r.required && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative-500", children: "*" })
              ] }),
              r.helpText && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: r.helpText }),
              /* @__PURE__ */ e.jsx(ce, { block: t, value: f[t.id], onChange: W, choices: t.dependsOnBlockId ? T[t.id] || [] : null, loading: !!K[t.id] }),
              N[t.id] && ((c = f[t.id]) == null ? void 0 : c.value) === N[t.id] && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-secondary", children: "Bağlantıdan seçildi; değiştirebilirsiniz." })
            ] }, t.id);
          }),
          n.requireCaptcha && /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "text",
              tabIndex: -1,
              autoComplete: "off",
              "aria-hidden": "true",
              defaultValue: "",
              onChange: (t) => {
                F.current = t.target.value;
              },
              style: { position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }
            }
          ),
          n.requireKvkk && /* @__PURE__ */ e.jsxs("label", { className: "flex items-start gap-2 text-sm text-text-secondary", children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "checkbox",
                checked: a,
                onChange: (t) => m(t.target.checked),
                className: "mt-0.5 h-4 w-4 rounded text-accent"
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("a", { href: "/aydinlatma-metni", target: "_blank", rel: "noopener", className: "text-accent underline", children: "Aydınlatma metnini" }),
              " ",
              "okudum, kişisel verilerimin işlenmesini kabul ediyorum."
            ] })
          ] }),
          i && /* @__PURE__ */ e.jsx("p", { className: "text-sm font-medium text-negative-500", children: i }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: X,
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
const E = ({ children: o }) => /* @__PURE__ */ e.jsx("div", { className: "flex min-h-screen items-center justify-center bg-surface-app-bg p-6 text-text-secondary", children: o }), q = document.getElementById("public-form-root");
if (q) {
  const o = q.getAttribute("data-slug");
  te(q).render(/* @__PURE__ */ e.jsx(le, { slug: o }));
}
