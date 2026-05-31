import { c as G, j as e, r as m } from "./vendor.js";
const J = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest"
};
class Y extends Error {
  constructor(a, { status: r, code: p, details: b, validationErrors: f } = {}) {
    super(a), this.name = "ApiError", this.status = r, this.code = p, this.details = b, this.validationErrors = f;
  }
}
function Z() {
  if (typeof document > "u") return null;
  const s = document.querySelector('meta[name="__RequestVerificationToken"]');
  if (s) return s.getAttribute("content");
  const a = document.querySelector('input[name="__RequestVerificationToken"]');
  return a ? a.value : null;
}
async function V(s) {
  let a = null;
  try {
    a = await s.json();
  } catch {
  }
  const r = a == null ? void 0 : a.error;
  return new Y(
    (r == null ? void 0 : r.message) || `HTTP ${s.status}`,
    {
      status: s.status,
      code: r == null ? void 0 : r.code,
      details: r == null ? void 0 : r.details,
      validationErrors: r == null ? void 0 : r.validationErrors
    }
  );
}
async function v(s, { method: a = "GET", body: r, signal: p, headers: b = {} } = {}) {
  const f = a !== "GET" && a !== "HEAD", j = { ...J, ...b };
  if (f) {
    const N = Z();
    N && (j.RequestVerificationToken = N);
  }
  const x = await fetch(s, {
    method: a,
    credentials: "include",
    /* ABP cookie session */
    signal: p,
    headers: j,
    body: r !== void 0 ? JSON.stringify(r) : void 0
  });
  if (!x.ok) throw await V(x);
  return x.status === 204 ? null : (x.headers.get("content-type") || "").includes("application/json") ? x.json() : x.text();
}
const w = {
  get: (s, a) => v(s, { ...a, method: "GET" }),
  post: (s, a, r) => v(s, { ...r, method: "POST", body: a }),
  put: (s, a, r) => v(s, { ...r, method: "PUT", body: a }),
  patch: (s, a, r) => v(s, { ...r, method: "PATCH", body: a }),
  delete: (s, a) => v(s, { ...a, method: "DELETE" })
}, l = {
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
}, q = /* @__PURE__ */ new Set([l.Select, l.MultiSelect, l.Dropdown]), T = /* @__PURE__ */ new Set([l.SectionHeader, l.Paragraph]), H = [
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
], P = Object.fromEntries(
  H.flatMap((s) => s.items.map((a) => [a.type, a.label]))
), E = () => Math.random().toString(36).slice(2, 10);
function X(s) {
  const a = { id: E(), type: s, content: P[s] || "Soru", settings: { required: !1 } };
  return q.has(s) && (a.settings.options = ["Seçenek 1", "Seçenek 2"]), s === l.SectionHeader && (a.content = "Bölüm Başlığı"), s === l.Paragraph && (a.content = "Açıklama metni…"), a;
}
const W = ({ checked: s, onChange: a, label: r }) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center justify-between gap-3 cursor-pointer select-none", children: [
  /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium text-slate-600", children: r }),
  /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: () => a(!s),
      className: `relative h-6 w-11 rounded-full transition-colors ${s ? "bg-indigo-600" : "bg-slate-300"}`,
      "aria-pressed": s,
      children: /* @__PURE__ */ e.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${s ? "left-[22px]" : "left-0.5"}` })
    }
  )
] }), y = ({ label: s, children: a }) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
  /* @__PURE__ */ e.jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-slate-400", children: s }),
  a
] }), u = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";
function Q({ block: s }) {
  const a = s.settings || {};
  switch (s.type) {
    case l.LongText:
      return /* @__PURE__ */ e.jsx("textarea", { disabled: !0, rows: 3, className: u, placeholder: a.placeholder || "Uzun yanıt…" });
    case l.Number:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "number", className: u, placeholder: a.placeholder || "0" });
    case l.Email:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "email", className: u, placeholder: a.placeholder || "ornek@firma.com" });
    case l.Phone:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "tel", className: u, placeholder: a.placeholder || "+90 5xx xxx xx xx" });
    case l.DatePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "date", className: u });
    case l.TimePicker:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, type: "time", className: u });
    case l.FilePicker:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-400", children: "📎 Dosya seç / sürükle" });
    case l.Select:
    case l.MultiSelect:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: (a.options || []).map((r, p) => /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-600", children: [
        /* @__PURE__ */ e.jsx("span", { className: `inline-block h-4 w-4 border border-slate-300 ${s.type === l.Select ? "rounded-full" : "rounded"}` }),
        r
      ] }, p)) });
    case l.Dropdown:
      return /* @__PURE__ */ e.jsx("select", { disabled: !0, className: u, children: (a.options || []).map((r, p) => /* @__PURE__ */ e.jsx("option", { children: r }, p)) });
    case l.Rating:
      return /* @__PURE__ */ e.jsx("div", { className: "flex gap-1 text-2xl text-amber-400", children: "★★★★★" });
    case l.Nps:
      return /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1", children: Array.from({ length: 11 }, (r, p) => /* @__PURE__ */ e.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs text-slate-500", children: p }, p)) });
    case l.Signature:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border-2 border-dashed border-slate-200 px-3 py-8 text-center text-sm text-slate-400", children: "✍️ İmza alanı" });
    case l.Address:
      return /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ e.jsx("input", { disabled: !0, className: u, placeholder: "Adres satırı" }),
        /* @__PURE__ */ e.jsx("input", { disabled: !0, className: u, placeholder: "İlçe" }),
        /* @__PURE__ */ e.jsx("input", { disabled: !0, className: u, placeholder: "İl" }),
        /* @__PURE__ */ e.jsx("input", { disabled: !0, className: u, placeholder: "Posta kodu" })
      ] });
    case l.SectionHeader:
      return /* @__PURE__ */ e.jsx("div", { className: "border-b border-slate-200 pb-1 text-lg font-bold text-slate-700", children: s.content });
    case l.Paragraph:
      return /* @__PURE__ */ e.jsx("p", { className: "text-sm text-slate-500", children: s.content });
    case l.TableGrid:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-slate-200 p-3 text-sm text-slate-400", children: "▦ Tablo ızgarası" });
    case l.RichText:
      return /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-slate-200 p-3 text-sm text-slate-400", children: "𝐁 Zengin metin" });
    default:
      return /* @__PURE__ */ e.jsx("input", { disabled: !0, className: u, placeholder: a.placeholder || "Kısa yanıt…" });
  }
}
function ee() {
  const s = m.useMemo(() => new URLSearchParams(window.location.search).get("id"), []), [a, r] = m.useState(s), [p, b] = m.useState(""), [f, j] = m.useState(""), [x, h] = m.useState([]), [N, A] = m.useState(null), [C, D] = m.useState(!1), [I, O] = m.useState(!!s), k = m.useRef(null);
  m.useEffect(() => {
    s && (async () => {
      try {
        const t = await w.get(`/api/app/form/${s}`);
        b(t.title || ""), j(t.description || ""), h(
          (t.blocks || []).sort((n, c) => n.order - c.order).map((n) => ({
            id: n.id || E(),
            type: n.type,
            content: n.content,
            settings: te(n.settings)
          }))
        );
      } catch (t) {
        S("error", (t == null ? void 0 : t.message) || "Form yüklenemedi.");
      } finally {
        O(!1);
      }
    })();
  }, [s]);
  const i = x.find((t) => t.id === N) || null, $ = (t) => {
    const n = X(t);
    h((c) => [...c, n]), A(n.id);
  }, R = (t) => h((n) => n.filter((c) => c.id !== t)), z = (t) => h((n) => {
    const c = n.findIndex((K) => K.id === t);
    if (c < 0) return n;
    const o = { ...n[c], id: E(), settings: { ...n[c].settings } }, d = [...n];
    return d.splice(c + 1, 0, o), d;
  }), B = (t, n) => h((c) => {
    const o = n === "up" ? t - 1 : t + 1;
    if (o < 0 || o >= c.length) return c;
    const d = [...c];
    return [d[t], d[o]] = [d[o], d[t]], d;
  }), F = (t, n) => h((c) => c.map((o) => o.id === t ? { ...o, ...n } : o)), g = (t, n) => h((c) => c.map((o) => o.id === t ? { ...o, settings: { ...o.settings, ...n } } : o)), _ = (t) => {
    const n = k.current;
    k.current = null, !(n == null || n === t) && h((c) => {
      const o = [...c], [d] = o.splice(n, 1);
      return o.splice(t, 0, d), o;
    });
  }, L = () => x.map((t, n) => ({
    type: t.type,
    order: n + 1,
    content: t.content || P[t.type] || "Soru",
    settings: JSON.stringify(t.settings || {})
  })), U = async () => {
    if (!p.trim()) return S("warn", "Lütfen forma bir başlık verin.");
    D(!0);
    try {
      if (a)
        await w.put(`/api/app/form/${a}`, {
          title: p.trim(),
          description: f.trim() || null,
          categoryId: null,
          themeJson: null,
          blocks: []
        }), await w.put(`/api/app/form/${a}/blocks`, { blocks: L() }), S("success", "Form kaydedildi.");
      else {
        const t = await w.post("/api/app/form", {
          title: p.trim(),
          description: f.trim() || null,
          categoryId: null,
          themeJson: null,
          blocks: L()
        });
        r(t.id);
        const n = new URL(window.location.href);
        n.searchParams.set("id", t.id), window.history.replaceState({}, "", n), S("success", "Form oluşturuldu.");
      }
    } catch (t) {
      S("error", (t == null ? void 0 : t.message) || "Kaydetme başarısız.");
    } finally {
      D(!1);
    }
  };
  return I ? /* @__PURE__ */ e.jsx("div", { className: "flex h-[60vh] items-center justify-center text-slate-400", children: "Form yükleniyor…" }) : /* @__PURE__ */ e.jsxs("div", { className: "flex h-[calc(100vh-120px)] min-h-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-slate-800", children: [
    /* @__PURE__ */ e.jsxs("aside", { className: "w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-4", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "mb-3 text-xs font-bold uppercase tracking-widest text-indigo-500", children: "Soru Bileşenleri" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-4", children: H.map((t) => /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-semibold uppercase text-slate-400", children: t.group }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: t.items.map((n) => /* @__PURE__ */ e.jsxs(
          "button",
          {
            onClick: () => $(n.type),
            className: "flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50",
            children: [
              /* @__PURE__ */ e.jsx("span", { children: n.icon }),
              n.label
            ]
          },
          n.type
        )) })
      ] }, t.group)) })
    ] }),
    /* @__PURE__ */ e.jsxs("main", { className: "flex-1 overflow-y-auto p-8", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-between", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-slate-400", children: [
          x.length,
          " alan"
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: U,
            disabled: C,
            className: "rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50",
            children: C ? "Kaydediliyor…" : a ? "Kaydet" : "Oluştur"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mx-auto mt-4 max-w-2xl rounded-2xl border border-slate-200 bg-white p-8", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            value: p,
            onChange: (t) => b(t.target.value),
            placeholder: "Form başlığı…",
            className: "w-full border-none p-0 text-3xl font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-0"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            value: f,
            onChange: (t) => j(t.target.value),
            placeholder: "Form açıklaması (opsiyonel)…",
            className: "mt-2 w-full border-none p-0 text-sm text-slate-500 placeholder-slate-300 focus:outline-none focus:ring-0"
          }
        ),
        x.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "mt-8 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center text-slate-400", children: "Soldan bir bileşen ekleyin" }) : /* @__PURE__ */ e.jsx("div", { className: "mt-6 flex flex-col gap-3", children: x.map((t, n) => {
          var o;
          const c = t.id === N;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              draggable: !0,
              onDragStart: () => k.current = n,
              onDragOver: (d) => d.preventDefault(),
              onDrop: () => _(n),
              onClick: () => A(t.id),
              className: `group relative cursor-pointer rounded-xl border p-4 transition ${c ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200 hover:border-slate-300"}`,
              children: [
                /* @__PURE__ */ e.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600", children: P[t.type] || "Alan" }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 opacity-0 transition group-hover:opacity-100", children: [
                    /* @__PURE__ */ e.jsx("button", { onClick: (d) => {
                      d.stopPropagation(), B(n, "up");
                    }, className: "rounded p-1 text-slate-400 hover:bg-slate-100", title: "Yukarı", children: "▲" }),
                    /* @__PURE__ */ e.jsx("button", { onClick: (d) => {
                      d.stopPropagation(), B(n, "down");
                    }, className: "rounded p-1 text-slate-400 hover:bg-slate-100", title: "Aşağı", children: "▼" }),
                    /* @__PURE__ */ e.jsx("button", { onClick: (d) => {
                      d.stopPropagation(), z(t.id);
                    }, className: "rounded p-1 text-slate-400 hover:bg-slate-100", title: "Kopyala", children: "⧉" }),
                    /* @__PURE__ */ e.jsx("button", { onClick: (d) => {
                      d.stopPropagation(), R(t.id);
                    }, className: "rounded p-1 text-red-400 hover:bg-red-50", title: "Sil", children: "🗑" })
                  ] })
                ] }),
                !T.has(t.type) && /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    value: t.content,
                    onChange: (d) => F(t.id, { content: d.target.value }),
                    onClick: (d) => d.stopPropagation(),
                    placeholder: "Soru metni…",
                    className: "mb-3 w-full border-none p-0 text-base font-semibold text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-0"
                  }
                ),
                /* @__PURE__ */ e.jsx(Q, { block: t }),
                ((o = t.settings) == null ? void 0 : o.required) && /* @__PURE__ */ e.jsx("span", { className: "mt-2 inline-block text-xs font-medium text-rose-500", children: "* Zorunlu" })
              ]
            },
            t.id
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("aside", { className: "w-72 shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-4", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "mb-3 text-xs font-bold uppercase tracking-widest text-indigo-500", children: "Alan Özellikleri" }),
      i ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ e.jsx(y, { label: T.has(i.type) ? "İçerik" : "Soru / Etiket", children: /* @__PURE__ */ e.jsx("input", { className: u, value: i.content, onChange: (t) => F(i.id, { content: t.target.value }) }) }),
        !T.has(i.type) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(y, { label: "Placeholder", children: /* @__PURE__ */ e.jsx("input", { className: u, value: i.settings.placeholder || "", onChange: (t) => g(i.id, { placeholder: t.target.value }) }) }),
          /* @__PURE__ */ e.jsx(y, { label: "Yardım Metni", children: /* @__PURE__ */ e.jsx("input", { className: u, value: i.settings.helpText || "", onChange: (t) => g(i.id, { helpText: t.target.value }) }) }),
          /* @__PURE__ */ e.jsx(W, { label: "Zorunlu alan", checked: !!i.settings.required, onChange: (t) => g(i.id, { required: t }) })
        ] }),
        q.has(i.type) && /* @__PURE__ */ e.jsx(y, { label: "Seçenekler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
          (i.settings.options || []).map((t, n) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                className: u,
                value: t,
                onChange: (c) => {
                  const o = [...i.settings.options];
                  o[n] = c.target.value, g(i.id, { options: o });
                }
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "rounded p-1.5 text-red-400 hover:bg-red-50",
                onClick: () => g(i.id, { options: i.settings.options.filter((c, o) => o !== n) }),
                title: "Sil",
                children: "✕"
              }
            )
          ] }, n)),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "rounded-xl border border-dashed border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600",
              onClick: () => g(i.id, { options: [...i.settings.options || [], `Seçenek ${(i.settings.options || []).length + 1}`] }),
              children: "+ Seçenek ekle"
            }
          )
        ] }) }),
        (i.type === l.Number || i.type === l.Rating) && /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ e.jsx(y, { label: "Min", children: /* @__PURE__ */ e.jsx("input", { type: "number", className: u, value: i.settings.min ?? "", onChange: (t) => g(i.id, { min: t.target.value === "" ? null : Number(t.target.value) }) }) }),
          /* @__PURE__ */ e.jsx(y, { label: "Max", children: /* @__PURE__ */ e.jsx("input", { type: "number", className: u, value: i.settings.max ?? "", onChange: (t) => g(i.id, { max: t.target.value === "" ? null : Number(t.target.value) }) }) })
        ] }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => R(i.id), className: "mt-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50", children: "Alanı sil" })
      ] }) : /* @__PURE__ */ e.jsx("p", { className: "text-sm text-slate-400", children: "Düzenlemek için bir alan seçin." })
    ] })
  ] });
}
function te(s) {
  if (!s) return { required: !1 };
  try {
    return typeof s == "string" ? JSON.parse(s) : s;
  } catch {
    return { required: !1 };
  }
}
function S(s, a) {
  const r = window.abp;
  r != null && r.notify && (s === "success" || s === "info") ? r.notify[s === "success" ? "success" : "info"](a) : r != null && r.message ? r.message[s === "error" ? "error" : s === "warn" ? "warn" : "info"](a) : console.log(`[${s}] ${a}`);
}
const M = document.getElementById("dynamic-assets-app-root");
M && G(M).render(/* @__PURE__ */ e.jsx(ee, {}));
