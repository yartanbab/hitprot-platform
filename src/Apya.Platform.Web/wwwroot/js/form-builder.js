import { b as xe, j as e, r as x } from "./react-vendor-D57GAUXd.js";
import { a as A } from "./httpClient-DePjXdo1.js";
import { H as pe } from "./Hint-CNW95h3H.js";
import { p as Z } from "./publicFormLink-CJ_6ABDU.js";
import { O as $, s as H, C as me, w as he } from "./formChoices-DAx-kYeM.js";
import { V as L, O, a as fe, f as ge } from "./formConditions-DMSgmMUB.js";
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
}, z = /* @__PURE__ */ new Set([i.Select, i.MultiSelect, i.Dropdown]), X = /* @__PURE__ */ new Set([i.SectionHeader, i.Paragraph]), ee = [
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
], U = Object.fromEntries(ee.flatMap((t) => t.items.map((r) => [r.type, r.label]))), _ = () => Math.random().toString(36).slice(2, 10), be = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, J = (t) => t.map((r, l) => ({
  id: be.test(r.id) ? r.id : null,
  type: r.type,
  order: l + 1,
  content: r.content || U[r.type] || "Soru",
  settings: JSON.stringify(r.settings || {})
})), ye = (t, r) => t.slice(0, r).filter((l) => !X.has(l.type)), ve = (t, r, l) => {
  const o = (l || []).find((g) => {
    var d, y;
    return g.key === ((y = (d = t[r]) == null ? void 0 : d.settings) == null ? void 0 : y.source);
  });
  return o != null && o.dependsOnSourceKey ? t.slice(0, r).filter((g) => {
    var d;
    return g.type === i.Dropdown && ((d = g.settings) == null ? void 0 : d.source) === o.dependsOnSourceKey;
  }) : [];
}, je = (t, r) => {
  const l = new Map((r || []).map((o) => [o.order, o.id]));
  return Object.fromEntries(t.map((o, g) => [o.id, l.get(g + 1)]).filter(([o, g]) => g && o !== g));
};
function q(t) {
  const r = { id: _(), type: t, content: U[t] || "Soru", settings: { required: !1 } };
  return z.has(t) && (r.settings.options = ["Seçenek 1", "Seçenek 2"]), t === i.SectionHeader && (r.content = "Bölüm Başlığı"), t === i.Paragraph && (r.content = "Açıklama metni…"), r;
}
const b = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft", Y = ({ checked: t, onChange: r, label: l }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
  /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium text-text-secondary", children: l }),
  /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: (o) => {
        o.stopPropagation(), r(!t);
      },
      className: `relative h-6 w-11 rounded-full transition-colors ${t ? "bg-accent" : "bg-neutral-200"}`,
      "aria-pressed": t,
      children: /* @__PURE__ */ e.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${t ? "left-[22px]" : "left-0.5"}` })
    }
  )
] });
function Ne({ value: t, onChange: r }) {
  return /* @__PURE__ */ e.jsx(
    "select",
    {
      value: t,
      onClick: (l) => l.stopPropagation(),
      onChange: (l) => r(Number(l.target.value)),
      className: "shrink-0 rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm font-medium text-text-primary focus:border-focus focus:outline-none",
      children: ee.map((l) => /* @__PURE__ */ e.jsx("optgroup", { label: l.group, children: l.items.map((o) => /* @__PURE__ */ e.jsxs("option", { value: o.type, children: [
        o.icon,
        " ",
        o.label
      ] }, o.type)) }, l.group))
    }
  );
}
function ke({ block: t }) {
  const r = t.settings || {};
  switch (t.type) {
    case i.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: b, placeholder: r.placeholder || "Uzun yanıt…" });
    case i.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: b, placeholder: r.placeholder || "0" });
    case i.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: b, placeholder: r.placeholder || "ornek@firma.com" });
    case i.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: b, placeholder: r.placeholder || "+90 5xx xxx xx xx" });
    case i.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: b });
    case i.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: b });
    case i.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-6 text-center text-sm text-text-tertiary", children: "📎 Dosya seç / sürükle" });
    case i.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: b, children: (r.options || []).map((l, o) => /* @__PURE__ */ e.jsx("option", { children: l }, o)) });
    case i.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-warning", children: "★★★★★" });
    case i.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (l, o) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-default text-xs text-text-secondary", children: o }, o)) });
    case i.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-8 text-center text-sm text-text-tertiary", children: "✍️ İmza alanı" });
    case i.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["Adres satırı", "İlçe", "İl", "Posta kodu"].map((l) => /* @__PURE__ */ e.jsx("input", { disabled: !0, className: b, placeholder: l }, l)) });
    case i.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "▦ Tablo ızgarası" });
    case i.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: b, placeholder: r.placeholder || "Kısa yanıt…" });
  }
}
function Se({ block: t, settings: r, onPatchSettings: l, publicSlug: o, sources: g, parentCandidates: d }) {
  var m;
  const y = !!r.source, N = g.find((a) => a.key === r.source) || null, k = !!(N != null && N.dependsOnSourceKey), [p, S] = x.useState(null), [C, D] = x.useState("");
  x.useEffect(() => {
    if (!y || k) {
      S(null);
      return;
    }
    let a = !1;
    return S(null), A.get(`/api/app/form/choices?source=${encodeURIComponent(r.source)}`).then((s) => {
      a || S(s || []);
    }).catch(() => {
      a || S([]);
    }), () => {
      a = !0;
    };
  }, [y, k, r.source]);
  const w = (a) => ({ source: a, urlPrefill: a === $ ? !0 : void 0, dependsOn: void 0 }), P = g.some((a) => a.key === $) || g.length === 0 ? $ : g[0].key, E = (a) => l(t.id, a ? w(P) : { source: void 0, urlPrefill: void 0, dependsOn: void 0 }), v = (a) => l(t.id, w(a)), j = () => {
    var a;
    (a = navigator.clipboard) == null || a.writeText(`${window.location.origin}${he(Z(o), C)}`), I("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "mt-4 rounded-xl border border-subtle bg-surface-sunken p-3", onClick: (a) => a.stopPropagation(), children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-2 text-[11px] font-semibold uppercase text-text-secondary", children: "Seçenek kaynağı" }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
      /* @__PURE__ */ e.jsx("input", { type: "radio", name: `source-${t.id}`, checked: !y, onChange: () => E(!1), className: "h-4 w-4 text-accent" }),
      "Sabit seçenekler, elle yazılır"
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "mt-1 flex items-center gap-2 text-sm text-text-primary", children: [
      /* @__PURE__ */ e.jsx("input", { type: "radio", name: `source-${t.id}`, checked: y, onChange: () => E(!0), className: "h-4 w-4 text-accent" }),
      "Veri kaynağından, canlı liste"
    ] }),
    y && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 border-t border-subtle pt-3", children: [
      /* @__PURE__ */ e.jsxs("select", { className: b, value: r.source, onChange: (a) => v(a.target.value), "aria-label": "Veri kaynağı", children: [
        !N && /* @__PURE__ */ e.jsx("option", { value: r.source, children: H(r.source) }),
        g.map((a) => /* @__PURE__ */ e.jsx("option", { value: a.key, children: H(a.key) }, a.key))
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-xs text-text-secondary", children: ((m = me[r.source]) == null ? void 0 : m.hint) || "Seçenekler her form açılışında bu kaynaktan tazelenir." }),
      k && /* @__PURE__ */ e.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold text-text-secondary", children: "Hangi alana bağlı?" }),
        d.length === 0 ? /* @__PURE__ */ e.jsxs("p", { className: "rounded-lg bg-warning-subtle px-2.5 py-2 text-xs text-warning", children: [
          "Bu liste bir üst alana bağlı çalışır. Önce yukarıya “",
          H(N.dependsOnSourceKey),
          "” kaynağına bağlı bir açılır liste ekleyin."
        ] }) : /* @__PURE__ */ e.jsxs("select", { className: b, value: r.dependsOn || "", onChange: (a) => l(t.id, { dependsOn: a.target.value || void 0 }), "aria-label": "Üst alan", children: [
          /* @__PURE__ */ e.jsx("option", { value: "", children: "Üst alanı seçin…" }),
          d.map((a) => /* @__PURE__ */ e.jsx("option", { value: a.id, children: a.content || "Adsız alan" }, a.id))
        ] })
      ] }),
      !k && (p == null ? /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-xs text-text-tertiary", children: "Liste yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "mt-2", children: [
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-secondary", children: [
          "Şu an ",
          p.length,
          " kayıt listeleniyor."
        ] }),
        p.length > 0 && /* @__PURE__ */ e.jsx("ul", { className: "mt-2 flex flex-col gap-1 text-sm text-text-primary", children: p.slice(0, 3).map((a) => /* @__PURE__ */ e.jsx("li", { className: "truncate", children: a.label }, a.value)) }),
        p.length > 3 && /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-xs text-text-tertiary", children: [
          "ve ",
          p.length - 3,
          " kayıt daha"
        ] })
      ] })),
      r.source === $ && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("div", { className: "mt-3", children: /* @__PURE__ */ e.jsx(Y, { label: "Bağlantıdaki çağrıyı ön seç", checked: !!r.urlPrefill, onChange: (a) => l(t.id, { urlPrefill: a }) }) }),
        r.urlPrefill && o && (p == null ? void 0 : p.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs("select", { className: `${b} min-w-0 flex-1`, value: C, onChange: (a) => D(a.target.value), "aria-label": "Çağrıya özel bağlantı", children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "Çağrıya özel bağlantı için seçin…" }),
            p.map((a) => /* @__PURE__ */ e.jsx("option", { value: a.value, children: a.label }, a.value))
          ] }),
          /* @__PURE__ */ e.jsx("button", { type: "button", disabled: !C, onClick: j, className: "rounded-lg border border-default bg-surface-raised px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-sunken disabled:opacity-50", children: "Bağlantıyı kopyala" })
        ] })
      ] })
    ] })
  ] });
}
function Ce({ block: t, settings: r, onPatchSettings: l, candidates: o, sources: g }) {
  const d = r[L] || null, y = o.find((s) => s.id === (d == null ? void 0 : d.blockId)) || null, N = (y == null ? void 0 : y.settings) || {}, k = (y == null ? void 0 : y.type) === i.Dropdown ? N.source : null, p = g.find((s) => s.key === k) || null, S = !!(p != null && p.dependsOnSourceKey), C = (p == null ? void 0 : p.flags) || [], [D, w] = x.useState(null);
  x.useEffect(() => {
    if (!k || S) return w(null);
    let s = !1;
    return A.get(`/api/app/form/choices?source=${encodeURIComponent(k)}`).then((T) => {
      s || w(T || []);
    }).catch(() => {
      s || w([]);
    }), () => {
      s = !0;
    };
  }, [k, S]);
  const P = (s) => l(t.id, { [L]: { ...d, ...s } }), E = () => {
    const s = o[0];
    l(t.id, { [L]: { blockId: s.id, op: O.ANSWERED, value: void 0 } });
  }, v = (s) => l(t.id, { [L]: { blockId: s, op: O.ANSWERED, value: void 0 } }), j = (s) => P({ op: s, value: s === O.FLAG ? C[0] : void 0 }), m = k ? (D || []).map((s) => ({ value: s.value, label: s.label })) : (N.options || []).map((s) => ({ value: s, label: s })), a = [O.ANSWERED, O.EQ, O.NEQ, ...C.length ? [O.FLAG] : []].filter((s) => !(S && (s === O.EQ || s === O.NEQ)));
  return /* @__PURE__ */ e.jsxs("div", { className: "mt-3 rounded-xl border border-subtle bg-surface-sunken p-3", onClick: (s) => s.stopPropagation(), children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-2 text-[11px] font-semibold uppercase text-text-secondary", children: "Görünürlük" }),
    o.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-secondary", children: "Koşul için yukarıda bir alan gerekir; bu alan her zaman görünür." }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
      !y && /* @__PURE__ */ e.jsx("p", { className: "rounded-lg bg-warning-subtle px-2.5 py-2 text-xs text-warning", children: "Koşuldaki alan artık yukarıda değil. Yeni bir alan seçin ya da koşulu kaldırın — yoksa bu alan formda hiç görünmeyebilir." }),
      /* @__PURE__ */ e.jsxs("select", { className: b, value: d.blockId, onChange: (s) => v(s.target.value), "aria-label": "Koşul alanı", children: [
        !y && /* @__PURE__ */ e.jsx("option", { value: d.blockId, children: "Kaldırılmış alan" }),
        o.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: s.content || "Adsız alan" }, s.id))
      ] }),
      /* @__PURE__ */ e.jsx("select", { className: b, value: d.op, onChange: (s) => j(s.target.value), "aria-label": "Koşul karşılaştırması", children: a.map((s) => /* @__PURE__ */ e.jsx("option", { value: s, children: fe[s] }, s)) }),
      d.op === O.FLAG && /* @__PURE__ */ e.jsx("select", { className: b, value: d.value || C[0] || "", onChange: (s) => P({ value: s.target.value }), "aria-label": "Koşul şartı", children: C.map((s) => /* @__PURE__ */ e.jsx("option", { value: s, children: ge(s) }, s)) }),
      (d.op === O.EQ || d.op === O.NEQ) && (m.length > 0 ? /* @__PURE__ */ e.jsxs("select", { className: b, value: d.value || "", onChange: (s) => P({ value: s.target.value }), "aria-label": "Koşul cevabı", children: [
        /* @__PURE__ */ e.jsx("option", { value: "", children: "Cevabı seçin…" }),
        m.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.value, children: s.label }, s.value))
      ] }) : /* @__PURE__ */ e.jsx("input", { className: b, value: d.value || "", onChange: (s) => P({ value: s.target.value }), placeholder: "Beklenen cevap…", "aria-label": "Koşul cevabı" })),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => l(t.id, { [L]: void 0 }),
          className: "self-start text-xs font-semibold text-text-secondary underline hover:text-text-primary",
          children: "Koşulu kaldır"
        }
      )
    ] }) : /* @__PURE__ */ e.jsx("button", { type: "button", onClick: E, className: "rounded-lg border border-default bg-surface-raised px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-sunken", children: "+ Koşul ekle" })
  ] });
}
function we({ block: t, index: r, selected: l, onSelect: o, onPatch: g, onPatchSettings: d, onChangeType: y, onDuplicate: N, onRemove: k, onAddAfter: p, onMove: S, dragRef: C, publicSlug: D, sources: w = [], parentCandidates: P = [], conditionCandidates: E = [] }) {
  const v = t.settings || {}, j = X.has(t.type), m = x.useRef(null);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: m,
      onDragOver: (a) => a.preventDefault(),
      onDrop: () => S(r),
      onClick: () => o(t.id),
      className: `group relative rounded-2xl border bg-surface-raised p-5 transition ${l ? "border-focus shadow-md ring-1 ring-accent-soft" : "border-default hover:border-strong"}`,
      children: [
        l && /* @__PURE__ */ e.jsx("span", { className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-accent" }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            draggable: !0,
            onDragStart: (a) => {
              C.current = r, m.current && a.dataTransfer.setDragImage(m.current, 24, 24);
            },
            title: "Sürükle",
            className: `absolute -top-2 left-1/2 -translate-x-1/2 cursor-grab px-4 text-text-tertiary transition-opacity active:cursor-grabbing ${l ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`,
            children: "⠿"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3", children: [
          j ? /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (a) => a.stopPropagation(),
              onChange: (a) => g(t.id, { content: a.target.value }),
              placeholder: t.type === i.SectionHeader ? "Bölüm başlığı" : "Açıklama metni",
              className: `flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${t.type === i.SectionHeader ? "text-xl font-bold text-text-primary" : "text-sm text-text-secondary"}`
            }
          ) : /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (a) => a.stopPropagation(),
              onChange: (a) => g(t.id, { content: a.target.value }),
              placeholder: "Soru metni…",
              className: "flex-1 border-b border-transparent bg-transparent p-0 pb-1 text-base font-semibold text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-0"
            }
          ),
          l && /* @__PURE__ */ e.jsx(Ne, { value: t.type, onChange: (a) => y(t.id, a) }),
          !l && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary", children: U[t.type] }),
          v.source && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-primary-subtle px-2.5 py-1 text-[11px] font-semibold text-primary", children: "⚡ Canlı liste" })
        ] }),
        l && t.type === i.Dropdown && /* @__PURE__ */ e.jsx(Se, { block: t, settings: v, onPatchSettings: d, publicSlug: D, sources: w, parentCandidates: P }),
        l && /* @__PURE__ */ e.jsx(Ce, { block: t, settings: v, onPatchSettings: d, candidates: E, sources: w }),
        l && z.has(t.type) && !v.source && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [
          (v.options || []).map((a, s) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", onClick: (T) => T.stopPropagation(), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: t.type === i.MultiSelect ? "☐" : "○" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: "flex-1 border-b border-subtle bg-transparent px-1 py-1 text-sm focus:border-focus focus:outline-none",
                value: a,
                onChange: (T) => {
                  const K = [...v.options];
                  K[s] = T.target.value, d(t.id, { options: K });
                }
              }
            ),
            /* @__PURE__ */ e.jsx("button", { className: "rounded p-1 text-text-tertiary hover:text-negative-500", onClick: () => d(t.id, { options: v.options.filter((T, K) => K !== s) }), children: "✕" })
          ] }, s)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "self-start text-sm font-medium text-accent hover:text-accent-600",
              onClick: (a) => {
                a.stopPropagation(), d(t.id, { options: [...v.options || [], `Seçenek ${(v.options || []).length + 1}`] });
              },
              children: "+ Seçenek ekle"
            }
          )
        ] }),
        !j && !z.has(t.type) && /* @__PURE__ */ e.jsx("div", { className: "mt-4", onClick: (a) => a.stopPropagation(), children: /* @__PURE__ */ e.jsx(ke, { block: t }) }),
        l && !j && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 border-t border-subtle pt-4 sm:grid-cols-2", onClick: (a) => a.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Placeholder" }),
            /* @__PURE__ */ e.jsx("input", { className: b, value: v.placeholder || "", onChange: (a) => d(t.id, { placeholder: a.target.value }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yardım Metni" }),
            /* @__PURE__ */ e.jsx("input", { className: b, value: v.helpText || "", onChange: (a) => d(t.id, { helpText: a.target.value }) })
          ] }),
          (t.type === i.Number || t.type === i.Rating) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Min" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: b, value: v.min ?? "", onChange: (a) => d(t.id, { min: a.target.value === "" ? null : Number(a.target.value) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Max" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: b, value: v.max ?? "", onChange: (a) => d(t.id, { max: a.target.value === "" ? null : Number(a.target.value) }) })
            ] })
          ] })
        ] }),
        l && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 border-t border-subtle pt-3", onClick: (a) => a.stopPropagation(), children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => S(r - 1, r), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Yukarı", children: "▲" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => S(r + 1, r), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Aşağı", children: "▼" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => N(t.id), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Kopyala", children: "⧉" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => k(t.id), className: "rounded-lg p-2 text-negative-500 hover:bg-negative-50", title: "Sil", children: "🗑" }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          !j && /* @__PURE__ */ e.jsx(Y, { label: "Zorunlu", checked: !!v.required, onChange: (a) => d(t.id, { required: a }) }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => p(t.id), className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600", children: "+ Soru" })
        ] })
      ]
    }
  );
}
function Pe() {
  const t = x.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [r, l] = x.useState(t), [o, g] = x.useState(""), [d, y] = x.useState(!1), [N, k] = x.useState(""), [p, S] = x.useState(""), [C, D] = x.useState(null), [w, P] = x.useState([]), [E, v] = x.useState([]), [j, m] = x.useState([]), [a, s] = x.useState(null), [T, K] = x.useState(!1), [te, ae] = x.useState(!!t), M = x.useRef(null);
  x.useEffect(() => {
    A.get("/api/app/form-category?MaxResultCount=100").then((n) => P(n.items || [])).catch(() => {
    });
  }, []), x.useEffect(() => {
    A.get("/api/app/form/choice-sources").then((n) => v(n || [])).catch(() => v([]));
  }, []), x.useEffect(() => {
    t && (async () => {
      try {
        const n = await A.get(`/api/app/form/${t}`);
        k(n.title || ""), g(n.slug || ""), S(n.description || ""), D(n.categoryId || null), m((n.blocks || []).slice().sort((c, u) => c.order - u.order).map((c) => ({
          id: c.id || _(),
          type: c.type,
          content: c.content,
          settings: Oe(c.settings)
        })));
      } catch (n) {
        I("error", (n == null ? void 0 : n.message) || "Form yüklenemedi.");
      } finally {
        ae(!1);
      }
    })();
  }, [t]);
  const se = (n = i.ShortText) => {
    const c = q(n);
    m((u) => [...u, c]), s(c.id);
  }, re = (n) => {
    const c = q(i.ShortText);
    m((u) => {
      const h = u.findIndex((B) => B.id === n), f = [...u];
      return f.splice(h + 1, 0, c), f;
    }), s(c.id);
  }, ne = (n) => m((c) => c.filter((u) => u.id !== n)), le = (n) => m((c) => {
    const u = c.findIndex((B) => B.id === n);
    if (u < 0) return c;
    const h = { ...c[u], id: _(), settings: { ...c[u].settings } }, f = [...c];
    return f.splice(u + 1, 0, h), f;
  }), ie = (n, c) => m((u) => u.map((h) => h.id === n ? { ...h, ...c } : h)), oe = (n, c) => m((u) => u.map((h) => h.id === n ? { ...h, settings: { ...h.settings, ...c } } : h)), ce = (n, c) => m((u) => u.map((h) => {
    if (h.id !== n) return h;
    const f = { ...h.settings };
    return c !== i.Dropdown && (delete f.source, delete f.urlPrefill, delete f.dependsOn), z.has(c) && !f.options && (f.options = ["Seçenek 1", "Seçenek 2"]), { ...h, type: c, settings: f };
  })), de = (n, c) => m((u) => {
    const h = c ?? M.current;
    if (M.current = null, h == null || n < 0 || n >= u.length || h === n) return u;
    const f = [...u], [B] = f.splice(h, 1);
    return f.splice(n, 0, B), f;
  }), G = (n, c) => {
    const u = je(n, c);
    Object.keys(u).length && (m((h) => h.map((f) => {
      var V, Q;
      const B = (V = f.settings) == null ? void 0 : V.dependsOn, R = (Q = f.settings) == null ? void 0 : Q[L];
      let F = f.settings;
      return B && u[B] && (F = { ...F, dependsOn: u[B] }), R != null && R.blockId && u[R.blockId] && (F = { ...F, [L]: { ...R, blockId: u[R.blockId] } }), u[f.id] || F !== f.settings ? { ...f, id: u[f.id] || f.id, settings: F } : f;
    })), s((h) => u[h] || h));
  }, ue = async () => {
    if (!N.trim()) return I("warn", "Lütfen forma bir başlık verin.");
    K(!0);
    try {
      if (r) {
        await A.put(`/api/app/form/${r}`, { title: N.trim(), description: p.trim() || null, categoryId: C, themeJson: null, blocks: [] });
        const n = await A.put(`/api/app/form/${r}/blocks`, { blocks: J(j) });
        G(j, n == null ? void 0 : n.blocks), I("success", "Form kaydedildi.");
      } else {
        const n = await A.post("/api/app/form", { title: N.trim(), description: p.trim() || null, categoryId: C, themeJson: null, blocks: J(j) });
        G(j, n.blocks), l(n.id), g(n.slug || "");
        const c = new URL(window.location.href);
        c.searchParams.set("id", n.id), window.history.replaceState({}, "", c), I("success", "Form oluşturuldu.");
      }
    } catch (n) {
      I("error", (n == null ? void 0 : n.message) || "Kaydetme başarısız.");
    } finally {
      K(!1);
    }
  };
  return te ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-text-tertiary", children: "Form yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "min-h-[calc(100vh-120px)] bg-surface-sunken pb-24", children: [
    /* @__PURE__ */ e.jsx("div", { className: "sticky top-0 z-20 border-b border-default bg-surface-raised", children: /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets", className: "text-sm font-semibold text-text-secondary hover:text-text-primary", children: "← Formlar" }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary", children: [
          j.length,
          " alan"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("button", { onClick: ue, disabled: T, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken disabled:opacity-50", children: T ? "Kaydediliyor…" : r ? "Kaydet" : "Oluştur" }),
        r && /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${r}`, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken", children: "Yanıtlar" }),
        r && /* @__PURE__ */ e.jsx("button", { onClick: () => y(!0), className: "rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-600", children: "Yayınla" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative mb-4 overflow-hidden rounded-2xl border border-default bg-surface-raised p-6", children: [
        /* @__PURE__ */ e.jsx("span", { className: "absolute inset-x-0 top-0 h-1.5 bg-accent" }),
        /* @__PURE__ */ e.jsx("input", { value: N, onChange: (n) => k(n.target.value), placeholder: "Form başlığı…", className: "w-full border-none bg-transparent p-0 text-3xl font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsx("input", { value: p, onChange: (n) => S(n.target.value), placeholder: "Form açıklaması (opsiyonel)…", className: "mt-2 w-full border-none bg-transparent p-0 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: C || "",
            onChange: (n) => D(n.target.value || null),
            className: "mt-3 rounded-lg border border-default bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-text-secondary focus:border-accent focus:outline-none",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Kategorisiz" }),
              w.map((n) => /* @__PURE__ */ e.jsxs("option", { value: n.id, children: [
                n.icon ? `${n.icon} ` : "",
                n.name
              ] }, n.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: j.map((n, c) => /* @__PURE__ */ e.jsx(
        we,
        {
          block: n,
          index: c,
          selected: n.id === a,
          onSelect: s,
          onPatch: ie,
          onPatchSettings: oe,
          onChangeType: ce,
          onDuplicate: le,
          onRemove: ne,
          onAddAfter: re,
          onMove: de,
          dragRef: M,
          publicSlug: o,
          sources: E,
          parentCandidates: ve(j, c, E),
          conditionCandidates: ye(j, c)
        },
        n.id
      )) }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => se(i.ShortText), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-default py-4 text-sm font-bold text-text-secondary transition hover:border-focus hover:text-accent", children: "+ Soru Ekle" }),
      j.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-center text-sm text-text-tertiary", children: "Başlamak için bir soru ekleyin." })
    ] }),
    d && /* @__PURE__ */ e.jsx(Ee, { formId: r, slug: o, onClose: () => y(!1) })
  ] });
}
function Ee({ formId: t, slug: r, onClose: l }) {
  const [o, g] = x.useState(r || ""), [d, y] = x.useState(""), [N, k] = x.useState(""), [p, S] = x.useState(!1), [C, D] = x.useState(!1), [w, P] = x.useState(!1), [E, v] = x.useState(null), j = async () => {
    P(!0);
    try {
      const s = await A.post(`/api/app/form/${t}/publish`, {
        slug: (o == null ? void 0 : o.trim()) || null,
        publishSettingsJson: JSON.stringify({ startDate: d || null, endDate: N || null, kvkk: p, captcha: C })
      });
      v(s.slug || o), I("success", "Form yayınlandı.");
    } catch (s) {
      I("error", (s == null ? void 0 : s.message) || "Yayınlama başarısız.");
    } finally {
      P(!1);
    }
  }, m = E ? `${window.location.origin}${Z(E)}` : null, a = () => {
    var s;
    m && ((s = navigator.clipboard) == null || s.writeText(m)), I("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: l, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-surface-raised p-6 shadow-xl", onClick: (s) => s.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Formu Yayınla" }),
      /* @__PURE__ */ e.jsx("button", { onClick: l, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    m ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: "rounded-xl bg-positive-50 p-3 text-sm text-positive-700", children: "✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yayın bağlantısı" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: b, value: m, onClick: (s) => s.target.select() }),
          /* @__PURE__ */ e.jsx("button", { onClick: a, className: "shrink-0 rounded-xl border border-default px-3 py-2 text-sm font-medium hover:bg-surface-sunken", children: "Kopyala" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: m, target: "_blank", rel: "noreferrer", className: "rounded-xl bg-accent px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-accent-600", children: "Formu yeni sekmede aç" })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bağlantı adresi (slug)" }),
        /* @__PURE__ */ e.jsx("input", { className: b, value: o, onChange: (s) => g(s.target.value), placeholder: "musteri-memnuniyet" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Başlangıç" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: b, value: d, onChange: (s) => y(s.target.value) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bitiş" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: b, value: N, onChange: (s) => k(s.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(Y, { label: "KVKK onayı iste", checked: p, onChange: S }),
      /* @__PURE__ */ e.jsx(Y, { label: "Bot koruması", checked: C, onChange: D }),
      /* @__PURE__ */ e.jsxs("div", { className: "-mt-2 flex items-start gap-1 text-[11px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx(pe, { text: "Başlangıç/Bitiş tarihi form penceresini sınırlar (dışında form kapalı). KVKK onayı açıkken genel formda zorunlu onay kutusu çıkar ve rıza kaydı tutulur. Bot koruması honeypot + minimum doldurma süresiyle otomatik gönderimleri eler (üçüncü taraf servis kullanılmaz)." }),
        /* @__PURE__ */ e.jsx("span", { children: "Bu ayarlar sunucu tarafında uygulanır" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { onClick: j, disabled: w, className: "mt-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: w ? "Yayınlanıyor…" : "Yayınla" })
    ] })
  ] }) });
}
function Oe(t) {
  if (!t) return { required: !1 };
  try {
    return typeof t == "string" ? JSON.parse(t) : t;
  } catch {
    return { required: !1 };
  }
}
function I(t, r) {
  const l = window.abp;
  l != null && l.notify && (t === "success" || t === "info") ? l.notify[t === "success" ? "success" : "info"](r) : l != null && l.message ? l.message[t === "error" ? "error" : t === "warn" ? "warn" : "info"](r) : console.log(`[${t}] ${r}`);
}
const W = document.getElementById("dynamic-assets-app-root");
W && xe(W).render(/* @__PURE__ */ e.jsx(Pe, {}));
export {
  we as QuestionCard,
  ye as conditionCandidatesFor,
  ve as parentCandidatesFor,
  J as payloadBlocks,
  je as serverIdMap
};
