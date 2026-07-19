import { c as X, j as e, r as d } from "./vendor.js";
import { a as B } from "./vendor2.js";
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
}, R = /* @__PURE__ */ new Set([a.Select, a.MultiSelect, a.Dropdown]), ee = /* @__PURE__ */ new Set([a.SectionHeader, a.Paragraph]), K = [
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
], L = Object.fromEntries(K.flatMap((t) => t.items.map((l) => [l.type, l.label]))), E = () => Math.random().toString(36).slice(2, 10);
function z(t) {
  const l = { id: E(), type: t, content: L[t] || "Soru", settings: { required: !1 } };
  return R.has(t) && (l.settings.options = ["Seçenek 1", "Seçenek 2"]), t === a.SectionHeader && (l.content = "Bölüm Başlığı"), t === a.Paragraph && (l.content = "Açıklama metni…"), l;
}
const x = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100", I = ({ checked: t, onChange: l, label: r }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
  /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium text-slate-600", children: r }),
  /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: (c) => {
        c.stopPropagation(), l(!t);
      },
      className: `relative h-6 w-11 rounded-full transition-colors ${t ? "bg-indigo-600" : "bg-slate-300"}`,
      "aria-pressed": t,
      children: /* @__PURE__ */ e.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${t ? "left-[22px]" : "left-0.5"}` })
    }
  )
] });
function te({ value: t, onChange: l }) {
  return /* @__PURE__ */ e.jsx(
    "select",
    {
      value: t,
      onClick: (r) => r.stopPropagation(),
      onChange: (r) => l(Number(r.target.value)),
      className: "shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-indigo-400 focus:outline-none",
      children: K.map((r) => /* @__PURE__ */ e.jsx("optgroup", { label: r.group, children: r.items.map((c) => /* @__PURE__ */ e.jsxs("option", { value: c.type, children: [
        c.icon,
        " ",
        c.label
      ] }, c.type)) }, r.group))
    }
  );
}
function se({ block: t }) {
  const l = t.settings || {};
  switch (t.type) {
    case a.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: x, placeholder: l.placeholder || "Uzun yanıt…" });
    case a.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: x, placeholder: l.placeholder || "0" });
    case a.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: x, placeholder: l.placeholder || "ornek@firma.com" });
    case a.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: x, placeholder: l.placeholder || "+90 5xx xxx xx xx" });
    case a.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: x });
    case a.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: x });
    case a.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-400", children: "📎 Dosya seç / sürükle" });
    case a.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: x, children: (l.options || []).map((r, c) => /* @__PURE__ */ e.jsx("option", { children: r }, c)) });
    case a.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-amber-400", children: "★★★★★" });
    case a.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (r, c) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs text-slate-500", children: c }, c)) });
    case a.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-slate-200 px-3 py-8 text-center text-sm text-slate-400", children: "✍️ İmza alanı" });
    case a.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["Adres satırı", "İlçe", "İl", "Posta kodu"].map((r) => /* @__PURE__ */ e.jsx("input", { disabled: !0, className: x, placeholder: r }, r)) });
    case a.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-slate-200 p-3 text-sm text-slate-400", children: "▦ Tablo ızgarası" });
    case a.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-slate-200 p-3 text-sm text-slate-400", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: x, placeholder: l.placeholder || "Kısa yanıt…" });
  }
}
function ae({ block: t, index: l, selected: r, onSelect: c, onPatch: P, onPatchSettings: h, onChangeType: T, onDuplicate: y, onRemove: D, onAddAfter: v, onMove: S, dragRef: w }) {
  const g = t.settings || {}, j = ee.has(t.type);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !0,
      onDragStart: () => w.current = l,
      onDragOver: (n) => n.preventDefault(),
      onDrop: () => S(l),
      onClick: () => c(t.id),
      className: `group relative rounded-2xl border bg-white p-5 transition ${r ? "border-indigo-300 shadow-md ring-1 ring-indigo-100" : "border-slate-200 hover:border-slate-300"}`,
      children: [
        r && /* @__PURE__ */ e.jsx("span", { className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-indigo-500" }),
        /* @__PURE__ */ e.jsx("div", { className: "absolute -top-2 left-1/2 -translate-x-1/2 cursor-grab text-slate-300 opacity-0 group-hover:opacity-100", title: "Sürükle", children: "⠿" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3", children: [
          j ? /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (n) => n.stopPropagation(),
              onChange: (n) => P(t.id, { content: n.target.value }),
              placeholder: t.type === a.SectionHeader ? "Bölüm başlığı" : "Açıklama metni",
              className: `flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${t.type === a.SectionHeader ? "text-xl font-bold text-slate-800" : "text-sm text-slate-500"}`
            }
          ) : /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (n) => n.stopPropagation(),
              onChange: (n) => P(t.id, { content: n.target.value }),
              placeholder: "Soru metni…",
              className: "flex-1 border-b border-transparent bg-transparent p-0 pb-1 text-base font-semibold text-slate-800 placeholder-slate-300 focus:border-indigo-300 focus:outline-none focus:ring-0"
            }
          ),
          r && /* @__PURE__ */ e.jsx(te, { value: t.type, onChange: (n) => T(t.id, n) }),
          !r && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500", children: L[t.type] })
        ] }),
        r && R.has(t.type) && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [
          (g.options || []).map((n, f) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", onClick: (m) => m.stopPropagation(), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-slate-300", children: t.type === a.MultiSelect ? "☐" : "○" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: "flex-1 border-b border-slate-100 bg-transparent px-1 py-1 text-sm focus:border-indigo-300 focus:outline-none",
                value: n,
                onChange: (m) => {
                  const k = [...g.options];
                  k[f] = m.target.value, h(t.id, { options: k });
                }
              }
            ),
            /* @__PURE__ */ e.jsx("button", { className: "rounded p-1 text-slate-300 hover:text-red-500", onClick: () => h(t.id, { options: g.options.filter((m, k) => k !== f) }), children: "✕" })
          ] }, f)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "self-start text-sm font-medium text-indigo-600 hover:text-indigo-700",
              onClick: (n) => {
                n.stopPropagation(), h(t.id, { options: [...g.options || [], `Seçenek ${(g.options || []).length + 1}`] });
              },
              children: "+ Seçenek ekle"
            }
          )
        ] }),
        !j && !R.has(t.type) && /* @__PURE__ */ e.jsx("div", { className: "mt-4", onClick: (n) => n.stopPropagation(), children: /* @__PURE__ */ e.jsx(se, { block: t }) }),
        r && !j && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2", onClick: (n) => n.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Placeholder" }),
            /* @__PURE__ */ e.jsx("input", { className: x, value: g.placeholder || "", onChange: (n) => h(t.id, { placeholder: n.target.value }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Yardım Metni" }),
            /* @__PURE__ */ e.jsx("input", { className: x, value: g.helpText || "", onChange: (n) => h(t.id, { helpText: n.target.value }) })
          ] }),
          (t.type === a.Number || t.type === a.Rating) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Min" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: x, value: g.min ?? "", onChange: (n) => h(t.id, { min: n.target.value === "" ? null : Number(n.target.value) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Max" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: x, value: g.max ?? "", onChange: (n) => h(t.id, { max: n.target.value === "" ? null : Number(n.target.value) }) })
            ] })
          ] })
        ] }),
        r && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 border-t border-slate-100 pt-3", onClick: (n) => n.stopPropagation(), children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => S(l - 1, l), className: "rounded-lg p-2 text-slate-400 hover:bg-slate-100", title: "Yukarı", children: "▲" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => S(l + 1, l), className: "rounded-lg p-2 text-slate-400 hover:bg-slate-100", title: "Aşağı", children: "▼" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => y(t.id), className: "rounded-lg p-2 text-slate-400 hover:bg-slate-100", title: "Kopyala", children: "⧉" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => D(t.id), className: "rounded-lg p-2 text-red-400 hover:bg-red-50", title: "Sil", children: "🗑" }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-slate-200" }),
          !j && /* @__PURE__ */ e.jsx(I, { label: "Zorunlu", checked: !!g.required, onChange: (n) => h(t.id, { required: n }) }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-slate-200" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => v(t.id), className: "rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700", children: "+ Soru" })
        ] })
      ]
    }
  );
}
function le() {
  const t = d.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [l, r] = d.useState(t), [c, P] = d.useState(""), [h, T] = d.useState(!1), [y, D] = d.useState(""), [v, S] = d.useState(""), [w, g] = d.useState(null), [j, n] = d.useState([]), [f, m] = d.useState([]), [k, N] = d.useState(null), [F, u] = d.useState(!1), [O, H] = d.useState(!!t), $ = d.useRef(null);
  d.useEffect(() => {
    B.get("/api/app/form-category?MaxResultCount=100").then((s) => n(s.items || [])).catch(() => {
    });
  }, []), d.useEffect(() => {
    t && (async () => {
      try {
        const s = await B.get(`/api/app/form/${t}`);
        D(s.title || ""), P(s.slug || ""), S(s.description || ""), g(s.categoryId || null), m((s.blocks || []).slice().sort((o, i) => o.order - i.order).map((o) => ({
          id: o.id || E(),
          type: o.type,
          content: o.content,
          settings: re(o.settings)
        })));
      } catch (s) {
        C("error", (s == null ? void 0 : s.message) || "Form yüklenemedi.");
      } finally {
        H(!1);
      }
    })();
  }, [t]);
  const U = (s = a.ShortText) => {
    const o = z(s);
    m((i) => [...i, o]), N(o.id);
  }, J = (s) => {
    const o = z(a.ShortText);
    m((i) => {
      const p = i.findIndex((A) => A.id === s), b = [...i];
      return b.splice(p + 1, 0, o), b;
    }), N(o.id);
  }, _ = (s) => m((o) => o.filter((i) => i.id !== s)), q = (s) => m((o) => {
    const i = o.findIndex((A) => A.id === s);
    if (i < 0) return o;
    const p = { ...o[i], id: E(), settings: { ...o[i].settings } }, b = [...o];
    return b.splice(i + 1, 0, p), b;
  }), G = (s, o) => m((i) => i.map((p) => p.id === s ? { ...p, ...o } : p)), Z = (s, o) => m((i) => i.map((p) => p.id === s ? { ...p, settings: { ...p.settings, ...o } } : p)), Q = (s, o) => m((i) => i.map((p) => {
    if (p.id !== s) return p;
    const b = { ...p.settings };
    return R.has(o) && !b.options && (b.options = ["Seçenek 1", "Seçenek 2"]), { ...p, type: o, settings: b };
  })), V = (s, o) => m((i) => {
    const p = o ?? $.current;
    if ($.current = null, p == null || s < 0 || s >= i.length || p === s) return i;
    const b = [...i], [A] = b.splice(p, 1);
    return b.splice(s, 0, A), b;
  }), M = () => f.map((s, o) => ({
    type: s.type,
    order: o + 1,
    content: s.content || L[s.type] || "Soru",
    settings: JSON.stringify(s.settings || {})
  })), W = async () => {
    if (!y.trim()) return C("warn", "Lütfen forma bir başlık verin.");
    u(!0);
    try {
      if (l)
        await B.put(`/api/app/form/${l}`, { title: y.trim(), description: v.trim() || null, categoryId: w, themeJson: null, blocks: [] }), await B.put(`/api/app/form/${l}/blocks`, { blocks: M() }), C("success", "Form kaydedildi.");
      else {
        const s = await B.post("/api/app/form", { title: y.trim(), description: v.trim() || null, categoryId: w, themeJson: null, blocks: M() });
        r(s.id), P(s.slug || "");
        const o = new URL(window.location.href);
        o.searchParams.set("id", s.id), window.history.replaceState({}, "", o), C("success", "Form oluşturuldu.");
      }
    } catch (s) {
      C("error", (s == null ? void 0 : s.message) || "Kaydetme başarısız.");
    } finally {
      u(!1);
    }
  };
  return O ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-slate-400", children: "Form yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "min-h-[calc(100vh-120px)] bg-slate-50 pb-24", children: [
    /* @__PURE__ */ e.jsx("div", { className: "sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur", children: /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-between px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets", className: "text-sm font-semibold text-slate-500 hover:text-slate-700", children: "← Formlar" }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-slate-400", children: [
          f.length,
          " alan"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("button", { onClick: W, disabled: F, className: "rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50", children: F ? "Kaydediliyor…" : l ? "Kaydet" : "Oluştur" }),
        l && /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${l}`, className: "rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50", children: "Yanıtlar" }),
        l && /* @__PURE__ */ e.jsx("button", { onClick: () => T(!0), className: "rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700", children: "Yayınla" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6", children: [
        /* @__PURE__ */ e.jsx("span", { className: "absolute inset-x-0 top-0 h-1.5 bg-indigo-500" }),
        /* @__PURE__ */ e.jsx("input", { value: y, onChange: (s) => D(s.target.value), placeholder: "Form başlığı…", className: "w-full border-none bg-transparent p-0 text-3xl font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsx("input", { value: v, onChange: (s) => S(s.target.value), placeholder: "Form açıklaması (opsiyonel)…", className: "mt-2 w-full border-none bg-transparent p-0 text-sm text-slate-500 placeholder-slate-300 focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: w || "",
            onChange: (s) => g(s.target.value || null),
            className: "mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 focus:border-indigo-400 focus:outline-none",
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
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: f.map((s, o) => /* @__PURE__ */ e.jsx(
        ae,
        {
          block: s,
          index: o,
          selected: s.id === k,
          onSelect: N,
          onPatch: G,
          onPatchSettings: Z,
          onChangeType: Q,
          onDuplicate: q,
          onRemove: _,
          onAddAfter: J,
          onMove: V,
          dragRef: $
        },
        s.id
      )) }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => U(a.ShortText), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-4 text-sm font-bold text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600", children: "+ Soru Ekle" }),
      f.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-center text-sm text-slate-400", children: "Başlamak için bir soru ekleyin." })
    ] }),
    h && /* @__PURE__ */ e.jsx(ne, { formId: l, slug: c, onClose: () => T(!1) })
  ] });
}
function ne({ formId: t, slug: l, onClose: r }) {
  const [c, P] = d.useState(l || ""), [h, T] = d.useState(""), [y, D] = d.useState(""), [v, S] = d.useState(!1), [w, g] = d.useState(!1), [j, n] = d.useState(!1), [f, m] = d.useState(null), k = async () => {
    n(!0);
    try {
      const u = await B.post(`/api/app/form/${t}/publish`, {
        slug: (c == null ? void 0 : c.trim()) || null,
        publishSettingsJson: JSON.stringify({ startDate: h || null, endDate: y || null, kvkk: v, captcha: w })
      });
      m(u.slug || c), C("success", "Form yayınlandı.");
    } catch (u) {
      C("error", (u == null ? void 0 : u.message) || "Yayınlama başarısız.");
    } finally {
      n(!1);
    }
  }, N = f ? `${window.location.origin}/f/${f}` : null, F = () => {
    var u;
    N && ((u = navigator.clipboard) == null || u.writeText(N)), C("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4", onClick: r, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-white p-6 shadow-xl", onClick: (u) => u.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-slate-800", children: "Formu Yayınla" }),
      /* @__PURE__ */ e.jsx("button", { onClick: r, className: "rounded p-1 text-slate-400 hover:bg-slate-100", children: "✕" })
    ] }),
    N ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: "rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700", children: "✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Yayın bağlantısı" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: x, value: N, onClick: (u) => u.target.select() }),
          /* @__PURE__ */ e.jsx("button", { onClick: F, className: "shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50", children: "Kopyala" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: N, target: "_blank", rel: "noreferrer", className: "rounded-xl bg-indigo-600 px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-indigo-700", children: "Formu yeni sekmede aç" })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Bağlantı adresi (slug)" }),
        /* @__PURE__ */ e.jsx("input", { className: x, value: c, onChange: (u) => P(u.target.value), placeholder: "musteri-memnuniyet" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Başlangıç" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: x, value: h, onChange: (u) => T(u.target.value) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Bitiş" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: x, value: y, onChange: (u) => D(u.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(I, { label: "KVKK onayı iste", checked: v, onChange: S }),
      /* @__PURE__ */ e.jsx(I, { label: "Captcha doğrulaması", checked: w, onChange: g }),
      /* @__PURE__ */ e.jsx("button", { onClick: k, disabled: j, className: "mt-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50", children: j ? "Yayınlanıyor…" : "Yayınla" })
    ] })
  ] }) });
}
function re(t) {
  if (!t) return { required: !1 };
  try {
    return typeof t == "string" ? JSON.parse(t) : t;
  } catch {
    return { required: !1 };
  }
}
function C(t, l) {
  const r = window.abp;
  r != null && r.notify && (t === "success" || t === "info") ? r.notify[t === "success" ? "success" : "info"](l) : r != null && r.message ? r.message[t === "error" ? "error" : t === "warn" ? "warn" : "info"](l) : console.log(`[${t}] ${l}`);
}
const Y = document.getElementById("dynamic-assets-app-root");
Y && X(Y).render(/* @__PURE__ */ e.jsx(le, {}));
