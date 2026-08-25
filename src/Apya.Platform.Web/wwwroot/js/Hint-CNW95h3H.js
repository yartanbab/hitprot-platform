import { j as i } from "./react-vendor-D57GAUXd.js";
function r({ text: a, placement: n = "top", className: t }) {
  return a ? /* @__PURE__ */ i.jsx(
    "span",
    {
      className: t ? "apya-hint " + t : "apya-hint",
      "data-bs-toggle": "tooltip",
      "data-bs-placement": n,
      "data-bs-title": a,
      tabIndex: 0,
      "aria-label": "Bilgi",
      children: /* @__PURE__ */ i.jsx("i", { className: "fa fa-circle-info", "aria-hidden": "true" })
    }
  ) : null;
}
export {
  r as H
};
