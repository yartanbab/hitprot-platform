import { j as e } from "./react-vendor-D57GAUXd.js";
import { S as s, c as m } from "./Dialog-Bky2XNdc.js";
function x({ rows: a = 4, withLeading: t = !0, withTrailing: l = !0, className: i }) {
  return /* @__PURE__ */ e.jsx("ul", { className: m("flex flex-col gap-2", i), "aria-busy": "true", children: Array.from({ length: a }).map((o, r) => /* @__PURE__ */ e.jsxs(
    "li",
    {
      className: "flex items-center gap-3 p-2 rounded-md border border-subtle bg-surface-base",
      children: [
        t && /* @__PURE__ */ e.jsx(s, { width: 32, height: 32, rounded: "md" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
          /* @__PURE__ */ e.jsx(s, { height: 12, className: r % 2 === 0 ? "w-3/4" : "w-2/3" }),
          /* @__PURE__ */ e.jsx(s, { height: 10, className: "w-1/2" })
        ] }),
        l && /* @__PURE__ */ e.jsx(s, { width: 64, height: 12, rounded: "sm" })
      ]
    },
    r
  )) });
}
export {
  x as S
};
