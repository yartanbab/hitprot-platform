import { r as d, j as i } from "./react-vendor-D7YDiBbi.js";
import { R as v, T as R, P as N, C } from "./ui-vendor-UYevF8mE.js";
const f = {
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
}, I = [1, 2, 3, 4], q = [1, 2, 3, 4], M = (e) => f[e] ?? f[1], H = {
  primary: "bg-primary",
  info: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-negative",
  secondary: "bg-neutral-400",
  dark: "bg-neutral-400"
};
function J(e) {
  return e != null && e.length ? e.slice().sort((t, a) => t.order - a.order).map((t) => ({
    key: t.id,
    status: t.statusValue ?? 2,
    boardColumnId: t.isSystem ? null : t.id,
    label: t.name,
    dot: t.isSystem ? M(t.statusValue).dot : H[t.colorClass] ?? "bg-primary"
  })) : I.map((t) => ({
    key: `s${t}`,
    status: t,
    boardColumnId: null,
    label: f[t].label,
    dot: f[t].dot
  }));
}
function X(e, t, a) {
  return t === 0 ? null : a && e.find((n) => n.boardColumnId === a) || e.find((n) => !n.boardColumnId && n.status === t) || null;
}
const Z = (e) => h[e] ?? h[2];
function tt(e) {
  if (!e) return "—";
  const t = String(e).trim().split(/\s+/).filter(Boolean);
  return t.length ? (t.length > 1 ? t[0][0] + t[t.length - 1][0] : t[0].slice(0, 2)).toUpperCase() : "—";
}
function et(e) {
  return e ? "var(--apya-brand-500)" : "var(--apya-neutral-500)";
}
function rt(e, t = /* @__PURE__ */ new Date()) {
  if (!e) return { tone: "text-text-tertiary", hint: "" };
  const a = new Date(e);
  if (Number.isNaN(a.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const n = Math.ceil((a.setHours(0, 0, 0, 0) - new Date(t).setHours(0, 0, 0, 0)) / 864e5);
  return n < 0 ? { tone: "text-negative", hint: `${Math.abs(n)} gün gecikti` } : n === 0 ? { tone: "text-warning", hint: "Bugün" } : n <= 3 ? { tone: "text-warning", hint: `${n} gün kaldı` } : { tone: "text-text-tertiary", hint: `${n} gün kaldı` };
}
function B(e) {
  return (e == null ? void 0 : e.closest('[role="dialog"]')) ?? void 0;
}
const P = /* @__PURE__ */ new Set([
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
]), D = /* @__PURE__ */ new Set([
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
}, j = /* @__PURE__ */ new Set([
  "color",
  "background-color",
  "text-align",
  "font-weight",
  "font-style",
  "text-decoration"
]), U = /^(https?:|mailto:|tel:|#|\/(?!\/))/i, _ = /^(https?:|data:image\/(png|jpe?g|gif|webp);base64,|\/(?!\/))/i;
function K(e) {
  return String(e).split(";").map((t) => t.trim()).filter(Boolean).filter((t) => {
    const a = t.indexOf(":");
    if (a < 0) return !1;
    const n = t.slice(0, a).trim().toLowerCase(), s = t.slice(a + 1).toLowerCase();
    return j.has(n) && !/url\(|expression|javascript:|@import/.test(s);
  }).join("; ");
}
function F(e) {
  const t = /* @__PURE__ */ new Set([...y["*"], ...y[e.tagName] || []]);
  for (const a of [...e.attributes]) {
    const n = a.name.toLowerCase(), s = a.value.trim();
    if (!t.has(n) || n.startsWith("on")) {
      e.removeAttribute(a.name);
      continue;
    }
    if (n === "href" && !U.test(s)) {
      e.removeAttribute(a.name);
      continue;
    }
    if (n === "src" && !_.test(s)) {
      e.removeAttribute(a.name);
      continue;
    }
    if (n === "style") {
      const l = K(s);
      l ? e.setAttribute("style", l) : e.removeAttribute("style");
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
    if (P.has(a)) {
      t.remove();
      continue;
    }
    if (E(t), !D.has(a)) {
      t.replaceWith(...t.childNodes);
      continue;
    }
    F(t);
  }
}
function $(e) {
  if (!e) return "";
  const t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html");
  return E(t.body), t.body.innerHTML;
}
const G = [
  { icon: "fa-bold", title: "Kalın (Ctrl+B)", cmd: "bold" },
  { icon: "fa-italic", title: "İtalik (Ctrl+I)", cmd: "italic" },
  { icon: "fa-underline", title: "Altı çizili", cmd: "underline" },
  { icon: "fa-strikethrough", title: "Üstü çizili", cmd: "strikeThrough" },
  { icon: "fa-list-ul", title: "Madde listesi", cmd: "insertUnorderedList", gap: !0 },
  { icon: "fa-list-ol", title: "Numaralı liste", cmd: "insertOrderedList" },
  { icon: "fa-heading", title: "Başlık", cmd: "formatBlock", arg: "H3", gap: !0 },
  { icon: "fa-quote-left", title: "Alıntı", cmd: "formatBlock", arg: "BLOCKQUOTE" },
  { icon: "fa-code", title: "Kod", cmd: "formatBlock", arg: "PRE" },
  { icon: "fa-link", title: "Bağlantı ekle", cmd: "link", gap: !0 },
  { icon: "fa-image", title: "Görsel ekle", cmd: "image", regular: !0 },
  { icon: "fa-table-cells", title: "Tablo ekle", cmd: "table" },
  { icon: "fa-at", title: "Kişi bahset", cmd: "mention" },
  { icon: "fa-eraser", title: "Biçimi temizle", cmd: "removeFormat", gap: !0 }
], V = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', z = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function W(e) {
  return e ? /<[a-z][\s\S]*>/i.test(e) ? $(e) : `<p>${e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function at({ value: e, onChange: t, mentionName: a = "ekip arkadaşı", placeholder: n, readOnly: s = !1 }) {
  const l = d.useRef(null), A = d.useRef(W(e)), [k, g] = d.useState(!1), [p, b] = d.useState("https://"), m = d.useRef(null), u = (r, o) => {
    var c, T;
    (c = l.current) == null || c.focus();
    try {
      document.execCommand(r, !1, o);
    } catch {
    }
    t == null || t(((T = l.current) == null ? void 0 : T.innerHTML) ?? "");
  }, S = () => {
    const r = window.getSelection();
    m.current = r && r.rangeCount ? r.getRangeAt(0).cloneRange() : null;
  }, L = () => {
    const r = m.current;
    if (!r) return;
    const o = window.getSelection();
    o.removeAllRanges(), o.addRange(r);
  }, x = () => {
    var o;
    const r = p.trim();
    g(!1), !(!r || r === "https://") && ((o = l.current) == null || o.focus(), L(), u("createLink", r), b("https://"));
  }, w = (r) => {
    switch (r.cmd) {
      case "link":
        S();
        return;
      case "image":
        u("insertHTML", z);
        return;
      case "table":
        u("insertHTML", V);
        return;
      case "mention":
        u("insertHTML", `<span class="apya-rte-mention">@${a}</span>&nbsp;`);
        return;
      default:
        u(r.cmd, r.arg);
    }
  }, O = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ i.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    !s && /* @__PURE__ */ i.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: G.map((r) => {
      const o = /* @__PURE__ */ i.jsx(
        "button",
        {
          type: "button",
          title: r.title,
          onMouseDown: (c) => {
            c.preventDefault(), w(r);
          },
          className: `${O} ${r.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ i.jsx("i", { className: `fa-${r.regular ? "regular" : "solid"} ${r.icon} text-[12px]` })
        },
        r.cmd + r.icon
      );
      return r.cmd !== "link" ? o : /* @__PURE__ */ i.jsxs(v, { modal: !0, open: k, onOpenChange: g, children: [
        /* @__PURE__ */ i.jsx(R, { asChild: !0, children: o }),
        /* @__PURE__ */ i.jsx(N, { container: B(l.current), children: /* @__PURE__ */ i.jsxs(
          C,
          {
            sideOffset: 6,
            align: "start",
            className: "z-popover w-[290px] rounded-[13px] border border-default bg-surface-elevated p-3 shadow-float animate-fade-in-fast",
            children: [
              /* @__PURE__ */ i.jsx("div", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary mb-2", children: "Bağlantı adresi" }),
              /* @__PURE__ */ i.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ i.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "url",
                    value: p,
                    onChange: (c) => b(c.target.value),
                    onKeyDown: (c) => {
                      c.key === "Enter" && x();
                    },
                    className: "flex-1 min-w-0 h-[34px] px-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ i.jsx(
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
    /* @__PURE__ */ i.jsx(
      "div",
      {
        ref: l,
        contentEditable: !s,
        suppressContentEditableWarning: !0,
        role: "textbox",
        "aria-multiline": "true",
        "aria-readonly": s || void 0,
        "aria-label": "Görev açıklaması",
        "data-ph": s ? "Açıklama eklenmemiş." : n ?? "Bu görevin detayları nelerdir? (@kişi, #etiket)…",
        onInput: (r) => t == null ? void 0 : t(r.currentTarget.innerHTML),
        className: "apya-rte-surface min-h-[150px] p-4 text-[13.5px] leading-[1.7] text-text-primary bg-surface-base focus:outline-none",
        dangerouslySetInnerHTML: { __html: A.current }
      }
    )
  ] });
}
export {
  h as P,
  at as R,
  f as S,
  et as a,
  I as b,
  B as c,
  rt as d,
  J as e,
  X as f,
  q as g,
  tt as i,
  Z as p,
  M as s
};
