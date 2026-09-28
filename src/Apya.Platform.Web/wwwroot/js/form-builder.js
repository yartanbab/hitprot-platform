import { b as Ke, j as e, r as p } from "./react-vendor-D57GAUXd.js";
import { a as R } from "./httpClient-DePjXdo1.js";
import { H as Le } from "./Hint-CNW95h3H.js";
import { p as ne } from "./publicFormLink-CJ_6ABDU.js";
import { O as J, s as te, C as Re, w as ze } from "./formChoices-DAx-kYeM.js";
import { V as z, O as I, a as $e, f as Fe } from "./formConditions-DsejDGE1.js";
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
}, V = /* @__PURE__ */ new Set([i.Select, i.MultiSelect, i.Dropdown]), oe = /* @__PURE__ */ new Set([i.SectionHeader, i.Paragraph]), be = [
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
], ie = Object.fromEntries(be.flatMap((t) => t.items.map((a) => [a.type, a.label]))), re = () => Math.random().toString(36).slice(2, 10), xe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, pe = (t) => t.map((a, n) => ({
  id: xe.test(a.id) ? a.id : null,
  clientId: xe.test(a.id) ? null : a.id,
  type: a.type,
  order: n + 1,
  content: a.content || ie[a.type] || "Soru",
  settings: JSON.stringify(a.settings || {})
})), ye = (t, a) => t.slice(0, a).filter((n) => !oe.has(n.type)), Ye = (t, a, n) => {
  const o = (n || []).find((c) => {
    var d, f;
    return c.key === ((f = (d = t[a]) == null ? void 0 : d.settings) == null ? void 0 : f.source);
  });
  return o != null && o.dependsOnSourceKey ? t.slice(0, a).filter((c) => {
    var d;
    return c.type === i.Dropdown && ((d = c.settings) == null ? void 0 : d.source) === o.dependsOnSourceKey;
  }) : [];
}, me = (t, a) => {
  const n = new Map((a || []).map((o) => [o.order, o.id]));
  return Object.fromEntries(t.map((o, c) => [o.id, n.get(c + 1)]).filter(([o, c]) => c && o !== c));
}, ae = (t, a) => t.map((n) => {
  var f, b;
  const o = (f = n.settings) == null ? void 0 : f.dependsOn, c = (b = n.settings) == null ? void 0 : b[z];
  let d = n.settings;
  return o && a[o] && (d = { ...d, dependsOn: a[o] }), c != null && c.blockId && a[c.blockId] && (d = { ...d, [z]: { ...c, blockId: a[c.blockId] } }), a[n.id] || d !== n.settings ? { ...n, id: a[n.id] || n.id, settings: d } : n;
}), fe = (t) => t.filter((a, n) => {
  var c;
  const o = (c = a.settings) == null ? void 0 : c[z];
  return !!(o != null && o.blockId) && !ye(t, n).some((d) => d.id === o.blockId);
}), Me = (t, a) => {
  const n = new Set(a.map((c) => c.id)), o = t.filter((c) => !n.has(c.id));
  return { ids: o.map((c) => c.id), answerable: o.filter((c) => !oe.has(c.type)).length };
}, se = (t) => (t || []).map((a) => ({ id: a.id, type: a.type })), M = (t, a, n, o) => JSON.stringify([t, a, n, o]);
function he(t) {
  const a = { id: re(), type: t, content: ie[t] || "Soru", settings: { required: !1 } };
  return V.has(t) && (a.settings.options = ["Seçenek 1", "Seçenek 2"]), t === i.SectionHeader && (a.content = "Bölüm Başlığı"), t === i.Paragraph && (a.content = "Açıklama metni…"), a;
}
const y = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft", G = ({ checked: t, onChange: a, label: n }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
  /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium text-text-secondary", children: n }),
  /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: (o) => {
        o.stopPropagation(), a(!t);
      },
      className: `relative h-6 w-11 rounded-full transition-colors ${t ? "bg-accent" : "bg-neutral-200"}`,
      "aria-pressed": t,
      children: /* @__PURE__ */ e.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${t ? "left-[22px]" : "left-0.5"}` })
    }
  )
] });
function Ue({ value: t, onChange: a }) {
  return /* @__PURE__ */ e.jsx(
    "select",
    {
      value: t,
      onClick: (n) => n.stopPropagation(),
      onChange: (n) => a(Number(n.target.value)),
      className: "shrink-0 rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm font-medium text-text-primary focus:border-focus focus:outline-none",
      children: be.map((n) => /* @__PURE__ */ e.jsx("optgroup", { label: n.group, children: n.items.map((o) => /* @__PURE__ */ e.jsxs("option", { value: o.type, children: [
        o.icon,
        " ",
        o.label
      ] }, o.type)) }, n.group))
    }
  );
}
function He({ block: t }) {
  const a = t.settings || {};
  switch (t.type) {
    case i.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: y, placeholder: a.placeholder || "Uzun yanıt…" });
    case i.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: y, placeholder: a.placeholder || "0" });
    case i.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: y, placeholder: a.placeholder || "ornek@firma.com" });
    case i.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: y, placeholder: a.placeholder || "+90 5xx xxx xx xx" });
    case i.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: y });
    case i.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: y });
    case i.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-6 text-center text-sm text-text-tertiary", children: "📎 Dosya seç / sürükle" });
    case i.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: y, children: (a.options || []).map((n, o) => /* @__PURE__ */ e.jsx("option", { children: n }, o)) });
    case i.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-warning", children: "★★★★★" });
    case i.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (n, o) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-default text-xs text-text-secondary", children: o }, o)) });
    case i.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-8 text-center text-sm text-text-tertiary", children: "✍️ İmza alanı" });
    case i.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["Adres satırı", "İlçe", "İl", "Posta kodu"].map((n) => /* @__PURE__ */ e.jsx("input", { disabled: !0, className: y, placeholder: n }, n)) });
    case i.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "▦ Tablo ızgarası" });
    case i.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: y, placeholder: a.placeholder || "Kısa yanıt…" });
  }
}
function Je({ block: t, settings: a, onPatchSettings: n, publicSlug: o, sources: c, parentCandidates: d }) {
  var j;
  const f = !!a.source, b = c.find((s) => s.key === a.source) || null, w = !!(b != null && b.dependsOnSourceKey), [h, C] = p.useState(null), [S, K] = p.useState("");
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
  const P = (s) => ({ source: s, urlPrefill: s === J ? !0 : void 0, dependsOn: void 0 }), D = c.some((s) => s.key === J) || c.length === 0 ? J : c[0].key, O = (s) => n(t.id, s ? P(D) : { source: void 0, urlPrefill: void 0, dependsOn: void 0 }), v = (s) => n(t.id, P(s)), N = () => {
    var s;
    (s = navigator.clipboard) == null || s.writeText(`${window.location.origin}${ze(ne(o), S)}`), L("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "mt-4 rounded-xl border border-subtle bg-surface-sunken p-3", onClick: (s) => s.stopPropagation(), children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-2 text-[11px] font-semibold uppercase text-text-secondary", children: "Seçenek kaynağı" }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-text-primary", children: [
      /* @__PURE__ */ e.jsx("input", { type: "radio", name: `source-${t.id}`, checked: !f, onChange: () => O(!1), className: "h-4 w-4 text-accent" }),
      "Sabit seçenekler, elle yazılır"
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "mt-1 flex items-center gap-2 text-sm text-text-primary", children: [
      /* @__PURE__ */ e.jsx("input", { type: "radio", name: `source-${t.id}`, checked: f, onChange: () => O(!0), className: "h-4 w-4 text-accent" }),
      "Veri kaynağından, canlı liste"
    ] }),
    f && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 border-t border-subtle pt-3", children: [
      /* @__PURE__ */ e.jsxs("select", { className: y, value: a.source, onChange: (s) => v(s.target.value), "aria-label": "Veri kaynağı", children: [
        !b && /* @__PURE__ */ e.jsx("option", { value: a.source, children: te(a.source) }),
        c.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.key, children: te(s.key) }, s.key))
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-xs text-text-secondary", children: ((j = Re[a.source]) == null ? void 0 : j.hint) || "Seçenekler her form açılışında bu kaynaktan tazelenir." }),
      w && /* @__PURE__ */ e.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-xs font-semibold text-text-secondary", children: "Hangi alana bağlı?" }),
        d.length === 0 ? /* @__PURE__ */ e.jsxs("p", { className: "rounded-lg bg-warning-subtle px-2.5 py-2 text-xs text-warning", children: [
          "Bu liste bir üst alana bağlı çalışır. Önce yukarıya “",
          te(b.dependsOnSourceKey),
          "” kaynağına bağlı bir açılır liste ekleyin."
        ] }) : /* @__PURE__ */ e.jsxs("select", { className: y, value: a.dependsOn || "", onChange: (s) => n(t.id, { dependsOn: s.target.value || void 0 }), "aria-label": "Üst alan", children: [
          /* @__PURE__ */ e.jsx("option", { value: "", children: "Üst alanı seçin…" }),
          d.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: s.content || "Adsız alan" }, s.id))
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
      a.source === J && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("div", { className: "mt-3", children: /* @__PURE__ */ e.jsx(G, { label: "Bağlantıdaki çağrıyı ön seç", checked: !!a.urlPrefill, onChange: (s) => n(t.id, { urlPrefill: s }) }) }),
        a.urlPrefill && o && (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs("select", { className: `${y} min-w-0 flex-1`, value: S, onChange: (s) => K(s.target.value), "aria-label": "Çağrıya özel bağlantı", children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "Çağrıya özel bağlantı için seçin…" }),
            h.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.value, children: s.label }, s.value))
          ] }),
          /* @__PURE__ */ e.jsx("button", { type: "button", disabled: !S, onClick: N, className: "rounded-lg border border-default bg-surface-raised px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-sunken disabled:opacity-50", children: "Bağlantıyı kopyala" })
        ] })
      ] })
    ] })
  ] });
}
function _e({ block: t, settings: a, onPatchSettings: n, candidates: o, sources: c }) {
  const d = a[z] || null, f = o.find((l) => l.id === (d == null ? void 0 : d.blockId)) || null, b = (f == null ? void 0 : f.settings) || {}, w = (f == null ? void 0 : f.type) === i.Dropdown ? b.source : null, h = c.find((l) => l.key === w) || null, C = !!(h != null && h.dependsOnSourceKey), S = (h == null ? void 0 : h.flags) || [], [K, P] = p.useState(null);
  p.useEffect(() => {
    if (!w || C) return P(null);
    let l = !1;
    return R.get(`/api/app/form/choices?source=${encodeURIComponent(w)}`).then((B) => {
      l || P(B || []);
    }).catch(() => {
      l || P([]);
    }), () => {
      l = !0;
    };
  }, [w, C]);
  const D = (l) => n(t.id, { [z]: { ...d, ...l } }), O = () => {
    const l = o[0];
    n(t.id, { [z]: { blockId: l.id, op: I.ANSWERED, value: void 0 } });
  }, v = (l) => n(t.id, { [z]: { blockId: l, op: I.ANSWERED, value: void 0 } }), N = (l) => D({ op: l, value: l === I.FLAG ? S[0] : void 0 }), j = w ? (K || []).map((l) => ({ value: l.value, label: l.label })) : (b.options || []).map((l) => ({ value: l, label: l })), s = [I.ANSWERED, I.EQ, I.NEQ, ...S.length ? [I.FLAG] : []].filter((l) => !(C && (l === I.EQ || l === I.NEQ)));
  return /* @__PURE__ */ e.jsxs("div", { className: "mt-3 rounded-xl border border-subtle bg-surface-sunken p-3", onClick: (l) => l.stopPropagation(), children: [
    /* @__PURE__ */ e.jsx("p", { className: "mb-2 text-[11px] font-semibold uppercase text-text-secondary", children: "Görünürlük" }),
    o.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-secondary", children: "Koşul için yukarıda bir alan gerekir; bu alan her zaman görünür." }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
      !f && /* @__PURE__ */ e.jsx("p", { className: "rounded-lg bg-warning-subtle px-2.5 py-2 text-xs text-warning", children: "Koşuldaki alan artık yukarıda değil. Yeni bir alan seçin ya da koşulu kaldırın — yoksa bu alan formda hiç görünmeyebilir." }),
      /* @__PURE__ */ e.jsxs("select", { className: y, value: d.blockId, onChange: (l) => v(l.target.value), "aria-label": "Koşul alanı", children: [
        !f && /* @__PURE__ */ e.jsx("option", { value: d.blockId, children: "Kaldırılmış alan" }),
        o.map((l) => /* @__PURE__ */ e.jsx("option", { value: l.id, children: l.content || "Adsız alan" }, l.id))
      ] }),
      /* @__PURE__ */ e.jsx("select", { className: y, value: d.op, onChange: (l) => N(l.target.value), "aria-label": "Koşul karşılaştırması", children: s.map((l) => /* @__PURE__ */ e.jsx("option", { value: l, children: $e[l] }, l)) }),
      d.op === I.FLAG && /* @__PURE__ */ e.jsx("select", { className: y, value: d.value || S[0] || "", onChange: (l) => D({ value: l.target.value }), "aria-label": "Koşul şartı", children: S.map((l) => /* @__PURE__ */ e.jsx("option", { value: l, children: Fe(l) }, l)) }),
      (d.op === I.EQ || d.op === I.NEQ) && (j.length > 0 ? /* @__PURE__ */ e.jsxs("select", { className: y, value: d.value || "", onChange: (l) => D({ value: l.target.value }), "aria-label": "Koşul cevabı", children: [
        /* @__PURE__ */ e.jsx("option", { value: "", children: "Cevabı seçin…" }),
        j.map((l) => /* @__PURE__ */ e.jsx("option", { value: l.value, children: l.label }, l.value))
      ] }) : /* @__PURE__ */ e.jsx("input", { className: y, value: d.value || "", onChange: (l) => D({ value: l.target.value }), placeholder: "Beklenen cevap…", "aria-label": "Koşul cevabı" })),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => n(t.id, { [z]: void 0 }),
          className: "self-start text-xs font-semibold text-text-secondary underline hover:text-text-primary",
          children: "Koşulu kaldır"
        }
      )
    ] }) : /* @__PURE__ */ e.jsx("button", { type: "button", onClick: O, className: "rounded-lg border border-default bg-surface-raised px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-sunken", children: "+ Koşul ekle" })
  ] });
}
function Ve({ block: t, index: a, selected: n, onSelect: o, onPatch: c, onPatchSettings: d, onChangeType: f, onDuplicate: b, onRemove: w, onAddAfter: h, onMove: C, dragRef: S, publicSlug: K, sources: P = [], parentCandidates: D = [], conditionCandidates: O = [] }) {
  const v = t.settings || {}, N = oe.has(t.type), j = p.useRef(null);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: j,
      onDragOver: (s) => s.preventDefault(),
      onDrop: () => C(a),
      onClick: () => o(t.id),
      className: `group relative rounded-2xl border bg-surface-raised p-5 transition ${n ? "border-focus shadow-md ring-1 ring-accent-soft" : "border-default hover:border-strong"}`,
      children: [
        n && /* @__PURE__ */ e.jsx("span", { className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-accent" }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            draggable: !0,
            onDragStart: (s) => {
              S.current = a, j.current && s.dataTransfer.setDragImage(j.current, 24, 24);
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
              onChange: (s) => c(t.id, { content: s.target.value }),
              placeholder: t.type === i.SectionHeader ? "Bölüm başlığı" : "Açıklama metni",
              className: `flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${t.type === i.SectionHeader ? "text-xl font-bold text-text-primary" : "text-sm text-text-secondary"}`
            }
          ) : /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (s) => s.stopPropagation(),
              onChange: (s) => c(t.id, { content: s.target.value }),
              placeholder: "Soru metni…",
              className: "flex-1 border-b border-transparent bg-transparent p-0 pb-1 text-base font-semibold text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-0"
            }
          ),
          n && /* @__PURE__ */ e.jsx(Ue, { value: t.type, onChange: (s) => f(t.id, s) }),
          !n && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary", children: ie[t.type] }),
          v.source && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-primary-subtle px-2.5 py-1 text-[11px] font-semibold text-primary", children: "⚡ Canlı liste" })
        ] }),
        n && t.type === i.Dropdown && /* @__PURE__ */ e.jsx(Je, { block: t, settings: v, onPatchSettings: d, publicSlug: K, sources: P, parentCandidates: D }),
        n && /* @__PURE__ */ e.jsx(_e, { block: t, settings: v, onPatchSettings: d, candidates: O, sources: P }),
        n && V.has(t.type) && !v.source && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [
          (v.options || []).map((s, l) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", onClick: (B) => B.stopPropagation(), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: t.type === i.MultiSelect ? "☐" : "○" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: "flex-1 border-b border-subtle bg-transparent px-1 py-1 text-sm focus:border-focus focus:outline-none",
                value: s,
                onChange: (B) => {
                  const E = [...v.options];
                  E[l] = B.target.value, d(t.id, { options: E });
                }
              }
            ),
            /* @__PURE__ */ e.jsx("button", { className: "rounded p-1 text-text-tertiary hover:text-negative-500", onClick: () => d(t.id, { options: v.options.filter((B, E) => E !== l) }), children: "✕" })
          ] }, l)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "self-start text-sm font-medium text-accent hover:text-accent-600",
              onClick: (s) => {
                s.stopPropagation(), d(t.id, { options: [...v.options || [], `Seçenek ${(v.options || []).length + 1}`] });
              },
              children: "+ Seçenek ekle"
            }
          )
        ] }),
        !N && !V.has(t.type) && /* @__PURE__ */ e.jsx("div", { className: "mt-4", onClick: (s) => s.stopPropagation(), children: /* @__PURE__ */ e.jsx(He, { block: t }) }),
        n && !N && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 border-t border-subtle pt-4 sm:grid-cols-2", onClick: (s) => s.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Placeholder" }),
            /* @__PURE__ */ e.jsx("input", { className: y, value: v.placeholder || "", onChange: (s) => d(t.id, { placeholder: s.target.value }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yardım Metni" }),
            /* @__PURE__ */ e.jsx("input", { className: y, value: v.helpText || "", onChange: (s) => d(t.id, { helpText: s.target.value }) })
          ] }),
          (t.type === i.Number || t.type === i.Rating) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Min" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: y, value: v.min ?? "", onChange: (s) => d(t.id, { min: s.target.value === "" ? null : Number(s.target.value) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Max" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: y, value: v.max ?? "", onChange: (s) => d(t.id, { max: s.target.value === "" ? null : Number(s.target.value) }) })
            ] })
          ] })
        ] }),
        n && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 border-t border-subtle pt-3", onClick: (s) => s.stopPropagation(), children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => C(a - 1, a), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Yukarı", children: "▲" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => C(a + 1, a), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Aşağı", children: "▼" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => b(t.id), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Kopyala", children: "⧉" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => w(t.id), className: "rounded-lg p-2 text-negative-500 hover:bg-negative-50", title: "Sil", children: "🗑" }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          !N && /* @__PURE__ */ e.jsx(G, { label: "Zorunlu", checked: !!v.required, onChange: (s) => d(t.id, { required: s }) }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => h(t.id), className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600", children: "+ Soru" })
        ] })
      ]
    }
  );
}
function Ge() {
  const t = p.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [a, n] = p.useState(t), [o, c] = p.useState(""), [d, f] = p.useState(!1), [b, w] = p.useState(""), [h, C] = p.useState(""), [S, K] = p.useState(null), [P, D] = p.useState([]), [O, v] = p.useState([]), [N, j] = p.useState([]), [s, l] = p.useState(null), [B, E] = p.useState(!1), [$, Y] = p.useState(!!t), [k, A] = p.useState(null), [je, ke] = p.useState(0), U = p.useRef([]), [ce, H] = p.useState(0), [Q, q] = p.useState(0), [Ne, W] = p.useState(null), [Se, Z] = p.useState(() => M("", "", null, [])), X = p.useRef(null);
  p.useEffect(() => {
    R.get("/api/app/form-category?MaxResultCount=100").then((r) => D(r.items || [])).catch(() => {
    });
  }, []), p.useEffect(() => {
    R.get("/api/app/form/choice-sources").then((r) => v(r || [])).catch(() => v([]));
  }, []), p.useEffect(() => {
    t && (async () => {
      try {
        const r = await R.get(`/api/app/form/${t}`), u = (r.blocks || []).slice().sort((m, g) => m.order - g.order).map((m) => ({
          id: m.id || re(),
          type: m.type,
          content: m.content,
          settings: ve(m.settings)
        }));
        w(r.title || ""), c(r.slug || ""), C(r.description || ""), K(r.categoryId || null), j(u), U.current = se(r.blocks), H(r.responseCount ?? 0), q(r.status ?? 0), W(r.publishSettingsJson ?? null), Z(M(r.title || "", r.description || "", r.categoryId || null, u)), A(null);
      } catch (r) {
        A(_(r, "Bağlantınızı kontrol edip tekrar deneyin."));
      } finally {
        Y(!1);
      }
    })();
  }, [t, je]);
  const we = (r = i.ShortText) => {
    const u = he(r);
    j((m) => [...m, u]), l(u.id);
  }, Ce = (r) => {
    const u = he(i.ShortText);
    j((m) => {
      const g = m.findIndex((T) => T.id === r), x = [...m];
      return x.splice(g + 1, 0, u), x;
    }), l(u.id);
  }, Pe = (r) => j((u) => u.filter((m) => m.id !== r)), Ee = (r) => j((u) => {
    const m = u.findIndex((T) => T.id === r);
    if (m < 0) return u;
    const g = { ...u[m], id: re(), settings: { ...u[m].settings } }, x = [...u];
    return x.splice(m + 1, 0, g), x;
  }), De = (r, u) => j((m) => m.map((g) => g.id === r ? { ...g, ...u } : g)), Oe = (r, u) => j((m) => m.map((g) => g.id === r ? { ...g, settings: { ...g.settings, ...u } } : g)), Be = (r, u) => j((m) => m.map((g) => {
    if (g.id !== r) return g;
    const x = { ...g.settings };
    return u !== i.Dropdown && (delete x.source, delete x.urlPrefill, delete x.dependsOn), V.has(u) && !x.options && (x.options = ["Seçenek 1", "Seçenek 2"]), { ...g, type: u, settings: x };
  })), Ie = (r, u) => j((m) => {
    const g = u ?? X.current;
    if (X.current = null, g == null || r < 0 || r >= m.length || g === r) return m;
    const x = [...m], [T] = x.splice(g, 1);
    return x.splice(r, 0, T), x;
  }), de = (r) => {
    Object.keys(r).length && (j((u) => ae(u, r)), l((u) => r[u] || u));
  }, ue = async () => {
    if (!b.trim())
      return L("warn", "Lütfen forma bir başlık verin."), !1;
    const r = { title: b.trim(), description: h.trim() || null, categoryId: S, themeJson: null, blocks: [] }, u = N;
    if (!a) {
      E(!0);
      try {
        const x = await R.post("/api/app/form", { ...r, blocks: pe(u) }), T = me(u, x.blocks);
        U.current = se(x.blocks), de(T), n(x.id), c(x.slug || ""), q(x.status ?? 0), H(x.responseCount ?? 0), W(x.publishSettingsJson ?? null), Z(M(b, h, S, ae(u, T)));
        const F = new URL(window.location.href);
        return F.searchParams.set("id", x.id), window.history.replaceState({}, "", F), L("success", "Form oluşturuldu."), !0;
      } catch (x) {
        return L("error", _(x, "Kaydetme başarısız.")), !1;
      } finally {
        E(!1);
      }
    }
    const m = Q === 1 ? fe(u) : [];
    if (m.length && (l(m[0].id), !await le(`"${m[0].content || "Adsız alan"}" alanının görünürlük koşulu formda olmayan (ya da aşağıdaki) bir alana bağlı. Form yayında: kaydettiğiniz anda doldurucular bu hâli görür. Yine de kaydedilsin mi?`)))
      return !1;
    const g = Me(U.current, u);
    if (g.answerable > 0 && ce > 0 && !await le(`${g.answerable} soru silinecek. Bu sorulara verilmiş yanıtlar yanıt ekranında ve dışa aktarımda sorusuz kalır. Devam edilsin mi?`))
      return !1;
    E(!0);
    try {
      const x = await R.put(`/api/app/form/${a}/blocks`, { blocks: pe(u), removedBlockIds: g.ids }), T = me(u, x == null ? void 0 : x.blocks);
      U.current = se(x == null ? void 0 : x.blocks), de(T);
      const F = await R.put(`/api/app/form/${a}`, r);
      return H((F == null ? void 0 : F.responseCount) ?? (x == null ? void 0 : x.responseCount) ?? 0), Z(M(b, h, S, ae(u, T))), L("success", "Form kaydedildi."), !0;
    } catch (x) {
      return L("error", _(x, "Kaydetme başarısız.")), !1;
    } finally {
      E(!1);
    }
  }, ee = !$ && !k && M(b, h, S, N) !== Se;
  p.useEffect(() => {
    if (!ee) return;
    const r = (u) => {
      u.preventDefault(), u.returnValue = "";
    };
    return window.addEventListener("beforeunload", r), () => window.removeEventListener("beforeunload", r);
  }, [ee]);
  const Ae = async () => {
    const r = fe(N);
    if (r.length) {
      l(r[0].id), L("warn", `"${r[0].content || "Adsız alan"}" alanının görünürlük koşulu formda olmayan (ya da aşağıdaki) bir alana bağlı. Yayınlamadan önce koşulu düzeltin veya kaldırın.`);
      return;
    }
    ee && !await ue() || f(!0);
  }, Te = (r) => {
    c(r.slug || o), W(r.publishSettingsJson ?? null), q(r.status ?? Q), H(r.responseCount ?? ce);
  };
  return $ ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-text-tertiary", children: "Form yükleniyor…" }) : k ? /* @__PURE__ */ e.jsxs("div", { className: "flex h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center", children: [
    /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets", className: "text-sm font-semibold text-text-secondary hover:text-text-primary", children: "← Formlar" }),
    /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Form yüklenemedi" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary", children: k }),
    /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          A(null), Y(!0), ke((r) => r + 1);
        },
        className: "rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-600",
        children: "Tekrar dene"
      }
    )
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "min-h-[calc(100vh-120px)] bg-surface-sunken pb-24", children: [
    /* @__PURE__ */ e.jsx("div", { className: "sticky top-0 z-20 border-b border-default bg-surface-raised", children: /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets", className: "text-sm font-semibold text-text-secondary hover:text-text-primary", children: "← Formlar" }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary", children: [
          N.length,
          " alan"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("button", { onClick: ue, disabled: B, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken disabled:opacity-50", children: B ? "Kaydediliyor…" : a ? "Kaydet" : "Oluştur" }),
        a && /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${a}`, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken", children: "Yanıtlar" }),
        a && /* @__PURE__ */ e.jsx("button", { onClick: Ae, disabled: B, className: "rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-600 disabled:opacity-50", children: "Yayınla" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative mb-4 overflow-hidden rounded-2xl border border-default bg-surface-raised p-6", children: [
        /* @__PURE__ */ e.jsx("span", { className: "absolute inset-x-0 top-0 h-1.5 bg-accent" }),
        /* @__PURE__ */ e.jsx("input", { value: b, onChange: (r) => w(r.target.value), placeholder: "Form başlığı…", className: "w-full border-none bg-transparent p-0 text-3xl font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsx("input", { value: h, onChange: (r) => C(r.target.value), placeholder: "Form açıklaması (opsiyonel)…", className: "mt-2 w-full border-none bg-transparent p-0 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: S || "",
            onChange: (r) => K(r.target.value || null),
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
        Ve,
        {
          block: r,
          index: u,
          selected: r.id === s,
          onSelect: l,
          onPatch: De,
          onPatchSettings: Oe,
          onChangeType: Be,
          onDuplicate: Ee,
          onRemove: Pe,
          onAddAfter: Ce,
          onMove: Ie,
          dragRef: X,
          publicSlug: o,
          sources: O,
          parentCandidates: Ye(N, u, O),
          conditionCandidates: ye(N, u)
        },
        r.id
      )) }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => we(i.ShortText), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-default py-4 text-sm font-bold text-text-secondary transition hover:border-focus hover:text-accent", children: "+ Soru Ekle" }),
      N.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-center text-sm text-text-tertiary", children: "Başlamak için bir soru ekleyin." })
    ] }),
    d && /* @__PURE__ */ e.jsx(
      Qe,
      {
        formId: a,
        slug: o,
        settingsJson: Ne,
        published: Q === 1,
        onPublished: Te,
        onClose: () => f(!1)
      }
    )
  ] });
}
function Qe({ formId: t, slug: a, settingsJson: n, published: o, onPublished: c, onClose: d }) {
  const [f] = p.useState(() => ve(n) || {}), [b, w] = p.useState(a || ""), [h, C] = p.useState(String(f.startDate || "").slice(0, 10)), [S, K] = p.useState(String(f.endDate || "").slice(0, 10)), [P, D] = p.useState(!!f.kvkk), [O, v] = p.useState(!!f.captcha), [N, j] = p.useState(!1), [s, l] = p.useState(null), B = async () => {
    const k = (b == null ? void 0 : b.trim()) || null;
    if (!(o && k && k !== a && !await le("Bağlantı adresi değişecek. Daha önce paylaşılan bağlantı artık açılmaz. Devam edilsin mi?"))) {
      j(!0);
      try {
        const A = await R.post(`/api/app/form/${t}/publish`, {
          slug: k,
          publishSettingsJson: JSON.stringify({ startDate: h || null, endDate: S || null, kvkk: P, captcha: O })
        });
        c == null || c(A), l(A.slug || b), L("success", "Form yayınlandı.");
      } catch (A) {
        L("error", _(A, "Yayınlama başarısız."));
      } finally {
        j(!1);
      }
    }
  }, E = o && a ? `${window.location.origin}${ne(a)}` : null, $ = s ? `${window.location.origin}${ne(s)}` : null, Y = (k) => {
    var A;
    k && ((A = navigator.clipboard) == null || A.writeText(k)), L("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: d, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-surface-raised p-6 shadow-xl", onClick: (k) => k.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Formu Yayınla" }),
      /* @__PURE__ */ e.jsx("button", { onClick: d, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    $ ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: "rounded-xl bg-positive-50 p-3 text-sm text-positive-700", children: "✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yayın bağlantısı" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: y, value: $, onClick: (k) => k.target.select() }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => Y($), className: "shrink-0 rounded-xl border border-default px-3 py-2 text-sm font-medium hover:bg-surface-sunken", children: "Kopyala" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: $, target: "_blank", rel: "noreferrer", className: "rounded-xl bg-accent px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-accent-600", children: "Formu yeni sekmede aç" })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      E && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yayın bağlantısı" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: y, value: E, onClick: (k) => k.target.select(), "aria-label": "Yayın bağlantısı" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => Y(E), className: "shrink-0 rounded-xl border border-default px-3 py-2 text-sm font-medium hover:bg-surface-sunken", children: "Kopyala" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bağlantı adresi (slug)" }),
        /* @__PURE__ */ e.jsx("input", { className: y, value: b, onChange: (k) => w(k.target.value), placeholder: "musteri-memnuniyet" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Başlangıç" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: y, value: h, onChange: (k) => C(k.target.value) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bitiş" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: y, value: S, onChange: (k) => K(k.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(G, { label: "KVKK onayı iste", checked: P, onChange: D }),
      /* @__PURE__ */ e.jsx(G, { label: "Bot koruması", checked: O, onChange: v }),
      /* @__PURE__ */ e.jsxs("div", { className: "-mt-2 flex items-start gap-1 text-[11px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx(Le, { text: "Başlangıç/Bitiş tarihi form penceresini sınırlar (dışında form kapalı). KVKK onayı açıkken genel formda zorunlu onay kutusu çıkar ve rıza kaydı tutulur. Bot koruması honeypot + minimum doldurma süresiyle otomatik gönderimleri eler (üçüncü taraf servis kullanılmaz)." }),
        /* @__PURE__ */ e.jsx("span", { children: "Bu ayarlar sunucu tarafında uygulanır" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { onClick: B, disabled: N, className: "mt-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: N ? o ? "Kaydediliyor…" : "Yayınlanıyor…" : o ? "Ayarları güncelle" : "Yayınla" })
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
function L(t, a) {
  const n = window.abp;
  n != null && n.notify && (t === "success" || t === "info") ? n.notify[t === "success" ? "success" : "info"](a) : n != null && n.message ? n.message[t === "error" ? "error" : t === "warn" ? "warn" : "info"](a) : console.log(`[${t}] ${a}`);
}
function _(t, a) {
  return t != null && t.status && t.message || a;
}
function le(t) {
  var n;
  const a = window.abp;
  return (n = a == null ? void 0 : a.message) != null && n.confirm ? new Promise((o) => a.message.confirm(t, "Onay", (c) => o(!!c))) : Promise.resolve(window.confirm(t));
}
const ge = document.getElementById("dynamic-assets-app-root");
ge && Ke(ge).render(/* @__PURE__ */ e.jsx(Ge, {}));
export {
  Ge as FormBuilder,
  Qe as PublishModal,
  Ve as QuestionCard,
  Me as blockRemovals,
  fe as brokenConditionBlocks,
  ye as conditionCandidatesFor,
  Ye as parentCandidatesFor,
  pe as payloadBlocks,
  me as serverIdMap,
  ae as withServerIds
};
