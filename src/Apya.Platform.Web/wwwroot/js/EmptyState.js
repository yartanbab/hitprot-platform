import { j as e } from "./react-vendor.js";
import { S as t, c as i } from "./Sheet.js";
function f({ className: s, withDelta: a = !0, withBar: r = !1 }) {
  return /* @__PURE__ */ e.jsxs("div", { className: i("flex flex-col gap-3 h-full", s), "aria-busy": "true", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
      /* @__PURE__ */ e.jsx(t, { width: 140, height: 32, rounded: "md" }),
      /* @__PURE__ */ e.jsx(t, { width: 70, height: 16, rounded: "sm" })
    ] }),
    a && /* @__PURE__ */ e.jsx(t, { width: 180, height: 12, rounded: "sm" }),
    r && /* @__PURE__ */ e.jsx(t, { height: 6, rounded: "full" })
  ] });
}
function o({ className: s, height: a = 64 }) {
  const r = [0.4, 0.55, 0.45, 0.7, 0.6, 0.8, 0.65, 0.85, 0.75, 0.9, 0.7, 0.95];
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: i("flex items-end justify-between gap-1 w-full", s),
      style: { height: a },
      "aria-busy": "true",
      children: r.map((n, x) => /* @__PURE__ */ e.jsx(
        t,
        {
          height: `${n * 100}%`,
          className: "flex-1 min-w-0",
          rounded: "sm"
        },
        x
      ))
    }
  );
}
function g({ rows: s = 4, withLeading: a = !0, withTrailing: r = !0, className: n }) {
  return /* @__PURE__ */ e.jsx("ul", { className: i("flex flex-col gap-2", n), "aria-busy": "true", children: Array.from({ length: s }).map((x, l) => /* @__PURE__ */ e.jsxs(
    "li",
    {
      className: "flex items-center gap-3 p-2 rounded-md border border-subtle bg-surface-base",
      children: [
        a && /* @__PURE__ */ e.jsx(t, { width: 32, height: 32, rounded: "md" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
          /* @__PURE__ */ e.jsx(t, { height: 12, className: l % 2 === 0 ? "w-3/4" : "w-2/3" }),
          /* @__PURE__ */ e.jsx(t, { height: 10, className: "w-1/2" })
        ] }),
        r && /* @__PURE__ */ e.jsx(t, { width: 64, height: 12, rounded: "sm" })
      ]
    },
    l
  )) });
}
const u = {
  default: { ring: "bg-neutral-100 text-neutral-500", text: "text-text-tertiary" },
  success: { ring: "bg-positive-50 text-positive-600", text: "text-text-secondary" },
  info: { ring: "bg-brand-50 text-brand-600", text: "text-text-secondary" }
};
function j({
  icon: s,
  title: a,
  description: r,
  action: n,
  /* ReactNode — Button, link vs. */
  variant: x = "default",
  compact: l = !1,
  /* compact: ikonu küçült, padding düşür — Bento widget için */
  className: m
}) {
  const d = u[x] ?? u.default;
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      className: i(
        "flex flex-col items-center justify-center text-center",
        l ? "gap-2 py-3" : "gap-3 py-6",
        m
      ),
      children: [
        s && /* @__PURE__ */ e.jsx(
          "span",
          {
            className: i(
              "inline-flex items-center justify-center rounded-full",
              d.ring,
              l ? "h-8 w-8" : "h-12 w-12"
            ),
            "aria-hidden": "true",
            children: s
          }
        ),
        a && /* @__PURE__ */ e.jsx("p", { className: i(
          "font-medium text-text-primary",
          l ? "text-sm" : "text-base"
        ), children: a }),
        r && /* @__PURE__ */ e.jsx("p", { className: i("max-w-sm", d.text, l ? "text-xs" : "text-sm"), children: r }),
        n && /* @__PURE__ */ e.jsx("div", { className: "mt-1", children: n })
      ]
    }
  );
}
export {
  j as E,
  f as S,
  o as a,
  g as b
};
