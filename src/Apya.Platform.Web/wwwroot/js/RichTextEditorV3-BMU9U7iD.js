import { r as d, j as i } from "./react-vendor-D7YDiBbi.js";
import { R, T as v, P as N, C as M } from "./ui-vendor-UYevF8mE.js";
const T = {
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
}, Y = [1, 2, 3, 4], V = [1, 2, 3, 4], Q = (t) => T[t] ?? T[1], q = (t) => h[t] ?? h[2];
function J(t) {
  if (!t) return "—";
  const e = String(t).trim().split(/\s+/).filter(Boolean);
  return e.length ? (e.length > 1 ? e[0][0] + e[e.length - 1][0] : e[0].slice(0, 2)).toUpperCase() : "—";
}
function X(t) {
  return t ? "var(--apya-brand-500)" : "var(--apya-neutral-500)";
}
function Z(t, e = /* @__PURE__ */ new Date()) {
  if (!t) return { tone: "text-text-tertiary", hint: "" };
  const n = new Date(t);
  if (Number.isNaN(n.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const a = Math.ceil((n.setHours(0, 0, 0, 0) - new Date(e).setHours(0, 0, 0, 0)) / 864e5);
  return a < 0 ? { tone: "text-negative", hint: `${Math.abs(a)} gün gecikti` } : a === 0 ? { tone: "text-warning", hint: "Bugün" } : a <= 3 ? { tone: "text-warning", hint: `${a} gün kaldı` } : { tone: "text-text-tertiary", hint: `${a} gün kaldı` };
}
function H(t) {
  return (t == null ? void 0 : t.closest('[role="dialog"]')) ?? void 0;
}
const I = /* @__PURE__ */ new Set([
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
]), B = /* @__PURE__ */ new Set([
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
]), E = {
  "*": ["class", "title", "style"],
  A: ["href", "target", "rel"],
  IMG: ["src", "alt", "width", "height"],
  TD: ["colspan", "rowspan"],
  TH: ["colspan", "rowspan"],
  FONT: ["color"],
  OL: ["start"]
}, C = /* @__PURE__ */ new Set([
  "color",
  "background-color",
  "text-align",
  "font-weight",
  "font-style",
  "text-decoration"
]), P = /^(https?:|mailto:|tel:|#|\/(?!\/))/i, D = /^(https?:|data:image\/(png|jpe?g|gif|webp);base64,|\/(?!\/))/i;
function j(t) {
  return String(t).split(";").map((e) => e.trim()).filter(Boolean).filter((e) => {
    const n = e.indexOf(":");
    if (n < 0) return !1;
    const a = e.slice(0, n).trim().toLowerCase(), s = e.slice(n + 1).toLowerCase();
    return C.has(a) && !/url\(|expression|javascript:|@import/.test(s);
  }).join("; ");
}
function U(t) {
  const e = /* @__PURE__ */ new Set([...E["*"], ...E[t.tagName] || []]);
  for (const n of [...t.attributes]) {
    const a = n.name.toLowerCase(), s = n.value.trim();
    if (!e.has(a) || a.startsWith("on")) {
      t.removeAttribute(n.name);
      continue;
    }
    if (a === "href" && !P.test(s)) {
      t.removeAttribute(n.name);
      continue;
    }
    if (a === "src" && !D.test(s)) {
      t.removeAttribute(n.name);
      continue;
    }
    if (a === "style") {
      const l = j(s);
      l ? t.setAttribute("style", l) : t.removeAttribute("style");
    }
  }
  t.tagName === "A" && t.getAttribute("target") && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer"));
}
function A(t) {
  for (const e of [...t.childNodes]) {
    if (e.nodeType === 8) {
      e.remove();
      continue;
    }
    if (e.nodeType !== 1)
      continue;
    const n = e.tagName.toUpperCase();
    if (I.has(n)) {
      e.remove();
      continue;
    }
    if (A(e), !B.has(n)) {
      e.replaceWith(...e.childNodes);
      continue;
    }
    U(e);
  }
}
function _(t) {
  if (!t) return "";
  const e = new DOMParser().parseFromString(`<body>${t}</body>`, "text/html");
  return A(e.body), e.body.innerHTML;
}
const K = [
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
], F = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', $ = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function G(t) {
  return t ? /<[a-z][\s\S]*>/i.test(t) ? _(t) : `<p>${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function tt({ value: t, onChange: e, mentionName: n = "ekip arkadaşı", placeholder: a, readOnly: s = !1 }) {
  const l = d.useRef(null), k = d.useRef(G(t)), [L, f] = d.useState(!1), [g, p] = d.useState("https://"), b = d.useRef(null), u = (r, o) => {
    var c, x;
    (c = l.current) == null || c.focus();
    try {
      document.execCommand(r, !1, o);
    } catch {
    }
    e == null || e(((x = l.current) == null ? void 0 : x.innerHTML) ?? "");
  }, S = () => {
    const r = window.getSelection();
    b.current = r && r.rangeCount ? r.getRangeAt(0).cloneRange() : null;
  }, y = () => {
    const r = b.current;
    if (!r) return;
    const o = window.getSelection();
    o.removeAllRanges(), o.addRange(r);
  }, m = () => {
    var o;
    const r = g.trim();
    f(!1), !(!r || r === "https://") && ((o = l.current) == null || o.focus(), y(), u("createLink", r), p("https://"));
  }, w = (r) => {
    switch (r.cmd) {
      case "link":
        S();
        return;
      case "image":
        u("insertHTML", $);
        return;
      case "table":
        u("insertHTML", F);
        return;
      case "mention":
        u("insertHTML", `<span class="apya-rte-mention">@${n}</span>&nbsp;`);
        return;
      default:
        u(r.cmd, r.arg);
    }
  }, O = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ i.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    !s && /* @__PURE__ */ i.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: K.map((r) => {
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
      return r.cmd !== "link" ? o : /* @__PURE__ */ i.jsxs(R, { modal: !0, open: L, onOpenChange: f, children: [
        /* @__PURE__ */ i.jsx(v, { asChild: !0, children: o }),
        /* @__PURE__ */ i.jsx(N, { container: H(l.current), children: /* @__PURE__ */ i.jsxs(
          M,
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
                    value: g,
                    onChange: (c) => p(c.target.value),
                    onKeyDown: (c) => {
                      c.key === "Enter" && m();
                    },
                    className: "flex-1 min-w-0 h-[34px] px-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ i.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: m,
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
        "data-ph": s ? "Açıklama eklenmemiş." : a ?? "Bu görevin detayları nelerdir? (@kişi, #etiket)…",
        onInput: (r) => e == null ? void 0 : e(r.currentTarget.innerHTML),
        className: "apya-rte-surface min-h-[150px] p-4 text-[13.5px] leading-[1.7] text-text-primary bg-surface-base focus:outline-none",
        dangerouslySetInnerHTML: { __html: k.current }
      }
    )
  ] });
}
export {
  h as P,
  tt as R,
  T as S,
  X as a,
  Y as b,
  H as c,
  Z as d,
  V as e,
  J as i,
  q as p,
  Q as s
};
