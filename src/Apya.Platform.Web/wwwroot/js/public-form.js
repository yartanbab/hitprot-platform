import { b as _, j as e, r as x } from "./react-vendor-D57GAUXd.js";
import { a as $ } from "./httpClient-DePjXdo1.js";
import { f as Q } from "./publicFormLink-CJ_6ABDU.js";
import { p as W, b as X } from "./formChoices-DAx-kYeM.js";
import { h as M, w as F } from "./formConditions-DMSgmMUB.js";
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
}, Z = /* @__PURE__ */ new Set([u.SectionHeader, u.Paragraph]), k = (c) => {
  try {
    return typeof c == "string" ? JSON.parse(c) : c || {};
  } catch {
    return {};
  }
}, f = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2.5 text-base text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft";
function ee({ block: c, value: n, onChange: A, choices: g, loading: N = !1 }) {
  const d = k(c.settings), p = g || c.choices, l = (t) => A(c.id, t);
  switch (c.type) {
    case u.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { rows: 4, className: f, placeholder: d.placeholder || "", value: n || "", onChange: (t) => l(t.target.value) });
    case u.Number:
      return /* @__PURE__ */ e.jsx("input", { type: "number", min: d.min ?? void 0, max: d.max ?? void 0, className: f, placeholder: d.placeholder || "", value: n || "", onChange: (t) => l(t.target.value) });
    case u.Email:
      return /* @__PURE__ */ e.jsx("input", { type: "email", className: f, placeholder: d.placeholder || "ornek@firma.com", value: n || "", onChange: (t) => l(t.target.value) });
    case u.Phone:
      return /* @__PURE__ */ e.jsx("input", { type: "tel", className: f, placeholder: d.placeholder || "", value: n || "", onChange: (t) => l(t.target.value) });
    case u.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "date", className: f, value: n || "", onChange: (t) => l(t.target.value) });
    case u.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "time", className: f, value: n || "", onChange: (t) => l(t.target.value) });
    case u.Dropdown:
      return Array.isArray(p) ? /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: f,
          value: (n == null ? void 0 : n.value) || "",
          disabled: p.length === 0,
          onChange: (t) => {
            const a = p.find((m) => m.value === t.target.value);
            l(a ? { value: a.value, label: a.label } : "");
          },
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: N ? "Yükleniyor…" : p.length ? "Seçiniz…" : X(d.source) }),
            p.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.value, children: t.label }, t.value))
          ]
        }
      ) : /* @__PURE__ */ e.jsxs("select", { className: f, value: n || "", onChange: (t) => l(t.target.value), children: [
        /* @__PURE__ */ e.jsx("option", { value: "", children: "Seçiniz…" }),
        (d.options || []).map((t, a) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, a))
      ] });
    case u.Select:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (d.options || []).map((t, a) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "radio", name: c.id, checked: n === t, onChange: () => l(t), className: "h-4 w-4 text-accent" }),
        t
      ] }, a)) });
    case u.MultiSelect: {
      const t = Array.isArray(n) ? n : [], a = (m) => l(t.includes(m) ? t.filter((j) => j !== m) : [...t, m]);
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (d.options || []).map((m, j) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: t.includes(m), onChange: () => a(m), className: "h-4 w-4 rounded text-accent" }),
        m
      ] }, j)) });
    }
    case u.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((t) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => l(t), className: `flex h-11 w-11 items-center justify-center text-3xl ${(n || 0) >= t ? "text-warning" : "text-text-tertiary"}`, children: "★" }, t)) });
    case u.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Array.from({ length: 11 }, (t, a) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => l(a), className: `h-11 w-11 rounded-lg border text-sm font-medium ${n === a ? "border-focus bg-accent text-white" : "border-default text-text-secondary"}`, children: a }, a)) });
    case u.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: ["line", "district", "city", "zip"].map((t, a) => /* @__PURE__ */ e.jsx("input", { className: f, placeholder: ["Adres", "İlçe", "İl", "Posta kodu"][a], value: (n || {})[t] || "", onChange: (m) => l({ ...n || {}, [t]: m.target.value }) }, t)) });
    case u.FilePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "file", className: "block w-full text-sm text-text-secondary", onChange: (t) => {
        var a, m;
        return l(((m = (a = t.target.files) == null ? void 0 : a[0]) == null ? void 0 : m.name) || "");
      } });
    default:
      return /* @__PURE__ */ e.jsx("input", { type: "text", className: f, placeholder: d.placeholder || "", value: n || "", onChange: (t) => l(t.target.value) });
  }
}
function te({ slug: c }) {
  const [n, A] = x.useState(null), [g, N] = x.useState({}), [d, p] = x.useState("loading"), [l, t] = x.useState(""), [a, m] = x.useState(!1), [j, q] = x.useState({}), [P, T] = x.useState({}), [U, D] = x.useState({}), E = x.useRef(""), H = x.useRef((() => {
    const s = new URLSearchParams(window.location.search), r = s.get("shareToken"), i = s.get("taskId");
    return r && i ? { taskShareToken: r, taskId: i } : null;
  })()), L = x.useRef(Date.now()), v = x.useRef(Q(window.location.search));
  x.useEffect(() => {
    (async () => {
      try {
        const s = v.current ? `&tenantId=${v.current}` : "", r = await $.get(`/api/app/public-document/by-slug?slug=${encodeURIComponent(c)}${s}`);
        A(r);
        const i = {};
        for (const h of r.blocks || []) {
          if (!Array.isArray(h.choices) || !k(h.settings).urlPrefill) continue;
          const o = W(h.choices, window.location.search);
          o && (i[h.id] = o);
        }
        N(i), q(Object.fromEntries(Object.entries(i).map(([h, o]) => [h, o.value]))), p("ready"), L.current = Date.now();
      } catch (s) {
        t((s == null ? void 0 : s.message) || "Form yüklenemedi."), p("error");
      }
    })();
  }, [c]);
  const b = x.useMemo(
    () => ((n == null ? void 0 : n.blocks) || []).slice().sort((s, r) => s.order - r.order),
    [n]
  ), B = (s) => {
    const r = b.find((i) => i.id === s);
    return (r != null && r.dependsOnBlockId ? P[s] : r == null ? void 0 : r.choices) || [];
  }, I = x.useMemo(
    () => M(b, g, B),
    [b, g, P]
  ), w = b.filter((s) => !Z.has(s.type) && !I.has(s.id)), Y = w.filter((s) => {
    const r = g[s.id];
    return Array.isArray(r) ? r.length > 0 : r !== void 0 && r !== "" && r !== null;
  }).length, G = w.length ? Math.round(Y / w.length * 100) : 0, J = (s, r) => {
    const i = ((n == null ? void 0 : n.blocks) || []).filter((o) => o.dependsOnBlockId === s);
    N((o) => {
      const S = { ...o, [s]: r };
      for (const R of i) delete S[R.id];
      return S;
    }), N((o) => F(o, M(b, o, B)));
    const h = r && typeof r == "object" ? r.value : r;
    for (const o of i) {
      if (!h) {
        T((y) => ({ ...y, [o.id]: [] }));
        continue;
      }
      D((y) => ({ ...y, [o.id]: !0 }));
      const S = v.current ? `&tenantId=${v.current}` : "", R = `/api/app/public-document/block-choices?slug=${encodeURIComponent(c)}&blockId=${o.id}&parentValue=${encodeURIComponent(h)}${S}`;
      $.get(R).then((y) => T((V) => ({ ...V, [o.id]: y || [] }))).catch(() => T((y) => ({ ...y, [o.id]: [] }))).finally(() => D((y) => ({ ...y, [o.id]: !1 })));
    }
  }, K = async () => {
    for (const s of w)
      if (k(s.settings).required) {
        const i = g[s.id];
        if (Array.isArray(i) ? i.length === 0 : i === void 0 || i === "" || i === null) {
          t("Lütfen tüm zorunlu alanları doldurun.");
          return;
        }
      }
    if (n != null && n.requireKvkk && !a) {
      t("Devam etmek için aydınlatma metnini onaylamanız gerekir.");
      return;
    }
    t(""), p("submitting");
    try {
      await $.post("/api/app/response/submit", {
        documentSlug: c,
        answers: JSON.stringify(F(g, I)),
        completionSeconds: Math.round((Date.now() - L.current) / 1e3),
        kvkkConsent: a,
        website: E.current,
        // honeypot; boş kalmalı
        formTenantId: v.current,
        ...H.current ?? {}
      }), p("done");
    } catch (s) {
      t((s == null ? void 0 : s.message) || "Gönderim başarısız."), p("ready");
    }
  };
  if (d === "loading") return /* @__PURE__ */ e.jsx(O, { children: "Form yükleniyor…" });
  if (d === "error") return /* @__PURE__ */ e.jsx(O, { children: /* @__PURE__ */ e.jsx("span", { className: "text-negative-500", children: l }) });
  if (d === "done")
    return /* @__PURE__ */ e.jsx(O, { children: /* @__PURE__ */ e.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-positive-100 text-3xl", children: "✓" }),
      /* @__PURE__ */ e.jsx("h2", { className: "text-2xl font-bold text-text-primary", children: "Teşekkürler!" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-text-secondary", children: "Yanıtınız başarıyla gönderildi." })
    ] }) });
  const C = k(n == null ? void 0 : n.themeJson);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-app-bg py-8", children: [
    /* @__PURE__ */ e.jsx("div", { className: "fixed inset-x-0 top-0 z-10 h-1.5 bg-neutral-200", children: /* @__PURE__ */ e.jsx("div", { className: "h-full bg-accent transition-all duration-300", style: { width: `${G}%` } }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl bg-surface-raised shadow-sm", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle p-6", style: C.primary ? { borderTopColor: C.primary, borderTopWidth: 4 } : void 0, children: [
          /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-text-primary", children: n.title }),
          n.description && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-secondary", children: n.description })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 p-6", children: [
          b.map((s) => {
            var i;
            if (I.has(s.id)) return null;
            const r = k(s.settings);
            return s.type === u.SectionHeader ? /* @__PURE__ */ e.jsx("h2", { className: "border-b border-default pb-1 text-lg font-bold text-text-primary", children: s.content }, s.id) : s.type === u.Paragraph ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary", children: s.content }, s.id) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("label", { className: "text-sm font-semibold text-text-primary", children: [
                s.content,
                r.required && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative-500", children: "*" })
              ] }),
              r.helpText && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: r.helpText }),
              /* @__PURE__ */ e.jsx(ee, { block: s, value: g[s.id], onChange: J, choices: s.dependsOnBlockId ? P[s.id] || [] : null, loading: !!U[s.id] }),
              j[s.id] && ((i = g[s.id]) == null ? void 0 : i.value) === j[s.id] && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-secondary", children: "Bağlantıdan seçildi; değiştirebilirsiniz." })
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
                E.current = s.target.value;
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
              onClick: K,
              disabled: d === "submitting",
              className: "mt-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-600 disabled:opacity-50",
              style: C.primary ? { backgroundColor: C.primary } : void 0,
              children: d === "submitting" ? "Gönderiliyor…" : "Gönder"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-center text-xs text-text-tertiary", children: "Apya Platform ile oluşturuldu" })
    ] })
  ] });
}
const O = ({ children: c }) => /* @__PURE__ */ e.jsx("div", { className: "flex min-h-screen items-center justify-center bg-surface-app-bg p-6 text-text-secondary", children: c }), z = document.getElementById("public-form-root");
if (z) {
  const c = z.getAttribute("data-slug");
  _(z).render(/* @__PURE__ */ e.jsx(te, { slug: c }));
}
