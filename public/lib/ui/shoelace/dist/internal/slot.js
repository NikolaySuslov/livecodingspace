export function getInnerHTML(slot) {
    const nodes = slot.assignedNodes({ flatten: true });
    let html = '';
    [...nodes].map(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            html += node.outerHTML;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            html += node.textContent;
        }
    });
    return html;
}
export function getTextContent(slot) {
    const nodes = slot ? slot.assignedNodes({ flatten: true }) : [];
    let text = '';
    [...nodes].map(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent;
        }
    });
    return text;
}
export function hasSlot(el, name) {
    if (name) {
        return el.querySelector(`[slot="${name}"]`) !== null;
    }
    return [...el.childNodes].some(node => {
        if (node.nodeType === node.TEXT_NODE && node.textContent.trim() !== '') {
            return true;
        }
        if (node.nodeType === node.ELEMENT_NODE) {
            const el = node;
            if (!el.hasAttribute('slot')) {
                return true;
            }
        }
        return false;
    });
}
