import { j as o } from "./react-vendor-D7YDiBbi.js";
const y = ["ready", "thinking", "streaming", "listening", "suggest", "off"], E = [
  "0.00",
  "27.69",
  "55.38",
  "83.08",
  "110.77",
  "138.46",
  "166.15",
  "193.85",
  "221.54",
  "249.23",
  "276.92",
  "304.62",
  "332.31"
], g = [
  "1.12s",
  "0.70s",
  "0.95s",
  "0.95s",
  "0.70s",
  "1.12s",
  "0.79s",
  "0.87s",
  "1.04s",
  "0.62s",
  "1.04s",
  "0.87s",
  "0.79s"
], j = "50,36 55.5,50 50,52 44.5,50", f = "50,64 44.5,50 50,48 55.5,50", u = "50,34 56,50 50,52.5 44,50", h = "50,60 45.5,50 50,48 54.5,50", m = "50,26 60,50 50,55 40,50", _ = "50,74 40,50 50,46 60,50";
function N({ size: r = 24, state: n = "ready", print: c = !1, micro: t, label: e, className: l, ...d }) {
  const i = y.includes(n) ? n : "ready", x = typeof t == "boolean" ? t : r < 16, p = e ? { role: "img", "aria-label": e } : { "aria-hidden": "true", focusable: "false" };
  return /* @__PURE__ */ o.jsx(
    "svg",
    {
      className: l ? `apya-mark ${l}` : "apya-mark",
      width: r,
      height: r,
      viewBox: "0 0 100 100",
      "data-state": i,
      ...p,
      ...d,
      children: x ? /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
        /* @__PURE__ */ o.jsx("g", { fill: "none", stroke: "currentColor", strokeWidth: "9", children: ["0", "120", "240"].map((s) => /* @__PURE__ */ o.jsx("line", { x1: "50", y1: "18", x2: "50", y2: "4", transform: `rotate(${s} 50 50)` }, s)) }),
        /* @__PURE__ */ o.jsx("polygon", { points: m, fill: "currentColor" }),
        /* @__PURE__ */ o.jsx("polygon", { points: _, fill: "none", stroke: "currentColor", strokeWidth: "5", strokeLinejoin: "round" })
      ] }) : /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
        /* @__PURE__ */ o.jsx("g", { fill: "none", stroke: "currentColor", strokeWidth: i === "suggest" || r < 32 ? "6" : "4.5", children: E.map((s, a) => /* @__PURE__ */ o.jsx("g", { transform: `rotate(${s} 50 50)`, children: /* @__PURE__ */ o.jsx(
          "line",
          {
            className: "apya-mark__ray",
            style: { "--i": a, "--ld": g[a] },
            x1: "50",
            y1: "20",
            x2: "50",
            y2: "4"
          }
        ) }, s)) }),
        c ? /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
          /* @__PURE__ */ o.jsx("polygon", { points: u, fill: "currentColor" }),
          /* @__PURE__ */ o.jsx("polygon", { points: h, fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinejoin: "round" })
        ] }) : /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
          /* @__PURE__ */ o.jsx("polygon", { points: j, fill: "currentColor" }),
          /* @__PURE__ */ o.jsx("polygon", { points: f, fill: "currentColor", opacity: ".38" })
        ] })
      ] })
    }
  );
}
export {
  N as A
};
