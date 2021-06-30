// src/internal/focus-visible.ts
var listeners = new WeakMap();
function observe(el) {
  const keys = ["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageDown", "PageUp"];
  const is = (event) => {
    if (keys.includes(event.key)) {
      el.classList.add("focus-visible");
    }
  };
  const isNot = () => el.classList.remove("focus-visible");
  listeners.set(el, { is, isNot });
  el.addEventListener("keydown", is);
  el.addEventListener("keyup", is);
  el.addEventListener("mousedown", isNot);
  el.addEventListener("mousedown", isNot);
}
function unobserve(el) {
  const { is, isNot } = listeners.get(el);
  el.classList.remove("focus-visible");
  el.removeEventListener("keydown", is);
  el.removeEventListener("keyup", is);
  el.removeEventListener("mousedown", isNot);
  el.removeEventListener("mousedown", isNot);
}
var focusVisible = {
  observe,
  unobserve
};

export {
  focusVisible
};
