import { b as Te, j as e, r as p } from "./react-vendor-D57GAUXd.js";
import { a as R } from "./httpClient-DePjXdo1.js";
import { H as Le } from "./Hint-CNW95h3H.js";
import { M as Re } from "./ModalPortal-8QCz-DZi.js";
import { p as re } from "./publicFormLink-CJ_6ABDU.js";
import { O as _, s as ae, C as ze, w as $e } from "./formChoices-CDoZfRj7.js";
import { V as z, O as I, a as Fe, f as Ye } from "./formConditions-DsejDGE1.js";
/* empty css               */
const c = {
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
}, G = /* @__PURE__ */ new Set([c.Select, c.MultiSelect, c.Dropdown]), oe = /* @__PURE__ */ new Set([c.SectionHeader, c.Paragraph]), ye = [
  { group: "Metin & Sayı", items: [
    { type: c.ShortText, label: "Kısa Metin", icon: "✏️" },
    { type: c.LongText, label: "Uzun Metin", icon: "📝" },
    { type: c.Number, label: "Sayısal", icon: "🔢" },
    { type: c.Email, label: "E-Posta", icon: "✉️" },
    { type: c.Phone, label: "Telefon", icon: "📞" }
  ] },
  { group: "Seçim", items: [
    { type: c.Select, label: "Tekli Seçim", icon: "🔘" },
    { type: c.MultiSelect, label: "Çoklu Seçim", icon: "☑️" },
    { type: c.Dropdown, label: "Açılır Liste", icon: "⬇️" }
  ] },
  { group: "Tarih & Zaman", items: [
    { type: c.DatePicker, label: "Tarih", icon: "📅" },
    { type: c.TimePicker, label: "Saat", icon: "🕐" }
  ] },
  { group: "Özel", items: [
    { type: c.FilePicker, label: "Dosya Yükleme", icon: "📎" },
    { type: c.Rating, label: "Derecelendirme", icon: "⭐" },
    { type: c.Nps, label: "NPS (0-10)", icon: "📊" },
    { type: c.Signature, label: "İmza", icon: "✍️" },
    { type: c.Address, label: "Adres", icon: "📍" }
  ] },
  { group: "Düzen", items: [
    { type: c.SectionHeader, label: "Bölüm Başlığı", icon: "🏷️" },
    { type: c.Paragraph, label: "Açıklama", icon: "💬" }
  ] }
], ce = Object.fromEntries(ye.flatMap((t) => t.items.map((a) => [a.type, a.label]))), le = () => Math.random().toString(36).slice(2, 10), pe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, me = (t) => t.map((a, n) => ({
  id: pe.test(a.id) ? a.id : null,
  clientId: pe.test(a.id) ? null : a.id,
  type: a.type,
  order: n + 1,
  content: a.content || ce[a.type] || "Soru",
  settings: JSON.stringify(a.settings || {})
})), ve = (t, a) => t.slice(0, a).filter((n) => !oe.has(n.type)), Me = (t, a, n) => {
  const i = (n || []).find((d) => {
    var o, f;
    return d.key === ((f = (o = t[a]) == null ? void 0 : o.settings) == null ? void 0 : f.source);
  });
  return i != null && i.dependsOnSourceKey ? t.slice(0, a).filter((d) => {
    var o;
    return d.type === c.Dropdown && ((o = d.settings) == null ? void 0 : o.source) === i.dependsOnSourceKey;
  }) : [];
}, fe = (t, a) => {
  const n = new Map((a || []).map((i) => [i.order, i.id]));
  return Object.fromEntries(t.map((i, d) => [i.id, n.get(d + 1)]).filter(([i, d]) => d && i !== d));
}, se = (t, a) => t.map((n) => {
  var f, g;
  const i = (f = n.settings) == null ? void 0 : f.dependsOn, d = (g = n.settings) == null ? void 0 : g[z];
  let o = n.settings;
  return i && a[i] && (o = { ...o, dependsOn: a[i] }), d != null && d.blockId && a[d.blockId] && (o = { ...o, [z]: { ...d, blockId: a[d.blockId] } }), a[n.id] || o !== n.settings ? { ...n, id: a[n.id] || n.id, settings: o } : n;
}), he = (t) => t.filter((a, n) => {
  var d;
  const i = (d = a.settings) == null ? void 0 : d[z];
  return !!(i != null && i.blockId) && !ve(t, n).some((o) => o.id === i.blockId);
}), Ue = (t, a) => {
  const n = new Set(a.map((d) => d.id)), i = t.filter((d) => !n.has(d.id));
  return { ids: i.map((d) => d.id), answerable: i.filter((d) => !oe.has(d.type)).length };
}, ne = (t) => (t || []).map((a) => ({ id: a.id, type: a.type })), U = (t, a, n, i) => JSON.stringify([t, a, n, i]);
function be(t) {
  const a = { id: le(), type: t, content: ce[t] || "Soru", settings: { required: !1 } };
  return G.has(t) && (a.settings.options = ["Seçenek 1", "Seçenek 2"]), t === c.SectionHeader && (a.content = "Bölüm Başlığı"), t === c.Paragraph && (a.content = "Açıklama metni…"), a;
}
const y = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft", Q = ({ checked: t, onChange: a, label: n }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
  /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium text-text-secondary", children: n }),
  /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: (i) => {
        i.stopPropagation(), a(!t);
      },
      className: `relative h-6 w-11 rounded-full transition-colors ${t ? "bg-accent" : "bg-neutral-200"}`,
      "aria-pressed": t,
      children: /* @__PURE__ */ e.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${t ? "left-[22px]" : "left-0.5"}` })
    }
  )
] });
function He({ value: t, onChange: a }) {
  return /* @__PURE__ */ e.jsx(
    "select",
    {
      value: t,
      onClick: (n) => n.stopPropagation(),
      onChange: (n) => a(Number(n.target.value)),
      className: "shrink-0 rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm font-medium text-text-primary focus:border-focus focus:outline-none",
      children: ye.map((n) => /* @__PURE__ */ e.jsx("optgroup", { label: n.group, children: n.items.map((i) => /* @__PURE__ */ e.jsxs("option", { value: i.type, children: [
        i.icon,
        " ",
        i.label
      ] }, i.type)) }, n.group))
    }
  );
}
function Je({ block: t }) {
  const a = t.settings || {};
  switch (t.type) {
    case c.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: y, placeholder: a.placeholder || "Uzun yanıt…" });
    case c.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: y, placeholder: a.placeholder || "0" });
    case c.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: y, placeholder: a.placeholder || "ornek@firma.com" });
    case c.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: y, placeholder: a.placeholder || "+90 5xx xxx xx xx" });
    case c.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: y });
    case c.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: y });
    case c.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-6 text-center text-sm text-text-tertiary", children: "📎 Dosya seç / sürükle" });
    case c.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: y, children: (a.options || []).map((n, i) => /* @__PURE__ */ e.jsx("option", { children: n }, i)) });
    case c.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-warning", children: "★★★★★" });
    case c.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (n, i) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-default text-xs text-text-secondary", children: i }, i)) });
    case c.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-8 text-center text-sm text-text-tertiary", children: "✍️ İmza alanı" });
    case c.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["Adres satırı", "İlçe", "İl", "Posta kodu"].map((n) => /* @__PURE__ */ e.jsx("input", { disabled: !0, className: y, placeholder: n }, n)) });
    case c.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "▦ Tablo ızgarası" });
    case c.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: y, placeholder: a.placeholder || "Kısa yanıt…" });
  }
}
function _e({ block: t, settings: a, onPatchSettings: n, publicSlug: i, sources: d, parentCandidates: o }) {
  var k;
  const f = !!a.source, g = d.find((s) => s.key === a.source) || null, w = !!(g != null && g.dependsOnSourceKey), [h, C] = p.useState(null), [S, T] = p.useState("");
  p.useEffect(() => {
    if (!f || w) {
      C(null);
      return;
    }
    let s = !1;
    return C(null), R.get(`/api/app/form/choices?source=${encodeURIComponent(a.source)}`).then((l) => {
      s || C(l || []);
    }).catch(() => {
      s || C([]);
    }), () => {
      s = !0;
    };
  }, [f, w, a.source]);
  const P = (s) => ({ source: s, urlPrefill: s === _ ? !0 : void 0, dependsOn: void 0 }), D = d.some((s) => s.key === _) || d.length === 0 ? _ : d[0].key, B = (s) => n(t.id, s ? P(D) : { source: void 0, urlPrefill: void 0, dependsOn: void 0 }), j = (s) => n(t.id, P(s)), N = () => {
    var s;
    (s = navigator.clipboard) == null || s.writeText(`${window.location.origin}${$e(re(i), S)}`), L("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "mt-4 rounded-xl border border-subtle bg-surface-sunken p-3", onClick: (s) => s.stopPropagation(), children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-2 text-[11px] font-semibold uppercase text-text-secondary", children: "Seçenek kaynağı" }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
      /* @__PURE__ */ e.jsx("input", { type: "radio", name: `source-${t.id}`, checked: !f, onChange: () => B(!1), className: "h-4 w-4 text-accent" }),
      "Sabit seçenekler, elle yazılır"
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "mt-1 flex items-center gap-2 text-sm text-text-primary", children: [
      /* @__PURE__ */ e.jsx("input", { type: "radio", name: `source-${t.id}`, checked: f, onChange: () => B(!0), className: "h-4 w-4 text-accent" }),
      "Veri kaynağından, canlı liste"
    ] }),
    f && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 border-t border-subtle pt-3", children: [
      /* @__PURE__ */ e.jsxs("select", { className: y, value: a.source, onChange: (s) => j(s.target.value), "aria-label": "Veri kaynağı", children: [
        !g && /* @__PURE__ */ e.jsx("option", { value: a.source, children: ae(a.source) }),
        d.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.key, children: ae(s.key) }, s.key))
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-xs text-text-secondary", children: ((k = ze[a.source]) == null ? void 0 : k.hint) || "Seçenekler her form açılışında bu kaynaktan tazelenir." }),
      w && /* @__PURE__ */ e.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold text-text-secondary", children: "Hangi alana bağlı?" }),
        o.length === 0 ? /* @__PURE__ */ e.jsxs("p", { className: "rounded-lg bg-warning-subtle px-2.5 py-2 text-xs text-warning", children: [
          "Bu liste bir üst alana bağlı çalışır. Önce yukarıya “",
          ae(g.dependsOnSourceKey),
          "” kaynağına bağlı bir açılır liste ekleyin."
        ] }) : /* @__PURE__ */ e.jsxs("select", { className: y, value: a.dependsOn || "", onChange: (s) => n(t.id, { dependsOn: s.target.value || void 0 }), "aria-label": "Üst alan", children: [
          /* @__PURE__ */ e.jsx("option", { value: "", children: "Üst alanı seçin…" }),
          o.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: s.content || "Adsız alan" }, s.id))
        ] })
      ] }),
      !w && (h == null ? /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-xs text-text-tertiary", children: "Liste yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "mt-2", children: [
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-secondary", children: [
          "Şu an ",
          h.length,
          " kayıt listeleniyor."
        ] }),
        h.length > 0 && /* @__PURE__ */ e.jsx("ul", { className: "mt-2 flex flex-col gap-1 text-sm text-text-primary", children: h.slice(0, 3).map((s) => /* @__PURE__ */ e.jsx("li", { className: "truncate", children: s.label }, s.value)) }),
        h.length > 3 && /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-xs text-text-tertiary", children: [
          "ve ",
          h.length - 3,
          " kayıt daha"
        ] })
      ] })),
      a.source === _ && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("div", { className: "mt-3", children: /* @__PURE__ */ e.jsx(Q, { label: "Bağlantıdaki çağrıyı ön seç", checked: !!a.urlPrefill, onChange: (s) => n(t.id, { urlPrefill: s }) }) }),
        a.urlPrefill && i && (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs("select", { className: `${y} min-w-0 flex-1`, value: S, onChange: (s) => T(s.target.value), "aria-label": "Çağrıya özel bağlantı", children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "Çağrıya özel bağlantı için seçin…" }),
            h.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.value, children: s.label }, s.value))
          ] }),
          /* @__PURE__ */ e.jsx("button", { type: "button", disabled: !S, onClick: N, className: "rounded-lg border border-default bg-surface-raised px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-sunken disabled:opacity-50", children: "Bağlantıyı kopyala" })
        ] })
      ] })
    ] })
  ] });
}
function Ve({ block: t, settings: a, onPatchSettings: n, candidates: i, sources: d }) {
  const o = a[z] || null, f = i.find((l) => l.id === (o == null ? void 0 : o.blockId)) || null, g = (f == null ? void 0 : f.settings) || {}, w = (f == null ? void 0 : f.type) === c.Dropdown ? g.source : null, h = d.find((l) => l.key === w) || null, C = !!(h != null && h.dependsOnSourceKey), S = (h == null ? void 0 : h.flags) || [], [T, P] = p.useState(null);
  p.useEffect(() => {
    if (!w || C) return P(null);
    let l = !1;
    return R.get(`/api/app/form/choices?source=${encodeURIComponent(w)}`).then((E) => {
      l || P(E || []);
    }).catch(() => {
      l || P([]);
    }), () => {
      l = !0;
    };
  }, [w, C]);
  const D = (l) => n(t.id, { [z]: { ...o, ...l } }), B = () => {
    const l = i[0];
    n(t.id, { [z]: { blockId: l.id, op: I.ANSWERED, value: void 0 } });
  }, j = (l) => n(t.id, { [z]: { blockId: l, op: I.ANSWERED, value: void 0 } }), N = (l) => D({ op: l, value: l === I.FLAG ? S[0] : void 0 }), k = w ? (T || []).map((l) => ({ value: l.value, label: l.label })) : (g.options || []).map((l) => ({ value: l, label: l })), s = [I.ANSWERED, I.EQ, I.NEQ, ...S.length ? [I.FLAG] : []].filter((l) => !(C && (l === I.EQ || l === I.NEQ)));
  return /* @__PURE__ */ e.jsxs("div", { className: "mt-3 rounded-xl border border-subtle bg-surface-sunken p-3", onClick: (l) => l.stopPropagation(), children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-2 text-[11px] font-semibold uppercase text-text-secondary", children: "Görünürlük" }),
    i.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-secondary", children: "Koşul için yukarıda bir alan gerekir; bu alan her zaman görünür." }) : o ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
      !f && /* @__PURE__ */ e.jsx("p", { className: "rounded-lg bg-warning-subtle px-2.5 py-2 text-xs text-warning", children: "Koşuldaki alan artık yukarıda değil. Yeni bir alan seçin ya da koşulu kaldırın — yoksa bu alan formda hiç görünmeyebilir." }),
      /* @__PURE__ */ e.jsxs("select", { className: y, value: o.blockId, onChange: (l) => j(l.target.value), "aria-label": "Koşul alanı", children: [
        !f && /* @__PURE__ */ e.jsx("option", { value: o.blockId, children: "Kaldırılmış alan" }),
        i.map((l) => /* @__PURE__ */ e.jsx("option", { value: l.id, children: l.content || "Adsız alan" }, l.id))
      ] }),
      /* @__PURE__ */ e.jsx("select", { className: y, value: o.op, onChange: (l) => N(l.target.value), "aria-label": "Koşul karşılaştırması", children: s.map((l) => /* @__PURE__ */ e.jsx("option", { value: l, children: Fe[l] }, l)) }),
      o.op === I.FLAG && /* @__PURE__ */ e.jsx("select", { className: y, value: o.value || S[0] || "", onChange: (l) => D({ value: l.target.value }), "aria-label": "Koşul şartı", children: S.map((l) => /* @__PURE__ */ e.jsx("option", { value: l, children: Ye(l) }, l)) }),
      (o.op === I.EQ || o.op === I.NEQ) && (k.length > 0 ? /* @__PURE__ */ e.jsxs("select", { className: y, value: o.value || "", onChange: (l) => D({ value: l.target.value }), "aria-label": "Koşul cevabı", children: [
        /* @__PURE__ */ e.jsx("option", { value: "", children: "Cevabı seçin…" }),
        k.map((l) => /* @__PURE__ */ e.jsx("option", { value: l.value, children: l.label }, l.value))
      ] }) : /* @__PURE__ */ e.jsx("input", { className: y, value: o.value || "", onChange: (l) => D({ value: l.target.value }), placeholder: "Beklenen cevap…", "aria-label": "Koşul cevabı" })),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => n(t.id, { [z]: void 0 }),
          className: "self-start text-xs font-semibold text-text-secondary underline hover:text-text-primary",
          children: "Koşulu kaldır"
        }
      )
    ] }) : /* @__PURE__ */ e.jsx("button", { type: "button", onClick: B, className: "rounded-lg border border-default bg-surface-raised px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-sunken", children: "+ Koşul ekle" })
  ] });
}
function Ge({ block: t, index: a, selected: n, onSelect: i, onPatch: d, onPatchSettings: o, onChangeType: f, onDuplicate: g, onRemove: w, onAddAfter: h, onMove: C, dragRef: S, publicSlug: T, sources: P = [], parentCandidates: D = [], conditionCandidates: B = [] }) {
  const j = t.settings || {}, N = oe.has(t.type), k = p.useRef(null);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: k,
      onDragOver: (s) => s.preventDefault(),
      onDrop: () => C(a),
      onClick: () => i(t.id),
      className: `group relative rounded-2xl border bg-surface-raised p-5 transition ${n ? "border-focus shadow-md ring-1 ring-accent-soft" : "border-default hover:border-strong"}`,
      children: [
        n && /* @__PURE__ */ e.jsx("span", { className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-accent" }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            draggable: !0,
            onDragStart: (s) => {
              S.current = a, k.current && s.dataTransfer.setDragImage(k.current, 24, 24);
            },
            title: "Sürükle",
            className: `absolute -top-2 left-1/2 -translate-x-1/2 cursor-grab px-4 text-text-tertiary transition-opacity active:cursor-grabbing ${n ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`,
            children: "⠿"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3", children: [
          N ? /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (s) => s.stopPropagation(),
              onChange: (s) => d(t.id, { content: s.target.value }),
              placeholder: t.type === c.SectionHeader ? "Bölüm başlığı" : "Açıklama metni",
              className: `flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${t.type === c.SectionHeader ? "text-xl font-bold text-text-primary" : "text-sm text-text-secondary"}`
            }
          ) : /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (s) => s.stopPropagation(),
              onChange: (s) => d(t.id, { content: s.target.value }),
              placeholder: "Soru metni…",
              className: "flex-1 border-b border-transparent bg-transparent p-0 pb-1 text-base font-semibold text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-0"
            }
          ),
          n && /* @__PURE__ */ e.jsx(He, { value: t.type, onChange: (s) => f(t.id, s) }),
          !n && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary", children: ce[t.type] }),
          j.source && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-primary-subtle px-2.5 py-1 text-[11px] font-semibold text-primary", children: "⚡ Canlı liste" })
        ] }),
        n && t.type === c.Dropdown && /* @__PURE__ */ e.jsx(_e, { block: t, settings: j, onPatchSettings: o, publicSlug: T, sources: P, parentCandidates: D }),
        n && /* @__PURE__ */ e.jsx(Ve, { block: t, settings: j, onPatchSettings: o, candidates: B, sources: P }),
        n && G.has(t.type) && !j.source && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [
          (j.options || []).map((s, l) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", onClick: (E) => E.stopPropagation(), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: t.type === c.MultiSelect ? "☐" : "○" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: "flex-1 border-b border-subtle bg-transparent px-1 py-1 text-sm focus:border-focus focus:outline-none",
                value: s,
                onChange: (E) => {
                  const K = [...j.options];
                  K[l] = E.target.value, o(t.id, { options: K });
                }
              }
            ),
            /* @__PURE__ */ e.jsx("button", { className: "rounded p-1 text-text-tertiary hover:text-negative-500", onClick: () => o(t.id, { options: j.options.filter((E, K) => K !== l) }), children: "✕" })
          ] }, l)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "self-start text-sm font-medium text-accent hover:text-accent-600",
              onClick: (s) => {
                s.stopPropagation(), o(t.id, { options: [...j.options || [], `Seçenek ${(j.options || []).length + 1}`] });
              },
              children: "+ Seçenek ekle"
            }
          )
        ] }),
        !N && !G.has(t.type) && /* @__PURE__ */ e.jsx("div", { className: "mt-4", onClick: (s) => s.stopPropagation(), children: /* @__PURE__ */ e.jsx(Je, { block: t }) }),
        n && !N && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 border-t border-subtle pt-4 sm:grid-cols-2", onClick: (s) => s.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Placeholder" }),
            /* @__PURE__ */ e.jsx("input", { className: y, value: j.placeholder || "", onChange: (s) => o(t.id, { placeholder: s.target.value }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yardım Metni" }),
            /* @__PURE__ */ e.jsx("input", { className: y, value: j.helpText || "", onChange: (s) => o(t.id, { helpText: s.target.value }) })
          ] }),
          (t.type === c.Number || t.type === c.Rating) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Min" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: y, value: j.min ?? "", onChange: (s) => o(t.id, { min: s.target.value === "" ? null : Number(s.target.value) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Max" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: y, value: j.max ?? "", onChange: (s) => o(t.id, { max: s.target.value === "" ? null : Number(s.target.value) }) })
            ] })
          ] })
        ] }),
        n && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 border-t border-subtle pt-3", onClick: (s) => s.stopPropagation(), children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => C(a - 1, a), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Yukarı", children: "▲" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => C(a + 1, a), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Aşağı", children: "▼" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => g(t.id), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Kopyala", children: "⧉" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => w(t.id), className: "rounded-lg p-2 text-negative-500 hover:bg-negative-50", title: "Sil", children: "🗑" }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          !N && /* @__PURE__ */ e.jsx(Q, { label: "Zorunlu", checked: !!j.required, onChange: (s) => o(t.id, { required: s }) }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => h(t.id), className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600", children: "+ Soru" })
        ] })
      ]
    }
  );
}
function Qe() {
  const t = p.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [a, n] = p.useState(t), [i, d] = p.useState(""), [o, f] = p.useState(!1), [g, w] = p.useState(""), [h, C] = p.useState(""), [S, T] = p.useState(null), [P, D] = p.useState([]), [B, j] = p.useState([]), [N, k] = p.useState([]), [s, l] = p.useState(null), [E, K] = p.useState(!1), [F, $] = p.useState(!!t), [Y, v] = p.useState(null), [O, ke] = p.useState(0), H = p.useRef([]), [de, J] = p.useState(0), [q, W] = p.useState(0), [Ne, Z] = p.useState(null), [Se, X] = p.useState(() => U("", "", null, [])), ee = p.useRef(null);
  p.useEffect(() => {
    R.get("/api/app/form-category?MaxResultCount=100").then((r) => D(r.items || [])).catch(() => {
    });
  }, []), p.useEffect(() => {
    R.get("/api/app/form/choice-sources").then((r) => j(r || [])).catch(() => j([]));
  }, []), p.useEffect(() => {
    t && (async () => {
      try {
        const r = await R.get(`/api/app/form/${t}`), u = (r.blocks || []).slice().sort((m, b) => m.order - b.order).map((m) => ({
          id: m.id || le(),
          type: m.type,
          content: m.content,
          settings: je(m.settings)
        }));
        w(r.title || ""), d(r.slug || ""), C(r.description || ""), T(r.categoryId || null), k(u), H.current = ne(r.blocks), J(r.responseCount ?? 0), W(r.status ?? 0), Z(r.publishSettingsJson ?? null), X(U(r.title || "", r.description || "", r.categoryId || null, u)), v(null);
      } catch (r) {
        v(V(r, "Bağlantınızı kontrol edip tekrar deneyin."));
      } finally {
        $(!1);
      }
    })();
  }, [t, O]);
  const we = (r = c.ShortText) => {
    const u = be(r);
    k((m) => [...m, u]), l(u.id);
  }, Ce = (r) => {
    const u = be(c.ShortText);
    k((m) => {
      const b = m.findIndex((A) => A.id === r), x = [...m];
      return x.splice(b + 1, 0, u), x;
    }), l(u.id);
  }, Pe = (r) => k((u) => u.filter((m) => m.id !== r)), Ee = (r) => k((u) => {
    const m = u.findIndex((A) => A.id === r);
    if (m < 0) return u;
    const b = { ...u[m], id: le(), settings: { ...u[m].settings } }, x = [...u];
    return x.splice(m + 1, 0, b), x;
  }), Oe = (r, u) => k((m) => m.map((b) => b.id === r ? { ...b, ...u } : b)), De = (r, u) => k((m) => m.map((b) => b.id === r ? { ...b, settings: { ...b.settings, ...u } } : b)), Be = (r, u) => k((m) => m.map((b) => {
    if (b.id !== r) return b;
    const x = { ...b.settings };
    return u !== c.Dropdown && (delete x.source, delete x.urlPrefill, delete x.dependsOn), G.has(u) && !x.options && (x.options = ["Seçenek 1", "Seçenek 2"]), { ...b, type: u, settings: x };
  })), Ie = (r, u) => k((m) => {
    const b = u ?? ee.current;
    if (ee.current = null, b == null || r < 0 || r >= m.length || b === r) return m;
    const x = [...m], [A] = x.splice(b, 1);
    return x.splice(r, 0, A), x;
  }), ue = (r) => {
    Object.keys(r).length && (k((u) => se(u, r)), l((u) => r[u] || u));
  }, xe = async () => {
    if (!g.trim())
      return L("warn", "Lütfen forma bir başlık verin."), !1;
    const r = { title: g.trim(), description: h.trim() || null, categoryId: S, themeJson: null, blocks: [] }, u = N;
    if (!a) {
      K(!0);
      try {
        const x = await R.post("/api/app/form", { ...r, blocks: me(u) }), A = fe(u, x.blocks);
        H.current = ne(x.blocks), ue(A), n(x.id), d(x.slug || ""), W(x.status ?? 0), J(x.responseCount ?? 0), Z(x.publishSettingsJson ?? null), X(U(g, h, S, se(u, A)));
        const M = new URL(window.location.href);
        return M.searchParams.set("id", x.id), window.history.replaceState({}, "", M), L("success", "Form oluşturuldu."), !0;
      } catch (x) {
        return L("error", V(x, "Kaydetme başarısız.")), !1;
      } finally {
        K(!1);
      }
    }
    const m = q === 1 ? he(u) : [];
    if (m.length && (l(m[0].id), !await ie(`"${m[0].content || "Adsız alan"}" alanının görünürlük koşulu formda olmayan (ya da aşağıdaki) bir alana bağlı. Form yayında: kaydettiğiniz anda doldurucular bu hâli görür. Yine de kaydedilsin mi?`)))
      return !1;
    const b = Ue(H.current, u);
    if (b.answerable > 0 && de > 0 && !await ie(`${b.answerable} soru silinecek. Bu sorulara verilmiş yanıtlar yanıt ekranında ve dışa aktarımda sorusuz kalır. Devam edilsin mi?`))
      return !1;
    K(!0);
    try {
      const x = await R.put(`/api/app/form/${a}/blocks`, { blocks: me(u), removedBlockIds: b.ids }), A = fe(u, x == null ? void 0 : x.blocks);
      H.current = ne(x == null ? void 0 : x.blocks), ue(A);
      const M = await R.put(`/api/app/form/${a}`, r);
      return J((M == null ? void 0 : M.responseCount) ?? (x == null ? void 0 : x.responseCount) ?? 0), X(U(g, h, S, se(u, A))), L("success", "Form kaydedildi."), !0;
    } catch (x) {
      return L("error", V(x, "Kaydetme başarısız.")), !1;
    } finally {
      K(!1);
    }
  }, te = !F && !Y && U(g, h, S, N) !== Se;
  p.useEffect(() => {
    if (!te) return;
    const r = (u) => {
      u.preventDefault(), u.returnValue = "";
    };
    return window.addEventListener("beforeunload", r), () => window.removeEventListener("beforeunload", r);
  }, [te]);
  const Ke = async () => {
    const r = he(N);
    if (r.length) {
      l(r[0].id), L("warn", `"${r[0].content || "Adsız alan"}" alanının görünürlük koşulu formda olmayan (ya da aşağıdaki) bir alana bağlı. Yayınlamadan önce koşulu düzeltin veya kaldırın.`);
      return;
    }
    te && !await xe() || f(!0);
  }, Ae = (r) => {
    d(r.slug || i), Z(r.publishSettingsJson ?? null), W(r.status ?? q), J(r.responseCount ?? de);
  };
  return F ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-text-tertiary", children: "Form yükleniyor…" }) : Y ? /* @__PURE__ */ e.jsxs("div", { className: "flex h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center", children: [
    /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets", className: "text-sm font-semibold text-text-secondary hover:text-text-primary", children: "← Formlar" }),
    /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Form yüklenemedi" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary", children: Y }),
    /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          v(null), $(!0), ke((r) => r + 1);
        },
        className: "rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-600",
        children: "Tekrar dene"
      }
    )
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "min-h-[calc(100vh-120px)] bg-surface-sunken pb-24", children: [
    /* @__PURE__ */ e.jsx("div", { className: "sticky top-[var(--apya-header-h,0px)] z-20 border-b border-default bg-surface-raised", children: /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets", className: "text-sm font-semibold text-text-secondary hover:text-text-primary", children: "← Formlar" }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary", children: [
          N.length,
          " alan"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("button", { onClick: xe, disabled: E, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken disabled:opacity-50", children: E ? "Kaydediliyor…" : a ? "Kaydet" : "Oluştur" }),
        a && /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${a}`, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken", children: "Yanıtlar" }),
        a && /* @__PURE__ */ e.jsx("button", { onClick: Ke, disabled: E, className: "rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-600 disabled:opacity-50", children: "Yayınla" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative mb-4 overflow-hidden rounded-2xl border border-default bg-surface-raised p-6", children: [
        /* @__PURE__ */ e.jsx("span", { className: "absolute inset-x-0 top-0 h-1.5 bg-accent" }),
        /* @__PURE__ */ e.jsx("input", { value: g, onChange: (r) => w(r.target.value), placeholder: "Form başlığı…", className: "w-full border-none bg-transparent p-0 text-3xl font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsx("input", { value: h, onChange: (r) => C(r.target.value), placeholder: "Form açıklaması (opsiyonel)…", className: "mt-2 w-full border-none bg-transparent p-0 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: S || "",
            onChange: (r) => T(r.target.value || null),
            className: "mt-3 rounded-lg border border-default bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-text-secondary focus:border-accent focus:outline-none",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Kategorisiz" }),
              P.map((r) => /* @__PURE__ */ e.jsxs("option", { value: r.id, children: [
                r.icon ? `${r.icon} ` : "",
                r.name
              ] }, r.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: N.map((r, u) => /* @__PURE__ */ e.jsx(
        Ge,
        {
          block: r,
          index: u,
          selected: r.id === s,
          onSelect: l,
          onPatch: Oe,
          onPatchSettings: De,
          onChangeType: Be,
          onDuplicate: Ee,
          onRemove: Pe,
          onAddAfter: Ce,
          onMove: Ie,
          dragRef: ee,
          publicSlug: i,
          sources: B,
          parentCandidates: Me(N, u, B),
          conditionCandidates: ve(N, u)
        },
        r.id
      )) }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => we(c.ShortText), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-default py-4 text-sm font-bold text-text-secondary transition hover:border-focus hover:text-accent", children: "+ Soru Ekle" }),
      N.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-center text-sm text-text-tertiary", children: "Başlamak için bir soru ekleyin." })
    ] }),
    o && /* @__PURE__ */ e.jsx(
      qe,
      {
        formId: a,
        slug: i,
        settingsJson: Ne,
        published: q === 1,
        onPublished: Ae,
        onClose: () => f(!1)
      }
    )
  ] });
}
function qe({ formId: t, slug: a, settingsJson: n, published: i, onPublished: d, onClose: o }) {
  const [f] = p.useState(() => je(n) || {}), [g, w] = p.useState(a || ""), [h, C] = p.useState(String(f.startDate || "").slice(0, 10)), [S, T] = p.useState(String(f.endDate || "").slice(0, 10)), [P, D] = p.useState(!!f.kvkk), [B, j] = p.useState(!!f.captcha), [N, k] = p.useState(!1), [s, l] = p.useState(null), E = p.useRef(!1);
  p.useEffect(() => {
    const v = (O) => {
      O.key === "Escape" && !E.current && !N && (o == null || o());
    };
    return document.addEventListener("keydown", v), () => document.removeEventListener("keydown", v);
  }, [o, N]);
  const K = async () => {
    const v = (g == null ? void 0 : g.trim()) || null;
    if (i && v && v !== a) {
      E.current = !0;
      const O = await ie("Bağlantı adresi değişecek. Daha önce paylaşılan bağlantı artık açılmaz. Devam edilsin mi?");
      if (E.current = !1, !O) return;
    }
    k(!0);
    try {
      const O = await R.post(`/api/app/form/${t}/publish`, {
        slug: v,
        publishSettingsJson: JSON.stringify({ startDate: h || null, endDate: S || null, kvkk: P, captcha: B })
      });
      d == null || d(O), l(O.slug || g), L("success", "Form yayınlandı.");
    } catch (O) {
      L("error", V(O, "Yayınlama başarısız."));
    } finally {
      k(!1);
    }
  }, F = i && a ? `${window.location.origin}${re(a)}` : null, $ = s ? `${window.location.origin}${re(s)}` : null, Y = (v) => {
    var O;
    v && ((O = navigator.clipboard) == null || O.writeText(v)), L("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx(Re, { children: /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-modal flex items-center justify-center bg-surface-overlay p-4", onClick: o, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-surface-raised p-6 shadow-xl",
      onClick: (v) => v.stopPropagation(),
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "publish-modal-title",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ e.jsx("h2", { id: "publish-modal-title", className: "text-lg font-bold text-text-primary", children: "Formu Yayınla" }),
          /* @__PURE__ */ e.jsx("button", { onClick: o, "aria-label": "Kapat", className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
        ] }),
        $ ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ e.jsx("div", { className: "rounded-xl bg-positive-50 p-3 text-sm text-positive-700", children: "✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz." }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yayın bağlantısı" }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: y, value: $, onClick: (v) => v.target.select() }),
              /* @__PURE__ */ e.jsx("button", { onClick: () => Y($), className: "shrink-0 rounded-xl border border-default px-3 py-2 text-sm font-medium hover:bg-surface-sunken", children: "Kopyala" })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("a", { href: $, target: "_blank", rel: "noreferrer", className: "rounded-xl bg-accent px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-accent-600", children: "Formu yeni sekmede aç" })
        ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
          F && /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yayın bağlantısı" }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: y, value: F, onClick: (v) => v.target.select(), "aria-label": "Yayın bağlantısı" }),
              /* @__PURE__ */ e.jsx("button", { onClick: () => Y(F), className: "shrink-0 rounded-xl border border-default px-3 py-2 text-sm font-medium hover:bg-surface-sunken", children: "Kopyala" })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bağlantı adresi (slug)" }),
            /* @__PURE__ */ e.jsx("input", { className: y, value: g, onChange: (v) => w(v.target.value), placeholder: "musteri-memnuniyet" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Başlangıç" }),
              /* @__PURE__ */ e.jsx("input", { type: "date", className: y, value: h, onChange: (v) => C(v.target.value) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bitiş" }),
              /* @__PURE__ */ e.jsx("input", { type: "date", className: y, value: S, onChange: (v) => T(v.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx(Q, { label: "KVKK onayı iste", checked: P, onChange: D }),
          /* @__PURE__ */ e.jsx(Q, { label: "Bot koruması", checked: B, onChange: j }),
          /* @__PURE__ */ e.jsxs("div", { className: "-mt-2 flex items-start gap-1 text-[11px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx(Le, { text: "Başlangıç/Bitiş tarihi form penceresini sınırlar (dışında form kapalı). KVKK onayı açıkken genel formda zorunlu onay kutusu çıkar ve rıza kaydı tutulur. Bot koruması honeypot + minimum doldurma süresiyle otomatik gönderimleri eler (üçüncü taraf servis kullanılmaz)." }),
            /* @__PURE__ */ e.jsx("span", { children: "Bu ayarlar sunucu tarafında uygulanır" })
          ] }),
          /* @__PURE__ */ e.jsx("button", { onClick: K, disabled: N, className: "mt-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: N ? i ? "Kaydediliyor…" : "Yayınlanıyor…" : i ? "Ayarları güncelle" : "Yayınla" })
        ] })
      ]
    }
  ) }) });
}
function je(t) {
  if (!t) return { required: !1 };
  try {
    return typeof t == "string" ? JSON.parse(t) : t;
  } catch {
    return { required: !1 };
  }
}
function L(t, a) {
  const n = window.abp;
  n != null && n.notify && (t === "success" || t === "info") ? n.notify[t === "success" ? "success" : "info"](a) : n != null && n.message ? n.message[t === "error" ? "error" : t === "warn" ? "warn" : "info"](a) : console.log(`[${t}] ${a}`);
}
function V(t, a) {
  return t != null && t.status && t.message || a;
}
function ie(t) {
  var n;
  const a = window.abp;
  return (n = a == null ? void 0 : a.message) != null && n.confirm ? new Promise((i) => a.message.confirm(t, "Onay", (d) => i(!!d))) : Promise.resolve(window.confirm(t));
}
const ge = document.getElementById("dynamic-assets-app-root");
ge && Te(ge).render(/* @__PURE__ */ e.jsx(Qe, {}));
export {
  Qe as FormBuilder,
  qe as PublishModal,
  Ge as QuestionCard,
  Ue as blockRemovals,
  he as brokenConditionBlocks,
  ve as conditionCandidatesFor,
  Me as parentCandidatesFor,
  me as payloadBlocks,
  fe as serverIdMap,
  se as withServerIds
};
