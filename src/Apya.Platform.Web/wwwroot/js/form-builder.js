import { b as Z, j as e, r as x } from "./react-vendor.js";
import { a as F } from "./httpClient.js";
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
}, R = /* @__PURE__ */ new Set([a.Select, a.MultiSelect, a.Dropdown]), Q = /* @__PURE__ */ new Set([a.SectionHeader, a.Paragraph]), z = [
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
], E = Object.fromEntries(z.flatMap((t) => t.items.map((l) => [l.type, l.label]))), L = () => Math.random().toString(36).slice(2, 10);
function M(t) {
  const l = { id: L(), type: t, content: E[t] || "Soru", settings: { required: !1 } };
  return R.has(t) && (l.settings.options = ["Seçenek 1", "Seçenek 2"]), t === a.SectionHeader && (l.content = "Bölüm Başlığı"), t === a.Paragraph && (l.content = "Açıklama metni…"), l;
}
const m = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100", $ = ({ checked: t, onChange: l, label: r }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
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
function V({ value: t, onChange: l }) {
  return /* @__PURE__ */ e.jsx(
    "select",
    {
      value: t,
      onClick: (r) => r.stopPropagation(),
      onChange: (r) => l(Number(r.target.value)),
      className: "shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-indigo-400 focus:outline-none",
      children: z.map((r) => /* @__PURE__ */ e.jsx("optgroup", { label: r.group, children: r.items.map((c) => /* @__PURE__ */ e.jsxs("option", { value: c.type, children: [
        c.icon,
        " ",
        c.label
      ] }, c.type)) }, r.group))
    }
  );
}
function W({ block: t }) {
  const l = t.settings || {};
  switch (t.type) {
    case a.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: m, placeholder: l.placeholder || "Uzun yanıt…" });
    case a.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: m, placeholder: l.placeholder || "0" });
    case a.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: m, placeholder: l.placeholder || "ornek@firma.com" });
    case a.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: m, placeholder: l.placeholder || "+90 5xx xxx xx xx" });
    case a.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: m });
    case a.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: m });
    case a.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-400", children: "📎 Dosya seç / sürükle" });
    case a.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: m, children: (l.options || []).map((r, c) => /* @__PURE__ */ e.jsx("option", { children: r }, c)) });
    case a.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-amber-400", children: "★★★★★" });
    case a.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (r, c) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs text-slate-500", children: c }, c)) });
    case a.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-slate-200 px-3 py-8 text-center text-sm text-slate-400", children: "✍️ İmza alanı" });
    case a.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["Adres satırı", "İlçe", "İl", "Posta kodu"].map((r) => /* @__PURE__ */ e.jsx("input", { disabled: !0, className: m, placeholder: r }, r)) });
    case a.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-slate-200 p-3 text-sm text-slate-400", children: "▦ Tablo ızgarası" });
    case a.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-slate-200 p-3 text-sm text-slate-400", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: m, placeholder: l.placeholder || "Kısa yanıt…" });
  }
}
function X({ block: t, index: l, selected: r, onSelect: c, onPatch: C, onPatchSettings: h, onChangeType: T, onDuplicate: b, onRemove: D, onAddAfter: v, onMove: S, dragRef: f }) {
  const d = t.settings || {}, y = Q.has(t.type);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !0,
      onDragStart: () => f.current = l,
      onDragOver: (n) => n.preventDefault(),
      onDrop: () => S(l),
      onClick: () => c(t.id),
      className: `group relative rounded-2xl border bg-white p-5 transition ${r ? "border-indigo-300 shadow-md ring-1 ring-indigo-100" : "border-slate-200 hover:border-slate-300"}`,
      children: [
        r && /* @__PURE__ */ e.jsx("span", { className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-indigo-500" }),
        /* @__PURE__ */ e.jsx("div", { className: "absolute -top-2 left-1/2 -translate-x-1/2 cursor-grab text-slate-300 opacity-0 group-hover:opacity-100", title: "Sürükle", children: "⠿" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3", children: [
          y ? /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (n) => n.stopPropagation(),
              onChange: (n) => C(t.id, { content: n.target.value }),
              placeholder: t.type === a.SectionHeader ? "Bölüm başlığı" : "Açıklama metni",
              className: `flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${t.type === a.SectionHeader ? "text-xl font-bold text-slate-800" : "text-sm text-slate-500"}`
            }
          ) : /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (n) => n.stopPropagation(),
              onChange: (n) => C(t.id, { content: n.target.value }),
              placeholder: "Soru metni…",
              className: "flex-1 border-b border-transparent bg-transparent p-0 pb-1 text-base font-semibold text-slate-800 placeholder-slate-300 focus:border-indigo-300 focus:outline-none focus:ring-0"
            }
          ),
          r && /* @__PURE__ */ e.jsx(V, { value: t.type, onChange: (n) => T(t.id, n) }),
          !r && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500", children: E[t.type] })
        ] }),
        r && R.has(t.type) && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [
          (d.options || []).map((n, j) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", onClick: (N) => N.stopPropagation(), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-slate-300", children: t.type === a.MultiSelect ? "☐" : "○" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: "flex-1 border-b border-slate-100 bg-transparent px-1 py-1 text-sm focus:border-indigo-300 focus:outline-none",
                value: n,
                onChange: (N) => {
                  const w = [...d.options];
                  w[j] = N.target.value, h(t.id, { options: w });
                }
              }
            ),
            /* @__PURE__ */ e.jsx("button", { className: "rounded p-1 text-slate-300 hover:text-red-500", onClick: () => h(t.id, { options: d.options.filter((N, w) => w !== j) }), children: "✕" })
          ] }, j)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "self-start text-sm font-medium text-indigo-600 hover:text-indigo-700",
              onClick: (n) => {
                n.stopPropagation(), h(t.id, { options: [...d.options || [], `Seçenek ${(d.options || []).length + 1}`] });
              },
              children: "+ Seçenek ekle"
            }
          )
        ] }),
        !y && !R.has(t.type) && /* @__PURE__ */ e.jsx("div", { className: "mt-4", onClick: (n) => n.stopPropagation(), children: /* @__PURE__ */ e.jsx(W, { block: t }) }),
        r && !y && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2", onClick: (n) => n.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Placeholder" }),
            /* @__PURE__ */ e.jsx("input", { className: m, value: d.placeholder || "", onChange: (n) => h(t.id, { placeholder: n.target.value }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Yardım Metni" }),
            /* @__PURE__ */ e.jsx("input", { className: m, value: d.helpText || "", onChange: (n) => h(t.id, { helpText: n.target.value }) })
          ] }),
          (t.type === a.Number || t.type === a.Rating) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Min" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: m, value: d.min ?? "", onChange: (n) => h(t.id, { min: n.target.value === "" ? null : Number(n.target.value) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Max" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: m, value: d.max ?? "", onChange: (n) => h(t.id, { max: n.target.value === "" ? null : Number(n.target.value) }) })
            ] })
          ] })
        ] }),
        r && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 border-t border-slate-100 pt-3", onClick: (n) => n.stopPropagation(), children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => S(l - 1, l), className: "rounded-lg p-2 text-slate-400 hover:bg-slate-100", title: "Yukarı", children: "▲" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => S(l + 1, l), className: "rounded-lg p-2 text-slate-400 hover:bg-slate-100", title: "Aşağı", children: "▼" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => b(t.id), className: "rounded-lg p-2 text-slate-400 hover:bg-slate-100", title: "Kopyala", children: "⧉" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => D(t.id), className: "rounded-lg p-2 text-red-400 hover:bg-red-50", title: "Sil", children: "🗑" }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-slate-200" }),
          !y && /* @__PURE__ */ e.jsx($, { label: "Zorunlu", checked: !!d.required, onChange: (n) => h(t.id, { required: n }) }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-slate-200" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => v(t.id), className: "rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700", children: "+ Soru" })
        ] })
      ]
    }
  );
}
function ee() {
  const t = x.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [l, r] = x.useState(t), [c, C] = x.useState(""), [h, T] = x.useState(!1), [b, D] = x.useState(""), [v, S] = x.useState(""), [f, d] = x.useState([]), [y, n] = x.useState(null), [j, N] = x.useState(!1), [w, P] = x.useState(!!t), B = x.useRef(null);
  x.useEffect(() => {
    t && (async () => {
      try {
        const s = await F.get(`/api/app/form/${t}`);
        D(s.title || ""), C(s.slug || ""), S(s.description || ""), d((s.blocks || []).slice().sort((o, i) => o.order - i.order).map((o) => ({
          id: o.id || L(),
          type: o.type,
          content: o.content,
          settings: se(o.settings)
        })));
      } catch (s) {
        k("error", (s == null ? void 0 : s.message) || "Form yüklenemedi.");
      } finally {
        P(!1);
      }
    })();
  }, [t]);
  const p = (s = a.ShortText) => {
    const o = M(s);
    d((i) => [...i, o]), n(o.id);
  }, O = (s) => {
    const o = M(a.ShortText);
    d((i) => {
      const u = i.findIndex((A) => A.id === s), g = [...i];
      return g.splice(u + 1, 0, o), g;
    }), n(o.id);
  }, K = (s) => d((o) => o.filter((i) => i.id !== s)), H = (s) => d((o) => {
    const i = o.findIndex((A) => A.id === s);
    if (i < 0) return o;
    const u = { ...o[i], id: L(), settings: { ...o[i].settings } }, g = [...o];
    return g.splice(i + 1, 0, u), g;
  }), U = (s, o) => d((i) => i.map((u) => u.id === s ? { ...u, ...o } : u)), J = (s, o) => d((i) => i.map((u) => u.id === s ? { ...u, settings: { ...u.settings, ...o } } : u)), _ = (s, o) => d((i) => i.map((u) => {
    if (u.id !== s) return u;
    const g = { ...u.settings };
    return R.has(o) && !g.options && (g.options = ["Seçenek 1", "Seçenek 2"]), { ...u, type: o, settings: g };
  })), q = (s, o) => d((i) => {
    const u = o ?? B.current;
    if (B.current = null, u == null || s < 0 || s >= i.length || u === s) return i;
    const g = [...i], [A] = g.splice(u, 1);
    return g.splice(s, 0, A), g;
  }), I = () => f.map((s, o) => ({
    type: s.type,
    order: o + 1,
    content: s.content || E[s.type] || "Soru",
    settings: JSON.stringify(s.settings || {})
  })), G = async () => {
    if (!b.trim()) return k("warn", "Lütfen forma bir başlık verin.");
    N(!0);
    try {
      if (l)
        await F.put(`/api/app/form/${l}`, { title: b.trim(), description: v.trim() || null, categoryId: null, themeJson: null, blocks: [] }), await F.put(`/api/app/form/${l}/blocks`, { blocks: I() }), k("success", "Form kaydedildi.");
      else {
        const s = await F.post("/api/app/form", { title: b.trim(), description: v.trim() || null, categoryId: null, themeJson: null, blocks: I() });
        r(s.id), C(s.slug || "");
        const o = new URL(window.location.href);
        o.searchParams.set("id", s.id), window.history.replaceState({}, "", o), k("success", "Form oluşturuldu.");
      }
    } catch (s) {
      k("error", (s == null ? void 0 : s.message) || "Kaydetme başarısız.");
    } finally {
      N(!1);
    }
  };
  return w ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-slate-400", children: "Form yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "min-h-[calc(100vh-120px)] bg-slate-50 pb-24", children: [
    /* @__PURE__ */ e.jsx("div", { className: "sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur", children: /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-between px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets", className: "text-sm font-semibold text-slate-500 hover:text-slate-700", children: "← Formlar" }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-slate-400", children: [
          f.length,
          " alan"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("button", { onClick: G, disabled: j, className: "rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50", children: j ? "Kaydediliyor…" : l ? "Kaydet" : "Oluştur" }),
        l && /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${l}`, className: "rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50", children: "Yanıtlar" }),
        l && /* @__PURE__ */ e.jsx("button", { onClick: () => T(!0), className: "rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700", children: "Yayınla" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6", children: [
        /* @__PURE__ */ e.jsx("span", { className: "absolute inset-x-0 top-0 h-1.5 bg-indigo-500" }),
        /* @__PURE__ */ e.jsx("input", { value: b, onChange: (s) => D(s.target.value), placeholder: "Form başlığı…", className: "w-full border-none bg-transparent p-0 text-3xl font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsx("input", { value: v, onChange: (s) => S(s.target.value), placeholder: "Form açıklaması (opsiyonel)…", className: "mt-2 w-full border-none bg-transparent p-0 text-sm text-slate-500 placeholder-slate-300 focus:outline-none focus:ring-0" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: f.map((s, o) => /* @__PURE__ */ e.jsx(
        X,
        {
          block: s,
          index: o,
          selected: s.id === y,
          onSelect: n,
          onPatch: U,
          onPatchSettings: J,
          onChangeType: _,
          onDuplicate: H,
          onRemove: K,
          onAddAfter: O,
          onMove: q,
          dragRef: B
        },
        s.id
      )) }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => p(a.ShortText), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-4 text-sm font-bold text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600", children: "+ Soru Ekle" }),
      f.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-center text-sm text-slate-400", children: "Başlamak için bir soru ekleyin." })
    ] }),
    h && /* @__PURE__ */ e.jsx(te, { formId: l, slug: c, onClose: () => T(!1) })
  ] });
}
function te({ formId: t, slug: l, onClose: r }) {
  const [c, C] = x.useState(l || ""), [h, T] = x.useState(""), [b, D] = x.useState(""), [v, S] = x.useState(!1), [f, d] = x.useState(!1), [y, n] = x.useState(!1), [j, N] = x.useState(null), w = async () => {
    n(!0);
    try {
      const p = await F.post(`/api/app/form/${t}/publish`, {
        slug: (c == null ? void 0 : c.trim()) || null,
        publishSettingsJson: JSON.stringify({ startDate: h || null, endDate: b || null, kvkk: v, captcha: f })
      });
      N(p.slug || c), k("success", "Form yayınlandı.");
    } catch (p) {
      k("error", (p == null ? void 0 : p.message) || "Yayınlama başarısız.");
    } finally {
      n(!1);
    }
  }, P = j ? `${window.location.origin}/f/${j}` : null, B = () => {
    var p;
    P && ((p = navigator.clipboard) == null || p.writeText(P)), k("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4", onClick: r, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-white p-6 shadow-xl", onClick: (p) => p.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-slate-800", children: "Formu Yayınla" }),
      /* @__PURE__ */ e.jsx("button", { onClick: r, className: "rounded p-1 text-slate-400 hover:bg-slate-100", children: "✕" })
    ] }),
    P ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: "rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700", children: "✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Yayın bağlantısı" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: m, value: P, onClick: (p) => p.target.select() }),
          /* @__PURE__ */ e.jsx("button", { onClick: B, className: "shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50", children: "Kopyala" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: P, target: "_blank", rel: "noreferrer", className: "rounded-xl bg-indigo-600 px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-indigo-700", children: "Formu yeni sekmede aç" })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Bağlantı adresi (slug)" }),
        /* @__PURE__ */ e.jsx("input", { className: m, value: c, onChange: (p) => C(p.target.value), placeholder: "musteri-memnuniyet" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Başlangıç" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: m, value: h, onChange: (p) => T(p.target.value) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-slate-400", children: "Bitiş" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: m, value: b, onChange: (p) => D(p.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx($, { label: "KVKK onayı iste", checked: v, onChange: S }),
      /* @__PURE__ */ e.jsx($, { label: "Captcha doğrulaması", checked: f, onChange: d }),
      /* @__PURE__ */ e.jsx("button", { onClick: w, disabled: y, className: "mt-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50", children: y ? "Yayınlanıyor…" : "Yayınla" })
    ] })
  ] }) });
}
function se(t) {
  if (!t) return { required: !1 };
  try {
    return typeof t == "string" ? JSON.parse(t) : t;
  } catch {
    return { required: !1 };
  }
}
function k(t, l) {
  const r = window.abp;
  r != null && r.notify && (t === "success" || t === "info") ? r.notify[t === "success" ? "success" : "info"](l) : r != null && r.message ? r.message[t === "error" ? "error" : t === "warn" ? "warn" : "info"](l) : console.log(`[${t}] ${l}`);
}
const Y = document.getElementById("dynamic-assets-app-root");
Y && Z(Y).render(/* @__PURE__ */ e.jsx(ee, {}));
