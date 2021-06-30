import {
  event
} from "./chunk.XX234VRK.js";
import {
  T,
  h,
  n,
  r
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/resize-observer/resize-observer.scss
var resize_observer_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: contents;\n}";

// src/components/resize-observer/resize-observer.ts
var SlResizeObserver = class extends h {
  constructor() {
    super(...arguments);
    this.observedElements = [];
  }
  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver((entries) => {
      this.slResize.emit({ detail: { entries } });
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.disconnect();
  }
  handleSlotChange() {
    const slot = this.shadowRoot.querySelector("slot");
    const elements = slot.assignedElements({ flatten: true });
    this.observedElements.map((el) => this.resizeObserver.unobserve(el));
    this.observedElements = [];
    elements.map((el) => {
      this.resizeObserver.observe(el);
      this.observedElements.push(el);
    });
  }
  render() {
    return T` <slot @slotchange=${this.handleSlotChange}></slot> `;
  }
};
SlResizeObserver.styles = r(resize_observer_default);
__decorateClass([
  event("sl-resize")
], SlResizeObserver.prototype, "slResize", 2);
SlResizeObserver = __decorateClass([
  n("sl-resize-observer")
], SlResizeObserver);
var resize_observer_default2 = SlResizeObserver;

export {
  resize_observer_default2 as resize_observer_default
};
