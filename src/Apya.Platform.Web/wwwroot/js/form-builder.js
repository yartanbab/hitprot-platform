import { c as V, j as e, r as x } from "./vendor.js";
import { a as P } from "./vendor2.js";
const l = {
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
}, q = /* @__PURE__ */ new Set([l.Select, l.MultiSelect, l.Dropdown]), L = /* @__PURE__ */ new Set([l.SectionHeader, l.Paragraph]), H = [
  {
    group: "Metin & Sayı",
    items: [
      { type: l.ShortText, label: "Kısa Metin", icon: "✏️" },
      { type: l.LongText, label: "Uzun Metin", icon: "📝" },
      { type: l.Number, label: "Sayısal", icon: "🔢" },
      { type: l.Email, label: "E-Posta", icon: "✉️" },
      { type: l.Phone, label: "Telefon", icon: "📞" }
    ]
  },
  {
    group: "Seçim",
    items: [
      { type: l.Select, label: "Tekli Seçim", icon: "🔘" },
      { type: l.MultiSelect, label: "Çoklu Seçim", icon: "☑️" },
      { type: l.Dropdown, label: "Açılır Liste", icon: "⬇️" }
    ]
  },
  {
    group: "Tarih & Zaman",
    items: [
      { type: l.DatePicker, label: "Tarih", icon: "📅" },
      { type: l.TimePicker, label: "Saat", icon: "🕐" }
    ]
  },
  {
    group: "Özel",
    items: [
      { type: l.FilePicker, label: "Dosya Yükleme", icon: "📎" },
      { type: l.Rating, label: "Derecelendirme", icon: "⭐" },
      { type: l.Nps, label: "NPS (0-10)", icon: "📊" },
      { type: l.Signature, label: "İmza", icon: "✍️" },
      { type: l.Address, label: "Adres", icon: "📍" }
    ]
  },
  {
    group: "Düzen",
    items: [
      { type: l.SectionHeader, label: "Bölüm Başlığı", icon: "🏷️" },
      { type: l.Paragraph, label: "Açıklama", icon: "💬" }
    ]
  }
], M = Object.fromEntries(
  H.flatMap((n) => n.items.map((r) => [r.type, r.label]))
), $ = () => Math.random().toString(36).slice(2, 10);
function Q(n) {
  const r = { id: $(), type: n, content: M[n] || "Soru", settings: { required: !1 } };
  return q.has(n) && (r.settings.options = ["Seçenek 1", "Seçenek 2"]), n === l.SectionHeader && (r.content = "Bölüm Başlığı"), n === l.Paragraph && (r.content = "Açıklama metni…"), r;
}
const z = ({ checked: n, onChange: r, label: u }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center justify-between gap-3 cursor-pointer select-none", children: [
  /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium text-slate-600", children: u }),
  /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: () => r(!n),
      className: `relative h-6 w-11 rounded-full transition-colors ${n ? "bg-indigo-600" : "bg-slate-300"}`,
      "aria-pressed": n,
      children: /* @__PURE__ */ e.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${n ? "left-[22px]" : "left-0.5"}` })
    }
  )
] }), h = ({ label: n, children: r }) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
  /* @__PURE__ */ e.jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-slate-400", children: n }),
  r
] }), d = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";
function W({ block: n }) {
  const r = n.settings || {};
  switch (n.type) {
    case l.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: d, placeholder: r.placeholder || "Uzun yanıt…" });
    case l.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: d, placeholder: r.placeholder || "0" });
    case l.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: d, placeholder: r.placeholder || "ornek@firma.com" });
    case l.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: d, placeholder: r.placeholder || "+90 5xx xxx xx xx" });
    case l.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: d });
    case l.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: d });
    case l.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-400", children: "📎 Dosya seç / sürükle" });
    case l.Select:
    case l.MultiSelect:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (r.options || []).map((u, p) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-600", children: [
        /* @__PURE__ */ e.jsx("span", { className: `inline-block h-4 w-4 border border-slate-300 ${n.type === l.Select ? "rounded-full" : "rounded"}` }),
        u
      ] }, p)) });
    case l.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: d, children: (r.options || []).map((u, p) => /* @__PURE__ */ e.jsx("option", { children: u }, p)) });
    case l.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-amber-400", children: "★★★★★" });
    case l.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (u, p) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs text-slate-500", children: p }, p)) });
    case l.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-slate-200 px-3 py-8 text-center text-sm text-slate-400", children: "✍️ İmza alanı" });
    case l.Address:
      return /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ e.jsx("input", { disabled: !0, className: d, placeholder: "Adres satırı" }),
        /* @__PURE__ */ e.jsx("input", { disabled: !0, className: d, placeholder: "İlçe" }),
        /* @__PURE__ */ e.jsx("input", { disabled: !0, className: d, placeholder: "İl" }),
        /* @__PURE__ */ e.jsx("input", { disabled: !0, className: d, placeholder: "Posta kodu" })
      ] });
    case l.SectionHeader:
      return /* @__PURE__ */ e.jsx("div", { className: "border-b border-slate-200 pb-1 text-lg font-bold text-slate-700", children: n.content });
    case l.Paragraph:
      return /* @__PURE__ */ e.jsx("p", { className: "text-sm text-slate-500", children: n.content });
    case l.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-slate-200 p-3 text-sm text-slate-400", children: "▦ Tablo ızgarası" });
    case l.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-slate-200 p-3 text-sm text-slate-400", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: d, placeholder: r.placeholder || "Kısa yanıt…" });
  }
}
function X() {
  const n = x.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [r, u] = x.useState(n), [p, C] = x.useState(""), [T, D] = x.useState(!1), [y, B] = x.useState(""), [N, A] = x.useState(""), [g, m] = x.useState([]), [v, S] = x.useState(null), [k, F] = x.useState(!1), [E, j] = x.useState(!!n), w = x.useRef(null);
  x.useEffect(() => {
    n && (async () => {
      try {
        const t = await P.get(`/api/app/form/${n}`);
        B(t.title || ""), C(t.slug || ""), A(t.description || ""), m(
          (t.blocks || []).sort((a, o) => a.order - o.order).map((a) => ({
            id: a.id || $(),
            type: a.type,
            content: a.content,
            settings: te(a.settings)
          }))
        );
      } catch (t) {
        f("error", (t == null ? void 0 : t.message) || "Form yüklenemedi.");
      } finally {
        j(!1);
      }
    })();
  }, [n]);
  const s = g.find((t) => t.id === v) || null, J = (t) => {
    const a = Q(t);
    m((o) => [...o, a]), S(a.id);
  }, I = (t) => m((a) => a.filter((o) => o.id !== t)), U = (t) => m((a) => {
    const o = a.findIndex((G) => G.id === t);
    if (o < 0) return a;
    const i = { ...a[o], id: $(), settings: { ...a[o].settings } }, c = [...a];
    return c.splice(o + 1, 0, i), c;
  }), R = (t, a) => m((o) => {
    const i = a === "up" ? t - 1 : t + 1;
    if (i < 0 || i >= o.length) return o;
    const c = [...o];
    return [c[t], c[i]] = [c[i], c[t]], c;
  }), Y = (t, a) => m((o) => o.map((i) => i.id === t ? { ...i, ...a } : i)), b = (t, a) => m((o) => o.map((i) => i.id === t ? { ...i, settings: { ...i.settings, ...a } } : i)), _ = (t) => {
    const a = w.current;
    w.current = null, !(a == null || a === t) && m((o) => {
      const i = [...o], [c] = i.splice(a, 1);
      return i.splice(t, 0, c), i;
    });
  }, K = () => g.map((t, a) => ({
    type: t.type,
    order: a + 1,
    content: t.content || M[t.type] || "Soru",
    settings: JSON.stringify(t.settings || {})
  })), Z = async () => {
    if (!y.trim()) return f("warn", "Lütfen forma bir başlık verin.");
    F(!0);
    try {
      if (r)
        await P.put(`/api/app/form/${r}`, {
          title: y.trim(),
          description: N.trim() || null,
          categoryId: null,
          themeJson: null,
          blocks: []
        }), await P.put(`/api/app/form/${r}/blocks`, { blocks: K() }), f("success", "Form kaydedildi.");
      else {
        const t = await P.post("/api/app/form", {
          title: y.trim(),
          description: N.trim() || null,
          categoryId: null,
          themeJson: null,
          blocks: K()
        });
        u(t.id), C(t.slug || "");
        const a = new URL(window.location.href);
        a.searchParams.set("id", t.id), window.history.replaceState({}, "", a), f("success", "Form oluşturuldu.");
      }
    } catch (t) {
      f("error", (t == null ? void 0 : t.message) || "Kaydetme başarısız.");
    } finally {
      F(!1);
    }
  };
  return E ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-slate-400", children: "Form yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "flex h-[calc(100vh-120px)] min-h-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-slate-800", children: [
    /* @__PURE__ */ e.jsxs("aside", { className: "w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-4", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "mb-3 text-xs font-bold uppercase tracking-widest text-indigo-500", children: "Soru Bileşenleri" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-4", children: H.map((t) => /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-semibold uppercase text-slate-400", children: t.group }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: t.items.map((a) => /* @__PURE__ */ e.jsxs(
          "button",
          {
            onClick: () => J(a.type),
            className: "flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50",
            children: [
              /* @__PURE__ */ e.jsx("span", { children: a.icon }),
              a.label
            ]
          },
          a.type
        )) })
      ] }, t.group)) })
    ] }),
    /* @__PURE__ */ e.jsxs("main", { className: "flex-1 overflow-y-auto p-8", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-between", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-slate-400", children: [
          g.length,
          " alan"
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: Z,
              disabled: k,
              className: "rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50",
              children: k ? "Kaydediliyor…" : r ? "Kaydet" : "Oluştur"
            }
          ),
          r && /* @__PURE__ */ e.jsx(
            "a",
            {
              href: `/DynamicAssets/Responses?formId=${r}`,
              className: "rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50",
              children: "Yanıtlar"
            }
          ),
          r && /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: () => D(!0),
              className: "rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700",
              children: "Yayınla"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mx-auto mt-4 max-w-2xl rounded-2xl border border-slate-200 bg-white p-8", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            value: y,
            onChange: (t) => B(t.target.value),
            placeholder: "Form başlığı…",
            className: "w-full border-none p-0 text-3xl font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-0"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            value: N,
            onChange: (t) => A(t.target.value),
            placeholder: "Form açıklaması (opsiyonel)…",
            className: "mt-2 w-full border-none p-0 text-sm text-slate-500 placeholder-slate-300 focus:outline-none focus:ring-0"
          }
        ),
        g.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "mt-8 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center text-slate-400", children: "Soldan bir bileşen ekleyin" }) : /* @__PURE__ */ e.jsx("div", { className: "mt-6 flex flex-col gap-3", children: g.map((t, a) => {
          var i;
          const o = t.id === v;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              draggable: !0,
              onDragStart: () => w.current = a,
              onDragOver: (c) => c.preventDefault(),
              onDrop: () => _(a),
              onClick: () => S(t.id),
              className: `group relative cursor-pointer rounded-xl border p-4 transition ${o ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200 hover:border-slate-300"}`,
              children: [
                /* @__PURE__ */ e.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600", children: M[t.type] || "Alan" }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 opacity-0 transition group-hover:opacity-100", children: [
                    /* @__PURE__ */ e.jsx("button", { onClick: (c) => {
                      c.stopPropagation(), R(a, "up");
                    }, className: "rounded p-1 text-slate-400 hover:bg-slate-100", title: "Yukarı", children: "▲" }),
                    /* @__PURE__ */ e.jsx("button", { onClick: (c) => {
                      c.stopPropagation(), R(a, "down");
                    }, className: "rounded p-1 text-slate-400 hover:bg-slate-100", title: "Aşağı", children: "▼" }),
                    /* @__PURE__ */ e.jsx("button", { onClick: (c) => {
                      c.stopPropagation(), U(t.id);
                    }, className: "rounded p-1 text-slate-400 hover:bg-slate-100", title: "Kopyala", children: "⧉" }),
                    /* @__PURE__ */ e.jsx("button", { onClick: (c) => {
                      c.stopPropagation(), I(t.id);
                    }, className: "rounded p-1 text-red-400 hover:bg-red-50", title: "Sil", children: "🗑" })
                  ] })
                ] }),
                !L.has(t.type) && /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    value: t.content,
                    onChange: (c) => Y(t.id, { content: c.target.value }),
                    onClick: (c) => c.stopPropagation(),
                    placeholder: "Soru metni…",
                    className: "mb-3 w-full border-none p-0 text-base font-semibold text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-0"
                  }
                ),
                /* @__PURE__ */ e.jsx(W, { block: t }),
                ((i = t.settings) == null ? void 0 : i.required) && /* @__PURE__ */ e.jsx("span", { className: "mt-2 inline-block text-xs font-medium text-rose-500", children: "* Zorunlu" })
              ]
            },
            t.id
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("aside", { className: "w-72 shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-4", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "mb-3 text-xs font-bold uppercase tracking-widest text-indigo-500", children: "Alan Özellikleri" }),
      s ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ e.jsx(h, { label: L.has(s.type) ? "İçerik" : "Soru / Etiket", children: /* @__PURE__ */ e.jsx("input", { className: d, value: s.content, onChange: (t) => Y(s.id, { content: t.target.value }) }) }),
        !L.has(s.type) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(h, { label: "Placeholder", children: /* @__PURE__ */ e.jsx("input", { className: d, value: s.settings.placeholder || "", onChange: (t) => b(s.id, { placeholder: t.target.value }) }) }),
          /* @__PURE__ */ e.jsx(h, { label: "Yardım Metni", children: /* @__PURE__ */ e.jsx("input", { className: d, value: s.settings.helpText || "", onChange: (t) => b(s.id, { helpText: t.target.value }) }) }),
          /* @__PURE__ */ e.jsx(z, { label: "Zorunlu alan", checked: !!s.settings.required, onChange: (t) => b(s.id, { required: t }) })
        ] }),
        q.has(s.type) && /* @__PURE__ */ e.jsx(h, { label: "Seçenekler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
          (s.settings.options || []).map((t, a) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: d,
                value: t,
                onChange: (o) => {
                  const i = [...s.settings.options];
                  i[a] = o.target.value, b(s.id, { options: i });
                }
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "rounded p-1.5 text-red-400 hover:bg-red-50",
                onClick: () => b(s.id, { options: s.settings.options.filter((o, i) => i !== a) }),
                title: "Sil",
                children: "✕"
              }
            )
          ] }, a)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "rounded-xl border border-dashed border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600",
              onClick: () => b(s.id, { options: [...s.settings.options || [], `Seçenek ${(s.settings.options || []).length + 1}`] }),
              children: "+ Seçenek ekle"
            }
          )
        ] }) }),
        (s.type === l.Number || s.type === l.Rating) && /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ e.jsx(h, { label: "Min", children: /* @__PURE__ */ e.jsx("input", { type: "number", className: d, value: s.settings.min ?? "", onChange: (t) => b(s.id, { min: t.target.value === "" ? null : Number(t.target.value) }) }) }),
          /* @__PURE__ */ e.jsx(h, { label: "Max", children: /* @__PURE__ */ e.jsx("input", { type: "number", className: d, value: s.settings.max ?? "", onChange: (t) => b(s.id, { max: t.target.value === "" ? null : Number(t.target.value) }) }) })
        ] }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => I(s.id), className: "mt-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50", children: "Alanı sil" })
      ] }) : /* @__PURE__ */ e.jsx("p", { className: "text-sm text-slate-400", children: "Düzenlemek için bir alan seçin." })
    ] }),
    T && /* @__PURE__ */ e.jsx(ee, { formId: r, slug: p, onClose: () => D(!1) })
  ] });
}
function ee({ formId: n, slug: r, onClose: u }) {
  const [p, C] = x.useState(r || ""), [T, D] = x.useState(""), [y, B] = x.useState(""), [N, A] = x.useState(!1), [g, m] = x.useState(!1), [v, S] = x.useState(!1), [k, F] = x.useState(null), E = async () => {
    S(!0);
    try {
      const s = await P.post(`/api/app/form/${n}/publish`, {
        slug: (p == null ? void 0 : p.trim()) || null,
        publishSettingsJson: JSON.stringify({
          startDate: T || null,
          endDate: y || null,
          kvkk: N,
          captcha: g
        })
      });
      F(s.slug || p), f("success", "Form yayınlandı.");
    } catch (s) {
      f("error", (s == null ? void 0 : s.message) || "Yayınlama başarısız.");
    } finally {
      S(!1);
    }
  }, j = k ? `${window.location.origin}/f/${k}` : null, w = () => {
    var s;
    j && ((s = navigator.clipboard) == null || s.writeText(j)), f("success", "Bağlantı kopyalandı.");
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4", onClick: u, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-white p-6 shadow-xl", onClick: (s) => s.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-slate-800", children: "Formu Yayınla" }),
      /* @__PURE__ */ e.jsx("button", { onClick: u, className: "rounded p-1 text-slate-400 hover:bg-slate-100", children: "✕" })
    ] }),
    j ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: "rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700", children: "✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz." }),
      /* @__PURE__ */ e.jsx(h, { label: "Yayın bağlantısı", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("input", { readOnly: !0, className: d, value: j, onClick: (s) => s.target.select() }),
        /* @__PURE__ */ e.jsx("button", { onClick: w, className: "shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50", children: "Kopyala" })
      ] }) }),
      /* @__PURE__ */ e.jsx("a", { href: j, target: "_blank", rel: "noreferrer", className: "rounded-xl bg-indigo-600 px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-indigo-700", children: "Formu yeni sekmede aç" })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx(h, { label: "Bağlantı adresi (slug)", children: /* @__PURE__ */ e.jsx("input", { className: d, value: p, onChange: (s) => C(s.target.value), placeholder: "musteri-memnuniyet" }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ e.jsx(h, { label: "Başlangıç", children: /* @__PURE__ */ e.jsx("input", { type: "date", className: d, value: T, onChange: (s) => D(s.target.value) }) }),
        /* @__PURE__ */ e.jsx(h, { label: "Bitiş", children: /* @__PURE__ */ e.jsx("input", { type: "date", className: d, value: y, onChange: (s) => B(s.target.value) }) })
      ] }),
      /* @__PURE__ */ e.jsx(z, { label: "KVKK onayı iste", checked: N, onChange: A }),
      /* @__PURE__ */ e.jsx(z, { label: "Captcha doğrulaması", checked: g, onChange: m }),
      /* @__PURE__ */ e.jsx("button", { onClick: E, disabled: v, className: "mt-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50", children: v ? "Yayınlanıyor…" : "Yayınla" })
    ] })
  ] }) });
}
function te(n) {
  if (!n) return { required: !1 };
  try {
    return typeof n == "string" ? JSON.parse(n) : n;
  } catch {
    return { required: !1 };
  }
}
function f(n, r) {
  const u = window.abp;
  u != null && u.notify && (n === "success" || n === "info") ? u.notify[n === "success" ? "success" : "info"](r) : u != null && u.message ? u.message[n === "error" ? "error" : n === "warn" ? "warn" : "info"](r) : console.log(`[${n}] ${r}`);
}
const O = document.getElementById("dynamic-assets-app-root");
O && V(O).render(/* @__PURE__ */ e.jsx(X, {}));
