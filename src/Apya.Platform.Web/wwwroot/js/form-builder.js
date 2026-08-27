import { b as X, j as e, r as c } from "./react-vendor-D57GAUXd.js";
import { d as ee } from "./draggableActivation-Ybw9Upbh.js";
import { a as D } from "./httpClient-CRlyQ1eg.js";
import { H as te } from "./Hint-CNW95h3H.js";
/* empty css               */
const s = {
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
}, z = /* @__PURE__ */ new Set([s.Select, s.MultiSelect, s.Dropdown]), ae = /* @__PURE__ */ new Set([s.SectionHeader, s.Paragraph]), Y = [
  { group: "Metin & Sayı", items: [
    { type: s.ShortText, label: "Kısa Metin", icon: "✏️" },
    { type: s.LongText, label: "Uzun Metin", icon: "📝" },
    { type: s.Number, label: "Sayısal", icon: "🔢" },
    { type: s.Email, label: "E-Posta", icon: "✉️" },
    { type: s.Phone, label: "Telefon", icon: "📞" }
  ] },
  { group: "Seçim", items: [
    { type: s.Select, label: "Tekli Seçim", icon: "🔘" },
    { type: s.MultiSelect, label: "Çoklu Seçim", icon: "☑️" },
    { type: s.Dropdown, label: "Açılır Liste", icon: "⬇️" }
  ] },
  { group: "Tarih & Zaman", items: [
    { type: s.DatePicker, label: "Tarih", icon: "📅" },
    { type: s.TimePicker, label: "Saat", icon: "🕐" }
  ] },
  { group: "Özel", items: [
    { type: s.FilePicker, label: "Dosya Yükleme", icon: "📎" },
    { type: s.Rating, label: "Derecelendirme", icon: "⭐" },
    { type: s.Nps, label: "NPS (0-10)", icon: "📊" },
    { type: s.Signature, label: "İmza", icon: "✍️" },
    { type: s.Address, label: "Adres", icon: "📍" }
  ] },
  { group: "Düzen", items: [
    { type: s.SectionHeader, label: "Bölüm Başlığı", icon: "🏷️" },
    { type: s.Paragraph, label: "Açıklama", icon: "💬" }
  ] }
], E = Object.fromEntries(Y.flatMap((t) => t.items.map((r) => [r.type, r.label]))), $ = () => Math.random().toString(36).slice(2, 10);
function L(t) {
  const r = { id: $(), type: t, content: E[t] || "Soru", settings: { required: !1 } };
  return z.has(t) && (r.settings.options = ["Seçenek 1", "Seçenek 2"]), t === s.SectionHeader && (r.content = "Bölüm Başlığı"), t === s.Paragraph && (r.content = "Açıklama metni…"), r;
}
const p = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft", K = ({ checked: t, onChange: r, label: n }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
  /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium text-text-secondary", children: n }),
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
      onClick: (n) => n.stopPropagation(),
      onChange: (n) => r(Number(n.target.value)),
      className: "shrink-0 rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm font-medium text-text-primary focus:border-focus focus:outline-none",
      children: Y.map((n) => /* @__PURE__ */ e.jsx("optgroup", { label: n.group, children: n.items.map((d) => /* @__PURE__ */ e.jsxs("option", { value: d.type, children: [
        d.icon,
        " ",
        d.label
      ] }, d.type)) }, n.group))
    }
  );
}
function re({ block: t }) {
  const r = t.settings || {};
  switch (t.type) {
    case s.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: p, placeholder: r.placeholder || "Uzun yanıt…" });
    case s.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: p, placeholder: r.placeholder || "0" });
    case s.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: p, placeholder: r.placeholder || "ornek@firma.com" });
    case s.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: p, placeholder: r.placeholder || "+90 5xx xxx xx xx" });
    case s.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: p });
    case s.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: p });
    case s.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-6 text-center text-sm text-text-tertiary", children: "📎 Dosya seç / sürükle" });
    case s.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: p, children: (r.options || []).map((n, d) => /* @__PURE__ */ e.jsx("option", { children: n }, d)) });
    case s.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-warning", children: "★★★★★" });
    case s.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (n, d) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-default text-xs text-text-secondary", children: d }, d)) });
    case s.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-8 text-center text-sm text-text-tertiary", children: "✍️ İmza alanı" });
    case s.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["Adres satırı", "İlçe", "İl", "Posta kodu"].map((n) => /* @__PURE__ */ e.jsx("input", { disabled: !0, className: p, placeholder: n }, n)) });
    case s.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "▦ Tablo ızgarası" });
    case s.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: p, placeholder: r.placeholder || "Kısa yanıt…" });
  }
}
function ne({ block: t, index: r, selected: n, onSelect: d, onPatch: P, onPatchSettings: h, onChangeType: T, onDuplicate: y, onRemove: B, onAddAfter: N, onMove: k, dragRef: S }) {
  const f = t.settings || {}, j = ae.has(t.type);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      draggable: !0,
      onDragStart: () => S.current = r,
      onDragOver: (l) => l.preventDefault(),
      onDrop: () => k(r),
      ...ee(() => d(t.id)),
      className: `group relative rounded-2xl border bg-surface-raised p-5 transition ${n ? "border-focus shadow-md ring-1 ring-accent-soft" : "border-default hover:border-strong"}`,
      children: [
        n && /* @__PURE__ */ e.jsx("span", { className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-accent" }),
        /* @__PURE__ */ e.jsx("div", { className: `absolute -top-2 left-1/2 -translate-x-1/2 cursor-grab text-text-tertiary transition-opacity ${n ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`, title: "Sürükle", children: "⠿" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3", children: [
          j ? /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (l) => l.stopPropagation(),
              onChange: (l) => P(t.id, { content: l.target.value }),
              placeholder: t.type === s.SectionHeader ? "Bölüm başlığı" : "Açıklama metni",
              className: `flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${t.type === s.SectionHeader ? "text-xl font-bold text-text-primary" : "text-sm text-text-secondary"}`
            }
          ) : /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (l) => l.stopPropagation(),
              onChange: (l) => P(t.id, { content: l.target.value }),
              placeholder: "Soru metni…",
              className: "flex-1 border-b border-transparent bg-transparent p-0 pb-1 text-base font-semibold text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-0"
            }
          ),
          n && /* @__PURE__ */ e.jsx(se, { value: t.type, onChange: (l) => T(t.id, l) }),
          !n && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary", children: E[t.type] })
        ] }),
        n && z.has(t.type) && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [
          (f.options || []).map((l, b) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", onClick: (m) => m.stopPropagation(), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: t.type === s.MultiSelect ? "☐" : "○" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: "flex-1 border-b border-subtle bg-transparent px-1 py-1 text-sm focus:border-focus focus:outline-none",
                value: l,
                onChange: (m) => {
                  const w = [...f.options];
                  w[b] = m.target.value, h(t.id, { options: w });
                }
              }
            ),
            /* @__PURE__ */ e.jsx("button", { className: "rounded p-1 text-text-tertiary hover:text-negative-500", onClick: () => h(t.id, { options: f.options.filter((m, w) => w !== b) }), children: "✕" })
          ] }, b)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "self-start text-sm font-medium text-accent hover:text-accent-600",
              onClick: (l) => {
                l.stopPropagation(), h(t.id, { options: [...f.options || [], `Seçenek ${(f.options || []).length + 1}`] });
              },
              children: "+ Seçenek ekle"
            }
          )
        ] }),
        !j && !z.has(t.type) && /* @__PURE__ */ e.jsx("div", { className: "mt-4", onClick: (l) => l.stopPropagation(), children: /* @__PURE__ */ e.jsx(re, { block: t }) }),
        n && !j && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 border-t border-subtle pt-4 sm:grid-cols-2", onClick: (l) => l.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Placeholder" }),
            /* @__PURE__ */ e.jsx("input", { className: p, value: f.placeholder || "", onChange: (l) => h(t.id, { placeholder: l.target.value }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yardım Metni" }),
            /* @__PURE__ */ e.jsx("input", { className: p, value: f.helpText || "", onChange: (l) => h(t.id, { helpText: l.target.value }) })
          ] }),
          (t.type === s.Number || t.type === s.Rating) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Min" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: p, value: f.min ?? "", onChange: (l) => h(t.id, { min: l.target.value === "" ? null : Number(l.target.value) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Max" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: p, value: f.max ?? "", onChange: (l) => h(t.id, { max: l.target.value === "" ? null : Number(l.target.value) }) })
            ] })
          ] })
        ] }),
        n && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 border-t border-subtle pt-3", onClick: (l) => l.stopPropagation(), children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => k(r - 1, r), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Yukarı", children: "▲" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => k(r + 1, r), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Aşağı", children: "▼" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => y(t.id), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Kopyala", children: "⧉" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => B(t.id), className: "rounded-lg p-2 text-negative-500 hover:bg-negative-50", title: "Sil", children: "🗑" }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          !j && /* @__PURE__ */ e.jsx(K, { label: "Zorunlu", checked: !!f.required, onChange: (l) => h(t.id, { required: l }) }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => N(t.id), className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600", children: "+ Soru" })
        ] })
      ]
    }
  );
}
function le() {
  const t = c.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [r, n] = c.useState(t), [d, P] = c.useState(""), [h, T] = c.useState(!1), [y, B] = c.useState(""), [N, k] = c.useState(""), [S, f] = c.useState(null), [j, l] = c.useState([]), [b, m] = c.useState([]), [w, v] = c.useState(null), [F, u] = c.useState(!1), [O, H] = c.useState(!!t), R = c.useRef(null);
  c.useEffect(() => {
    D.get("/api/app/form-category?MaxResultCount=100").then((a) => l(a.items || [])).catch(() => {
    });
  }, []), c.useEffect(() => {
    t && (async () => {
      try {
        const a = await D.get(`/api/app/form/${t}`);
        B(a.title || ""), P(a.slug || ""), k(a.description || ""), f(a.categoryId || null), m((a.blocks || []).slice().sort((o, i) => o.order - i.order).map((o) => ({
          id: o.id || $(),
          type: o.type,
          content: o.content,
          settings: ie(o.settings)
        })));
      } catch (a) {
        C("error", (a == null ? void 0 : a.message) || "Form yüklenemedi.");
      } finally {
        H(!1);
      }
    })();
  }, [t]);
  const U = (a = s.ShortText) => {
    const o = L(a);
    m((i) => [...i, o]), v(o.id);
  }, J = (a) => {
    const o = L(s.ShortText);
    m((i) => {
      const x = i.findIndex((A) => A.id === a), g = [...i];
      return g.splice(x + 1, 0, o), g;
    }), v(o.id);
  }, _ = (a) => m((o) => o.filter((i) => i.id !== a)), q = (a) => m((o) => {
    const i = o.findIndex((A) => A.id === a);
    if (i < 0) return o;
    const x = { ...o[i], id: $(), settings: { ...o[i].settings } }, g = [...o];
    return g.splice(i + 1, 0, x), g;
  }), G = (a, o) => m((i) => i.map((x) => x.id === a ? { ...x, ...o } : x)), Z = (a, o) => m((i) => i.map((x) => x.id === a ? { ...x, settings: { ...x.settings, ...o } } : x)), V = (a, o) => m((i) => i.map((x) => {
    if (x.id !== a) return x;
    const g = { ...x.settings };
    return z.has(o) && !g.options && (g.options = ["Seçenek 1", "Seçenek 2"]), { ...x, type: o, settings: g };
  })), Q = (a, o) => m((i) => {
    const x = o ?? R.current;
    if (R.current = null, x == null || a < 0 || a >= i.length || x === a) return i;
    const g = [...i], [A] = g.splice(x, 1);
    return g.splice(a, 0, A), g;
  }), I = () => b.map((a, o) => ({
    type: a.type,
    order: o + 1,
    content: a.content || E[a.type] || "Soru",
    settings: JSON.stringify(a.settings || {})
  })), W = async () => {
    if (!y.trim()) return C("warn", "Lütfen forma bir başlık verin.");
    u(!0);
    try {
      if (r)
        await D.put(`/api/app/form/${r}`, { title: y.trim(), description: N.trim() || null, categoryId: S, themeJson: null, blocks: [] }), await D.put(`/api/app/form/${r}/blocks`, { blocks: I() }), C("success", "Form kaydedildi.");
      else {
        const a = await D.post("/api/app/form", { title: y.trim(), description: N.trim() || null, categoryId: S, themeJson: null, blocks: I() });
        n(a.id), P(a.slug || "");
        const o = new URL(window.location.href);
        o.searchParams.set("id", a.id), window.history.replaceState({}, "", o), C("success", "Form oluşturuldu.");
      }
    } catch (a) {
      C("error", (a == null ? void 0 : a.message) || "Kaydetme başarısız.");
    } finally {
      u(!1);
    }
  };
  return O ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-text-tertiary", children: "Form yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "min-h-[calc(100vh-120px)] bg-surface-sunken pb-24", children: [
    /* @__PURE__ */ e.jsx("div", { className: "sticky top-0 z-20 border-b border-default bg-surface-raised", children: /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3", children: [
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
        /* @__PURE__ */ e.jsx("input", { value: y, onChange: (a) => B(a.target.value), placeholder: "Form başlığı…", className: "w-full border-none bg-transparent p-0 text-3xl font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsx("input", { value: N, onChange: (a) => k(a.target.value), placeholder: "Form açıklaması (opsiyonel)…", className: "mt-2 w-full border-none bg-transparent p-0 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: S || "",
            onChange: (a) => f(a.target.value || null),
            className: "mt-3 rounded-lg border border-default bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-text-secondary focus:border-accent focus:outline-none",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Kategorisiz" }),
              j.map((a) => /* @__PURE__ */ e.jsxs("option", { value: a.id, children: [
                a.icon ? `${a.icon} ` : "",
                a.name
              ] }, a.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: b.map((a, o) => /* @__PURE__ */ e.jsx(
        ne,
        {
          block: a,
          index: o,
          selected: a.id === w,
          onSelect: v,
          onPatch: G,
          onPatchSettings: Z,
          onChangeType: V,
          onDuplicate: q,
          onRemove: _,
          onAddAfter: J,
          onMove: Q,
          dragRef: R
        },
        a.id
      )) }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => U(s.ShortText), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-default py-4 text-sm font-bold text-text-secondary transition hover:border-focus hover:text-accent", children: "+ Soru Ekle" }),
      b.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-center text-sm text-text-tertiary", children: "Başlamak için bir soru ekleyin." })
    ] }),
    h && /* @__PURE__ */ e.jsx(oe, { formId: r, slug: d, onClose: () => T(!1) })
  ] });
}
function oe({ formId: t, slug: r, onClose: n }) {
  const [d, P] = c.useState(r || ""), [h, T] = c.useState(""), [y, B] = c.useState(""), [N, k] = c.useState(!1), [S, f] = c.useState(!1), [j, l] = c.useState(!1), [b, m] = c.useState(null), w = async () => {
    l(!0);
    try {
      const u = await D.post(`/api/app/form/${t}/publish`, {
        slug: (d == null ? void 0 : d.trim()) || null,
        publishSettingsJson: JSON.stringify({ startDate: h || null, endDate: y || null, kvkk: N, captcha: S })
      });
      m(u.slug || d), C("success", "Form yayınlandı.");
    } catch (u) {
      C("error", (u == null ? void 0 : u.message) || "Yayınlama başarısız.");
    } finally {
      l(!1);
    }
  }, v = b ? `${window.location.origin}/f/${b}` : null, F = () => {
    var u;
    v && ((u = navigator.clipboard) == null || u.writeText(v)), C("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: n, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-surface-raised p-6 shadow-xl", onClick: (u) => u.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Formu Yayınla" }),
      /* @__PURE__ */ e.jsx("button", { onClick: n, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
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
          /* @__PURE__ */ e.jsx("input", { type: "date", className: p, value: h, onChange: (u) => T(u.target.value) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bitiş" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: p, value: y, onChange: (u) => B(u.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(K, { label: "KVKK onayı iste", checked: N, onChange: k }),
      /* @__PURE__ */ e.jsx(K, { label: "Bot koruması", checked: S, onChange: f }),
      /* @__PURE__ */ e.jsxs("div", { className: "-mt-2 flex items-start gap-1 text-[11px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx(te, { text: "Başlangıç/Bitiş tarihi form penceresini sınırlar (dışında form kapalı). KVKK onayı açıkken genel formda zorunlu onay kutusu çıkar ve rıza kaydı tutulur. Bot koruması honeypot + minimum doldurma süresiyle otomatik gönderimleri eler (üçüncü taraf servis kullanılmaz)." }),
        /* @__PURE__ */ e.jsx("span", { children: "Bu ayarlar sunucu tarafında uygulanır" })
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
  const n = window.abp;
  n != null && n.notify && (t === "success" || t === "info") ? n.notify[t === "success" ? "success" : "info"](r) : n != null && n.message ? n.message[t === "error" ? "error" : t === "warn" ? "warn" : "info"](r) : console.log(`[${t}] ${r}`);
}
const M = document.getElementById("dynamic-assets-app-root");
M && X(M).render(/* @__PURE__ */ e.jsx(le, {}));
