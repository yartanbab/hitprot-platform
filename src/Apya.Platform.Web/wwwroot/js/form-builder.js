import { b as ee, j as e, r as u } from "./react-vendor-D57GAUXd.js";
import { a as B } from "./httpClient-DePjXdo1.js";
import { H as te } from "./Hint-CNW95h3H.js";
import { p as ae } from "./publicFormLink-CJ_6ABDU.js";
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
}, F = /* @__PURE__ */ new Set([n.Select, n.MultiSelect, n.Dropdown]), se = /* @__PURE__ */ new Set([n.SectionHeader, n.Paragraph]), Y = [
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
], E = Object.fromEntries(Y.flatMap((t) => t.items.map((s) => [s.type, s.label]))), $ = () => Math.random().toString(36).slice(2, 10), re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, K = (t) => t.map((s, l) => ({
  id: re.test(s.id) ? s.id : null,
  type: s.type,
  order: l + 1,
  content: s.content || E[s.type] || "Soru",
  settings: JSON.stringify(s.settings || {})
})), ne = (t, s) => {
  const l = new Map((s || []).map((i) => [i.order, i.id]));
  return Object.fromEntries(t.map((i, y) => [i.id, l.get(y + 1)]).filter(([i, y]) => y && i !== y));
};
function O(t) {
  const s = { id: $(), type: t, content: E[t] || "Soru", settings: { required: !1 } };
  return F.has(t) && (s.settings.options = ["Seçenek 1", "Seçenek 2"]), t === n.SectionHeader && (s.content = "Bölüm Başlığı"), t === n.Paragraph && (s.content = "Açıklama metni…"), s;
}
const m = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft", z = ({ checked: t, onChange: s, label: l }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
  /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium text-text-secondary", children: l }),
  /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: (i) => {
        i.stopPropagation(), s(!t);
      },
      className: `relative h-6 w-11 rounded-full transition-colors ${t ? "bg-accent" : "bg-neutral-200"}`,
      "aria-pressed": t,
      children: /* @__PURE__ */ e.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${t ? "left-[22px]" : "left-0.5"}` })
    }
  )
] });
function le({ value: t, onChange: s }) {
  return /* @__PURE__ */ e.jsx(
    "select",
    {
      value: t,
      onClick: (l) => l.stopPropagation(),
      onChange: (l) => s(Number(l.target.value)),
      className: "shrink-0 rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm font-medium text-text-primary focus:border-focus focus:outline-none",
      children: Y.map((l) => /* @__PURE__ */ e.jsx("optgroup", { label: l.group, children: l.items.map((i) => /* @__PURE__ */ e.jsxs("option", { value: i.type, children: [
        i.icon,
        " ",
        i.label
      ] }, i.type)) }, l.group))
    }
  );
}
function oe({ block: t }) {
  const s = t.settings || {};
  switch (t.type) {
    case n.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: m, placeholder: s.placeholder || "Uzun yanıt…" });
    case n.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: m, placeholder: s.placeholder || "0" });
    case n.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: m, placeholder: s.placeholder || "ornek@firma.com" });
    case n.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: m, placeholder: s.placeholder || "+90 5xx xxx xx xx" });
    case n.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: m });
    case n.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: m });
    case n.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-6 text-center text-sm text-text-tertiary", children: "📎 Dosya seç / sürükle" });
    case n.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: m, children: (s.options || []).map((l, i) => /* @__PURE__ */ e.jsx("option", { children: l }, i)) });
    case n.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-warning", children: "★★★★★" });
    case n.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (l, i) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-default text-xs text-text-secondary", children: i }, i)) });
    case n.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-8 text-center text-sm text-text-tertiary", children: "✍️ İmza alanı" });
    case n.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["Adres satırı", "İlçe", "İl", "Posta kodu"].map((l) => /* @__PURE__ */ e.jsx("input", { disabled: !0, className: m, placeholder: l }, l)) });
    case n.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "▦ Tablo ızgarası" });
    case n.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: m, placeholder: s.placeholder || "Kısa yanıt…" });
  }
}
function ie({ block: t, index: s, selected: l, onSelect: i, onPatch: y, onPatchSettings: b, onChangeType: T, onDuplicate: j, onRemove: D, onAddAfter: N, onMove: k, dragRef: S }) {
  const h = t.settings || {}, v = se.has(t.type), w = u.useRef(null);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: w,
      onDragOver: (r) => r.preventDefault(),
      onDrop: () => k(s),
      onClick: () => i(t.id),
      className: `group relative rounded-2xl border bg-surface-raised p-5 transition ${l ? "border-focus shadow-md ring-1 ring-accent-soft" : "border-default hover:border-strong"}`,
      children: [
        l && /* @__PURE__ */ e.jsx("span", { className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-accent" }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            draggable: !0,
            onDragStart: (r) => {
              S.current = s, w.current && r.dataTransfer.setDragImage(w.current, 24, 24);
            },
            title: "Sürükle",
            className: `absolute -top-2 left-1/2 -translate-x-1/2 cursor-grab px-4 text-text-tertiary transition-opacity active:cursor-grabbing ${l ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`,
            children: "⠿"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3", children: [
          v ? /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (r) => r.stopPropagation(),
              onChange: (r) => y(t.id, { content: r.target.value }),
              placeholder: t.type === n.SectionHeader ? "Bölüm başlığı" : "Açıklama metni",
              className: `flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${t.type === n.SectionHeader ? "text-xl font-bold text-text-primary" : "text-sm text-text-secondary"}`
            }
          ) : /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (r) => r.stopPropagation(),
              onChange: (r) => y(t.id, { content: r.target.value }),
              placeholder: "Soru metni…",
              className: "flex-1 border-b border-transparent bg-transparent p-0 pb-1 text-base font-semibold text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-0"
            }
          ),
          l && /* @__PURE__ */ e.jsx(le, { value: t.type, onChange: (r) => T(t.id, r) }),
          !l && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary", children: E[t.type] })
        ] }),
        l && F.has(t.type) && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [
          (h.options || []).map((r, f) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", onClick: (C) => C.stopPropagation(), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: t.type === n.MultiSelect ? "☐" : "○" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: "flex-1 border-b border-subtle bg-transparent px-1 py-1 text-sm focus:border-focus focus:outline-none",
                value: r,
                onChange: (C) => {
                  const g = [...h.options];
                  g[f] = C.target.value, b(t.id, { options: g });
                }
              }
            ),
            /* @__PURE__ */ e.jsx("button", { className: "rounded p-1 text-text-tertiary hover:text-negative-500", onClick: () => b(t.id, { options: h.options.filter((C, g) => g !== f) }), children: "✕" })
          ] }, f)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "self-start text-sm font-medium text-accent hover:text-accent-600",
              onClick: (r) => {
                r.stopPropagation(), b(t.id, { options: [...h.options || [], `Seçenek ${(h.options || []).length + 1}`] });
              },
              children: "+ Seçenek ekle"
            }
          )
        ] }),
        !v && !F.has(t.type) && /* @__PURE__ */ e.jsx("div", { className: "mt-4", onClick: (r) => r.stopPropagation(), children: /* @__PURE__ */ e.jsx(oe, { block: t }) }),
        l && !v && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 border-t border-subtle pt-4 sm:grid-cols-2", onClick: (r) => r.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Placeholder" }),
            /* @__PURE__ */ e.jsx("input", { className: m, value: h.placeholder || "", onChange: (r) => b(t.id, { placeholder: r.target.value }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yardım Metni" }),
            /* @__PURE__ */ e.jsx("input", { className: m, value: h.helpText || "", onChange: (r) => b(t.id, { helpText: r.target.value }) })
          ] }),
          (t.type === n.Number || t.type === n.Rating) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Min" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: m, value: h.min ?? "", onChange: (r) => b(t.id, { min: r.target.value === "" ? null : Number(r.target.value) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Max" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: m, value: h.max ?? "", onChange: (r) => b(t.id, { max: r.target.value === "" ? null : Number(r.target.value) }) })
            ] })
          ] })
        ] }),
        l && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 border-t border-subtle pt-3", onClick: (r) => r.stopPropagation(), children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => k(s - 1, s), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Yukarı", children: "▲" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => k(s + 1, s), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Aşağı", children: "▼" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => j(t.id), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Kopyala", children: "⧉" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => D(t.id), className: "rounded-lg p-2 text-negative-500 hover:bg-negative-50", title: "Sil", children: "🗑" }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          !v && /* @__PURE__ */ e.jsx(z, { label: "Zorunlu", checked: !!h.required, onChange: (r) => b(t.id, { required: r }) }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => N(t.id), className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600", children: "+ Soru" })
        ] })
      ]
    }
  );
}
function ce() {
  const t = u.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [s, l] = u.useState(t), [i, y] = u.useState(""), [b, T] = u.useState(!1), [j, D] = u.useState(""), [N, k] = u.useState(""), [S, h] = u.useState(null), [v, w] = u.useState([]), [r, f] = u.useState([]), [C, g] = u.useState(null), [R, x] = u.useState(!1), [H, U] = u.useState(!!t), I = u.useRef(null);
  u.useEffect(() => {
    B.get("/api/app/form-category?MaxResultCount=100").then((a) => w(a.items || [])).catch(() => {
    });
  }, []), u.useEffect(() => {
    t && (async () => {
      try {
        const a = await B.get(`/api/app/form/${t}`);
        D(a.title || ""), y(a.slug || ""), k(a.description || ""), h(a.categoryId || null), f((a.blocks || []).slice().sort((o, c) => o.order - c.order).map((o) => ({
          id: o.id || $(),
          type: o.type,
          content: o.content,
          settings: ue(o.settings)
        })));
      } catch (a) {
        P("error", (a == null ? void 0 : a.message) || "Form yüklenemedi.");
      } finally {
        U(!1);
      }
    })();
  }, [t]);
  const _ = (a = n.ShortText) => {
    const o = O(a);
    f((c) => [...c, o]), g(o.id);
  }, J = (a) => {
    const o = O(n.ShortText);
    f((c) => {
      const d = c.findIndex((A) => A.id === a), p = [...c];
      return p.splice(d + 1, 0, o), p;
    }), g(o.id);
  }, q = (a) => f((o) => o.filter((c) => c.id !== a)), G = (a) => f((o) => {
    const c = o.findIndex((A) => A.id === a);
    if (c < 0) return o;
    const d = { ...o[c], id: $(), settings: { ...o[c].settings } }, p = [...o];
    return p.splice(c + 1, 0, d), p;
  }), Z = (a, o) => f((c) => c.map((d) => d.id === a ? { ...d, ...o } : d)), V = (a, o) => f((c) => c.map((d) => d.id === a ? { ...d, settings: { ...d.settings, ...o } } : d)), Q = (a, o) => f((c) => c.map((d) => {
    if (d.id !== a) return d;
    const p = { ...d.settings };
    return F.has(o) && !p.options && (p.options = ["Seçenek 1", "Seçenek 2"]), { ...d, type: o, settings: p };
  })), W = (a, o) => f((c) => {
    const d = o ?? I.current;
    if (I.current = null, d == null || a < 0 || a >= c.length || d === a) return c;
    const p = [...c], [A] = p.splice(d, 1);
    return p.splice(a, 0, A), p;
  }), M = (a, o) => {
    const c = ne(a, o);
    Object.keys(c).length && (f((d) => d.map((p) => c[p.id] ? { ...p, id: c[p.id] } : p)), g((d) => c[d] || d));
  }, X = async () => {
    if (!j.trim()) return P("warn", "Lütfen forma bir başlık verin.");
    x(!0);
    try {
      if (s) {
        await B.put(`/api/app/form/${s}`, { title: j.trim(), description: N.trim() || null, categoryId: S, themeJson: null, blocks: [] });
        const a = await B.put(`/api/app/form/${s}/blocks`, { blocks: K(r) });
        M(r, a == null ? void 0 : a.blocks), P("success", "Form kaydedildi.");
      } else {
        const a = await B.post("/api/app/form", { title: j.trim(), description: N.trim() || null, categoryId: S, themeJson: null, blocks: K(r) });
        M(r, a.blocks), l(a.id), y(a.slug || "");
        const o = new URL(window.location.href);
        o.searchParams.set("id", a.id), window.history.replaceState({}, "", o), P("success", "Form oluşturuldu.");
      }
    } catch (a) {
      P("error", (a == null ? void 0 : a.message) || "Kaydetme başarısız.");
    } finally {
      x(!1);
    }
  };
  return H ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-text-tertiary", children: "Form yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "min-h-[calc(100vh-120px)] bg-surface-sunken pb-24", children: [
    /* @__PURE__ */ e.jsx("div", { className: "sticky top-0 z-20 border-b border-default bg-surface-raised", children: /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets", className: "text-sm font-semibold text-text-secondary hover:text-text-primary", children: "← Formlar" }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary", children: [
          r.length,
          " alan"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("button", { onClick: X, disabled: R, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken disabled:opacity-50", children: R ? "Kaydediliyor…" : s ? "Kaydet" : "Oluştur" }),
        s && /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${s}`, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken", children: "Yanıtlar" }),
        s && /* @__PURE__ */ e.jsx("button", { onClick: () => T(!0), className: "rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-600", children: "Yayınla" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative mb-4 overflow-hidden rounded-2xl border border-default bg-surface-raised p-6", children: [
        /* @__PURE__ */ e.jsx("span", { className: "absolute inset-x-0 top-0 h-1.5 bg-accent" }),
        /* @__PURE__ */ e.jsx("input", { value: j, onChange: (a) => D(a.target.value), placeholder: "Form başlığı…", className: "w-full border-none bg-transparent p-0 text-3xl font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsx("input", { value: N, onChange: (a) => k(a.target.value), placeholder: "Form açıklaması (opsiyonel)…", className: "mt-2 w-full border-none bg-transparent p-0 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: S || "",
            onChange: (a) => h(a.target.value || null),
            className: "mt-3 rounded-lg border border-default bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-text-secondary focus:border-accent focus:outline-none",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Kategorisiz" }),
              v.map((a) => /* @__PURE__ */ e.jsxs("option", { value: a.id, children: [
                a.icon ? `${a.icon} ` : "",
                a.name
              ] }, a.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: r.map((a, o) => /* @__PURE__ */ e.jsx(
        ie,
        {
          block: a,
          index: o,
          selected: a.id === C,
          onSelect: g,
          onPatch: Z,
          onPatchSettings: V,
          onChangeType: Q,
          onDuplicate: G,
          onRemove: q,
          onAddAfter: J,
          onMove: W,
          dragRef: I
        },
        a.id
      )) }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => _(n.ShortText), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-default py-4 text-sm font-bold text-text-secondary transition hover:border-focus hover:text-accent", children: "+ Soru Ekle" }),
      r.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-center text-sm text-text-tertiary", children: "Başlamak için bir soru ekleyin." })
    ] }),
    b && /* @__PURE__ */ e.jsx(de, { formId: s, slug: i, onClose: () => T(!1) })
  ] });
}
function de({ formId: t, slug: s, onClose: l }) {
  const [i, y] = u.useState(s || ""), [b, T] = u.useState(""), [j, D] = u.useState(""), [N, k] = u.useState(!1), [S, h] = u.useState(!1), [v, w] = u.useState(!1), [r, f] = u.useState(null), C = async () => {
    w(!0);
    try {
      const x = await B.post(`/api/app/form/${t}/publish`, {
        slug: (i == null ? void 0 : i.trim()) || null,
        publishSettingsJson: JSON.stringify({ startDate: b || null, endDate: j || null, kvkk: N, captcha: S })
      });
      f(x.slug || i), P("success", "Form yayınlandı.");
    } catch (x) {
      P("error", (x == null ? void 0 : x.message) || "Yayınlama başarısız.");
    } finally {
      w(!1);
    }
  }, g = r ? `${window.location.origin}${ae(r)}` : null, R = () => {
    var x;
    g && ((x = navigator.clipboard) == null || x.writeText(g)), P("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: l, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-surface-raised p-6 shadow-xl", onClick: (x) => x.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Formu Yayınla" }),
      /* @__PURE__ */ e.jsx("button", { onClick: l, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    g ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: "rounded-xl bg-positive-50 p-3 text-sm text-positive-700", children: "✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yayın bağlantısı" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: m, value: g, onClick: (x) => x.target.select() }),
          /* @__PURE__ */ e.jsx("button", { onClick: R, className: "shrink-0 rounded-xl border border-default px-3 py-2 text-sm font-medium hover:bg-surface-sunken", children: "Kopyala" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: g, target: "_blank", rel: "noreferrer", className: "rounded-xl bg-accent px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-accent-600", children: "Formu yeni sekmede aç" })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bağlantı adresi (slug)" }),
        /* @__PURE__ */ e.jsx("input", { className: m, value: i, onChange: (x) => y(x.target.value), placeholder: "musteri-memnuniyet" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Başlangıç" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: m, value: b, onChange: (x) => T(x.target.value) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bitiş" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: m, value: j, onChange: (x) => D(x.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(z, { label: "KVKK onayı iste", checked: N, onChange: k }),
      /* @__PURE__ */ e.jsx(z, { label: "Bot koruması", checked: S, onChange: h }),
      /* @__PURE__ */ e.jsxs("div", { className: "-mt-2 flex items-start gap-1 text-[11px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx(te, { text: "Başlangıç/Bitiş tarihi form penceresini sınırlar (dışında form kapalı). KVKK onayı açıkken genel formda zorunlu onay kutusu çıkar ve rıza kaydı tutulur. Bot koruması honeypot + minimum doldurma süresiyle otomatik gönderimleri eler (üçüncü taraf servis kullanılmaz)." }),
        /* @__PURE__ */ e.jsx("span", { children: "Bu ayarlar sunucu tarafında uygulanır" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { onClick: C, disabled: v, className: "mt-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: v ? "Yayınlanıyor…" : "Yayınla" })
    ] })
  ] }) });
}
function ue(t) {
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
const L = document.getElementById("dynamic-assets-app-root");
L && ee(L).render(/* @__PURE__ */ e.jsx(ce, {}));
export {
  ie as QuestionCard,
  K as payloadBlocks,
  ne as serverIdMap
};
