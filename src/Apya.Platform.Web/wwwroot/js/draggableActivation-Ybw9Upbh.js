function r(t) {
  return {
    onPointerDown: (n) => {
      n.pointerType === "touch" || n.button !== 0 || t(n);
    },
    onClick: (n) => {
      var e;
      const o = ((e = n.nativeEvent) == null ? void 0 : e.pointerType) ?? n.pointerType;
      o === "mouse" || o === "pen" || t(n);
    }
  };
}
export {
  r as d
};
