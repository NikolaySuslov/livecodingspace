import {
  T,
  h,
  n,
  r
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/menu-label/menu-label.scss
var menu_label_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: block;\n}\n\n.menu-label {\n  font-family: var(--sl-font-sans);\n  font-size: var(--sl-font-size-small);\n  font-weight: var(--sl-font-weight-normal);\n  line-height: var(--sl-line-height-normal);\n  letter-spacing: var(--sl-letter-spacing-normal);\n  color: var(--sl-color-gray-400);\n  padding: var(--sl-spacing-xx-small) var(--sl-spacing-x-large);\n  user-select: none;\n}";

// src/components/menu-label/menu-label.ts
var SlMenuLabel = class extends h {
  render() {
    return T`
      <div part="base" class="menu-label">
        <slot></slot>
      </div>
    `;
  }
};
SlMenuLabel.styles = r(menu_label_default);
SlMenuLabel = __decorateClass([
  n("sl-menu-label")
], SlMenuLabel);
var menu_label_default2 = SlMenuLabel;

export {
  menu_label_default2 as menu_label_default
};
