import { b as z, j as e, r as m } from "./react-vendor-D57GAUXd.js";
import { a as C } from "./httpClient-CRlyQ1eg.js";
/* empty css               */
const n = {
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
}, E = /* @__PURE__ */ new Set([n.SectionHeader, n.Paragraph]), f = (l) => {
  try {
    return typeof l == "string" ? JSON.parse(l) : l || {};
  } catch {
    return {};
  }
}, u = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2.5 text-base text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft";
function M({ block: l, value: r, onChange: y }) {
  const o = f(l.settings), i = (t) => y(l.id, t);
  switch (l.type) {
    case n.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { rows: 4, className: u, placeholder: o.placeholder || "", value: r || "", onChange: (t) => i(t.target.value) });
    case n.Number:
      return /* @__PURE__ */ e.jsx("input", { type: "number", min: o.min ?? void 0, max: o.max ?? void 0, className: u, placeholder: o.placeholder || "", value: r || "", onChange: (t) => i(t.target.value) });
    case n.Email:
      return /* @__PURE__ */ e.jsx("input", { type: "email", className: u, placeholder: o.placeholder || "ornek@firma.com", value: r || "", onChange: (t) => i(t.target.value) });
    case n.Phone:
      return /* @__PURE__ */ e.jsx("input", { type: "tel", className: u, placeholder: o.placeholder || "", value: r || "", onChange: (t) => i(t.target.value) });
    case n.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "date", className: u, value: r || "", onChange: (t) => i(t.target.value) });
    case n.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "time", className: u, value: r || "", onChange: (t) => i(t.target.value) });
    case n.Dropdown:
      return /* @__PURE__ */ e.jsxs("select", { className: u, value: r || "", onChange: (t) => i(t.target.value), children: [
        /* @__PURE__ */ e.jsx("option", { value: "", children: "Seçiniz…" }),
        (o.options || []).map((t, a) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, a))
      ] });
    case n.Select:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (o.options || []).map((t, a) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "radio", name: l.id, checked: r === t, onChange: () => i(t), className: "h-4 w-4 text-accent" }),
        t
      ] }, a)) });
    case n.MultiSelect: {
      const t = Array.isArray(r) ? r : [], a = (c) => i(t.includes(c) ? t.filter((x) => x !== c) : [...t, c]);
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (o.options || []).map((c, x) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: t.includes(c), onChange: () => a(c), className: "h-4 w-4 rounded text-accent" }),
        c
      ] }, x)) });
    }
    case n.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((t) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => i(t), className: `flex h-11 w-11 items-center justify-center text-3xl ${(r || 0) >= t ? "text-warning" : "text-text-tertiary"}`, children: "★" }, t)) });
    case n.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Array.from({ length: 11 }, (t, a) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => i(a), className: `h-11 w-11 rounded-lg border text-sm font-medium ${r === a ? "border-focus bg-accent text-white" : "border-default text-text-secondary"}`, children: a }, a)) });
    case n.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: ["line", "district", "city", "zip"].map((t, a) => /* @__PURE__ */ e.jsx("input", { className: u, placeholder: ["Adres", "İlçe", "İl", "Posta kodu"][a], value: (r || {})[t] || "", onChange: (c) => i({ ...r || {}, [t]: c.target.value }) }, t)) });
    case n.FilePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "file", className: "block w-full text-sm text-text-secondary", onChange: (t) => {
        var a, c;
        return i(((c = (a = t.target.files) == null ? void 0 : a[0]) == null ? void 0 : c.name) || "");
      } });
    default:
      return /* @__PURE__ */ e.jsx("input", { type: "text", className: u, placeholder: o.placeholder || "", value: r || "", onChange: (t) => i(t.target.value) });
  }
}
function R({ slug: l }) {
  const [r, y] = m.useState(null), [o, i] = m.useState({}), [t, a] = m.useState("loading"), [c, x] = m.useState(""), [b, S] = m.useState(!1), v = m.useRef(""), k = m.useRef(Date.now());
  m.useEffect(() => {
    (async () => {
      try {
        const s = await C.get(`/api/app/public-document/by-slug?slug=${encodeURIComponent(l)}`);
        y(s), a("ready"), k.current = Date.now();
      } catch (s) {
        x((s == null ? void 0 : s.message) || "Form yüklenemedi."), a("error");
      }
    })();
  }, [l]);
  const w = m.useMemo(
    () => ((r == null ? void 0 : r.blocks) || []).slice().sort((s, d) => s.order - d.order),
    [r]
  ), h = w.filter((s) => !E.has(s.type)), A = h.filter((s) => {
    const d = o[s.id];
    return Array.isArray(d) ? d.length > 0 : d !== void 0 && d !== "" && d !== null;
  }).length, P = h.length ? Math.round(A / h.length * 100) : 0, T = (s, d) => i((p) => ({ ...p, [s]: d })), D = async () => {
    for (const s of h)
      if (f(s.settings).required) {
        const p = o[s.id];
        if (Array.isArray(p) ? p.length === 0 : p === void 0 || p === "" || p === null) {
          x("Lütfen tüm zorunlu alanları doldurun.");
          return;
        }
      }
    if (r != null && r.requireKvkk && !b) {
      x("Devam etmek için aydınlatma metnini onaylamanız gerekir.");
      return;
    }
    x(""), a("submitting");
    try {
      await C.post("/api/app/response/submit", {
        documentSlug: l,
        answers: JSON.stringify(o),
        completionSeconds: Math.round((Date.now() - k.current) / 1e3),
        kvkkConsent: b,
        website: v.current
        // honeypot; boş kalmalı
      }), a("done");
    } catch (s) {
      x((s == null ? void 0 : s.message) || "Gönderim başarısız."), a("ready");
    }
  };
  if (t === "loading") return /* @__PURE__ */ e.jsx(j, { children: "Form yükleniyor…" });
  if (t === "error") return /* @__PURE__ */ e.jsx(j, { children: /* @__PURE__ */ e.jsx("span", { className: "text-negative-500", children: c }) });
  if (t === "done")
    return /* @__PURE__ */ e.jsx(j, { children: /* @__PURE__ */ e.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-positive-100 text-3xl", children: "✓" }),
      /* @__PURE__ */ e.jsx("h2", { className: "text-2xl font-bold text-text-primary", children: "Teşekkürler!" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-text-secondary", children: "Yanıtınız başarıyla gönderildi." })
    ] }) });
  const g = f(r == null ? void 0 : r.themeJson);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-app-bg py-8", children: [
    /* @__PURE__ */ e.jsx("div", { className: "fixed inset-x-0 top-0 z-10 h-1.5 bg-neutral-200", children: /* @__PURE__ */ e.jsx("div", { className: "h-full bg-accent transition-all duration-300", style: { width: `${P}%` } }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl bg-surface-raised shadow-sm", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle p-6", style: g.primary ? { borderTopColor: g.primary, borderTopWidth: 4 } : void 0, children: [
          /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-text-primary", children: r.title }),
          r.description && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-secondary", children: r.description })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 p-6", children: [
          w.map((s) => {
            const d = f(s.settings);
            return s.type === n.SectionHeader ? /* @__PURE__ */ e.jsx("h2", { className: "border-b border-default pb-1 text-lg font-bold text-text-primary", children: s.content }, s.id) : s.type === n.Paragraph ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary", children: s.content }, s.id) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("label", { className: "text-sm font-semibold text-text-primary", children: [
                s.content,
                d.required && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative-500", children: "*" })
              ] }),
              d.helpText && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: d.helpText }),
              /* @__PURE__ */ e.jsx(M, { block: s, value: o[s.id], onChange: T })
            ] }, s.id);
          }),
          r.requireCaptcha && /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "text",
              tabIndex: -1,
              autoComplete: "off",
              "aria-hidden": "true",
              defaultValue: "",
              onChange: (s) => {
                v.current = s.target.value;
              },
              style: { position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }
            }
          ),
          r.requireKvkk && /* @__PURE__ */ e.jsxs("label", { className: "flex items-start gap-2 text-sm text-text-secondary", children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "checkbox",
                checked: b,
                onChange: (s) => S(s.target.checked),
                className: "mt-0.5 h-4 w-4 rounded text-accent"
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("a", { href: "/aydinlatma-metni", target: "_blank", rel: "noopener", className: "text-accent underline", children: "Aydınlatma metnini" }),
              " ",
              "okudum, kişisel verilerimin işlenmesini kabul ediyorum."
            ] })
          ] }),
          c && /* @__PURE__ */ e.jsx("p", { className: "text-sm font-medium text-negative-500", children: c }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: D,
              disabled: t === "submitting",
              className: "mt-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-600 disabled:opacity-50",
              style: g.primary ? { backgroundColor: g.primary } : void 0,
              children: t === "submitting" ? "Gönderiliyor…" : "Gönder"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-center text-xs text-text-tertiary", children: "Apya Platform ile oluşturuldu" })
    ] })
  ] });
}
const j = ({ children: l }) => /* @__PURE__ */ e.jsx("div", { className: "flex min-h-screen items-center justify-center bg-surface-app-bg p-6 text-text-secondary", children: l }), N = document.getElementById("public-form-root");
if (N) {
  const l = N.getAttribute("data-slug");
  z(N).render(/* @__PURE__ */ e.jsx(R, { slug: l }));
}
