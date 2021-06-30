// src/internal/slot.ts
function getTextContent(slot) {
  const nodes = slot ? slot.assignedNodes({ flatten: true }) : [];
  let text = "";
  [...nodes].map((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  });
  return text;
}
function hasSlot(el, name) {
  if (name) {
    return el.querySelector(`[slot="${name}"]`) !== null;
  }
  return [...el.childNodes].some((node) => {
    if (node.nodeType === node.TEXT_NODE && node.textContent.trim() !== "") {
      return true;
    }
    if (node.nodeType === node.ELEMENT_NODE) {
      const el2 = node;
      if (!el2.hasAttribute("slot")) {
        return true;
      }
    }
    return false;
  });
}

export {
  getTextContent,
  hasSlot
};
