import { r as s, j as r } from "./react-vendor-D57GAUXd.js";
import { I as K, c as h, t as E } from "./Dialog-CkwGYc9B.js";
function z(n, c) {
  const l = c.trim().toLowerCase();
  return l ? n.filter((b) => String(b.label).toLowerCase().includes(l)) : n;
}
function U({
  options: n = [],
  value: c,
  onChange: l,
  placeholder: b = E("Common:MakeSelection", "Seçim yap"),
  onSearch: u,
  /* opsiyonel — async/server-side filter caller'a */
  size: N,
  invalid: k,
  disabled: v,
  emptyMessage: M = E("Common:NoMatch", "Eşleşme bulunamadı"),
  className: I,
  listMaxHeight: C = 240,
  ...R
}) {
  const [a, o] = s.useState(!1), [p, f] = s.useState(""), [d, m] = s.useState(0), y = s.useRef(null), D = s.useRef(null), x = s.useId(), w = s.useMemo(
    () => n.find((e) => e.value === c),
    [n, c]
  ), i = s.useMemo(() => u ? n : z(n, p), [n, p, u]), L = a ? p : (w == null ? void 0 : w.label) ?? "", $ = s.useCallback((e) => {
    const t = e.target.value;
    f(t), o(!0), m(0), u == null || u(t);
  }, [u]), g = s.useCallback((e) => {
    var t;
    !e || e.disabled || (l == null || l(e.value), f(""), o(!1), (t = D.current) == null || t.blur());
  }, [l]), A = s.useCallback((e) => {
    v || (e.key === "ArrowDown" ? (e.preventDefault(), o(!0), m((t) => Math.min(t + 1, i.length - 1))) : e.key === "ArrowUp" ? (e.preventDefault(), m((t) => Math.max(t - 1, 0))) : e.key === "Enter" ? a && i[d] && (e.preventDefault(), g(i[d])) : e.key === "Escape" && a && (e.preventDefault(), o(!1), f("")));
  }, [a, d, i, g, v]);
  return s.useEffect(() => {
    if (!a) return;
    const e = (t) => {
      y.current && !y.current.contains(t.target) && (o(!1), f(""));
    };
    return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
  }, [a]), /* @__PURE__ */ r.jsxs(
    "div",
    {
      ref: y,
      className: h("relative", I),
      children: [
        /* @__PURE__ */ r.jsx(
          K,
          {
            ref: D,
            role: "combobox",
            "aria-controls": x,
            "aria-expanded": a,
            "aria-autocomplete": "list",
            "aria-activedescendant": a && i[d] ? `${x}-opt-${d}` : void 0,
            value: L,
            placeholder: b,
            disabled: v,
            invalid: k,
            size: N,
            onFocus: () => o(!0),
            onChange: $,
            onKeyDown: A,
            trailing: /* @__PURE__ */ r.jsx("span", { className: "text-text-tertiary text-xs", "aria-hidden": "true", children: a ? "▲" : "▼" }),
            ...R
          }
        ),
        a && /* @__PURE__ */ r.jsx(
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
            children: i.length === 0 ? /* @__PURE__ */ r.jsx("li", { className: "px-3 py-2 text-sm text-text-tertiary", children: M }) : i.map((e, t) => {
              const j = e.value === c, q = t === d;
              return /* @__PURE__ */ r.jsxs(
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
                    e.leading && /* @__PURE__ */ r.jsx("span", { className: "flex-none", children: e.leading }),
                    /* @__PURE__ */ r.jsx("span", { className: "flex-1 min-w-0 truncate", children: e.label }),
                    j && /* @__PURE__ */ r.jsx("span", { className: "flex-none text-brand-600 text-xs", "aria-hidden": "true", children: "✓" })
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
  U as C
};
