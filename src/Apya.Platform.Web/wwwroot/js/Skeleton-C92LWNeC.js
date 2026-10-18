import { j as n } from "./react-vendor-D7YDiBbi.js";
import { c as t } from "./Dialog-D3HpJNIB.js";
function f({ className: m, width: o, height: e, rounded: r = "md", ...l }) {
  const s = {};
  return o !== void 0 && (s.width = typeof o == "number" ? `${o}px` : o), e !== void 0 && (s.height = typeof e == "number" ? `${e}px` : e), /* @__PURE__ */ n.jsx(
    "div",
    {
      "aria-busy": "true",
      "aria-live": "polite",
      className: t(
        "skeleton",
        r === "full" && "rounded-full",
        r === "sm" && "rounded-sm",
        r === "md" && "rounded-md",
        r === "lg" && "rounded-lg",
        m
      ),
      style: s,
      ...l
    }
  );
}
export {
  f as S
};
