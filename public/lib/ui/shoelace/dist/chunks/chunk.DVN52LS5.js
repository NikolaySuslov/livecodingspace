// src/internal/tabbable.ts
function isTabbable(el) {
  const tag = el.tagName.toLowerCase();
  if (el.getAttribute("tabindex") === "-1") {
    return false;
  }
  if (el.hasAttribute("disabled")) {
    return false;
  }
  if (el.hasAttribute("aria-disabled") && el.getAttribute("aria-disabled") !== "false") {
    return false;
  }
  if (el.hasAttribute("tabindex")) {
    return true;
  }
  if (el.hasAttribute("contenteditable") && el.getAttribute("contenteditable") !== "false") {
    return true;
  }
  if ((tag === "audio" || tag === "video") && el.hasAttribute("controls")) {
    return true;
  }
  if (tag === "input" && el.getAttribute("type") === "radio" && !el.hasAttribute("checked")) {
    return false;
  }
  if (!el.offsetParent) {
    return false;
  }
  if (window.getComputedStyle(el).visibility === "hidden") {
    return false;
  }
  return ["button", "input", "select", "textarea", "a", "audio", "video", "summary"].includes(tag);
}
function getTabbableElements(root) {
  const tabbableElements = [];
  if (root instanceof HTMLElement) {
    if (isTabbable(root)) {
      tabbableElements.push(root);
    }
    if (root.shadowRoot && root.shadowRoot.mode === "open") {
      getTabbableElements(root.shadowRoot).map((el) => tabbableElements.push(el));
    }
    if (root instanceof HTMLSlotElement) {
      root.assignedElements().map((slottedEl) => {
        getTabbableElements(slottedEl).map((el) => tabbableElements.push(el));
      });
    }
  }
  [...root.querySelectorAll("*")].map((el) => {
    getTabbableElements(el).map((el2) => tabbableElements.push(el2));
  });
  return tabbableElements;
}
function getNearestTabbableElement(el) {
  const tabbableElements = getTabbableElements(el);
  return tabbableElements.length ? tabbableElements[0] : null;
}

export {
  getTabbableElements,
  getNearestTabbableElement
};
