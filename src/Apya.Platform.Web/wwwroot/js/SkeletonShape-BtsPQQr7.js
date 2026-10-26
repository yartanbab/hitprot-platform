import { j as e } from "./react-vendor-D7YDiBbi.js";
import { S as s } from "./Skeleton-B15h4VhT.js";
import { c as m } from "./Dialog-DTcK6HxT.js";
function c({ rows: t = 4, withLeading: a = !0, withTrailing: l = !0, className: i }) {
  return /* @__PURE__ */ e.jsx("ul", { className: m("flex flex-col gap-2", i), "aria-busy": "true", children: Array.from({ length: t }).map((o, r) => /* @__PURE__ */ e.jsxs(
    "li",
    {
      className: "flex items-center gap-3 p-2 rounded-md border border-subtle bg-surface-base",
      children: [
        a && /* @__PURE__ */ e.jsx(s, { width: 32, height: 32, rounded: "md" }),
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
  c as S
};
