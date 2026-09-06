import { b as X, j as e, r as c } from "./react-vendor-D57GAUXd.js";
import { a as D } from "./httpClient-DePjXdo1.js";
import { H as ee } from "./Hint-CNW95h3H.js";
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
}, F = /* @__PURE__ */ new Set([s.Select, s.MultiSelect, s.Dropdown]), te = /* @__PURE__ */ new Set([s.SectionHeader, s.Paragraph]), Y = [
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
], K = Object.fromEntries(Y.flatMap((t) => t.items.map((n) => [n.type, n.label]))), $ = () => Math.random().toString(36).slice(2, 10);
function L(t) {
  const n = { id: $(), type: t, content: K[t] || "Soru", settings: { required: !1 } };
  return F.has(t) && (n.settings.options = ["Seçenek 1", "Seçenek 2"]), t === s.SectionHeader && (n.content = "Bölüm Başlığı"), t === s.Paragraph && (n.content = "Açıklama metni…"), n;
}
const p = "w-full rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft", I = ({ checked: t, onChange: n, label: l }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
  /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium text-text-secondary", children: l }),
  /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: (d) => {
        d.stopPropagation(), n(!t);
      },
      className: `relative h-6 w-11 rounded-full transition-colors ${t ? "bg-accent" : "bg-neutral-200"}`,
      "aria-pressed": t,
      children: /* @__PURE__ */ e.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${t ? "left-[22px]" : "left-0.5"}` })
    }
  )
] });
function ae({ value: t, onChange: n }) {
  return /* @__PURE__ */ e.jsx(
    "select",
    {
      value: t,
      onClick: (l) => l.stopPropagation(),
      onChange: (l) => n(Number(l.target.value)),
      className: "shrink-0 rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm font-medium text-text-primary focus:border-focus focus:outline-none",
      children: Y.map((l) => /* @__PURE__ */ e.jsx("optgroup", { label: l.group, children: l.items.map((d) => /* @__PURE__ */ e.jsxs("option", { value: d.type, children: [
        d.icon,
        " ",
        d.label
      ] }, d.type)) }, l.group))
    }
  );
}
function se({ block: t }) {
  const n = t.settings || {};
  switch (t.type) {
    case s.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: p, placeholder: n.placeholder || "Uzun yanıt…" });
    case s.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: p, placeholder: n.placeholder || "0" });
    case s.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: p, placeholder: n.placeholder || "ornek@firma.com" });
    case s.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: p, placeholder: n.placeholder || "+90 5xx xxx xx xx" });
    case s.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: p });
    case s.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: p });
    case s.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-6 text-center text-sm text-text-tertiary", children: "📎 Dosya seç / sürükle" });
    case s.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: p, children: (n.options || []).map((l, d) => /* @__PURE__ */ e.jsx("option", { children: l }, d)) });
    case s.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-warning", children: "★★★★★" });
    case s.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (l, d) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-default text-xs text-text-secondary", children: d }, d)) });
    case s.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-default px-3 py-8 text-center text-sm text-text-tertiary", children: "✍️ İmza alanı" });
    case s.Address:
      return /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["Adres satırı", "İlçe", "İl", "Posta kodu"].map((l) => /* @__PURE__ */ e.jsx("input", { disabled: !0, className: p, placeholder: l }, l)) });
    case s.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "▦ Tablo ızgarası" });
    case s.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-default p-3 text-sm text-text-tertiary", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: p, placeholder: n.placeholder || "Kısa yanıt…" });
  }
}
function re({ block: t, index: n, selected: l, onSelect: d, onPatch: P, onPatchSettings: g, onChangeType: T, onDuplicate: y, onRemove: B, onAddAfter: v, onMove: N, dragRef: k }) {
  const m = t.settings || {}, j = te.has(t.type), S = c.useRef(null);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: S,
      onDragOver: (r) => r.preventDefault(),
      onDrop: () => N(n),
      onClick: () => d(t.id),
      className: `group relative rounded-2xl border bg-surface-raised p-5 transition ${l ? "border-focus shadow-md ring-1 ring-accent-soft" : "border-default hover:border-strong"}`,
      children: [
        l && /* @__PURE__ */ e.jsx("span", { className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-accent" }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            draggable: !0,
            onDragStart: (r) => {
              k.current = n, S.current && r.dataTransfer.setDragImage(S.current, 24, 24);
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
              onClick: (r) => r.stopPropagation(),
              onChange: (r) => P(t.id, { content: r.target.value }),
              placeholder: t.type === s.SectionHeader ? "Bölüm başlığı" : "Açıklama metni",
              className: `flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${t.type === s.SectionHeader ? "text-xl font-bold text-text-primary" : "text-sm text-text-secondary"}`
            }
          ) : /* @__PURE__ */ e.jsx(
            "input",
            {
              value: t.content,
              onClick: (r) => r.stopPropagation(),
              onChange: (r) => P(t.id, { content: r.target.value }),
              placeholder: "Soru metni…",
              className: "flex-1 border-b border-transparent bg-transparent p-0 pb-1 text-base font-semibold text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-0"
            }
          ),
          l && /* @__PURE__ */ e.jsx(ae, { value: t.type, onChange: (r) => T(t.id, r) }),
          !l && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary", children: K[t.type] })
        ] }),
        l && F.has(t.type) && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [
          (m.options || []).map((r, f) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", onClick: (w) => w.stopPropagation(), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: t.type === s.MultiSelect ? "☐" : "○" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: "flex-1 border-b border-subtle bg-transparent px-1 py-1 text-sm focus:border-focus focus:outline-none",
                value: r,
                onChange: (w) => {
                  const h = [...m.options];
                  h[f] = w.target.value, g(t.id, { options: h });
                }
              }
            ),
            /* @__PURE__ */ e.jsx("button", { className: "rounded p-1 text-text-tertiary hover:text-negative-500", onClick: () => g(t.id, { options: m.options.filter((w, h) => h !== f) }), children: "✕" })
          ] }, f)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "self-start text-sm font-medium text-accent hover:text-accent-600",
              onClick: (r) => {
                r.stopPropagation(), g(t.id, { options: [...m.options || [], `Seçenek ${(m.options || []).length + 1}`] });
              },
              children: "+ Seçenek ekle"
            }
          )
        ] }),
        !j && !F.has(t.type) && /* @__PURE__ */ e.jsx("div", { className: "mt-4", onClick: (r) => r.stopPropagation(), children: /* @__PURE__ */ e.jsx(se, { block: t }) }),
        l && !j && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 border-t border-subtle pt-4 sm:grid-cols-2", onClick: (r) => r.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Placeholder" }),
            /* @__PURE__ */ e.jsx("input", { className: p, value: m.placeholder || "", onChange: (r) => g(t.id, { placeholder: r.target.value }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yardım Metni" }),
            /* @__PURE__ */ e.jsx("input", { className: p, value: m.helpText || "", onChange: (r) => g(t.id, { helpText: r.target.value }) })
          ] }),
          (t.type === s.Number || t.type === s.Rating) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Min" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: p, value: m.min ?? "", onChange: (r) => g(t.id, { min: r.target.value === "" ? null : Number(r.target.value) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Max" }),
              /* @__PURE__ */ e.jsx("input", { type: "number", className: p, value: m.max ?? "", onChange: (r) => g(t.id, { max: r.target.value === "" ? null : Number(r.target.value) }) })
            ] })
          ] })
        ] }),
        l && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 border-t border-subtle pt-3", onClick: (r) => r.stopPropagation(), children: [
          /* @__PURE__ */ e.jsx("button", { onClick: () => N(n - 1, n), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Yukarı", children: "▲" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => N(n + 1, n), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Aşağı", children: "▼" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => y(t.id), className: "rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken", title: "Kopyala", children: "⧉" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => B(t.id), className: "rounded-lg p-2 text-negative-500 hover:bg-negative-50", title: "Sil", children: "🗑" }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          !j && /* @__PURE__ */ e.jsx(I, { label: "Zorunlu", checked: !!m.required, onChange: (r) => g(t.id, { required: r }) }),
          /* @__PURE__ */ e.jsx("div", { className: "mx-1 h-6 w-px bg-border-default" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => v(t.id), className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600", children: "+ Soru" })
        ] })
      ]
    }
  );
}
function ne() {
  const t = c.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [n, l] = c.useState(t), [d, P] = c.useState(""), [g, T] = c.useState(!1), [y, B] = c.useState(""), [v, N] = c.useState(""), [k, m] = c.useState(null), [j, S] = c.useState([]), [r, f] = c.useState([]), [w, h] = c.useState(null), [R, u] = c.useState(!1), [O, H] = c.useState(!!t), z = c.useRef(null);
  c.useEffect(() => {
    D.get("/api/app/form-category?MaxResultCount=100").then((a) => S(a.items || [])).catch(() => {
    });
  }, []), c.useEffect(() => {
    t && (async () => {
      try {
        const a = await D.get(`/api/app/form/${t}`);
        B(a.title || ""), P(a.slug || ""), N(a.description || ""), m(a.categoryId || null), f((a.blocks || []).slice().sort((o, i) => o.order - i.order).map((o) => ({
          id: o.id || $(),
          type: o.type,
          content: o.content,
          settings: oe(o.settings)
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
    f((i) => [...i, o]), h(o.id);
  }, J = (a) => {
    const o = L(s.ShortText);
    f((i) => {
      const x = i.findIndex((A) => A.id === a), b = [...i];
      return b.splice(x + 1, 0, o), b;
    }), h(o.id);
  }, _ = (a) => f((o) => o.filter((i) => i.id !== a)), q = (a) => f((o) => {
    const i = o.findIndex((A) => A.id === a);
    if (i < 0) return o;
    const x = { ...o[i], id: $(), settings: { ...o[i].settings } }, b = [...o];
    return b.splice(i + 1, 0, x), b;
  }), G = (a, o) => f((i) => i.map((x) => x.id === a ? { ...x, ...o } : x)), Z = (a, o) => f((i) => i.map((x) => x.id === a ? { ...x, settings: { ...x.settings, ...o } } : x)), V = (a, o) => f((i) => i.map((x) => {
    if (x.id !== a) return x;
    const b = { ...x.settings };
    return F.has(o) && !b.options && (b.options = ["Seçenek 1", "Seçenek 2"]), { ...x, type: o, settings: b };
  })), Q = (a, o) => f((i) => {
    const x = o ?? z.current;
    if (z.current = null, x == null || a < 0 || a >= i.length || x === a) return i;
    const b = [...i], [A] = b.splice(x, 1);
    return b.splice(a, 0, A), b;
  }), E = () => r.map((a, o) => ({
    type: a.type,
    order: o + 1,
    content: a.content || K[a.type] || "Soru",
    settings: JSON.stringify(a.settings || {})
  })), W = async () => {
    if (!y.trim()) return C("warn", "Lütfen forma bir başlık verin.");
    u(!0);
    try {
      if (n)
        await D.put(`/api/app/form/${n}`, { title: y.trim(), description: v.trim() || null, categoryId: k, themeJson: null, blocks: [] }), await D.put(`/api/app/form/${n}/blocks`, { blocks: E() }), C("success", "Form kaydedildi.");
      else {
        const a = await D.post("/api/app/form", { title: y.trim(), description: v.trim() || null, categoryId: k, themeJson: null, blocks: E() });
        l(a.id), P(a.slug || "");
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
          r.length,
          " alan"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("button", { onClick: W, disabled: R, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken disabled:opacity-50", children: R ? "Kaydediliyor…" : n ? "Kaydet" : "Oluştur" }),
        n && /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${n}`, className: "rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken", children: "Yanıtlar" }),
        n && /* @__PURE__ */ e.jsx("button", { onClick: () => T(!0), className: "rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-600", children: "Yayınla" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative mb-4 overflow-hidden rounded-2xl border border-default bg-surface-raised p-6", children: [
        /* @__PURE__ */ e.jsx("span", { className: "absolute inset-x-0 top-0 h-1.5 bg-accent" }),
        /* @__PURE__ */ e.jsx("input", { value: y, onChange: (a) => B(a.target.value), placeholder: "Form başlığı…", className: "w-full border-none bg-transparent p-0 text-3xl font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsx("input", { value: v, onChange: (a) => N(a.target.value), placeholder: "Form açıklaması (opsiyonel)…", className: "mt-2 w-full border-none bg-transparent p-0 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:ring-0" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: k || "",
            onChange: (a) => m(a.target.value || null),
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
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: r.map((a, o) => /* @__PURE__ */ e.jsx(
        re,
        {
          block: a,
          index: o,
          selected: a.id === w,
          onSelect: h,
          onPatch: G,
          onPatchSettings: Z,
          onChangeType: V,
          onDuplicate: q,
          onRemove: _,
          onAddAfter: J,
          onMove: Q,
          dragRef: z
        },
        a.id
      )) }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => U(s.ShortText), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-default py-4 text-sm font-bold text-text-secondary transition hover:border-focus hover:text-accent", children: "+ Soru Ekle" }),
      r.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-center text-sm text-text-tertiary", children: "Başlamak için bir soru ekleyin." })
    ] }),
    g && /* @__PURE__ */ e.jsx(le, { formId: n, slug: d, onClose: () => T(!1) })
  ] });
}
function le({ formId: t, slug: n, onClose: l }) {
  const [d, P] = c.useState(n || ""), [g, T] = c.useState(""), [y, B] = c.useState(""), [v, N] = c.useState(!1), [k, m] = c.useState(!1), [j, S] = c.useState(!1), [r, f] = c.useState(null), w = async () => {
    S(!0);
    try {
      const u = await D.post(`/api/app/form/${t}/publish`, {
        slug: (d == null ? void 0 : d.trim()) || null,
        publishSettingsJson: JSON.stringify({ startDate: g || null, endDate: y || null, kvkk: v, captcha: k })
      });
      f(u.slug || d), C("success", "Form yayınlandı.");
    } catch (u) {
      C("error", (u == null ? void 0 : u.message) || "Yayınlama başarısız.");
    } finally {
      S(!1);
    }
  }, h = r ? `${window.location.origin}/f/${r}` : null, R = () => {
    var u;
    h && ((u = navigator.clipboard) == null || u.writeText(h)), C("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: l, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-surface-raised p-6 shadow-xl", onClick: (u) => u.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Formu Yayınla" }),
      /* @__PURE__ */ e.jsx("button", { onClick: l, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    h ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: "rounded-xl bg-positive-50 p-3 text-sm text-positive-700", children: "✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz." }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Yayın bağlantısı" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: p, value: h, onClick: (u) => u.target.select() }),
          /* @__PURE__ */ e.jsx("button", { onClick: R, className: "shrink-0 rounded-xl border border-default px-3 py-2 text-sm font-medium hover:bg-surface-sunken", children: "Kopyala" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: h, target: "_blank", rel: "noreferrer", className: "rounded-xl bg-accent px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-accent-600", children: "Formu yeni sekmede aç" })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bağlantı adresi (slug)" }),
        /* @__PURE__ */ e.jsx("input", { className: p, value: d, onChange: (u) => P(u.target.value), placeholder: "musteri-memnuniyet" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Başlangıç" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: p, value: g, onChange: (u) => T(u.target.value) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "mb-1 block text-[11px] font-semibold uppercase text-text-tertiary", children: "Bitiş" }),
          /* @__PURE__ */ e.jsx("input", { type: "date", className: p, value: y, onChange: (u) => B(u.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(I, { label: "KVKK onayı iste", checked: v, onChange: N }),
      /* @__PURE__ */ e.jsx(I, { label: "Bot koruması", checked: k, onChange: m }),
      /* @__PURE__ */ e.jsxs("div", { className: "-mt-2 flex items-start gap-1 text-[11px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx(ee, { text: "Başlangıç/Bitiş tarihi form penceresini sınırlar (dışında form kapalı). KVKK onayı açıkken genel formda zorunlu onay kutusu çıkar ve rıza kaydı tutulur. Bot koruması honeypot + minimum doldurma süresiyle otomatik gönderimleri eler (üçüncü taraf servis kullanılmaz)." }),
        /* @__PURE__ */ e.jsx("span", { children: "Bu ayarlar sunucu tarafında uygulanır" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { onClick: w, disabled: j, className: "mt-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: j ? "Yayınlanıyor…" : "Yayınla" })
    ] })
  ] }) });
}
function oe(t) {
  if (!t) return { required: !1 };
  try {
    return typeof t == "string" ? JSON.parse(t) : t;
  } catch {
    return { required: !1 };
  }
}
function C(t, n) {
  const l = window.abp;
  l != null && l.notify && (t === "success" || t === "info") ? l.notify[t === "success" ? "success" : "info"](n) : l != null && l.message ? l.message[t === "error" ? "error" : t === "warn" ? "warn" : "info"](n) : console.log(`[${t}] ${n}`);
}
const M = document.getElementById("dynamic-assets-app-root");
M && X(M).render(/* @__PURE__ */ e.jsx(ne, {}));
export {
  re as QuestionCard
};
