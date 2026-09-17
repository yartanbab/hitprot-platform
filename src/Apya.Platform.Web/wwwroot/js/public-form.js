import { b as H, j as e, r as x } from "./react-vendor-D57GAUXd.js";
import { a as T } from "./httpClient-DePjXdo1.js";
import { f as J } from "./publicFormLink-CJ_6ABDU.js";
import { p as K, b as V } from "./formChoices-DAx-kYeM.js";
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
}, _ = /* @__PURE__ */ new Set([d.SectionHeader, d.Paragraph]), N = (l) => {
  try {
    return typeof l == "string" ? JSON.parse(l) : l || {};
  } catch {
    return {};
  }
}, f = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2.5 text-base text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft";
function Q({ block: l, value: n, onChange: S, choices: y, loading: v = !1 }) {
  const o = N(l.settings), p = y || l.choices, i = (t) => S(l.id, t);
  switch (l.type) {
    case d.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { rows: 4, className: f, placeholder: o.placeholder || "", value: n || "", onChange: (t) => i(t.target.value) });
    case d.Number:
      return /* @__PURE__ */ e.jsx("input", { type: "number", min: o.min ?? void 0, max: o.max ?? void 0, className: f, placeholder: o.placeholder || "", value: n || "", onChange: (t) => i(t.target.value) });
    case d.Email:
      return /* @__PURE__ */ e.jsx("input", { type: "email", className: f, placeholder: o.placeholder || "ornek@firma.com", value: n || "", onChange: (t) => i(t.target.value) });
    case d.Phone:
      return /* @__PURE__ */ e.jsx("input", { type: "tel", className: f, placeholder: o.placeholder || "", value: n || "", onChange: (t) => i(t.target.value) });
    case d.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "date", className: f, value: n || "", onChange: (t) => i(t.target.value) });
    case d.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "time", className: f, value: n || "", onChange: (t) => i(t.target.value) });
    case d.Dropdown:
      return Array.isArray(p) ? /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: f,
          value: (n == null ? void 0 : n.value) || "",
          disabled: p.length === 0,
          onChange: (t) => {
            const a = p.find((u) => u.value === t.target.value);
            i(a ? { value: a.value, label: a.label } : "");
          },
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: v ? "Yükleniyor…" : p.length ? "Seçiniz…" : V(o.source) }),
            p.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.value, children: t.label }, t.value))
          ]
        }
      ) : /* @__PURE__ */ e.jsxs("select", { className: f, value: n || "", onChange: (t) => i(t.target.value), children: [
        /* @__PURE__ */ e.jsx("option", { value: "", children: "Seçiniz…" }),
        (o.options || []).map((t, a) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, a))
      ] });
    case d.Select:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (o.options || []).map((t, a) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "radio", name: l.id, checked: n === t, onChange: () => i(t), className: "h-4 w-4 text-accent" }),
        t
      ] }, a)) });
    case d.MultiSelect: {
      const t = Array.isArray(n) ? n : [], a = (u) => i(t.includes(u) ? t.filter((b) => b !== u) : [...t, u]);
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (o.options || []).map((u, b) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
        /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: t.includes(u), onChange: () => a(u), className: "h-4 w-4 rounded text-accent" }),
        u
      ] }, b)) });
    }
    case d.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((t) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => i(t), className: `flex h-11 w-11 items-center justify-center text-3xl ${(n || 0) >= t ? "text-warning" : "text-text-tertiary"}`, children: "★" }, t)) });
    case d.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Array.from({ length: 11 }, (t, a) => /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => i(a), className: `h-11 w-11 rounded-lg border text-sm font-medium ${n === a ? "border-focus bg-accent text-white" : "border-default text-text-secondary"}`, children: a }, a)) });
    case d.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: ["line", "district", "city", "zip"].map((t, a) => /* @__PURE__ */ e.jsx("input", { className: f, placeholder: ["Adres", "İlçe", "İl", "Posta kodu"][a], value: (n || {})[t] || "", onChange: (u) => i({ ...n || {}, [t]: u.target.value }) }, t)) });
    case d.FilePicker:
      return /* @__PURE__ */ e.jsx("input", { type: "file", className: "block w-full text-sm text-text-secondary", onChange: (t) => {
        var a, u;
        return i(((u = (a = t.target.files) == null ? void 0 : a[0]) == null ? void 0 : u.name) || "");
      } });
    default:
      return /* @__PURE__ */ e.jsx("input", { type: "text", className: f, placeholder: o.placeholder || "", value: n || "", onChange: (t) => i(t.target.value) });
  }
}
function W({ slug: l }) {
  const [n, S] = x.useState(null), [y, v] = x.useState({}), [o, p] = x.useState("loading"), [i, t] = x.useState(""), [a, u] = x.useState(!1), [b, L] = x.useState({}), [O, A] = x.useState({}), [F, $] = x.useState({}), z = x.useRef(""), M = x.useRef((() => {
    const s = new URLSearchParams(window.location.search), r = s.get("shareToken"), c = s.get("taskId");
    return r && c ? { taskShareToken: r, taskId: c } : null;
  })()), D = x.useRef(Date.now()), j = x.useRef(J(window.location.search));
  x.useEffect(() => {
    (async () => {
      try {
        const s = j.current ? `&tenantId=${j.current}` : "", r = await T.get(`/api/app/public-document/by-slug?slug=${encodeURIComponent(l)}${s}`);
        S(r);
        const c = {};
        for (const h of r.blocks || []) {
          if (!Array.isArray(h.choices) || !N(h.settings).urlPrefill) continue;
          const m = K(h.choices, window.location.search);
          m && (c[h.id] = m);
        }
        v(c), L(Object.fromEntries(Object.entries(c).map(([h, m]) => [h, m.value]))), p("ready"), D.current = Date.now();
      } catch (s) {
        t((s == null ? void 0 : s.message) || "Form yüklenemedi."), p("error");
      }
    })();
  }, [l]);
  const E = x.useMemo(
    () => ((n == null ? void 0 : n.blocks) || []).slice().sort((s, r) => s.order - r.order),
    [n]
  ), k = E.filter((s) => !_.has(s.type)), q = k.filter((s) => {
    const r = y[s.id];
    return Array.isArray(r) ? r.length > 0 : r !== void 0 && r !== "" && r !== null;
  }).length, B = k.length ? Math.round(q / k.length * 100) : 0, U = (s, r) => {
    const c = ((n == null ? void 0 : n.blocks) || []).filter((m) => m.dependsOnBlockId === s);
    v((m) => {
      const C = { ...m, [s]: r };
      for (const P of c) delete C[P.id];
      return C;
    });
    const h = r && typeof r == "object" ? r.value : r;
    for (const m of c) {
      if (!h) {
        A((g) => ({ ...g, [m.id]: [] }));
        continue;
      }
      $((g) => ({ ...g, [m.id]: !0 }));
      const C = j.current ? `&tenantId=${j.current}` : "", P = `/api/app/public-document/block-choices?slug=${encodeURIComponent(l)}&blockId=${m.id}&parentValue=${encodeURIComponent(h)}${C}`;
      T.get(P).then((g) => A((G) => ({ ...G, [m.id]: g || [] }))).catch(() => A((g) => ({ ...g, [m.id]: [] }))).finally(() => $((g) => ({ ...g, [m.id]: !1 })));
    }
  }, Y = async () => {
    for (const s of k)
      if (N(s.settings).required) {
        const c = y[s.id];
        if (Array.isArray(c) ? c.length === 0 : c === void 0 || c === "" || c === null) {
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
      await T.post("/api/app/response/submit", {
        documentSlug: l,
        answers: JSON.stringify(y),
        completionSeconds: Math.round((Date.now() - D.current) / 1e3),
        kvkkConsent: a,
        website: z.current,
        // honeypot; boş kalmalı
        formTenantId: j.current,
        ...M.current ?? {}
      }), p("done");
    } catch (s) {
      t((s == null ? void 0 : s.message) || "Gönderim başarısız."), p("ready");
    }
  };
  if (o === "loading") return /* @__PURE__ */ e.jsx(I, { children: "Form yükleniyor…" });
  if (o === "error") return /* @__PURE__ */ e.jsx(I, { children: /* @__PURE__ */ e.jsx("span", { className: "text-negative-500", children: i }) });
  if (o === "done")
    return /* @__PURE__ */ e.jsx(I, { children: /* @__PURE__ */ e.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-positive-100 text-3xl", children: "✓" }),
      /* @__PURE__ */ e.jsx("h2", { className: "text-2xl font-bold text-text-primary", children: "Teşekkürler!" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-text-secondary", children: "Yanıtınız başarıyla gönderildi." })
    ] }) });
  const w = N(n == null ? void 0 : n.themeJson);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-app-bg py-8", children: [
    /* @__PURE__ */ e.jsx("div", { className: "fixed inset-x-0 top-0 z-10 h-1.5 bg-neutral-200", children: /* @__PURE__ */ e.jsx("div", { className: "h-full bg-accent transition-all duration-300", style: { width: `${B}%` } }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl bg-surface-raised shadow-sm", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle p-6", style: w.primary ? { borderTopColor: w.primary, borderTopWidth: 4 } : void 0, children: [
          /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-text-primary", children: n.title }),
          n.description && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-secondary", children: n.description })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 p-6", children: [
          E.map((s) => {
            var c;
            const r = N(s.settings);
            return s.type === d.SectionHeader ? /* @__PURE__ */ e.jsx("h2", { className: "border-b border-default pb-1 text-lg font-bold text-text-primary", children: s.content }, s.id) : s.type === d.Paragraph ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary", children: s.content }, s.id) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("label", { className: "text-sm font-semibold text-text-primary", children: [
                s.content,
                r.required && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative-500", children: "*" })
              ] }),
              r.helpText && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: r.helpText }),
              /* @__PURE__ */ e.jsx(Q, { block: s, value: y[s.id], onChange: U, choices: s.dependsOnBlockId ? O[s.id] || [] : null, loading: !!F[s.id] }),
              b[s.id] && ((c = y[s.id]) == null ? void 0 : c.value) === b[s.id] && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-secondary", children: "Bağlantıdan seçildi; değiştirebilirsiniz." })
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
                z.current = s.target.value;
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
                onChange: (s) => u(s.target.checked),
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
              onClick: Y,
              disabled: o === "submitting",
              className: "mt-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-600 disabled:opacity-50",
              style: w.primary ? { backgroundColor: w.primary } : void 0,
              children: o === "submitting" ? "Gönderiliyor…" : "Gönder"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-center text-xs text-text-tertiary", children: "Apya Platform ile oluşturuldu" })
    ] })
  ] });
}
const I = ({ children: l }) => /* @__PURE__ */ e.jsx("div", { className: "flex min-h-screen items-center justify-center bg-surface-app-bg p-6 text-text-secondary", children: l }), R = document.getElementById("public-form-root");
if (R) {
  const l = R.getAttribute("data-slug");
  H(R).render(/* @__PURE__ */ e.jsx(W, { slug: l }));
}
