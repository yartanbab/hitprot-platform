import { b as q, j as e, r as u } from "./react-vendor-D57GAUXd.js";
import { a as T } from "./httpClient-DePjXdo1.js";
import { f as L } from "./publicFormLink-CJ_6ABDU.js";
import { p as O } from "./formChoices-CM6Xg9_c.js";
/* empty css               */
const d = {
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
}, $ = /* @__PURE__ */ new Set([d.SectionHeader, d.Paragraph]), g = (n) => {
  try {
    return typeof n == "string" ? JSON.parse(n) : n || {};
  } catch {
    return {};
  }
}, m = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2.5 text-base text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft";
function B({ block: n, value: r, onChange: b }) {
  const x = g(n.settings), l = (t) => b(n.id, t);
  switch (n.type) {
    case d.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { rows: 4, className: m, placeholder: x.placeholder || "", value: r || "", onChange: (t) => l(t.target.value) });
    case d.Number:
      return /* @__PURE__ */ e.jsx("input", { type: "number", min: x.min ?? void 0, max: x.max ?? void 0, className: m, placeholder: x.placeholder || "", value: r || "", onChange: (t) => l(t.target.value) });
    case d.Email:
      return /* @__PURE__ */ e.jsx("input", { type: "email", className: m, placeholder: x.placeholder || "ornek@firma.com", value: r || "", onChange: (t) => l(t.target.value) });
    case d.Phone:
      return /* @__PURE__ */ e.jsx("input", { type: "tel", className: m, placeholder: x.placeholder || "", value: r || "", onChange: (t) => l(t.target.value) });
    case d.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "date", className: m, value: r || "", onChange: (t) => l(t.target.value) });
    case d.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "time", className: m, value: r || "", onChange: (t) => l(t.target.value) });
    case d.Dropdown:
      return Array.isArray(n.choices) ? /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: m,
          value: (r == null ? void 0 : r.value) || "",
          disabled: n.choices.length === 0,
          onChange: (t) => {
            const a = n.choices.find((c) => c.value === t.target.value);
            l(a ? { value: a.value, label: a.label } : "");
          },
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: n.choices.length ? "Seçiniz…" : "Şu an başvuruya açık çağrı yok" }),
            n.choices.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.value, children: t.label }, t.value))
          ]
        }
      ) : /* @__PURE__ */ e.jsxs("select", { className: m, value: r || "", onChange: (t) => l(t.target.value), children: [
        /* @__PURE__ */ e.jsx("option", { value: "", children: "Seçiniz…" }),
        (x.options || []).map((t, a) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, a))
      ] });
    case d.Select:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (x.options || []).map((t, a) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "radio", name: n.id, checked: r === t, onChange: () => l(t), className: "h-4 w-4 text-accent" }),
        t
      ] }, a)) });
    case d.MultiSelect: {
      const t = Array.isArray(r) ? r : [], a = (c) => l(t.includes(c) ? t.filter((p) => p !== c) : [...t, c]);
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (x.options || []).map((c, p) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: t.includes(c), onChange: () => a(c), className: "h-4 w-4 rounded text-accent" }),
        c
      ] }, p)) });
    }
    case d.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((t) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => l(t), className: `flex h-11 w-11 items-center justify-center text-3xl ${(r || 0) >= t ? "text-warning" : "text-text-tertiary"}`, children: "★" }, t)) });
    case d.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Array.from({ length: 11 }, (t, a) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => l(a), className: `h-11 w-11 rounded-lg border text-sm font-medium ${r === a ? "border-focus bg-accent text-white" : "border-default text-text-secondary"}`, children: a }, a)) });
    case d.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: ["line", "district", "city", "zip"].map((t, a) => /* @__PURE__ */ e.jsx("input", { className: m, placeholder: ["Adres", "İlçe", "İl", "Posta kodu"][a], value: (r || {})[t] || "", onChange: (c) => l({ ...r || {}, [t]: c.target.value }) }, t)) });
    case d.FilePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "file", className: "block w-full text-sm text-text-secondary", onChange: (t) => {
        var a, c;
        return l(((c = (a = t.target.files) == null ? void 0 : a[0]) == null ? void 0 : c.name) || "");
      } });
    default:
      return /* @__PURE__ */ e.jsx("input", { type: "text", className: m, placeholder: x.placeholder || "", value: r || "", onChange: (t) => l(t.target.value) });
  }
}
function G({ slug: n }) {
  const [r, b] = u.useState(null), [x, l] = u.useState({}), [t, a] = u.useState("loading"), [c, p] = u.useState(""), [N, R] = u.useState(!1), [C, z] = u.useState({}), S = u.useRef(""), D = u.useRef((() => {
    const s = new URLSearchParams(window.location.search), i = s.get("shareToken"), o = s.get("taskId");
    return i && o ? { taskShareToken: i, taskId: o } : null;
  })()), A = u.useRef(Date.now()), v = u.useRef(L(window.location.search));
  u.useEffect(() => {
    (async () => {
      try {
        const s = v.current ? `&tenantId=${v.current}` : "", i = await T.get(`/api/app/public-document/by-slug?slug=${encodeURIComponent(n)}${s}`);
        b(i);
        const o = {};
        for (const h of i.blocks || []) {
          if (!Array.isArray(h.choices) || !g(h.settings).urlPrefill) continue;
          const j = O(h.choices, window.location.search);
          j && (o[h.id] = j);
        }
        l(o), z(Object.fromEntries(Object.entries(o).map(([h, j]) => [h, j.value]))), a("ready"), A.current = Date.now();
      } catch (s) {
        p((s == null ? void 0 : s.message) || "Form yüklenemedi."), a("error");
      }
    })();
  }, [n]);
  const P = u.useMemo(
    () => ((r == null ? void 0 : r.blocks) || []).slice().sort((s, i) => s.order - i.order),
    [r]
  ), f = P.filter((s) => !$.has(s.type)), E = f.filter((s) => {
    const i = x[s.id];
    return Array.isArray(i) ? i.length > 0 : i !== void 0 && i !== "" && i !== null;
  }).length, I = f.length ? Math.round(E / f.length * 100) : 0, F = (s, i) => l((o) => ({ ...o, [s]: i })), M = async () => {
    for (const s of f)
      if (g(s.settings).required) {
        const o = x[s.id];
        if (Array.isArray(o) ? o.length === 0 : o === void 0 || o === "" || o === null) {
          p("Lütfen tüm zorunlu alanları doldurun.");
          return;
        }
      }
    if (r != null && r.requireKvkk && !N) {
      p("Devam etmek için aydınlatma metnini onaylamanız gerekir.");
      return;
    }
    p(""), a("submitting");
    try {
      await T.post("/api/app/response/submit", {
        documentSlug: n,
        answers: JSON.stringify(x),
        completionSeconds: Math.round((Date.now() - A.current) / 1e3),
        kvkkConsent: N,
        website: S.current,
        // honeypot; boş kalmalı
        formTenantId: v.current,
        ...D.current ?? {}
      }), a("done");
    } catch (s) {
      p((s == null ? void 0 : s.message) || "Gönderim başarısız."), a("ready");
    }
  };
  if (t === "loading") return /* @__PURE__ */ e.jsx(k, { children: "Form yükleniyor…" });
  if (t === "error") return /* @__PURE__ */ e.jsx(k, { children: /* @__PURE__ */ e.jsx("span", { className: "text-negative-500", children: c }) });
  if (t === "done")
    return /* @__PURE__ */ e.jsx(k, { children: /* @__PURE__ */ e.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-positive-100 text-3xl", children: "✓" }),
      /* @__PURE__ */ e.jsx("h2", { className: "text-2xl font-bold text-text-primary", children: "Teşekkürler!" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-text-secondary", children: "Yanıtınız başarıyla gönderildi." })
    ] }) });
  const y = g(r == null ? void 0 : r.themeJson);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-app-bg py-8", children: [
    /* @__PURE__ */ e.jsx("div", { className: "fixed inset-x-0 top-0 z-10 h-1.5 bg-neutral-200", children: /* @__PURE__ */ e.jsx("div", { className: "h-full bg-accent transition-all duration-300", style: { width: `${I}%` } }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl bg-surface-raised shadow-sm", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle p-6", style: y.primary ? { borderTopColor: y.primary, borderTopWidth: 4 } : void 0, children: [
          /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-text-primary", children: r.title }),
          r.description && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-secondary", children: r.description })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 p-6", children: [
          P.map((s) => {
            var o;
            const i = g(s.settings);
            return s.type === d.SectionHeader ? /* @__PURE__ */ e.jsx("h2", { className: "border-b border-default pb-1 text-lg font-bold text-text-primary", children: s.content }, s.id) : s.type === d.Paragraph ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary", children: s.content }, s.id) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("label", { className: "text-sm font-semibold text-text-primary", children: [
                s.content,
                i.required && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative-500", children: "*" })
              ] }),
              i.helpText && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: i.helpText }),
              /* @__PURE__ */ e.jsx(B, { block: s, value: x[s.id], onChange: F }),
              C[s.id] && ((o = x[s.id]) == null ? void 0 : o.value) === C[s.id] && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-secondary", children: "Bağlantıdan seçildi; değiştirebilirsiniz." })
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
                S.current = s.target.value;
              },
              style: { position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }
            }
          ),
          r.requireKvkk && /* @__PURE__ */ e.jsxs("label", { className: "flex items-start gap-2 text-sm text-text-secondary", children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "checkbox",
                checked: N,
                onChange: (s) => R(s.target.checked),
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
              onClick: M,
              disabled: t === "submitting",
              className: "mt-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-600 disabled:opacity-50",
              style: y.primary ? { backgroundColor: y.primary } : void 0,
              children: t === "submitting" ? "Gönderiliyor…" : "Gönder"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-center text-xs text-text-tertiary", children: "Apya Platform ile oluşturuldu" })
    ] })
  ] });
}
const k = ({ children: n }) => /* @__PURE__ */ e.jsx("div", { className: "flex min-h-screen items-center justify-center bg-surface-app-bg p-6 text-text-secondary", children: n }), w = document.getElementById("public-form-root");
if (w) {
  const n = w.getAttribute("data-slug");
  q(w).render(/* @__PURE__ */ e.jsx(G, { slug: n }));
}
