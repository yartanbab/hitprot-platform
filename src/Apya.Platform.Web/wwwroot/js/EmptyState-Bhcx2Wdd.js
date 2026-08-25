import { j as t } from "./react-vendor-D57GAUXd.js";
import { c as s } from "./Dialog-BdNKdiS6.js";
const l = {
  default: { ring: "bg-neutral-100 text-neutral-500", text: "text-text-tertiary" },
  success: { ring: "bg-positive-50 text-positive-600", text: "text-text-secondary" },
  info: { ring: "bg-brand-50 text-brand-600", text: "text-text-secondary" }
};
function f({
  icon: r,
  title: x,
  description: a,
  action: n,
  /* ReactNode — Button, link vs. */
  variant: d = "default",
  compact: e = !1,
  /* compact: ikonu küçült, padding düşür — Bento widget için */
  className: m
}) {
  const i = l[d] ?? l.default;
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      className: s(
        "flex flex-col items-center justify-center text-center",
        e ? "gap-2 py-3" : "gap-3 py-6",
        m
      ),
      children: [
        r && /* @__PURE__ */ t.jsx(
          "span",
          {
            className: s(
              "inline-flex items-center justify-center rounded-full",
              i.ring,
              e ? "h-8 w-8" : "h-12 w-12"
            ),
            "aria-hidden": "true",
            children: r
          }
        ),
        x && /* @__PURE__ */ t.jsx("p", { className: s(
          "font-medium text-text-primary",
          e ? "text-sm" : "text-base"
        ), children: x }),
        a && /* @__PURE__ */ t.jsx("p", { className: s("max-w-sm", i.text, e ? "text-xs" : "text-sm"), children: a }),
        n && /* @__PURE__ */ t.jsx("div", { className: "mt-1", children: n })
      ]
    }
  );
}
export {
  f as E
};
