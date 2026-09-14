import { b as ae, j as e, r as p } from "./react-vendor-D57GAUXd.js";
import { a as D } from "./httpClient-DePjXdo1.js";
import { H as se } from "./Hint-CNW95h3H.js";
import { p as H } from "./publicFormLink-CJ_6ABDU.js";
import { O as F, w as re } from "./formChoices-CM6Xg9_c.js";
/* empty css               */
const n = {
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
}, L = /* @__PURE__ */ new Set([n.Select, n.MultiSelect, n.Dropdown]), ne = /* @__PURE__ */ new Set([n.SectionHeader, n.Paragraph]), _ = [
  { group: "Metin & Sayı", items: [
    { type: n.ShortText, label: "Kısa Metin", icon: "✏️" },
    { type: n.LongText, label: "Uzun Metin", icon: "📝" },
    { type: n.Number, label: "Sayısal", icon: "🔢" },
    { type: n.Email, label: "E-Posta", icon: "✉️" },
    { type: n.Phone, label: "Telefon", icon: "📞" }
  ] },
  { group: "Seçim", items: [
    { type: n.Select, label: "Tekli Seçim", icon: "🔘" },
    { type: n.MultiSelect, label: "Çoklu Seçim", icon: "☑️" },
    { type: n.Dropdown, label: "Açılır Liste", icon: "⬇️" }
  ] },
  { group: "Tarih & Zaman", items: [
    { type: n.DatePicker, label: "Tarih", icon: "📅" },
    { type: n.TimePicker, label: "Saat", icon: "🕐" }
  ] },
  { group: "Özel", items: [
    { type: n.FilePicker, label: "Dosya Yükleme", icon: "📎" },
    { type: n.Rating, label: "Derecelendirme", icon: "⭐" },
    { type: n.Nps, label: "NPS (0-10)", icon: "📊" },
    { type: n.Signature, label: "İmza", icon: "✍️" },
    { type: n.Address, label: "Adres", icon: "📍" }
  ] },
  { group: "Düzen", items: [
    { type: n.SectionHeader, label: "Bölüm Başlığı", icon: "🏷️" },
    { type: n.Paragraph, label: "Açıklama", icon: "💬" }
  ] }
], I = Object.fromEntries(_.flatMap((t) => t.items.map((s) => [s.type, s.label]))), E = () => Math.random().toString(36).slice(2, 10), le = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, K = (t) => t.map((s, l) => ({
  id: le.test(s.id) ? s.id : null,
  type: s.type,
  order: l + 1,
  content: s.content || I[s.type] || "Soru",
  settings: JSON.stringify(s.settings || {})
})), ie = (t, s) => {
  const l = new Map((s || []).map((o) => [o.order, o.id]));
  return Object.fromEntries(t.map((o, h) => [o.id, l.get(h + 1)]).filter(([o, h]) => h && o !== h));
};
function M(t) {
  const s = { id: E(), type: t, content: I[t] || "Soru", settings: { required: !1 } };
  return L.has(t) && (s.settings.options = ["Seçenek 1", "Seçenek 2"]), t === n.SectionHeader && (s.content = "Bölüm Başlığı"), t === n.Paragraph && (s.content = "Açıklama metni…"), s;
}
const b = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft", R = ({ checked: t, onChange: s, label: l }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
  /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium text-text-secondary", children: l }),
  /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: (o) => {
        o.stopPropagation(), s(!t);
      },
      className: `relative h-6 w-11 rounded-full transition-colors ${t ? "bg-accent" : "bg-neutral-200"}`,
      "aria-pressed": t,
      children: /* @__PURE__ */ e.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${t ? "left-[22px]" : "left-0.5"}` })
    }
  )
] });
function oe({ value: t, onChange: s }) {
  return /* @__PURE__ */ e.jsx(
    "select",
    {
      value: t,
      onClick: (l) => l.stopPropagation(),
      onChange: (l) => s(Number(l.target.value)),
      className: "shrink-0 rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm font-medium text-text-primary focus:border-focus focus:outline-none",
      children: _.map((l) => /* @__PURE__ */ e.jsx("optgroup", { label: l.group, children: l.items.map((o) => /* @__PURE__ */ e.jsxs("option", { value: o.type, children: [
        o.icon,
        " ",
        o.label
      ] }, o.type)) }, l.group))
    }
  );
}
function ce({ block: t }) {
  const s = t.settings || {};
  switch (t.type) {
    case n.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: b, placeholder: s.placeholder || "Uzun yanıt…" });
    case n.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: b, placeholder: s.placeholder || "0" });
    case n.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: b, placeholder: s.placeholder || "ornek@firma.com" });
    case n.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: b, placeholder: s.placeholder || "+90 5xx xxx xx xx" });
    case n.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: b });
    case n.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: b });
    case n.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-6 text-center text-sm text-text-tertiary", children: "📎 Dosya seç / sürükle" });
    case n.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: b, children: (s.options || []).map((l, o) => /* @__PURE__ */ e.jsx("option", { children: l }, o)) });
    case n.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-warning", children: "★★★★★" });
    case n.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (l, o) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-default text-xs text-text-secondary", children: o }, o)) });
    case n.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-8 text-center text-sm text-text-tertiary", children: "✍️ İmza alanı" });
    case n.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["Adres satırı", "İlçe", "İl", "Posta kodu"].map((l) => /* @__PURE__ */ e.jsx("input", { disabled: !0, className: b, placeholder: l }, l)) });
    case n.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "▦ Tablo ızgarası" });
    case n.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: b, placeholder: s.placeholder || "Kısa yanıt…" });
  }
}
function de({ block: t, settings: s, onPatchSettings: l, publicSlug: o }) {
  const h = s.source === F, [u, S] = p.useState(null), [v, T] = p.useState("");
  p.useEffect(() => {
    !h || u || D.get(`/api/app/form/choices?source=${F}`).then((c) => S(c || [])).catch(() => S([]));
  }, [h, u]);
  const N = (c) => l(t.id, c ? { source: F, urlPrefill: !0 } : { source: void 0, urlPrefill: void 0 }), k = () => {
    var c;
    (c = navigator.clipboard) == null || c.writeText(`${window.location.origin}${re(H(o), v)}`), P("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "mt-4 rounded-xl border border-subtle bg-surface-sunken p-3", onClick: (c) => c.stopPropagation(), children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-2 text-[11px] font-semibold uppercase text-text-tertiary", children: "Seçenek kaynağı" }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
      /* @__PURE__ */ e.jsx("input", { type: "radio", name: `source-${t.id}`, checked: !h, onChange: () => N(!1), className: "h-4 w-4 text-accent" }),
      "Sabit seçenekler, elle yazılır"
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "mt-1 flex items-center gap-2 text-sm text-text-primary", children: [
      /* @__PURE__ */ e.jsx("input", { type: "radio", name: `source-${t.id}`, checked: h, onChange: () => N(!0), className: "h-4 w-4 text-accent" }),
      "Yayındaki hibeler, canlı liste"
    ] }),
    h && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 border-t border-subtle pt-3", children: [
      u == null ? /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Liste yükleniyor…" }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-secondary", children: [
          "Şu an başvuruya açık ",
          u.length,
          " çağrı var. Kapanan çağrı listeden kendiliğinden düşer, yeni yayınlanan eklenir."
        ] }),
        u.length > 0 && /* @__PURE__ */ e.jsx("ul", { className: "mt-2 flex flex-col gap-1 text-sm text-text-primary", children: u.slice(0, 3).map((c) => /* @__PURE__ */ e.jsx("li", { className: "truncate", children: c.label }, c.value)) }),
        u.length > 3 && /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-xs text-text-tertiary", children: [
          "ve ",
          u.length - 3,
          " çağrı daha"
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-3", children: /* @__PURE__ */ e.jsx(R, { label: "Bağlantıdaki çağrıyı ön seç", checked: !!s.urlPrefill, onChange: (c) => l(t.id, { urlPrefill: c }) }) }),
      s.urlPrefill && o && (u == null ? void 0 : u.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("select", { className: `${b} min-w-0 flex-1`, value: v, onChange: (c) => T(c.target.value), "aria-label": "Çağrıya özel bağlantı", children: [
          /* @__PURE__ */ e.jsx("option", { value: "", children: "Çağrıya özel bağlantı için seçin…" }),
          u.map((c) => /* @__PURE__ */ e.jsx("option", { value: c.value, children: c.label }, c.value))
        ] }),
        /* @__PURE__ */ e.jsx("button", { type: "button", disabled: !v, onClick: k, className: "rounded-lg border border-default bg-surface-raised px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-sunken disabled:opacity-50", children: "Bağlantıyı kopyala" })
      ] })
    ] })
  ] });
}
function ue({ block: t, index: s, selected: l, onSelect: o, onPatch: h, onPatchSettings: u, onChangeType: S, onDuplicate: v, onRemove: T, onAddAfter: N, onMove: k, dragRef: c, publicSlug: $ }) {
  const g = t.settings || {}, w = ne.has(t.type), j = p.useRef(null);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: j,
      onDragOver: (r) => r.preventDefault(),
      onDrop: () => k(s),
      onClick: () => o(t.id),
      className: `group relative rounded-2xl border bg-surface-raised p-5 transition ${l ? "border-focus shadow-md ring-1 ring-accent-soft" : "border-default hover:border-strong"}`,
      children: [
        l && /* @__PURE__ */ e.jsx("span", { className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-accent" }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            draggable: !0,
            onDragStart: (r) => {
              c.current = s, j.current && r.dataTransfer.setDragImage(j.current, 24, 24);
            },
            title: "Sürükle",
            className: `absolute -top-2 left-1/2 -translate-x-1/2 cursor-grab px-4 text-text-tertiary transition-opacity active:cursor-grabbing ${l ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`,
            children: "⠿"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3", children: [
          w ? /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (r) => r.stopPropagation(),
              onChange: (r) => h(t.id, { content: r.target.value }),
              placeholder: t.type === n.SectionHeader ? "Bölüm başlığı" : "Açıklama metni",
              className: `flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${t.type === n.SectionHeader ? "text-xl font-bold text-text-primary" : "text-sm text-text-secondary"}`
            }
          ) : /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (r) => r.stopPropagation(),
              onChange: (r) => h(t.id, { content: r.target.value }),
              placeholder: "Soru metni…",
              className: "flex-1 border-b border-transparent bg-transparent p-0 pb-1 text-base font-semibold text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-0"
            }
          ),
          l && /* @__PURE__ */ e.jsx(oe, { value: t.type, onChange: (r) => S(t.id, r) }),
          !l && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary", children: I[t.type] }),
          g.source && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-primary-subtle px-2.5 py-1 text-[11px] font-semibold text-primary", children: "⚡ Canlı liste" })
        ] }),
        l && t.type === n.Dropdown && /* @__PURE__ */ e.jsx(de, { block: t, settings: g, onPatchSettings: u, publicSlug: $ }),
        l && L.has(t.type) && !g.source && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [
          (g.options || []).map((r, B) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", onClick: (y) => y.stopPropagation(), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: t.type === n.MultiSelect ? "☐" : "○" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: "flex-1 border-b border-subtle bg-transparent px-1 py-1 text-sm focus:border-focus focus:outline-none",
                value: r,
                onChange: (y) => {
                  const C = [...g.options];
                  C[B] = y.target.value, u(t.id, { options: C });
                }
              }
            ),
            /* @__PURE__ */ e.jsx("button", { className: "rounded p-1 text-text-tertiary hover:text-negative-500", onClick: () => u(t.id, { options: g.options.filter((y, C) => C !== B) }), children: "✕" })
          ] }, B)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "self-start text-sm font-medium text-accent hover:text-accent-600",
              onClick: (r) => {
                r.stopPropagation(), u(t.id, { options: [...g.options || [], `Seçenek ${(g.options || []).length + 1}`] });
              },
              children: "+ Seçenek ekle"
            }
          )
        ] }),
        !w && !L.has(t.type) && /* @__PURE__ */ e.jsx("div", { className: "mt-4", onClick: (r) => r.stopPropagation(), children: /* @__PURE__ */ e.jsx(ce, { block: t }) }),
        l && !w && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 border-t border-subtle pt-4 sm:grid-cols-2", onClick: (r) => r.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Placeholder" }),
            /* @__PURE__ */ e.jsx("input", { className: b, value: g.placeholder || "", onChange: (r) => u(t.id, { placeholder: r.target.value }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yardım Metni" }),
            /* @__PURE__ */ e.jsx("input", { className: b, value: g.helpText || "", onChange: (r) => u(t.id, { helpText: r.target.value }) })
          ] }),
          (t.type === n.Number || t.type === n.Rating) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Min" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: b, value: g.min ?? "", onChange: (r) => u(t.id, { min: r.target.value === "" ? null : Number(r.target.value) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Max" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: b, value: g.max ?? "", onChange: (r) => u(t.id, { max: r.target.value === "" ? null : Number(r.target.value) }) })
            ] })
          ] })
        ] }),
        l && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 border-t border-subtle pt-3", onClick: (r) => r.stopPropagation(), children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => k(s - 1, s), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Yukarı", children: "▲" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => k(s + 1, s), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Aşağı", children: "▼" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => v(t.id), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Kopyala", children: "⧉" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => T(t.id), className: "rounded-lg p-2 text-negative-500 hover:bg-negative-50", title: "Sil", children: "🗑" }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          !w && /* @__PURE__ */ e.jsx(R, { label: "Zorunlu", checked: !!g.required, onChange: (r) => u(t.id, { required: r }) }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => N(t.id), className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600", children: "+ Soru" })
        ] })
      ]
    }
  );
}
function xe() {
  const t = p.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [s, l] = p.useState(t), [o, h] = p.useState(""), [u, S] = p.useState(!1), [v, T] = p.useState(""), [N, k] = p.useState(""), [c, $] = p.useState(null), [g, w] = p.useState([]), [j, r] = p.useState([]), [B, y] = p.useState(null), [C, m] = p.useState(!1), [U, J] = p.useState(!!t), z = p.useRef(null);
  p.useEffect(() => {
    D.get("/api/app/form-category?MaxResultCount=100").then((a) => w(a.items || [])).catch(() => {
    });
  }, []), p.useEffect(() => {
    t && (async () => {
      try {
        const a = await D.get(`/api/app/form/${t}`);
        T(a.title || ""), h(a.slug || ""), k(a.description || ""), $(a.categoryId || null), r((a.blocks || []).slice().sort((i, d) => i.order - d.order).map((i) => ({
          id: i.id || E(),
          type: i.type,
          content: i.content,
          settings: me(i.settings)
        })));
      } catch (a) {
        P("error", (a == null ? void 0 : a.message) || "Form yüklenemedi.");
      } finally {
        J(!1);
      }
    })();
  }, [t]);
  const q = (a = n.ShortText) => {
    const i = M(a);
    r((d) => [...d, i]), y(i.id);
  }, G = (a) => {
    const i = M(n.ShortText);
    r((d) => {
      const x = d.findIndex((A) => A.id === a), f = [...d];
      return f.splice(x + 1, 0, i), f;
    }), y(i.id);
  }, V = (a) => r((i) => i.filter((d) => d.id !== a)), Z = (a) => r((i) => {
    const d = i.findIndex((A) => A.id === a);
    if (d < 0) return i;
    const x = { ...i[d], id: E(), settings: { ...i[d].settings } }, f = [...i];
    return f.splice(d + 1, 0, x), f;
  }), Q = (a, i) => r((d) => d.map((x) => x.id === a ? { ...x, ...i } : x)), W = (a, i) => r((d) => d.map((x) => x.id === a ? { ...x, settings: { ...x.settings, ...i } } : x)), X = (a, i) => r((d) => d.map((x) => {
    if (x.id !== a) return x;
    const f = { ...x.settings };
    return i !== n.Dropdown && (delete f.source, delete f.urlPrefill), L.has(i) && !f.options && (f.options = ["Seçenek 1", "Seçenek 2"]), { ...x, type: i, settings: f };
  })), ee = (a, i) => r((d) => {
    const x = i ?? z.current;
    if (z.current = null, x == null || a < 0 || a >= d.length || x === a) return d;
    const f = [...d], [A] = f.splice(x, 1);
    return f.splice(a, 0, A), f;
  }), O = (a, i) => {
    const d = ie(a, i);
    Object.keys(d).length && (r((x) => x.map((f) => d[f.id] ? { ...f, id: d[f.id] } : f)), y((x) => d[x] || x));
  }, te = async () => {
    if (!v.trim()) return P("warn", "Lütfen forma bir başlık verin.");
    m(!0);
    try {
      if (s) {
        await D.put(`/api/app/form/${s}`, { title: v.trim(), description: N.trim() || null, categoryId: c, themeJson: null, blocks: [] });
        const a = await D.put(`/api/app/form/${s}/blocks`, { blocks: K(j) });
        O(j, a == null ? void 0 : a.blocks), P("success", "Form kaydedildi.");
      } else {
        const a = await D.post("/api/app/form", { title: v.trim(), description: N.trim() || null, categoryId: c, themeJson: null, blocks: K(j) });
        O(j, a.blocks), l(a.id), h(a.slug || "");
        const i = new URL(window.location.href);
        i.searchParams.set("id", a.id), window.history.replaceState({}, "", i), P("success", "Form oluşturuldu.");
      }
    } catch (a) {
      P("error", (a == null ? void 0 : a.message) || "Kaydetme başarısız.");
    } finally {
      m(!1);
    }
  };
  return U ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-text-tertiary", children: "Form yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "min-h-[calc(100vh-120px)] bg-surface-sunken pb-24", children: [
    /* @__PURE__ */ e.jsx("div", { className: "sticky top-0 z-20 border-b border-default bg-surface-raised", children: /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets", className: "text-sm font-semibold text-text-secondary hover:text-text-primary", children: "← Formlar" }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary", children: [
          j.length,
          " alan"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("button", { onClick: te, disabled: C, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken disabled:opacity-50", children: C ? "Kaydediliyor…" : s ? "Kaydet" : "Oluştur" }),
        s && /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${s}`, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken", children: "Yanıtlar" }),
        s && /* @__PURE__ */ e.jsx("button", { onClick: () => S(!0), className: "rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-600", children: "Yayınla" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative mb-4 overflow-hidden rounded-2xl border border-default bg-surface-raised p-6", children: [
        /* @__PURE__ */ e.jsx("span", { className: "absolute inset-x-0 top-0 h-1.5 bg-accent" }),
        /* @__PURE__ */ e.jsx("input", { value: v, onChange: (a) => T(a.target.value), placeholder: "Form başlığı…", className: "w-full border-none bg-transparent p-0 text-3xl font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsx("input", { value: N, onChange: (a) => k(a.target.value), placeholder: "Form açıklaması (opsiyonel)…", className: "mt-2 w-full border-none bg-transparent p-0 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: c || "",
            onChange: (a) => $(a.target.value || null),
            className: "mt-3 rounded-lg border border-default bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-text-secondary focus:border-accent focus:outline-none",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Kategorisiz" }),
              g.map((a) => /* @__PURE__ */ e.jsxs("option", { value: a.id, children: [
                a.icon ? `${a.icon} ` : "",
                a.name
              ] }, a.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: j.map((a, i) => /* @__PURE__ */ e.jsx(
        ue,
        {
          block: a,
          index: i,
          selected: a.id === B,
          onSelect: y,
          onPatch: Q,
          onPatchSettings: W,
          onChangeType: X,
          onDuplicate: Z,
          onRemove: V,
          onAddAfter: G,
          onMove: ee,
          dragRef: z,
          publicSlug: o
        },
        a.id
      )) }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => q(n.ShortText), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-default py-4 text-sm font-bold text-text-secondary transition hover:border-focus hover:text-accent", children: "+ Soru Ekle" }),
      j.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-center text-sm text-text-tertiary", children: "Başlamak için bir soru ekleyin." })
    ] }),
    u && /* @__PURE__ */ e.jsx(pe, { formId: s, slug: o, onClose: () => S(!1) })
  ] });
}
function pe({ formId: t, slug: s, onClose: l }) {
  const [o, h] = p.useState(s || ""), [u, S] = p.useState(""), [v, T] = p.useState(""), [N, k] = p.useState(!1), [c, $] = p.useState(!1), [g, w] = p.useState(!1), [j, r] = p.useState(null), B = async () => {
    w(!0);
    try {
      const m = await D.post(`/api/app/form/${t}/publish`, {
        slug: (o == null ? void 0 : o.trim()) || null,
        publishSettingsJson: JSON.stringify({ startDate: u || null, endDate: v || null, kvkk: N, captcha: c })
      });
      r(m.slug || o), P("success", "Form yayınlandı.");
    } catch (m) {
      P("error", (m == null ? void 0 : m.message) || "Yayınlama başarısız.");
    } finally {
      w(!1);
    }
  }, y = j ? `${window.location.origin}${H(j)}` : null, C = () => {
    var m;
    y && ((m = navigator.clipboard) == null || m.writeText(y)), P("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: l, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-surface-raised p-6 shadow-xl", onClick: (m) => m.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Formu Yayınla" }),
      /* @__PURE__ */ e.jsx("button", { onClick: l, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    y ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: "rounded-xl bg-positive-50 p-3 text-sm text-positive-700", children: "✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yayın bağlantısı" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: b, value: y, onClick: (m) => m.target.select() }),
          /* @__PURE__ */ e.jsx("button", { onClick: C, className: "shrink-0 rounded-xl border border-default px-3 py-2 text-sm font-medium hover:bg-surface-sunken", children: "Kopyala" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: y, target: "_blank", rel: "noreferrer", className: "rounded-xl bg-accent px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-accent-600", children: "Formu yeni sekmede aç" })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bağlantı adresi (slug)" }),
        /* @__PURE__ */ e.jsx("input", { className: b, value: o, onChange: (m) => h(m.target.value), placeholder: "musteri-memnuniyet" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Başlangıç" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: b, value: u, onChange: (m) => S(m.target.value) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bitiş" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: b, value: v, onChange: (m) => T(m.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(R, { label: "KVKK onayı iste", checked: N, onChange: k }),
      /* @__PURE__ */ e.jsx(R, { label: "Bot koruması", checked: c, onChange: $ }),
      /* @__PURE__ */ e.jsxs("div", { className: "-mt-2 flex items-start gap-1 text-[11px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx(se, { text: "Başlangıç/Bitiş tarihi form penceresini sınırlar (dışında form kapalı). KVKK onayı açıkken genel formda zorunlu onay kutusu çıkar ve rıza kaydı tutulur. Bot koruması honeypot + minimum doldurma süresiyle otomatik gönderimleri eler (üçüncü taraf servis kullanılmaz)." }),
        /* @__PURE__ */ e.jsx("span", { children: "Bu ayarlar sunucu tarafında uygulanır" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { onClick: B, disabled: g, className: "mt-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: g ? "Yayınlanıyor…" : "Yayınla" })
    ] })
  ] }) });
}
function me(t) {
  if (!t) return { required: !1 };
  try {
    return typeof t == "string" ? JSON.parse(t) : t;
  } catch {
    return { required: !1 };
  }
}
function P(t, s) {
  const l = window.abp;
  l != null && l.notify && (t === "success" || t === "info") ? l.notify[t === "success" ? "success" : "info"](s) : l != null && l.message ? l.message[t === "error" ? "error" : t === "warn" ? "warn" : "info"](s) : console.log(`[${t}] ${s}`);
}
const Y = document.getElementById("dynamic-assets-app-root");
Y && ae(Y).render(/* @__PURE__ */ e.jsx(xe, {}));
export {
  ue as QuestionCard,
  K as payloadBlocks,
  ie as serverIdMap
};
