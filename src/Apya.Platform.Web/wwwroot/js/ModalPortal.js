import { a as t } from "./react-vendor.js";
function e({ children: o }) {
  return typeof document > "u" ? null : t.createPortal(o, document.body);
}
export {
  e as M
};
