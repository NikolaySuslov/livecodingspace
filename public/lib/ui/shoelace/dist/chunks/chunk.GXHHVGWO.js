import {
  T,
  h,
  n,
  r
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/menu-divider/menu-divider.scss
var menu_divider_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: block;\n}\n\n.menu-divider {\n  border-top: solid 1px var(--sl-panel-border-color);\n  margin: var(--sl-spacing-x-small) 0;\n}";

// src/components/menu-divider/menu-divider.ts
var SlMenuDivider = class extends h {
  render() {
    return T` <div part="base" class="menu-divider" role="separator" aria-hidden="true"></div> `;
  }
};
SlMenuDivider.styles = r(menu_divider_default);
SlMenuDivider = __decorateClass([
  n("sl-menu-divider")
], SlMenuDivider);
var menu_divider_default2 = SlMenuDivider;

export {
  menu_divider_default2 as menu_divider_default
};
