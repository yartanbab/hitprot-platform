import { r as u, j as a } from "./react-vendor-D57GAUXd.js";
import { R as E, T as R, P as S, C as O } from "./ui-vendor-DaE-uom6.js";
const x = {
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
}, I = [1, 2, 3, 4], D = [1, 2, 3, 4], _ = (t) => x[t] ?? x[1], $ = (t) => h[t] ?? h[2];
function K(t) {
  if (!t) return "—";
  const r = String(t).trim().split(/\s+/).filter(Boolean);
  return r.length ? (r.length > 1 ? r[0][0] + r[r.length - 1][0] : r[0].slice(0, 2)).toUpperCase() : "—";
}
function P(t) {
  return t ? "var(--apya-brand-500)" : "var(--apya-neutral-500)";
}
function U(t, r = /* @__PURE__ */ new Date()) {
  if (!t) return { tone: "text-text-tertiary", hint: "" };
  const l = new Date(t);
  if (Number.isNaN(l.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const i = Math.ceil((l.setHours(0, 0, 0, 0) - new Date(r).setHours(0, 0, 0, 0)) / 864e5);
  return i < 0 ? { tone: "text-negative", hint: `${Math.abs(i)} gün gecikti` } : i === 0 ? { tone: "text-warning", hint: "Bugün" } : i <= 3 ? { tone: "text-warning", hint: `${i} gün kaldı` } : { tone: "text-text-tertiary", hint: `${i} gün kaldı` };
}
function j(t) {
  return (t == null ? void 0 : t.closest('[role="dialog"]')) ?? void 0;
}
const B = [
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
], H = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', M = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function A(t) {
  return t ? /<[a-z][\s\S]*>/i.test(t) ? t : `<p>${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function z({ value: t, onChange: r, mentionName: l = "ekip arkadaşı", placeholder: i }) {
  const o = u.useRef(null), k = u.useRef(A(t)), [y, d] = u.useState(!1), [f, g] = u.useState("https://"), p = u.useRef(null), c = (e, n) => {
    var s, m;
    (s = o.current) == null || s.focus();
    try {
      document.execCommand(e, !1, n);
    } catch {
    }
    r == null || r(((m = o.current) == null ? void 0 : m.innerHTML) ?? "");
  }, T = () => {
    const e = window.getSelection();
    p.current = e && e.rangeCount ? e.getRangeAt(0).cloneRange() : null;
  }, v = () => {
    const e = p.current;
    if (!e) return;
    const n = window.getSelection();
    n.removeAllRanges(), n.addRange(e);
  }, b = () => {
    var n;
    const e = f.trim();
    d(!1), !(!e || e === "https://") && ((n = o.current) == null || n.focus(), v(), c("createLink", e), g("https://"));
  }, w = (e) => {
    switch (e.cmd) {
      case "link":
        T();
        return;
      case "image":
        c("insertHTML", M);
        return;
      case "table":
        c("insertHTML", H);
        return;
      case "mention":
        c("insertHTML", `<span class="apya-rte-mention">@${l}</span>&nbsp;`);
        return;
      default:
        c(e.cmd, e.arg);
    }
  }, L = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ a.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    /* @__PURE__ */ a.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: B.map((e) => {
      const n = /* @__PURE__ */ a.jsx(
        "button",
        {
          type: "button",
          title: e.title,
          onMouseDown: (s) => {
            s.preventDefault(), w(e);
          },
          className: `${L} ${e.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ a.jsx("i", { className: `fa-${e.regular ? "regular" : "solid"} ${e.icon} text-[12px]` })
        },
        e.cmd + e.icon
      );
      return e.cmd !== "link" ? n : /* @__PURE__ */ a.jsxs(E, { modal: !0, open: y, onOpenChange: d, children: [
        /* @__PURE__ */ a.jsx(R, { asChild: !0, children: n }),
        /* @__PURE__ */ a.jsx(S, { container: j(o.current), children: /* @__PURE__ */ a.jsxs(
          O,
          {
            sideOffset: 6,
            align: "start",
            className: "z-popover w-[290px] rounded-[13px] border border-default bg-surface-elevated p-3 shadow-float animate-fade-in-fast",
            children: [
              /* @__PURE__ */ a.jsx("div", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary mb-2", children: "Bağlantı adresi" }),
              /* @__PURE__ */ a.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ a.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "url",
                    value: f,
                    onChange: (s) => g(s.target.value),
                    onKeyDown: (s) => {
                      s.key === "Enter" && b();
                    },
                    className: "flex-1 min-w-0 h-[34px] px-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ a.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: b,
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
    /* @__PURE__ */ a.jsx(
      "div",
      {
        ref: o,
        contentEditable: !0,
        suppressContentEditableWarning: !0,
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": "Görev açıklaması",
        "data-ph": i ?? "Bu görevin detayları nelerdir? (@kişi, #etiket)…",
        onInput: (e) => r == null ? void 0 : r(e.currentTarget.innerHTML),
        className: "apya-rte-surface min-h-[150px] p-4 text-[13.5px] leading-[1.7] text-text-primary bg-surface-base focus:outline-none",
        dangerouslySetInnerHTML: { __html: k.current }
      }
    )
  ] });
}
export {
  h as P,
  z as R,
  x as S,
  P as a,
  I as b,
  j as c,
  U as d,
  D as e,
  K as i,
  $ as p,
  _ as s
};
