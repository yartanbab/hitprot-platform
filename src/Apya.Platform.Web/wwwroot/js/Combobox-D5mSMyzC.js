import { r, j as a } from "./react-vendor-D57GAUXd.js";
import { I as K, c as h } from "./Dialog-Bky2XNdc.js";
import { t as E } from "./i18n-DkhYld-7.js";
function z(n, c) {
  const l = c.trim().toLowerCase();
  return l ? n.filter((b) => String(b.label).toLowerCase().includes(l)) : n;
}
function V({
  options: n = [],
  value: c,
  onChange: l,
  placeholder: b = E("Common:MakeSelection", "Seçim yap"),
  onSearch: u,
  /* opsiyonel — async/server-side filter caller'a */
  size: N,
  invalid: k,
  disabled: p,
  emptyMessage: M = E("Common:NoMatch", "Eşleşme bulunamadı"),
  className: I,
  listMaxHeight: C = 240,
  ...R
}) {
  const [s, o] = r.useState(!1), [v, f] = r.useState(""), [d, m] = r.useState(0), y = r.useRef(null), D = r.useRef(null), x = r.useId(), w = r.useMemo(
    () => n.find((e) => e.value === c),
    [n, c]
  ), i = r.useMemo(() => u ? n : z(n, v), [n, v, u]), L = s ? v : (w == null ? void 0 : w.label) ?? "", $ = r.useCallback((e) => {
    const t = e.target.value;
    f(t), o(!0), m(0), u == null || u(t);
  }, [u]), g = r.useCallback((e) => {
    var t;
    !e || e.disabled || (l == null || l(e.value), f(""), o(!1), (t = D.current) == null || t.blur());
  }, [l]), A = r.useCallback((e) => {
    p || (e.key === "ArrowDown" ? (e.preventDefault(), o(!0), m((t) => Math.min(t + 1, i.length - 1))) : e.key === "ArrowUp" ? (e.preventDefault(), m((t) => Math.max(t - 1, 0))) : e.key === "Enter" ? s && i[d] && (e.preventDefault(), g(i[d])) : e.key === "Escape" && s && (e.preventDefault(), o(!1), f("")));
  }, [s, d, i, g, p]);
  return r.useEffect(() => {
    if (!s) return;
    const e = (t) => {
      y.current && !y.current.contains(t.target) && (o(!1), f(""));
    };
    return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
  }, [s]), /* @__PURE__ */ a.jsxs(
    "div",
    {
      ref: y,
      className: h("relative", I),
      children: [
        /* @__PURE__ */ a.jsx(
          K,
          {
            ref: D,
            role: "combobox",
            "aria-controls": x,
            "aria-expanded": s,
            "aria-autocomplete": "list",
            "aria-activedescendant": s && i[d] ? `${x}-opt-${d}` : void 0,
            value: L,
            placeholder: b,
            disabled: p,
            invalid: k,
            size: N,
            onFocus: () => o(!0),
            onChange: $,
            onKeyDown: A,
            trailing: /* @__PURE__ */ a.jsx("span", { className: "text-text-tertiary text-xs", "aria-hidden": "true", children: s ? "▲" : "▼" }),
            ...R
          }
        ),
        s && /* @__PURE__ */ a.jsx(
          "ul",
          {
            id: x,
            role: "listbox",
            style: { maxHeight: C },
            className: h(
              "absolute z-popover left-0 right-0 mt-1",
              "bg-surface-raised border border-default rounded-md shadow-lg",
              "overflow-y-auto",
              "py-1"
            ),
            children: i.length === 0 ? /* @__PURE__ */ a.jsx("li", { className: "px-3 py-2 text-sm text-text-tertiary", children: M }) : i.map((e, t) => {
              const j = e.value === c, q = t === d;
              return /* @__PURE__ */ a.jsxs(
                "li",
                {
                  id: `${x}-opt-${t}`,
                  role: "option",
                  "aria-selected": j,
                  "aria-disabled": e.disabled || void 0,
                  onMouseDown: (F) => {
                    F.preventDefault(), g(e);
                  },
                  onMouseEnter: () => m(t),
                  className: h(
                    "px-3 py-1.5 text-sm cursor-pointer flex items-center gap-2",
                    e.disabled && "text-text-disabled cursor-not-allowed",
                    q && !e.disabled && "bg-surface-elevated",
                    j && "font-medium text-brand-700"
                  ),
                  children: [
                    e.leading && /* @__PURE__ */ a.jsx("span", { className: "flex-none", children: e.leading }),
                    /* @__PURE__ */ a.jsx("span", { className: "flex-1 min-w-0 truncate", children: e.label }),
                    j && /* @__PURE__ */ a.jsx("span", { className: "flex-none text-brand-600 text-xs", "aria-hidden": "true", children: "✓" })
                  ]
                },
                e.value ?? t
              );
            })
          }
        )
      ]
    }
  );
}
export {
  V as C
};
