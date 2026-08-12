import { b as P, j as e, r as p } from "./react-vendor.js";
import { a as w } from "./httpClient.js";
/* empty css      */
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
}, T = /* @__PURE__ */ new Set([n.SectionHeader, n.Paragraph]), f = (l) => {
  try {
    return typeof l == "string" ? JSON.parse(l) : l || {};
  } catch {
    return {};
  }
}, x = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2.5 text-base text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft";
function D({ block: l, value: r, onChange: y }) {
  const o = f(l.settings), c = (t) => y(l.id, t);
  switch (l.type) {
    case n.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { rows: 4, className: x, placeholder: o.placeholder || "", value: r || "", onChange: (t) => c(t.target.value) });
    case n.Number:
      return /* @__PURE__ */ e.jsx("input", { type: "number", min: o.min ?? void 0, max: o.max ?? void 0, className: x, placeholder: o.placeholder || "", value: r || "", onChange: (t) => c(t.target.value) });
    case n.Email:
      return /* @__PURE__ */ e.jsx("input", { type: "email", className: x, placeholder: o.placeholder || "ornek@firma.com", value: r || "", onChange: (t) => c(t.target.value) });
    case n.Phone:
      return /* @__PURE__ */ e.jsx("input", { type: "tel", className: x, placeholder: o.placeholder || "", value: r || "", onChange: (t) => c(t.target.value) });
    case n.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "date", className: x, value: r || "", onChange: (t) => c(t.target.value) });
    case n.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "time", className: x, value: r || "", onChange: (t) => c(t.target.value) });
    case n.Dropdown:
      return /* @__PURE__ */ e.jsxs("select", { className: x, value: r || "", onChange: (t) => c(t.target.value), children: [
        /* @__PURE__ */ e.jsx("option", { value: "", children: "Seçiniz…" }),
        (o.options || []).map((t, a) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, a))
      ] });
    case n.Select:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (o.options || []).map((t, a) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "radio", name: l.id, checked: r === t, onChange: () => c(t), className: "h-4 w-4 text-accent" }),
        t
      ] }, a)) });
    case n.MultiSelect: {
      const t = Array.isArray(r) ? r : [], a = (i) => c(t.includes(i) ? t.filter((m) => m !== i) : [...t, i]);
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (o.options || []).map((i, m) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: t.includes(i), onChange: () => a(i), className: "h-4 w-4 rounded text-accent" }),
        i
      ] }, m)) });
    }
    case n.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((t) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => c(t), className: `flex h-11 w-11 items-center justify-center text-3xl ${(r || 0) >= t ? "text-warning" : "text-text-tertiary"}`, children: "★" }, t)) });
    case n.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Array.from({ length: 11 }, (t, a) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => c(a), className: `h-11 w-11 rounded-lg border text-sm font-medium ${r === a ? "border-focus bg-accent text-white" : "border-default text-text-secondary"}`, children: a }, a)) });
    case n.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: ["line", "district", "city", "zip"].map((t, a) => /* @__PURE__ */ e.jsx("input", { className: x, placeholder: ["Adres", "İlçe", "İl", "Posta kodu"][a], value: (r || {})[t] || "", onChange: (i) => c({ ...r || {}, [t]: i.target.value }) }, t)) });
    case n.FilePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "file", className: "block w-full text-sm text-text-secondary", onChange: (t) => {
        var a, i;
        return c(((i = (a = t.target.files) == null ? void 0 : a[0]) == null ? void 0 : i.name) || "");
      } });
    default:
      return /* @__PURE__ */ e.jsx("input", { type: "text", className: x, placeholder: o.placeholder || "", value: r || "", onChange: (t) => c(t.target.value) });
  }
}
function E({ slug: l }) {
  const [r, y] = p.useState(null), [o, c] = p.useState({}), [t, a] = p.useState("loading"), [i, m] = p.useState(""), N = p.useRef(Date.now());
  p.useEffect(() => {
    (async () => {
      try {
        const s = await w.get(`/api/app/public-document/by-slug?slug=${encodeURIComponent(l)}`);
        y(s), a("ready"), N.current = Date.now();
      } catch (s) {
        m((s == null ? void 0 : s.message) || "Form yüklenemedi."), a("error");
      }
    })();
  }, [l]);
  const v = p.useMemo(
    () => ((r == null ? void 0 : r.blocks) || []).slice().sort((s, d) => s.order - d.order),
    [r]
  ), h = v.filter((s) => !T.has(s.type)), C = h.filter((s) => {
    const d = o[s.id];
    return Array.isArray(d) ? d.length > 0 : d !== void 0 && d !== "" && d !== null;
  }).length, S = h.length ? Math.round(C / h.length * 100) : 0, k = (s, d) => c((u) => ({ ...u, [s]: d })), A = async () => {
    for (const s of h)
      if (f(s.settings).required) {
        const u = o[s.id];
        if (Array.isArray(u) ? u.length === 0 : u === void 0 || u === "" || u === null) {
          m("Lütfen tüm zorunlu alanları doldurun.");
          return;
        }
      }
    m(""), a("submitting");
    try {
      await w.post("/api/app/response/submit", {
        documentSlug: l,
        answers: JSON.stringify(o),
        completionSeconds: Math.round((Date.now() - N.current) / 1e3)
      }), a("done");
    } catch (s) {
      m((s == null ? void 0 : s.message) || "Gönderim başarısız."), a("ready");
    }
  };
  if (t === "loading") return /* @__PURE__ */ e.jsx(b, { children: "Form yükleniyor…" });
  if (t === "error") return /* @__PURE__ */ e.jsx(b, { children: /* @__PURE__ */ e.jsx("span", { className: "text-negative-500", children: i }) });
  if (t === "done")
    return /* @__PURE__ */ e.jsx(b, { children: /* @__PURE__ */ e.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-positive-100 text-3xl", children: "✓" }),
      /* @__PURE__ */ e.jsx("h2", { className: "text-2xl font-bold text-text-primary", children: "Teşekkürler!" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-text-secondary", children: "Yanıtınız başarıyla gönderildi." })
    ] }) });
  const g = f(r == null ? void 0 : r.themeJson);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-app-bg py-8", children: [
    /* @__PURE__ */ e.jsx("div", { className: "fixed inset-x-0 top-0 z-10 h-1.5 bg-neutral-200", children: /* @__PURE__ */ e.jsx("div", { className: "h-full bg-accent transition-all duration-300", style: { width: `${S}%` } }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl bg-surface-raised shadow-sm", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle p-6", style: g.primary ? { borderTopColor: g.primary, borderTopWidth: 4 } : void 0, children: [
          /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-text-primary", children: r.title }),
          r.description && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-secondary", children: r.description })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 p-6", children: [
          v.map((s) => {
            const d = f(s.settings);
            return s.type === n.SectionHeader ? /* @__PURE__ */ e.jsx("h2", { className: "border-b border-default pb-1 text-lg font-bold text-text-primary", children: s.content }, s.id) : s.type === n.Paragraph ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary", children: s.content }, s.id) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("label", { className: "text-sm font-semibold text-text-primary", children: [
                s.content,
                d.required && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative-500", children: "*" })
              ] }),
              d.helpText && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: d.helpText }),
              /* @__PURE__ */ e.jsx(D, { block: s, value: o[s.id], onChange: k })
            ] }, s.id);
          }),
          i && /* @__PURE__ */ e.jsx("p", { className: "text-sm font-medium text-negative-500", children: i }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: A,
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
const b = ({ children: l }) => /* @__PURE__ */ e.jsx("div", { className: "flex min-h-screen items-center justify-center bg-surface-app-bg p-6 text-text-secondary", children: l }), j = document.getElementById("public-form-root");
if (j) {
  const l = j.getAttribute("data-slug");
  P(j).render(/* @__PURE__ */ e.jsx(E, { slug: l }));
}
