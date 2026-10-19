import { r as c, j as s } from "./react-vendor-D7YDiBbi.js";
import { R as O, T as R, P as v, C as N } from "./ui-vendor-UYevF8mE.js";
const d = {
  0: { label: "İptal", icon: "fa-ban", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  1: { label: "Yapılacak", icon: "fa-clock", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  2: { label: "Sürüyor", icon: "fa-spinner", bg: "bg-warning-subtle", fg: "text-warning", dot: "bg-warning" },
  3: { label: "Testte", icon: "fa-flask", bg: "bg-primary-subtle", fg: "text-primary", dot: "bg-primary" },
  4: { label: "Tamamlandı", icon: "fa-circle-check", bg: "bg-success-subtle", fg: "text-success", dot: "bg-success" }
}, h = {
  1: { label: "Düşük", icon: "fa-arrow-down", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  2: { label: "Orta", icon: "fa-minus", bg: "bg-warning-subtle", fg: "text-warning" },
  3: { label: "Yüksek", icon: "fa-arrow-up", bg: "bg-negative-subtle", fg: "text-negative" },
  4: { label: "Kritik", icon: "fa-flag", bg: "bg-negative-subtle", fg: "text-negative" }
}, C = [1, 2, 3, 4], Y = [1, 2, 3, 4], I = (e) => d[e] ?? d[1], M = {
  primary: "bg-primary",
  info: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-negative",
  secondary: "bg-neutral-400",
  dark: "bg-neutral-400"
};
function Q(e) {
  return e != null && e.length ? e.slice().sort((t, a) => t.order - a.order).map((t) => ({
    key: t.id,
    status: t.statusValue ?? 2,
    boardColumnId: t.isSystem ? null : t.id,
    label: t.name,
    dot: t.isSystem ? I(t.statusValue).dot : M[t.colorClass] ?? "bg-primary"
  })) : C.map((t) => ({
    key: `s${t}`,
    status: t,
    boardColumnId: null,
    label: d[t].label,
    dot: d[t].dot
  }));
}
function q(e, t, a) {
  return t === 0 ? null : a && e.find((n) => n.boardColumnId === a) || e.find((n) => !n.boardColumnId && n.status === t) || null;
}
const J = (e) => h[e] ?? h[2];
function X(e) {
  if (!e) return "—";
  const t = String(e).trim().split(/\s+/).filter(Boolean);
  return t.length ? (t.length > 1 ? t[0][0] + t[t.length - 1][0] : t[0].slice(0, 2)).toUpperCase() : "—";
}
function Z(e) {
  return e ? "var(--apya-brand-500)" : "var(--apya-neutral-500)";
}
function tt(e, t = /* @__PURE__ */ new Date()) {
  if (!e) return { tone: "text-text-tertiary", hint: "" };
  const a = new Date(e);
  if (Number.isNaN(a.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const n = Math.ceil((a.setHours(0, 0, 0, 0) - new Date(t).setHours(0, 0, 0, 0)) / 864e5);
  return n < 0 ? { tone: "text-negative", hint: `${Math.abs(n)} gün gecikti` } : n === 0 ? { tone: "text-warning", hint: "Bugün" } : n <= 3 ? { tone: "text-warning", hint: `${n} gün kaldı` } : { tone: "text-text-tertiary", hint: `${n} gün kaldı` };
}
function B(e) {
  return (e == null ? void 0 : e.closest('[role="dialog"]')) ?? void 0;
}
const H = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "IFRAME",
  "FRAME",
  "FRAMESET",
  "OBJECT",
  "EMBED",
  "APPLET",
  "LINK",
  "META",
  "BASE",
  "SVG",
  "MATH",
  "FORM",
  "INPUT",
  "BUTTON",
  "TEXTAREA",
  "SELECT",
  "OPTION",
  "TEMPLATE",
  "NOSCRIPT",
  "AUDIO",
  "VIDEO",
  "SOURCE",
  "TRACK",
  "CANVAS",
  "PORTAL"
]), P = /* @__PURE__ */ new Set([
  "P",
  "BR",
  "DIV",
  "SPAN",
  "B",
  "STRONG",
  "I",
  "EM",
  "U",
  "S",
  "STRIKE",
  "DEL",
  "INS",
  "SUB",
  "SUP",
  "MARK",
  "SMALL",
  "FONT",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "UL",
  "OL",
  "LI",
  "BLOCKQUOTE",
  "PRE",
  "CODE",
  "HR",
  "TABLE",
  "THEAD",
  "TBODY",
  "TFOOT",
  "TR",
  "TH",
  "TD",
  "CAPTION",
  "A",
  "IMG"
]), y = {
  "*": ["class", "title", "style"],
  A: ["href", "target", "rel"],
  IMG: ["src", "alt", "width", "height"],
  TD: ["colspan", "rowspan"],
  TH: ["colspan", "rowspan"],
  FONT: ["color"],
  OL: ["start"]
}, D = /* @__PURE__ */ new Set([
  "color",
  "background-color",
  "text-align",
  "font-weight",
  "font-style",
  "text-decoration"
]), j = /^(https?:|mailto:|tel:|#|\/(?!\/))/i, U = /^(https?:|data:image\/(png|jpe?g|gif|webp);base64,|\/(?!\/))/i;
function _(e) {
  return String(e).split(";").map((t) => t.trim()).filter(Boolean).filter((t) => {
    const a = t.indexOf(":");
    if (a < 0) return !1;
    const n = t.slice(0, a).trim().toLowerCase(), i = t.slice(a + 1).toLowerCase();
    return D.has(n) && !/url\(|expression|javascript:|@import/.test(i);
  }).join("; ");
}
function F(e) {
  const t = /* @__PURE__ */ new Set([...y["*"], ...y[e.tagName] || []]);
  for (const a of [...e.attributes]) {
    const n = a.name.toLowerCase(), i = a.value.trim();
    if (!t.has(n) || n.startsWith("on")) {
      e.removeAttribute(a.name);
      continue;
    }
    if (n === "href" && !j.test(i)) {
      e.removeAttribute(a.name);
      continue;
    }
    if (n === "src" && !U.test(i)) {
      e.removeAttribute(a.name);
      continue;
    }
    if (n === "style") {
      const u = _(i);
      u ? e.setAttribute("style", u) : e.removeAttribute("style");
    }
  }
  e.tagName === "A" && e.getAttribute("target") && (e.setAttribute("target", "_blank"), e.setAttribute("rel", "noopener noreferrer"));
}
function E(e) {
  for (const t of [...e.childNodes]) {
    if (t.nodeType === 8) {
      t.remove();
      continue;
    }
    if (t.nodeType !== 1)
      continue;
    const a = t.tagName.toUpperCase();
    if (H.has(a)) {
      t.remove();
      continue;
    }
    if (E(t), !P.has(a)) {
      t.replaceWith(...t.childNodes);
      continue;
    }
    F(t);
  }
}
function K(e) {
  if (!e) return "";
  const t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html");
  return E(t.body), t.body.innerHTML;
}
const $ = [
  { icon: "fa-bold", title: "Kalın (Ctrl+B)", cmd: "bold" },
  { icon: "fa-italic", title: "İtalik (Ctrl+I)", cmd: "italic" },
  { icon: "fa-underline", title: "Altı çizili", cmd: "underline" },
  { icon: "fa-strikethrough", title: "Üstü çizili", cmd: "strikeThrough" },
  { icon: "fa-list-ul", title: "Madde listesi", cmd: "insertUnorderedList", gap: !0 },
  { icon: "fa-list-ol", title: "Numaralı liste", cmd: "insertOrderedList" },
  { icon: "fa-heading", title: "Başlık", cmd: "formatBlock", arg: "H3", gap: !0 },
  { icon: "fa-quote-left", title: "Alıntı", cmd: "formatBlock", arg: "BLOCKQUOTE" },
  { icon: "fa-code", title: "Kod", cmd: "formatBlock", arg: "PRE" },
  /* "Görsel ekle" görsel eklemiyordu ("görsel yer tutucu" kutusu basıyordu), "Kişi bahset"
     seçicisiz olarak kullanıcının KENDİ adını yazıyordu (QA-32). İkisi de kalktı; görseller
     Dosyalar sekmesinde, kişi bahsetme seçici + bildirimle P-09'da. Eski içerikteki
     apya-rte-mention / apya-rte-imgph işaretleri temizleyicide durur, bozulmaz. */
  { icon: "fa-link", title: "Bağlantı ekle", cmd: "link", gap: !0 },
  { icon: "fa-table-cells", title: "Tablo ekle", cmd: "table" },
  { icon: "fa-eraser", title: "Biçimi temizle", cmd: "removeFormat", gap: !0 }
], G = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>';
function V(e) {
  return e ? /<[a-z][\s\S]*>/i.test(e) ? K(e) : `<p>${e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function et({ value: e, onChange: t, placeholder: a, readOnly: n = !1 }) {
  const i = c.useRef(null), u = c.useRef(V(e)), [A, g] = c.useState(!1), [b, p] = c.useState("https://"), m = c.useRef(null), f = (r, o) => {
    var l, T;
    (l = i.current) == null || l.focus();
    try {
      document.execCommand(r, !1, o);
    } catch {
    }
    t == null || t(((T = i.current) == null ? void 0 : T.innerHTML) ?? "");
  }, S = () => {
    const r = window.getSelection();
    m.current = r && r.rangeCount ? r.getRangeAt(0).cloneRange() : null;
  }, k = () => {
    const r = m.current;
    if (!r) return;
    const o = window.getSelection();
    o.removeAllRanges(), o.addRange(r);
  }, x = () => {
    var o;
    const r = b.trim();
    g(!1), !(!r || r === "https://") && ((o = i.current) == null || o.focus(), k(), f("createLink", r), p("https://"));
  }, w = (r) => {
    switch (r.cmd) {
      case "link":
        S();
        return;
      case "table":
        f("insertHTML", G);
        return;
      default:
        f(r.cmd, r.arg);
    }
  }, L = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ s.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    !n && /* @__PURE__ */ s.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: $.map((r) => {
      const o = /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          title: r.title,
          onMouseDown: (l) => {
            l.preventDefault(), w(r);
          },
          className: `${L} ${r.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ s.jsx("i", { className: `fa-${r.regular ? "regular" : "solid"} ${r.icon} text-[12px]` })
        },
        r.cmd + r.icon
      );
      return r.cmd !== "link" ? o : /* @__PURE__ */ s.jsxs(O, { modal: !0, open: A, onOpenChange: g, children: [
        /* @__PURE__ */ s.jsx(R, { asChild: !0, children: o }),
        /* @__PURE__ */ s.jsx(v, { container: B(i.current), children: /* @__PURE__ */ s.jsxs(
          N,
          {
            sideOffset: 6,
            align: "start",
            className: "z-popover w-[290px] rounded-[13px] border border-default bg-surface-elevated p-3 shadow-float animate-fade-in-fast",
            children: [
              /* @__PURE__ */ s.jsx("div", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary mb-2", children: "Bağlantı adresi" }),
              /* @__PURE__ */ s.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ s.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "url",
                    value: b,
                    onChange: (l) => p(l.target.value),
                    onKeyDown: (l) => {
                      l.key === "Enter" && x();
                    },
                    className: "flex-1 min-w-0 h-[34px] px-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ s.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: x,
                    className: "h-[34px] px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Ekle"
                  }
                )
              ] })
            ]
          }
        ) })
      ] }, "link");
    }) }),
    /* @__PURE__ */ s.jsx(
      "div",
      {
        ref: i,
        contentEditable: !n,
        suppressContentEditableWarning: !0,
        role: "textbox",
        "aria-multiline": "true",
        "aria-readonly": n || void 0,
        "aria-label": "Görev açıklaması",
        "data-ph": n ? "Açıklama eklenmemiş." : a ?? "Bu görevin detayları nelerdir? (@kişi, #etiket)…",
        onInput: (r) => t == null ? void 0 : t(r.currentTarget.innerHTML),
        className: "apya-rte-surface min-h-[150px] p-4 text-[13.5px] leading-[1.7] text-text-primary bg-surface-base focus:outline-none",
        dangerouslySetInnerHTML: { __html: u.current }
      }
    )
  ] });
}
export {
  h as P,
  et as R,
  d as S,
  Z as a,
  C as b,
  B as c,
  tt as d,
  Q as e,
  q as f,
  Y as g,
  X as i,
  J as p,
  I as s
};
