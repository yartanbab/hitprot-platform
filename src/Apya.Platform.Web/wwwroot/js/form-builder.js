import { b as ie, j as e, r as x } from "./react-vendor-D57GAUXd.js";
import { a as A } from "./httpClient-DePjXdo1.js";
import { H as oe } from "./Hint-CNW95h3H.js";
import { p as q } from "./publicFormLink-CJ_6ABDU.js";
import { O as R, s as L, C as ce, w as de } from "./formChoices-DAx-kYeM.js";
/* empty css               */
const i = {
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
}, z = /* @__PURE__ */ new Set([i.Select, i.MultiSelect, i.Dropdown]), ue = /* @__PURE__ */ new Set([i.SectionHeader, i.Paragraph]), G = [
  { group: "Metin & Sayı", items: [
    { type: i.ShortText, label: "Kısa Metin", icon: "✏️" },
    { type: i.LongText, label: "Uzun Metin", icon: "📝" },
    { type: i.Number, label: "Sayısal", icon: "🔢" },
    { type: i.Email, label: "E-Posta", icon: "✉️" },
    { type: i.Phone, label: "Telefon", icon: "📞" }
  ] },
  { group: "Seçim", items: [
    { type: i.Select, label: "Tekli Seçim", icon: "🔘" },
    { type: i.MultiSelect, label: "Çoklu Seçim", icon: "☑️" },
    { type: i.Dropdown, label: "Açılır Liste", icon: "⬇️" }
  ] },
  { group: "Tarih & Zaman", items: [
    { type: i.DatePicker, label: "Tarih", icon: "📅" },
    { type: i.TimePicker, label: "Saat", icon: "🕐" }
  ] },
  { group: "Özel", items: [
    { type: i.FilePicker, label: "Dosya Yükleme", icon: "📎" },
    { type: i.Rating, label: "Derecelendirme", icon: "⭐" },
    { type: i.Nps, label: "NPS (0-10)", icon: "📊" },
    { type: i.Signature, label: "İmza", icon: "✍️" },
    { type: i.Address, label: "Adres", icon: "📍" }
  ] },
  { group: "Düzen", items: [
    { type: i.SectionHeader, label: "Bölüm Başlığı", icon: "🏷️" },
    { type: i.Paragraph, label: "Açıklama", icon: "💬" }
  ] }
], K = Object.fromEntries(G.flatMap((t) => t.items.map((a) => [a.type, a.label]))), I = () => Math.random().toString(36).slice(2, 10), xe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, _ = (t) => t.map((a, n) => ({
  id: xe.test(a.id) ? a.id : null,
  type: a.type,
  order: n + 1,
  content: a.content || K[a.type] || "Soru",
  settings: JSON.stringify(a.settings || {})
})), pe = (t, a, n) => {
  const c = (n || []).find((h) => {
    var f, v;
    return h.key === ((v = (f = t[a]) == null ? void 0 : f.settings) == null ? void 0 : v.source);
  });
  return c != null && c.dependsOnSourceKey ? t.slice(0, a).filter((h) => {
    var f;
    return h.type === i.Dropdown && ((f = h.settings) == null ? void 0 : f.source) === c.dependsOnSourceKey;
  }) : [];
}, me = (t, a) => {
  const n = new Map((a || []).map((c) => [c.order, c.id]));
  return Object.fromEntries(t.map((c, h) => [c.id, n.get(h + 1)]).filter(([c, h]) => h && c !== h));
};
function J(t) {
  const a = { id: I(), type: t, content: K[t] || "Soru", settings: { required: !1 } };
  return z.has(t) && (a.settings.options = ["Seçenek 1", "Seçenek 2"]), t === i.SectionHeader && (a.content = "Bölüm Başlığı"), t === i.Paragraph && (a.content = "Açıklama metni…"), a;
}
const b = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft", E = ({ checked: t, onChange: a, label: n }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
  /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium text-text-secondary", children: n }),
  /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: (c) => {
        c.stopPropagation(), a(!t);
      },
      className: `relative h-6 w-11 rounded-full transition-colors ${t ? "bg-accent" : "bg-neutral-200"}`,
      "aria-pressed": t,
      children: /* @__PURE__ */ e.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${t ? "left-[22px]" : "left-0.5"}` })
    }
  )
] });
function he({ value: t, onChange: a }) {
  return /* @__PURE__ */ e.jsx(
    "select",
    {
      value: t,
      onClick: (n) => n.stopPropagation(),
      onChange: (n) => a(Number(n.target.value)),
      className: "shrink-0 rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm font-medium text-text-primary focus:border-focus focus:outline-none",
      children: G.map((n) => /* @__PURE__ */ e.jsx("optgroup", { label: n.group, children: n.items.map((c) => /* @__PURE__ */ e.jsxs("option", { value: c.type, children: [
        c.icon,
        " ",
        c.label
      ] }, c.type)) }, n.group))
    }
  );
}
function fe({ block: t }) {
  const a = t.settings || {};
  switch (t.type) {
    case i.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: b, placeholder: a.placeholder || "Uzun yanıt…" });
    case i.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: b, placeholder: a.placeholder || "0" });
    case i.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: b, placeholder: a.placeholder || "ornek@firma.com" });
    case i.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: b, placeholder: a.placeholder || "+90 5xx xxx xx xx" });
    case i.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: b });
    case i.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: b });
    case i.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-6 text-center text-sm text-text-tertiary", children: "📎 Dosya seç / sürükle" });
    case i.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: b, children: (a.options || []).map((n, c) => /* @__PURE__ */ e.jsx("option", { children: n }, c)) });
    case i.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-warning", children: "★★★★★" });
    case i.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (n, c) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-default text-xs text-text-secondary", children: c }, c)) });
    case i.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-8 text-center text-sm text-text-tertiary", children: "✍️ İmza alanı" });
    case i.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["Adres satırı", "İlçe", "İl", "Posta kodu"].map((n) => /* @__PURE__ */ e.jsx("input", { disabled: !0, className: b, placeholder: n }, n)) });
    case i.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "▦ Tablo ızgarası" });
    case i.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: b, placeholder: a.placeholder || "Kısa yanıt…" });
  }
}
function ge({ block: t, settings: a, onPatchSettings: n, publicSlug: c, sources: h, parentCandidates: f }) {
  var r;
  const v = !!a.source, N = h.find((l) => l.key === a.source) || null, w = !!(N != null && N.dependsOnSourceKey), [y, k] = x.useState(null), [S, B] = x.useState("");
  x.useEffect(() => {
    if (!v || w) {
      k(null);
      return;
    }
    let l = !1;
    return k(null), A.get(`/api/app/form/choices?source=${encodeURIComponent(a.source)}`).then((d) => {
      l || k(d || []);
    }).catch(() => {
      l || k([]);
    }), () => {
      l = !0;
    };
  }, [v, w, a.source]);
  const P = (l) => ({ source: l, urlPrefill: l === R ? !0 : void 0, dependsOn: void 0 }), D = h.some((l) => l.key === R) || h.length === 0 ? R : h[0].key, g = (l) => n(t.id, l ? P(D) : { source: void 0, urlPrefill: void 0, dependsOn: void 0 }), C = (l) => n(t.id, P(l)), j = () => {
    var l;
    (l = navigator.clipboard) == null || l.writeText(`${window.location.origin}${de(q(c), S)}`), O("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "mt-4 rounded-xl border border-subtle bg-surface-sunken p-3", onClick: (l) => l.stopPropagation(), children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-2 text-[11px] font-semibold uppercase text-text-tertiary", children: "Seçenek kaynağı" }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
      /* @__PURE__ */ e.jsx("input", { type: "radio", name: `source-${t.id}`, checked: !v, onChange: () => g(!1), className: "h-4 w-4 text-accent" }),
      "Sabit seçenekler, elle yazılır"
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "mt-1 flex items-center gap-2 text-sm text-text-primary", children: [
      /* @__PURE__ */ e.jsx("input", { type: "radio", name: `source-${t.id}`, checked: v, onChange: () => g(!0), className: "h-4 w-4 text-accent" }),
      "Veri kaynağından, canlı liste"
    ] }),
    v && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 border-t border-subtle pt-3", children: [
      /* @__PURE__ */ e.jsxs("select", { className: b, value: a.source, onChange: (l) => C(l.target.value), "aria-label": "Veri kaynağı", children: [
        !N && /* @__PURE__ */ e.jsx("option", { value: a.source, children: L(a.source) }),
        h.map((l) => /* @__PURE__ */ e.jsx("option", { value: l.key, children: L(l.key) }, l.key))
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-xs text-text-secondary", children: ((r = ce[a.source]) == null ? void 0 : r.hint) || "Seçenekler her form açılışında bu kaynaktan tazelenir." }),
      w && /* @__PURE__ */ e.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold text-text-secondary", children: "Hangi alana bağlı?" }),
        f.length === 0 ? /* @__PURE__ */ e.jsxs("p", { className: "rounded-lg bg-warning-subtle px-2.5 py-2 text-xs text-warning", children: [
          "Bu liste bir üst alana bağlı çalışır. Önce yukarıya “",
          L(N.dependsOnSourceKey),
          "” kaynağına bağlı bir açılır liste ekleyin."
        ] }) : /* @__PURE__ */ e.jsxs("select", { className: b, value: a.dependsOn || "", onChange: (l) => n(t.id, { dependsOn: l.target.value || void 0 }), "aria-label": "Üst alan", children: [
          /* @__PURE__ */ e.jsx("option", { value: "", children: "Üst alanı seçin…" }),
          f.map((l) => /* @__PURE__ */ e.jsx("option", { value: l.id, children: l.content || "Adsız alan" }, l.id))
        ] })
      ] }),
      !w && (y == null ? /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-xs text-text-tertiary", children: "Liste yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "mt-2", children: [
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-secondary", children: [
          "Şu an ",
          y.length,
          " kayıt listeleniyor."
        ] }),
        y.length > 0 && /* @__PURE__ */ e.jsx("ul", { className: "mt-2 flex flex-col gap-1 text-sm text-text-primary", children: y.slice(0, 3).map((l) => /* @__PURE__ */ e.jsx("li", { className: "truncate", children: l.label }, l.value)) }),
        y.length > 3 && /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-xs text-text-tertiary", children: [
          "ve ",
          y.length - 3,
          " kayıt daha"
        ] })
      ] })),
      a.source === R && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("div", { className: "mt-3", children: /* @__PURE__ */ e.jsx(E, { label: "Bağlantıdaki çağrıyı ön seç", checked: !!a.urlPrefill, onChange: (l) => n(t.id, { urlPrefill: l }) }) }),
        a.urlPrefill && c && (y == null ? void 0 : y.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs("select", { className: `${b} min-w-0 flex-1`, value: S, onChange: (l) => B(l.target.value), "aria-label": "Çağrıya özel bağlantı", children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "Çağrıya özel bağlantı için seçin…" }),
            y.map((l) => /* @__PURE__ */ e.jsx("option", { value: l.value, children: l.label }, l.value))
          ] }),
          /* @__PURE__ */ e.jsx("button", { type: "button", disabled: !S, onClick: j, className: "rounded-lg border border-default bg-surface-raised px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-sunken disabled:opacity-50", children: "Bağlantıyı kopyala" })
        ] })
      ] })
    ] })
  ] });
}
function be({ block: t, index: a, selected: n, onSelect: c, onPatch: h, onPatchSettings: f, onChangeType: v, onDuplicate: N, onRemove: w, onAddAfter: y, onMove: k, dragRef: S, publicSlug: B, sources: P = [], parentCandidates: D = [] }) {
  const g = t.settings || {}, C = ue.has(t.type), j = x.useRef(null);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: j,
      onDragOver: (r) => r.preventDefault(),
      onDrop: () => k(a),
      onClick: () => c(t.id),
      className: `group relative rounded-2xl border bg-surface-raised p-5 transition ${n ? "border-focus shadow-md ring-1 ring-accent-soft" : "border-default hover:border-strong"}`,
      children: [
        n && /* @__PURE__ */ e.jsx("span", { className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-accent" }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            draggable: !0,
            onDragStart: (r) => {
              S.current = a, j.current && r.dataTransfer.setDragImage(j.current, 24, 24);
            },
            title: "Sürükle",
            className: `absolute -top-2 left-1/2 -translate-x-1/2 cursor-grab px-4 text-text-tertiary transition-opacity active:cursor-grabbing ${n ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`,
            children: "⠿"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3", children: [
          C ? /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (r) => r.stopPropagation(),
              onChange: (r) => h(t.id, { content: r.target.value }),
              placeholder: t.type === i.SectionHeader ? "Bölüm başlığı" : "Açıklama metni",
              className: `flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${t.type === i.SectionHeader ? "text-xl font-bold text-text-primary" : "text-sm text-text-secondary"}`
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
          n && /* @__PURE__ */ e.jsx(he, { value: t.type, onChange: (r) => v(t.id, r) }),
          !n && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary", children: K[t.type] }),
          g.source && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-primary-subtle px-2.5 py-1 text-[11px] font-semibold text-primary", children: "⚡ Canlı liste" })
        ] }),
        n && t.type === i.Dropdown && /* @__PURE__ */ e.jsx(ge, { block: t, settings: g, onPatchSettings: f, publicSlug: B, sources: P, parentCandidates: D }),
        n && z.has(t.type) && !g.source && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [
          (g.options || []).map((r, l) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", onClick: (d) => d.stopPropagation(), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: t.type === i.MultiSelect ? "☐" : "○" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: "flex-1 border-b border-subtle bg-transparent px-1 py-1 text-sm focus:border-focus focus:outline-none",
                value: r,
                onChange: (d) => {
                  const $ = [...g.options];
                  $[l] = d.target.value, f(t.id, { options: $ });
                }
              }
            ),
            /* @__PURE__ */ e.jsx("button", { className: "rounded p-1 text-text-tertiary hover:text-negative-500", onClick: () => f(t.id, { options: g.options.filter((d, $) => $ !== l) }), children: "✕" })
          ] }, l)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "self-start text-sm font-medium text-accent hover:text-accent-600",
              onClick: (r) => {
                r.stopPropagation(), f(t.id, { options: [...g.options || [], `Seçenek ${(g.options || []).length + 1}`] });
              },
              children: "+ Seçenek ekle"
            }
          )
        ] }),
        !C && !z.has(t.type) && /* @__PURE__ */ e.jsx("div", { className: "mt-4", onClick: (r) => r.stopPropagation(), children: /* @__PURE__ */ e.jsx(fe, { block: t }) }),
        n && !C && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 border-t border-subtle pt-4 sm:grid-cols-2", onClick: (r) => r.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Placeholder" }),
            /* @__PURE__ */ e.jsx("input", { className: b, value: g.placeholder || "", onChange: (r) => f(t.id, { placeholder: r.target.value }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yardım Metni" }),
            /* @__PURE__ */ e.jsx("input", { className: b, value: g.helpText || "", onChange: (r) => f(t.id, { helpText: r.target.value }) })
          ] }),
          (t.type === i.Number || t.type === i.Rating) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Min" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: b, value: g.min ?? "", onChange: (r) => f(t.id, { min: r.target.value === "" ? null : Number(r.target.value) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Max" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: b, value: g.max ?? "", onChange: (r) => f(t.id, { max: r.target.value === "" ? null : Number(r.target.value) }) })
            ] })
          ] })
        ] }),
        n && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 border-t border-subtle pt-3", onClick: (r) => r.stopPropagation(), children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => k(a - 1, a), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Yukarı", children: "▲" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => k(a + 1, a), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Aşağı", children: "▼" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => N(t.id), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Kopyala", children: "⧉" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => w(t.id), className: "rounded-lg p-2 text-negative-500 hover:bg-negative-50", title: "Sil", children: "🗑" }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          !C && /* @__PURE__ */ e.jsx(E, { label: "Zorunlu", checked: !!g.required, onChange: (r) => f(t.id, { required: r }) }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => y(t.id), className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600", children: "+ Soru" })
        ] })
      ]
    }
  );
}
function ye() {
  const t = x.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [a, n] = x.useState(t), [c, h] = x.useState(""), [f, v] = x.useState(!1), [N, w] = x.useState(""), [y, k] = x.useState(""), [S, B] = x.useState(null), [P, D] = x.useState([]), [g, C] = x.useState([]), [j, r] = x.useState([]), [l, d] = x.useState(null), [$, M] = x.useState(!1), [Z, Q] = x.useState(!!t), F = x.useRef(null);
  x.useEffect(() => {
    A.get("/api/app/form-category?MaxResultCount=100").then((s) => D(s.items || [])).catch(() => {
    });
  }, []), x.useEffect(() => {
    A.get("/api/app/form/choice-sources").then((s) => C(s || [])).catch(() => C([]));
  }, []), x.useEffect(() => {
    t && (async () => {
      try {
        const s = await A.get(`/api/app/form/${t}`);
        w(s.title || ""), h(s.slug || ""), k(s.description || ""), B(s.categoryId || null), r((s.blocks || []).slice().sort((o, u) => o.order - u.order).map((o) => ({
          id: o.id || I(),
          type: o.type,
          content: o.content,
          settings: ve(o.settings)
        })));
      } catch (s) {
        O("error", (s == null ? void 0 : s.message) || "Form yüklenemedi.");
      } finally {
        Q(!1);
      }
    })();
  }, [t]);
  const W = (s = i.ShortText) => {
    const o = J(s);
    r((u) => [...u, o]), d(o.id);
  }, X = (s) => {
    const o = J(i.ShortText);
    r((u) => {
      const p = u.findIndex((T) => T.id === s), m = [...u];
      return m.splice(p + 1, 0, o), m;
    }), d(o.id);
  }, ee = (s) => r((o) => o.filter((u) => u.id !== s)), te = (s) => r((o) => {
    const u = o.findIndex((T) => T.id === s);
    if (u < 0) return o;
    const p = { ...o[u], id: I(), settings: { ...o[u].settings } }, m = [...o];
    return m.splice(u + 1, 0, p), m;
  }), ae = (s, o) => r((u) => u.map((p) => p.id === s ? { ...p, ...o } : p)), se = (s, o) => r((u) => u.map((p) => p.id === s ? { ...p, settings: { ...p.settings, ...o } } : p)), re = (s, o) => r((u) => u.map((p) => {
    if (p.id !== s) return p;
    const m = { ...p.settings };
    return o !== i.Dropdown && (delete m.source, delete m.urlPrefill, delete m.dependsOn), z.has(o) && !m.options && (m.options = ["Seçenek 1", "Seçenek 2"]), { ...p, type: o, settings: m };
  })), ne = (s, o) => r((u) => {
    const p = o ?? F.current;
    if (F.current = null, p == null || s < 0 || s >= u.length || p === s) return u;
    const m = [...u], [T] = m.splice(p, 1);
    return m.splice(s, 0, T), m;
  }), Y = (s, o) => {
    const u = me(s, o);
    Object.keys(u).length && (r((p) => p.map((m) => {
      var U;
      const T = (U = m.settings) == null ? void 0 : U.dependsOn, H = T && u[T] ? { ...m.settings, dependsOn: u[T] } : m.settings;
      return u[m.id] || H !== m.settings ? { ...m, id: u[m.id] || m.id, settings: H } : m;
    })), d((p) => u[p] || p));
  }, le = async () => {
    if (!N.trim()) return O("warn", "Lütfen forma bir başlık verin.");
    M(!0);
    try {
      if (a) {
        await A.put(`/api/app/form/${a}`, { title: N.trim(), description: y.trim() || null, categoryId: S, themeJson: null, blocks: [] });
        const s = await A.put(`/api/app/form/${a}/blocks`, { blocks: _(j) });
        Y(j, s == null ? void 0 : s.blocks), O("success", "Form kaydedildi.");
      } else {
        const s = await A.post("/api/app/form", { title: N.trim(), description: y.trim() || null, categoryId: S, themeJson: null, blocks: _(j) });
        Y(j, s.blocks), n(s.id), h(s.slug || "");
        const o = new URL(window.location.href);
        o.searchParams.set("id", s.id), window.history.replaceState({}, "", o), O("success", "Form oluşturuldu.");
      }
    } catch (s) {
      O("error", (s == null ? void 0 : s.message) || "Kaydetme başarısız.");
    } finally {
      M(!1);
    }
  };
  return Z ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-text-tertiary", children: "Form yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "min-h-[calc(100vh-120px)] bg-surface-sunken pb-24", children: [
    /* @__PURE__ */ e.jsx("div", { className: "sticky top-0 z-20 border-b border-default bg-surface-raised", children: /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets", className: "text-sm font-semibold text-text-secondary hover:text-text-primary", children: "← Formlar" }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary", children: [
          j.length,
          " alan"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("button", { onClick: le, disabled: $, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken disabled:opacity-50", children: $ ? "Kaydediliyor…" : a ? "Kaydet" : "Oluştur" }),
        a && /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${a}`, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken", children: "Yanıtlar" }),
        a && /* @__PURE__ */ e.jsx("button", { onClick: () => v(!0), className: "rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-600", children: "Yayınla" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative mb-4 overflow-hidden rounded-2xl border border-default bg-surface-raised p-6", children: [
        /* @__PURE__ */ e.jsx("span", { className: "absolute inset-x-0 top-0 h-1.5 bg-accent" }),
        /* @__PURE__ */ e.jsx("input", { value: N, onChange: (s) => w(s.target.value), placeholder: "Form başlığı…", className: "w-full border-none bg-transparent p-0 text-3xl font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsx("input", { value: y, onChange: (s) => k(s.target.value), placeholder: "Form açıklaması (opsiyonel)…", className: "mt-2 w-full border-none bg-transparent p-0 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: S || "",
            onChange: (s) => B(s.target.value || null),
            className: "mt-3 rounded-lg border border-default bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-text-secondary focus:border-accent focus:outline-none",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Kategorisiz" }),
              P.map((s) => /* @__PURE__ */ e.jsxs("option", { value: s.id, children: [
                s.icon ? `${s.icon} ` : "",
                s.name
              ] }, s.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: j.map((s, o) => /* @__PURE__ */ e.jsx(
        be,
        {
          block: s,
          index: o,
          selected: s.id === l,
          onSelect: d,
          onPatch: ae,
          onPatchSettings: se,
          onChangeType: re,
          onDuplicate: te,
          onRemove: ee,
          onAddAfter: X,
          onMove: ne,
          dragRef: F,
          publicSlug: c,
          sources: g,
          parentCandidates: pe(j, o, g)
        },
        s.id
      )) }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => W(i.ShortText), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-default py-4 text-sm font-bold text-text-secondary transition hover:border-focus hover:text-accent", children: "+ Soru Ekle" }),
      j.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-center text-sm text-text-tertiary", children: "Başlamak için bir soru ekleyin." })
    ] }),
    f && /* @__PURE__ */ e.jsx(je, { formId: a, slug: c, onClose: () => v(!1) })
  ] });
}
function je({ formId: t, slug: a, onClose: n }) {
  const [c, h] = x.useState(a || ""), [f, v] = x.useState(""), [N, w] = x.useState(""), [y, k] = x.useState(!1), [S, B] = x.useState(!1), [P, D] = x.useState(!1), [g, C] = x.useState(null), j = async () => {
    D(!0);
    try {
      const d = await A.post(`/api/app/form/${t}/publish`, {
        slug: (c == null ? void 0 : c.trim()) || null,
        publishSettingsJson: JSON.stringify({ startDate: f || null, endDate: N || null, kvkk: y, captcha: S })
      });
      C(d.slug || c), O("success", "Form yayınlandı.");
    } catch (d) {
      O("error", (d == null ? void 0 : d.message) || "Yayınlama başarısız.");
    } finally {
      D(!1);
    }
  }, r = g ? `${window.location.origin}${q(g)}` : null, l = () => {
    var d;
    r && ((d = navigator.clipboard) == null || d.writeText(r)), O("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: n, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-surface-raised p-6 shadow-xl", onClick: (d) => d.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Formu Yayınla" }),
      /* @__PURE__ */ e.jsx("button", { onClick: n, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    r ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: "rounded-xl bg-positive-50 p-3 text-sm text-positive-700", children: "✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yayın bağlantısı" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: b, value: r, onClick: (d) => d.target.select() }),
          /* @__PURE__ */ e.jsx("button", { onClick: l, className: "shrink-0 rounded-xl border border-default px-3 py-2 text-sm font-medium hover:bg-surface-sunken", children: "Kopyala" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: r, target: "_blank", rel: "noreferrer", className: "rounded-xl bg-accent px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-accent-600", children: "Formu yeni sekmede aç" })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bağlantı adresi (slug)" }),
        /* @__PURE__ */ e.jsx("input", { className: b, value: c, onChange: (d) => h(d.target.value), placeholder: "musteri-memnuniyet" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Başlangıç" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: b, value: f, onChange: (d) => v(d.target.value) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bitiş" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: b, value: N, onChange: (d) => w(d.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(E, { label: "KVKK onayı iste", checked: y, onChange: k }),
      /* @__PURE__ */ e.jsx(E, { label: "Bot koruması", checked: S, onChange: B }),
      /* @__PURE__ */ e.jsxs("div", { className: "-mt-2 flex items-start gap-1 text-[11px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx(oe, { text: "Başlangıç/Bitiş tarihi form penceresini sınırlar (dışında form kapalı). KVKK onayı açıkken genel formda zorunlu onay kutusu çıkar ve rıza kaydı tutulur. Bot koruması honeypot + minimum doldurma süresiyle otomatik gönderimleri eler (üçüncü taraf servis kullanılmaz)." }),
        /* @__PURE__ */ e.jsx("span", { children: "Bu ayarlar sunucu tarafında uygulanır" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { onClick: j, disabled: P, className: "mt-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: P ? "Yayınlanıyor…" : "Yayınla" })
    ] })
  ] }) });
}
function ve(t) {
  if (!t) return { required: !1 };
  try {
    return typeof t == "string" ? JSON.parse(t) : t;
  } catch {
    return { required: !1 };
  }
}
function O(t, a) {
  const n = window.abp;
  n != null && n.notify && (t === "success" || t === "info") ? n.notify[t === "success" ? "success" : "info"](a) : n != null && n.message ? n.message[t === "error" ? "error" : t === "warn" ? "warn" : "info"](a) : console.log(`[${t}] ${a}`);
}
const V = document.getElementById("dynamic-assets-app-root");
V && ie(V).render(/* @__PURE__ */ e.jsx(ye, {}));
export {
  be as QuestionCard,
  pe as parentCandidatesFor,
  _ as payloadBlocks,
  me as serverIdMap
};
