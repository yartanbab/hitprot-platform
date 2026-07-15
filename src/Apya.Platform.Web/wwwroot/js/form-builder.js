import { b as Z, j as e, r as p } from "./react-vendor.js";
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
], E = Object.fromEntries(z.flatMap((t) => t.items.map((r) => [r.type, r.label]))), L = () => Math.random().toString(36).slice(2, 10);
function M(t) {
  const r = { id: L(), type: t, content: E[t] || "Soru", settings: { required: !1 } };
  return R.has(t) && (r.settings.options = ["Seçenek 1", "Seçenek 2"]), t === a.SectionHeader && (r.content = "Bölüm Başlığı"), t === a.Paragraph && (r.content = "Açıklama metni…"), r;
}
const m = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft", $ = ({ checked: t, onChange: r, label: l }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
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
function V({ value: t, onChange: r }) {
  return /* @__PURE__ */ e.jsx(
    "select",
    {
      value: t,
      onClick: (l) => l.stopPropagation(),
      onChange: (l) => r(Number(l.target.value)),
      className: "shrink-0 rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm font-medium text-text-primary focus:border-focus focus:outline-none",
      children: z.map((l) => /* @__PURE__ */ e.jsx("optgroup", { label: l.group, children: l.items.map((d) => /* @__PURE__ */ e.jsxs("option", { value: d.type, children: [
        d.icon,
        " ",
        d.label
      ] }, d.type)) }, l.group))
    }
  );
}
function W({ block: t }) {
  const r = t.settings || {};
  switch (t.type) {
    case a.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: m, placeholder: r.placeholder || "Uzun yanıt…" });
    case a.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: m, placeholder: r.placeholder || "0" });
    case a.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: m, placeholder: r.placeholder || "ornek@firma.com" });
    case a.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: m, placeholder: r.placeholder || "+90 5xx xxx xx xx" });
    case a.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: m });
    case a.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: m });
    case a.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-6 text-center text-sm text-text-tertiary", children: "📎 Dosya seç / sürükle" });
    case a.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: m, children: (r.options || []).map((l, d) => /* @__PURE__ */ e.jsx("option", { children: l }, d)) });
    case a.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-warning", children: "★★★★★" });
    case a.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (l, d) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-default text-xs text-text-secondary", children: d }, d)) });
    case a.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-8 text-center text-sm text-text-tertiary", children: "✍️ İmza alanı" });
    case a.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["Adres satırı", "İlçe", "İl", "Posta kodu"].map((l) => /* @__PURE__ */ e.jsx("input", { disabled: !0, className: m, placeholder: l }, l)) });
    case a.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "▦ Tablo ızgarası" });
    case a.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: m, placeholder: r.placeholder || "Kısa yanıt…" });
  }
}
function X({ block: t, index: r, selected: l, onSelect: d, onPatch: C, onPatchSettings: h, onChangeType: T, onDuplicate: g, onRemove: D, onAddAfter: v, onMove: S, dragRef: b }) {
  const c = t.settings || {}, y = Q.has(t.type);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !0,
      onDragStart: () => b.current = r,
      onDragOver: (n) => n.preventDefault(),
      onDrop: () => S(r),
      onClick: () => d(t.id),
      className: `group relative rounded-2xl border bg-surface-raised p-5 transition ${l ? "border-focus shadow-md ring-1 ring-accent-soft" : "border-default hover:border-strong"}`,
      children: [
        l && /* @__PURE__ */ e.jsx("span", { className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-accent" }),
        /* @__PURE__ */ e.jsx("div", { className: "absolute -top-2 left-1/2 -translate-x-1/2 cursor-grab text-text-tertiary opacity-0 group-hover:opacity-100", title: "Sürükle", children: "⠿" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3", children: [
          y ? /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (n) => n.stopPropagation(),
              onChange: (n) => C(t.id, { content: n.target.value }),
              placeholder: t.type === a.SectionHeader ? "Bölüm başlığı" : "Açıklama metni",
              className: `flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${t.type === a.SectionHeader ? "text-xl font-bold text-text-primary" : "text-sm text-text-secondary"}`
            }
          ) : /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (n) => n.stopPropagation(),
              onChange: (n) => C(t.id, { content: n.target.value }),
              placeholder: "Soru metni…",
              className: "flex-1 border-b border-transparent bg-transparent p-0 pb-1 text-base font-semibold text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-0"
            }
          ),
          l && /* @__PURE__ */ e.jsx(V, { value: t.type, onChange: (n) => T(t.id, n) }),
          !l && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary", children: E[t.type] })
        ] }),
        l && R.has(t.type) && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [
          (c.options || []).map((n, j) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", onClick: (N) => N.stopPropagation(), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: t.type === a.MultiSelect ? "☐" : "○" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: "flex-1 border-b border-subtle bg-transparent px-1 py-1 text-sm focus:border-focus focus:outline-none",
                value: n,
                onChange: (N) => {
                  const k = [...c.options];
                  k[j] = N.target.value, h(t.id, { options: k });
                }
              }
            ),
            /* @__PURE__ */ e.jsx("button", { className: "rounded p-1 text-text-tertiary hover:text-negative-500", onClick: () => h(t.id, { options: c.options.filter((N, k) => k !== j) }), children: "✕" })
          ] }, j)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "self-start text-sm font-medium text-accent hover:text-accent-600",
              onClick: (n) => {
                n.stopPropagation(), h(t.id, { options: [...c.options || [], `Seçenek ${(c.options || []).length + 1}`] });
              },
              children: "+ Seçenek ekle"
            }
          )
        ] }),
        !y && !R.has(t.type) && /* @__PURE__ */ e.jsx("div", { className: "mt-4", onClick: (n) => n.stopPropagation(), children: /* @__PURE__ */ e.jsx(W, { block: t }) }),
        l && !y && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 border-t border-subtle pt-4 sm:grid-cols-2", onClick: (n) => n.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Placeholder" }),
            /* @__PURE__ */ e.jsx("input", { className: m, value: c.placeholder || "", onChange: (n) => h(t.id, { placeholder: n.target.value }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yardım Metni" }),
            /* @__PURE__ */ e.jsx("input", { className: m, value: c.helpText || "", onChange: (n) => h(t.id, { helpText: n.target.value }) })
          ] }),
          (t.type === a.Number || t.type === a.Rating) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Min" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: m, value: c.min ?? "", onChange: (n) => h(t.id, { min: n.target.value === "" ? null : Number(n.target.value) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Max" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: m, value: c.max ?? "", onChange: (n) => h(t.id, { max: n.target.value === "" ? null : Number(n.target.value) }) })
            ] })
          ] })
        ] }),
        l && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 border-t border-subtle pt-3", onClick: (n) => n.stopPropagation(), children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => S(r - 1, r), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Yukarı", children: "▲" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => S(r + 1, r), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Aşağı", children: "▼" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => g(t.id), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Kopyala", children: "⧉" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => D(t.id), className: "rounded-lg p-2 text-negative-500 hover:bg-negative-50", title: "Sil", children: "🗑" }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          !y && /* @__PURE__ */ e.jsx($, { label: "Zorunlu", checked: !!c.required, onChange: (n) => h(t.id, { required: n }) }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => v(t.id), className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600", children: "+ Soru" })
        ] })
      ]
    }
  );
}
function ee() {
  const t = p.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [r, l] = p.useState(t), [d, C] = p.useState(""), [h, T] = p.useState(!1), [g, D] = p.useState(""), [v, S] = p.useState(""), [b, c] = p.useState([]), [y, n] = p.useState(null), [j, N] = p.useState(!1), [k, P] = p.useState(!!t), B = p.useRef(null);
  p.useEffect(() => {
    t && (async () => {
      try {
        const s = await F.get(`/api/app/form/${t}`);
        D(s.title || ""), C(s.slug || ""), S(s.description || ""), c((s.blocks || []).slice().sort((o, i) => o.order - i.order).map((o) => ({
          id: o.id || L(),
          type: o.type,
          content: o.content,
          settings: se(o.settings)
        })));
      } catch (s) {
        w("error", (s == null ? void 0 : s.message) || "Form yüklenemedi.");
      } finally {
        P(!1);
      }
    })();
  }, [t]);
  const x = (s = a.ShortText) => {
    const o = M(s);
    c((i) => [...i, o]), n(o.id);
  }, O = (s) => {
    const o = M(a.ShortText);
    c((i) => {
      const u = i.findIndex((A) => A.id === s), f = [...i];
      return f.splice(u + 1, 0, o), f;
    }), n(o.id);
  }, K = (s) => c((o) => o.filter((i) => i.id !== s)), H = (s) => c((o) => {
    const i = o.findIndex((A) => A.id === s);
    if (i < 0) return o;
    const u = { ...o[i], id: L(), settings: { ...o[i].settings } }, f = [...o];
    return f.splice(i + 1, 0, u), f;
  }), U = (s, o) => c((i) => i.map((u) => u.id === s ? { ...u, ...o } : u)), J = (s, o) => c((i) => i.map((u) => u.id === s ? { ...u, settings: { ...u.settings, ...o } } : u)), _ = (s, o) => c((i) => i.map((u) => {
    if (u.id !== s) return u;
    const f = { ...u.settings };
    return R.has(o) && !f.options && (f.options = ["Seçenek 1", "Seçenek 2"]), { ...u, type: o, settings: f };
  })), q = (s, o) => c((i) => {
    const u = o ?? B.current;
    if (B.current = null, u == null || s < 0 || s >= i.length || u === s) return i;
    const f = [...i], [A] = f.splice(u, 1);
    return f.splice(s, 0, A), f;
  }), I = () => b.map((s, o) => ({
    type: s.type,
    order: o + 1,
    content: s.content || E[s.type] || "Soru",
    settings: JSON.stringify(s.settings || {})
  })), G = async () => {
    if (!g.trim()) return w("warn", "Lütfen forma bir başlık verin.");
    N(!0);
    try {
      if (r)
        await F.put(`/api/app/form/${r}`, { title: g.trim(), description: v.trim() || null, categoryId: null, themeJson: null, blocks: [] }), await F.put(`/api/app/form/${r}/blocks`, { blocks: I() }), w("success", "Form kaydedildi.");
      else {
        const s = await F.post("/api/app/form", { title: g.trim(), description: v.trim() || null, categoryId: null, themeJson: null, blocks: I() });
        l(s.id), C(s.slug || "");
        const o = new URL(window.location.href);
        o.searchParams.set("id", s.id), window.history.replaceState({}, "", o), w("success", "Form oluşturuldu.");
      }
    } catch (s) {
      w("error", (s == null ? void 0 : s.message) || "Kaydetme başarısız.");
    } finally {
      N(!1);
    }
  };
  return k ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-text-tertiary", children: "Form yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "min-h-[calc(100vh-120px)] bg-surface-sunken pb-24", children: [
    /* @__PURE__ */ e.jsx("div", { className: "sticky top-0 z-20 border-b border-default bg-surface-raised", children: /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-between px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets", className: "text-sm font-semibold text-text-secondary hover:text-text-primary", children: "← Formlar" }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary", children: [
          b.length,
          " alan"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("button", { onClick: G, disabled: j, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken disabled:opacity-50", children: j ? "Kaydediliyor…" : r ? "Kaydet" : "Oluştur" }),
        r && /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${r}`, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken", children: "Yanıtlar" }),
        r && /* @__PURE__ */ e.jsx("button", { onClick: () => T(!0), className: "rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-600", children: "Yayınla" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative mb-4 overflow-hidden rounded-2xl border border-default bg-surface-raised p-6", children: [
        /* @__PURE__ */ e.jsx("span", { className: "absolute inset-x-0 top-0 h-1.5 bg-accent" }),
        /* @__PURE__ */ e.jsx("input", { value: g, onChange: (s) => D(s.target.value), placeholder: "Form başlığı…", className: "w-full border-none bg-transparent p-0 text-3xl font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsx("input", { value: v, onChange: (s) => S(s.target.value), placeholder: "Form açıklaması (opsiyonel)…", className: "mt-2 w-full border-none bg-transparent p-0 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:ring-0" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: b.map((s, o) => /* @__PURE__ */ e.jsx(
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
      /* @__PURE__ */ e.jsx("button", { onClick: () => x(a.ShortText), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-default py-4 text-sm font-bold text-text-secondary transition hover:border-focus hover:text-accent", children: "+ Soru Ekle" }),
      b.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-center text-sm text-text-tertiary", children: "Başlamak için bir soru ekleyin." })
    ] }),
    h && /* @__PURE__ */ e.jsx(te, { formId: r, slug: d, onClose: () => T(!1) })
  ] });
}
function te({ formId: t, slug: r, onClose: l }) {
  const [d, C] = p.useState(r || ""), [h, T] = p.useState(""), [g, D] = p.useState(""), [v, S] = p.useState(!1), [b, c] = p.useState(!1), [y, n] = p.useState(!1), [j, N] = p.useState(null), k = async () => {
    n(!0);
    try {
      const x = await F.post(`/api/app/form/${t}/publish`, {
        slug: (d == null ? void 0 : d.trim()) || null,
        publishSettingsJson: JSON.stringify({ startDate: h || null, endDate: g || null, kvkk: v, captcha: b })
      });
      N(x.slug || d), w("success", "Form yayınlandı.");
    } catch (x) {
      w("error", (x == null ? void 0 : x.message) || "Yayınlama başarısız.");
    } finally {
      n(!1);
    }
  }, P = j ? `${window.location.origin}/f/${j}` : null, B = () => {
    var x;
    P && ((x = navigator.clipboard) == null || x.writeText(P)), w("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: l, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-surface-raised p-6 shadow-xl", onClick: (x) => x.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Formu Yayınla" }),
      /* @__PURE__ */ e.jsx("button", { onClick: l, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    P ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: "rounded-xl bg-positive-50 p-3 text-sm text-positive-700", children: "✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yayın bağlantısı" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: m, value: P, onClick: (x) => x.target.select() }),
          /* @__PURE__ */ e.jsx("button", { onClick: B, className: "shrink-0 rounded-xl border border-default px-3 py-2 text-sm font-medium hover:bg-surface-sunken", children: "Kopyala" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: P, target: "_blank", rel: "noreferrer", className: "rounded-xl bg-accent px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-accent-600", children: "Formu yeni sekmede aç" })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bağlantı adresi (slug)" }),
        /* @__PURE__ */ e.jsx("input", { className: m, value: d, onChange: (x) => C(x.target.value), placeholder: "musteri-memnuniyet" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Başlangıç" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: m, value: h, onChange: (x) => T(x.target.value) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bitiş" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: m, value: g, onChange: (x) => D(x.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx($, { label: "KVKK onayı iste", checked: v, onChange: S }),
      /* @__PURE__ */ e.jsx($, { label: "Captcha doğrulaması", checked: b, onChange: c }),
      /* @__PURE__ */ e.jsx("button", { onClick: k, disabled: y, className: "mt-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: y ? "Yayınlanıyor…" : "Yayınla" })
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
function w(t, r) {
  const l = window.abp;
  l != null && l.notify && (t === "success" || t === "info") ? l.notify[t === "success" ? "success" : "info"](r) : l != null && l.message ? l.message[t === "error" ? "error" : t === "warn" ? "warn" : "info"](r) : console.log(`[${t}] ${r}`);
}
const Y = document.getElementById("dynamic-assets-app-root");
Y && Z(Y).render(/* @__PURE__ */ e.jsx(ee, {}));
