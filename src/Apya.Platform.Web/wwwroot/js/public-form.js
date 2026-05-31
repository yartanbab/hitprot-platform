import { c as P, j as e, r as p } from "./vendor.js";
import { a as v } from "./vendor2.js";
const l = {
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
}, T = /* @__PURE__ */ new Set([l.SectionHeader, l.Paragraph]), f = (n) => {
  try {
    return typeof n == "string" ? JSON.parse(n) : n || {};
  } catch {
    return {};
  }
}, x = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";
function D({ block: n, value: a, onChange: b }) {
  const c = f(n.settings), i = (t) => b(n.id, t);
  switch (n.type) {
    case l.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { rows: 4, className: x, placeholder: c.placeholder || "", value: a || "", onChange: (t) => i(t.target.value) });
    case l.Number:
      return /* @__PURE__ */ e.jsx("input", { type: "number", min: c.min ?? void 0, max: c.max ?? void 0, className: x, placeholder: c.placeholder || "", value: a || "", onChange: (t) => i(t.target.value) });
    case l.Email:
      return /* @__PURE__ */ e.jsx("input", { type: "email", className: x, placeholder: c.placeholder || "ornek@firma.com", value: a || "", onChange: (t) => i(t.target.value) });
    case l.Phone:
      return /* @__PURE__ */ e.jsx("input", { type: "tel", className: x, placeholder: c.placeholder || "", value: a || "", onChange: (t) => i(t.target.value) });
    case l.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "date", className: x, value: a || "", onChange: (t) => i(t.target.value) });
    case l.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "time", className: x, value: a || "", onChange: (t) => i(t.target.value) });
    case l.Dropdown:
      return /* @__PURE__ */ e.jsxs("select", { className: x, value: a || "", onChange: (t) => i(t.target.value), children: [
        /* @__PURE__ */ e.jsx("option", { value: "", children: "Seçiniz…" }),
        (c.options || []).map((t, r) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, r))
      ] });
    case l.Select:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (c.options || []).map((t, r) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200", children: [
        /* @__PURE__ */ e.jsx("input", { type: "radio", name: n.id, checked: a === t, onChange: () => i(t), className: "h-4 w-4 text-indigo-600" }),
        t
      ] }, r)) });
    case l.MultiSelect: {
      const t = Array.isArray(a) ? a : [], r = (o) => i(t.includes(o) ? t.filter((m) => m !== o) : [...t, o]);
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (c.options || []).map((o, m) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200", children: [
        /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: t.includes(o), onChange: () => r(o), className: "h-4 w-4 rounded text-indigo-600" }),
        o
      ] }, m)) });
    }
    case l.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((t) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => i(t), className: `text-3xl ${(a || 0) >= t ? "text-amber-400" : "text-slate-300"}`, children: "★" }, t)) });
    case l.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Array.from({ length: 11 }, (t, r) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => i(r), className: `h-9 w-9 rounded-lg border text-sm font-medium ${a === r ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"}`, children: r }, r)) });
    case l.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: ["line", "district", "city", "zip"].map((t, r) => /* @__PURE__ */ e.jsx("input", { className: x, placeholder: ["Adres", "İlçe", "İl", "Posta kodu"][r], value: (a || {})[t] || "", onChange: (o) => i({ ...a || {}, [t]: o.target.value }) }, t)) });
    case l.FilePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "file", className: "block w-full text-sm text-slate-500", onChange: (t) => {
        var r, o;
        return i(((o = (r = t.target.files) == null ? void 0 : r[0]) == null ? void 0 : o.name) || "");
      } });
    default:
      return /* @__PURE__ */ e.jsx("input", { type: "text", className: x, placeholder: c.placeholder || "", value: a || "", onChange: (t) => i(t.target.value) });
  }
}
function E({ slug: n }) {
  const [a, b] = p.useState(null), [c, i] = p.useState({}), [t, r] = p.useState("loading"), [o, m] = p.useState(""), N = p.useRef(Date.now());
  p.useEffect(() => {
    (async () => {
      try {
        const s = await v.get(`/api/app/public-document/by-slug/${encodeURIComponent(n)}`);
        b(s), r("ready"), N.current = Date.now();
      } catch (s) {
        m((s == null ? void 0 : s.message) || "Form yüklenemedi."), r("error");
      }
    })();
  }, [n]);
  const k = p.useMemo(
    () => ((a == null ? void 0 : a.blocks) || []).slice().sort((s, d) => s.order - d.order),
    [a]
  ), h = k.filter((s) => !T.has(s.type)), w = h.filter((s) => {
    const d = c[s.id];
    return Array.isArray(d) ? d.length > 0 : d !== void 0 && d !== "" && d !== null;
  }).length, C = h.length ? Math.round(w / h.length * 100) : 0, S = (s, d) => i((u) => ({ ...u, [s]: d })), A = async () => {
    for (const s of h)
      if (f(s.settings).required) {
        const u = c[s.id];
        if (Array.isArray(u) ? u.length === 0 : u === void 0 || u === "" || u === null) {
          m("Lütfen tüm zorunlu alanları doldurun.");
          return;
        }
      }
    m(""), r("submitting");
    try {
      await v.post("/api/app/response/submit", {
        documentSlug: n,
        answers: JSON.stringify(c),
        completionSeconds: Math.round((Date.now() - N.current) / 1e3)
      }), r("done");
    } catch (s) {
      m((s == null ? void 0 : s.message) || "Gönderim başarısız."), r("ready");
    }
  };
  if (t === "loading") return /* @__PURE__ */ e.jsx(y, { children: "Form yükleniyor…" });
  if (t === "error") return /* @__PURE__ */ e.jsx(y, { children: /* @__PURE__ */ e.jsx("span", { className: "text-rose-500", children: o }) });
  if (t === "done")
    return /* @__PURE__ */ e.jsx(y, { children: /* @__PURE__ */ e.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl", children: "✓" }),
      /* @__PURE__ */ e.jsx("h2", { className: "text-2xl font-bold text-slate-800 dark:text-slate-100", children: "Teşekkürler!" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-slate-500", children: "Yanıtınız başarıyla gönderildi." })
    ] }) });
  const g = f(a == null ? void 0 : a.themeJson);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-slate-100 py-8 dark:bg-slate-900", children: [
    /* @__PURE__ */ e.jsx("div", { className: "fixed inset-x-0 top-0 z-10 h-1.5 bg-slate-200 dark:bg-slate-700", children: /* @__PURE__ */ e.jsx("div", { className: "h-full bg-indigo-600 transition-all duration-300", style: { width: `${C}%` } }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-800", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "border-b border-slate-100 p-6 dark:border-slate-700", style: g.primary ? { borderTopColor: g.primary, borderTopWidth: 4 } : void 0, children: [
          /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-slate-50", children: a.title }),
          a.description && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-slate-500", children: a.description })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 p-6", children: [
          k.map((s) => {
            const d = f(s.settings);
            return s.type === l.SectionHeader ? /* @__PURE__ */ e.jsx("h2", { className: "border-b border-slate-200 pb-1 text-lg font-bold text-slate-700 dark:text-slate-200 dark:border-slate-700", children: s.content }, s.id) : s.type === l.Paragraph ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-slate-500", children: s.content }, s.id) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("label", { className: "text-sm font-semibold text-slate-700 dark:text-slate-200", children: [
                s.content,
                d.required && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-rose-500", children: "*" })
              ] }),
              d.helpText && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-slate-400", children: d.helpText }),
              /* @__PURE__ */ e.jsx(D, { block: s, value: c[s.id], onChange: S })
            ] }, s.id);
          }),
          o && /* @__PURE__ */ e.jsx("p", { className: "text-sm font-medium text-rose-500", children: o }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: A,
              disabled: t === "submitting",
              className: "mt-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50",
              style: g.primary ? { backgroundColor: g.primary } : void 0,
              children: t === "submitting" ? "Gönderiliyor…" : "Gönder"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-center text-xs text-slate-400", children: "Apya Platform ile oluşturuldu" })
    ] })
  ] });
}
const y = ({ children: n }) => /* @__PURE__ */ e.jsx("div", { className: "flex min-h-screen items-center justify-center bg-slate-100 p-6 text-slate-500 dark:bg-slate-900", children: n }), j = document.getElementById("public-form-root");
if (j) {
  const n = j.getAttribute("data-slug");
  P(j).render(/* @__PURE__ */ e.jsx(E, { slug: n }));
}
