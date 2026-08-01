import { b as X, j as e, r as c } from "./react-vendor.js";
import { a as B } from "./httpClient.js";
import { H as ee } from "./Hint.js";
/* empty css      */
const a = {
  ShortText: 0,
  LongText: 1,
  Select: 2,
  MultiSelect: 3,
  DatePicker: 4,
  FilePicker: 5,
  TableGrid: 6,
  RichText: 7,
  Number: 8,
  Email: 9,
  Phone: 10,
  TimePicker: 11,
  Rating: 12,
  Nps: 13,
  Signature: 14,
  Address: 15,
  SectionHeader: 16,
  Paragraph: 17,
  Dropdown: 18
}, K = /* @__PURE__ */ new Set([a.Select, a.MultiSelect, a.Dropdown]), te = /* @__PURE__ */ new Set([a.SectionHeader, a.Paragraph]), E = [
  { group: "Metin & Sayı", items: [
    { type: a.ShortText, label: "Kısa Metin", icon: "✏️" },
    { type: a.LongText, label: "Uzun Metin", icon: "📝" },
    { type: a.Number, label: "Sayısal", icon: "🔢" },
    { type: a.Email, label: "E-Posta", icon: "✉️" },
    { type: a.Phone, label: "Telefon", icon: "📞" }
  ] },
  { group: "Seçim", items: [
    { type: a.Select, label: "Tekli Seçim", icon: "🔘" },
    { type: a.MultiSelect, label: "Çoklu Seçim", icon: "☑️" },
    { type: a.Dropdown, label: "Açılır Liste", icon: "⬇️" }
  ] },
  { group: "Tarih & Zaman", items: [
    { type: a.DatePicker, label: "Tarih", icon: "📅" },
    { type: a.TimePicker, label: "Saat", icon: "🕐" }
  ] },
  { group: "Özel", items: [
    { type: a.FilePicker, label: "Dosya Yükleme", icon: "📎" },
    { type: a.Rating, label: "Derecelendirme", icon: "⭐" },
    { type: a.Nps, label: "NPS (0-10)", icon: "📊" },
    { type: a.Signature, label: "İmza", icon: "✍️" },
    { type: a.Address, label: "Adres", icon: "📍" }
  ] },
  { group: "Düzen", items: [
    { type: a.SectionHeader, label: "Bölüm Başlığı", icon: "🏷️" },
    { type: a.Paragraph, label: "Açıklama", icon: "💬" }
  ] }
], I = Object.fromEntries(E.flatMap((t) => t.items.map((r) => [r.type, r.label]))), z = () => Math.random().toString(36).slice(2, 10);
function M(t) {
  const r = { id: z(), type: t, content: I[t] || "Soru", settings: { required: !1 } };
  return K.has(t) && (r.settings.options = ["Seçenek 1", "Seçenek 2"]), t === a.SectionHeader && (r.content = "Bölüm Başlığı"), t === a.Paragraph && (r.content = "Açıklama metni…"), r;
}
const p = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft", Y = ({ checked: t, onChange: r, label: l }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
  /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium text-text-secondary", children: l }),
  /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: (d) => {
        d.stopPropagation(), r(!t);
      },
      className: `relative h-6 w-11 rounded-full transition-colors ${t ? "bg-accent" : "bg-neutral-200"}`,
      "aria-pressed": t,
      children: /* @__PURE__ */ e.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${t ? "left-[22px]" : "left-0.5"}` })
    }
  )
] });
function se({ value: t, onChange: r }) {
  return /* @__PURE__ */ e.jsx(
    "select",
    {
      value: t,
      onClick: (l) => l.stopPropagation(),
      onChange: (l) => r(Number(l.target.value)),
      className: "shrink-0 rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm font-medium text-text-primary focus:border-focus focus:outline-none",
      children: E.map((l) => /* @__PURE__ */ e.jsx("optgroup", { label: l.group, children: l.items.map((d) => /* @__PURE__ */ e.jsxs("option", { value: d.type, children: [
        d.icon,
        " ",
        d.label
      ] }, d.type)) }, l.group))
    }
  );
}
function ae({ block: t }) {
  const r = t.settings || {};
  switch (t.type) {
    case a.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: p, placeholder: r.placeholder || "Uzun yanıt…" });
    case a.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: p, placeholder: r.placeholder || "0" });
    case a.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: p, placeholder: r.placeholder || "ornek@firma.com" });
    case a.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: p, placeholder: r.placeholder || "+90 5xx xxx xx xx" });
    case a.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: p });
    case a.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: p });
    case a.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-6 text-center text-sm text-text-tertiary", children: "📎 Dosya seç / sürükle" });
    case a.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: p, children: (r.options || []).map((l, d) => /* @__PURE__ */ e.jsx("option", { children: l }, d)) });
    case a.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-warning", children: "★★★★★" });
    case a.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (l, d) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-default text-xs text-text-secondary", children: d }, d)) });
    case a.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-8 text-center text-sm text-text-tertiary", children: "✍️ İmza alanı" });
    case a.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["Adres satırı", "İlçe", "İl", "Posta kodu"].map((l) => /* @__PURE__ */ e.jsx("input", { disabled: !0, className: p, placeholder: l }, l)) });
    case a.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "▦ Tablo ızgarası" });
    case a.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: p, placeholder: r.placeholder || "Kısa yanıt…" });
  }
}
function re({ block: t, index: r, selected: l, onSelect: d, onPatch: P, onPatchSettings: f, onChangeType: T, onDuplicate: y, onRemove: D, onAddAfter: N, onMove: k, dragRef: S }) {
  const h = t.settings || {}, j = te.has(t.type);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !0,
      onDragStart: () => S.current = r,
      onDragOver: (n) => n.preventDefault(),
      onDrop: () => k(r),
      onClick: () => d(t.id),
      className: `group relative rounded-2xl border bg-surface-raised p-5 transition ${l ? "border-focus shadow-md ring-1 ring-accent-soft" : "border-default hover:border-strong"}`,
      children: [
        l && /* @__PURE__ */ e.jsx("span", { className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-accent" }),
        /* @__PURE__ */ e.jsx("div", { className: "absolute -top-2 left-1/2 -translate-x-1/2 cursor-grab text-text-tertiary opacity-0 group-hover:opacity-100", title: "Sürükle", children: "⠿" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3", children: [
          j ? /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (n) => n.stopPropagation(),
              onChange: (n) => P(t.id, { content: n.target.value }),
              placeholder: t.type === a.SectionHeader ? "Bölüm başlığı" : "Açıklama metni",
              className: `flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${t.type === a.SectionHeader ? "text-xl font-bold text-text-primary" : "text-sm text-text-secondary"}`
            }
          ) : /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (n) => n.stopPropagation(),
              onChange: (n) => P(t.id, { content: n.target.value }),
              placeholder: "Soru metni…",
              className: "flex-1 border-b border-transparent bg-transparent p-0 pb-1 text-base font-semibold text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-0"
            }
          ),
          l && /* @__PURE__ */ e.jsx(se, { value: t.type, onChange: (n) => T(t.id, n) }),
          !l && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary", children: I[t.type] })
        ] }),
        l && K.has(t.type) && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [
          (h.options || []).map((n, b) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", onClick: (m) => m.stopPropagation(), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: t.type === a.MultiSelect ? "☐" : "○" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: "flex-1 border-b border-subtle bg-transparent px-1 py-1 text-sm focus:border-focus focus:outline-none",
                value: n,
                onChange: (m) => {
                  const w = [...h.options];
                  w[b] = m.target.value, f(t.id, { options: w });
                }
              }
            ),
            /* @__PURE__ */ e.jsx("button", { className: "rounded p-1 text-text-tertiary hover:text-negative-500", onClick: () => f(t.id, { options: h.options.filter((m, w) => w !== b) }), children: "✕" })
          ] }, b)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "self-start text-sm font-medium text-accent hover:text-accent-600",
              onClick: (n) => {
                n.stopPropagation(), f(t.id, { options: [...h.options || [], `Seçenek ${(h.options || []).length + 1}`] });
              },
              children: "+ Seçenek ekle"
            }
          )
        ] }),
        !j && !K.has(t.type) && /* @__PURE__ */ e.jsx("div", { className: "mt-4", onClick: (n) => n.stopPropagation(), children: /* @__PURE__ */ e.jsx(ae, { block: t }) }),
        l && !j && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 border-t border-subtle pt-4 sm:grid-cols-2", onClick: (n) => n.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Placeholder" }),
            /* @__PURE__ */ e.jsx("input", { className: p, value: h.placeholder || "", onChange: (n) => f(t.id, { placeholder: n.target.value }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yardım Metni" }),
            /* @__PURE__ */ e.jsx("input", { className: p, value: h.helpText || "", onChange: (n) => f(t.id, { helpText: n.target.value }) })
          ] }),
          (t.type === a.Number || t.type === a.Rating) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Min" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: p, value: h.min ?? "", onChange: (n) => f(t.id, { min: n.target.value === "" ? null : Number(n.target.value) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Max" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: p, value: h.max ?? "", onChange: (n) => f(t.id, { max: n.target.value === "" ? null : Number(n.target.value) }) })
            ] })
          ] })
        ] }),
        l && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 border-t border-subtle pt-3", onClick: (n) => n.stopPropagation(), children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => k(r - 1, r), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Yukarı", children: "▲" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => k(r + 1, r), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Aşağı", children: "▼" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => y(t.id), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Kopyala", children: "⧉" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => D(t.id), className: "rounded-lg p-2 text-negative-500 hover:bg-negative-50", title: "Sil", children: "🗑" }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          !j && /* @__PURE__ */ e.jsx(Y, { label: "Zorunlu", checked: !!h.required, onChange: (n) => f(t.id, { required: n }) }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => N(t.id), className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600", children: "+ Soru" })
        ] })
      ]
    }
  );
}
function ne() {
  const t = c.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [r, l] = c.useState(t), [d, P] = c.useState(""), [f, T] = c.useState(!1), [y, D] = c.useState(""), [N, k] = c.useState(""), [S, h] = c.useState(null), [j, n] = c.useState([]), [b, m] = c.useState([]), [w, v] = c.useState(null), [F, u] = c.useState(!1), [O, H] = c.useState(!!t), R = c.useRef(null);
  c.useEffect(() => {
    B.get("/api/app/form-category?MaxResultCount=100").then((s) => n(s.items || [])).catch(() => {
    });
  }, []), c.useEffect(() => {
    t && (async () => {
      try {
        const s = await B.get(`/api/app/form/${t}`);
        D(s.title || ""), P(s.slug || ""), k(s.description || ""), h(s.categoryId || null), m((s.blocks || []).slice().sort((i, o) => i.order - o.order).map((i) => ({
          id: i.id || z(),
          type: i.type,
          content: i.content,
          settings: ie(i.settings)
        })));
      } catch (s) {
        C("error", (s == null ? void 0 : s.message) || "Form yüklenemedi.");
      } finally {
        H(!1);
      }
    })();
  }, [t]);
  const U = (s = a.ShortText) => {
    const i = M(s);
    m((o) => [...o, i]), v(i.id);
  }, J = (s) => {
    const i = M(a.ShortText);
    m((o) => {
      const x = o.findIndex((A) => A.id === s), g = [...o];
      return g.splice(x + 1, 0, i), g;
    }), v(i.id);
  }, _ = (s) => m((i) => i.filter((o) => o.id !== s)), q = (s) => m((i) => {
    const o = i.findIndex((A) => A.id === s);
    if (o < 0) return i;
    const x = { ...i[o], id: z(), settings: { ...i[o].settings } }, g = [...i];
    return g.splice(o + 1, 0, x), g;
  }), G = (s, i) => m((o) => o.map((x) => x.id === s ? { ...x, ...i } : x)), V = (s, i) => m((o) => o.map((x) => x.id === s ? { ...x, settings: { ...x.settings, ...i } } : x)), Z = (s, i) => m((o) => o.map((x) => {
    if (x.id !== s) return x;
    const g = { ...x.settings };
    return K.has(i) && !g.options && (g.options = ["Seçenek 1", "Seçenek 2"]), { ...x, type: i, settings: g };
  })), Q = (s, i) => m((o) => {
    const x = i ?? R.current;
    if (R.current = null, x == null || s < 0 || s >= o.length || x === s) return o;
    const g = [...o], [A] = g.splice(x, 1);
    return g.splice(s, 0, A), g;
  }), L = () => b.map((s, i) => ({
    type: s.type,
    order: i + 1,
    content: s.content || I[s.type] || "Soru",
    settings: JSON.stringify(s.settings || {})
  })), W = async () => {
    if (!y.trim()) return C("warn", "Lütfen forma bir başlık verin.");
    u(!0);
    try {
      if (r)
        await B.put(`/api/app/form/${r}`, { title: y.trim(), description: N.trim() || null, categoryId: S, themeJson: null, blocks: [] }), await B.put(`/api/app/form/${r}/blocks`, { blocks: L() }), C("success", "Form kaydedildi.");
      else {
        const s = await B.post("/api/app/form", { title: y.trim(), description: N.trim() || null, categoryId: S, themeJson: null, blocks: L() });
        l(s.id), P(s.slug || "");
        const i = new URL(window.location.href);
        i.searchParams.set("id", s.id), window.history.replaceState({}, "", i), C("success", "Form oluşturuldu.");
      }
    } catch (s) {
      C("error", (s == null ? void 0 : s.message) || "Kaydetme başarısız.");
    } finally {
      u(!1);
    }
  };
  return O ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-text-tertiary", children: "Form yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "min-h-[calc(100vh-120px)] bg-surface-sunken pb-24", children: [
    /* @__PURE__ */ e.jsx("div", { className: "sticky top-0 z-20 border-b border-default bg-surface-raised", children: /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-between px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets", className: "text-sm font-semibold text-text-secondary hover:text-text-primary", children: "← Formlar" }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary", children: [
          b.length,
          " alan"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("button", { onClick: W, disabled: F, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken disabled:opacity-50", children: F ? "Kaydediliyor…" : r ? "Kaydet" : "Oluştur" }),
        r && /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${r}`, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken", children: "Yanıtlar" }),
        r && /* @__PURE__ */ e.jsx("button", { onClick: () => T(!0), className: "rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-600", children: "Yayınla" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative mb-4 overflow-hidden rounded-2xl border border-default bg-surface-raised p-6", children: [
        /* @__PURE__ */ e.jsx("span", { className: "absolute inset-x-0 top-0 h-1.5 bg-accent" }),
        /* @__PURE__ */ e.jsx("input", { value: y, onChange: (s) => D(s.target.value), placeholder: "Form başlığı…", className: "w-full border-none bg-transparent p-0 text-3xl font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsx("input", { value: N, onChange: (s) => k(s.target.value), placeholder: "Form açıklaması (opsiyonel)…", className: "mt-2 w-full border-none bg-transparent p-0 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: S || "",
            onChange: (s) => h(s.target.value || null),
            className: "mt-3 rounded-lg border border-default bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-text-secondary focus:border-accent focus:outline-none",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Kategorisiz" }),
              j.map((s) => /* @__PURE__ */ e.jsxs("option", { value: s.id, children: [
                s.icon ? `${s.icon} ` : "",
                s.name
              ] }, s.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: b.map((s, i) => /* @__PURE__ */ e.jsx(
        re,
        {
          block: s,
          index: i,
          selected: s.id === w,
          onSelect: v,
          onPatch: G,
          onPatchSettings: V,
          onChangeType: Z,
          onDuplicate: q,
          onRemove: _,
          onAddAfter: J,
          onMove: Q,
          dragRef: R
        },
        s.id
      )) }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => U(a.ShortText), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-default py-4 text-sm font-bold text-text-secondary transition hover:border-focus hover:text-accent", children: "+ Soru Ekle" }),
      b.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-center text-sm text-text-tertiary", children: "Başlamak için bir soru ekleyin." })
    ] }),
    f && /* @__PURE__ */ e.jsx(le, { formId: r, slug: d, onClose: () => T(!1) })
  ] });
}
function le({ formId: t, slug: r, onClose: l }) {
  const [d, P] = c.useState(r || ""), [f, T] = c.useState(""), [y, D] = c.useState(""), [N, k] = c.useState(!1), [S, h] = c.useState(!1), [j, n] = c.useState(!1), [b, m] = c.useState(null), w = async () => {
    n(!0);
    try {
      const u = await B.post(`/api/app/form/${t}/publish`, {
        slug: (d == null ? void 0 : d.trim()) || null,
        publishSettingsJson: JSON.stringify({ startDate: f || null, endDate: y || null, kvkk: N, captcha: S })
      });
      m(u.slug || d), C("success", "Form yayınlandı.");
    } catch (u) {
      C("error", (u == null ? void 0 : u.message) || "Yayınlama başarısız.");
    } finally {
      n(!1);
    }
  }, v = b ? `${window.location.origin}/f/${b}` : null, F = () => {
    var u;
    v && ((u = navigator.clipboard) == null || u.writeText(v)), C("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: l, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-surface-raised p-6 shadow-xl", onClick: (u) => u.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Formu Yayınla" }),
      /* @__PURE__ */ e.jsx("button", { onClick: l, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    v ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: "rounded-xl bg-positive-50 p-3 text-sm text-positive-700", children: "✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yayın bağlantısı" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: p, value: v, onClick: (u) => u.target.select() }),
          /* @__PURE__ */ e.jsx("button", { onClick: F, className: "shrink-0 rounded-xl border border-default px-3 py-2 text-sm font-medium hover:bg-surface-sunken", children: "Kopyala" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: v, target: "_blank", rel: "noreferrer", className: "rounded-xl bg-accent px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-accent-600", children: "Formu yeni sekmede aç" })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bağlantı adresi (slug)" }),
        /* @__PURE__ */ e.jsx("input", { className: p, value: d, onChange: (u) => P(u.target.value), placeholder: "musteri-memnuniyet" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Başlangıç" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: p, value: f, onChange: (u) => T(u.target.value) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bitiş" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: p, value: y, onChange: (u) => D(u.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(Y, { label: "KVKK onayı iste", checked: N, onChange: k }),
      /* @__PURE__ */ e.jsx(Y, { label: "Captcha doğrulaması", checked: S, onChange: h }),
      /* @__PURE__ */ e.jsxs("div", { className: "-mt-2 flex items-start gap-1 text-[11px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx(ee, { text: "Bu dört ayar (Başlangıç, Bitiş, KVKK onayı, Captcha) şu an yalnız kaydediliyor — hiçbiri gerçekten UYGULANMIYOR. Form, bitiş tarihi geçse de herkese açık kalır; KVKK kutucuğu ve captcha genel formda görünmez." }),
        /* @__PURE__ */ e.jsx("span", { children: "Yukarıdaki 4 ayar henüz devrede değil" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { onClick: w, disabled: j, className: "mt-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: j ? "Yayınlanıyor…" : "Yayınla" })
    ] })
  ] }) });
}
function ie(t) {
  if (!t) return { required: !1 };
  try {
    return typeof t == "string" ? JSON.parse(t) : t;
  } catch {
    return { required: !1 };
  }
}
function C(t, r) {
  const l = window.abp;
  l != null && l.notify && (t === "success" || t === "info") ? l.notify[t === "success" ? "success" : "info"](r) : l != null && l.message ? l.message[t === "error" ? "error" : t === "warn" ? "warn" : "info"](r) : console.log(`[${t}] ${r}`);
}
const $ = document.getElementById("dynamic-assets-app-root");
$ && X($).render(/* @__PURE__ */ e.jsx(ne, {}));
