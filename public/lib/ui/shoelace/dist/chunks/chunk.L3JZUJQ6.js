import {
  l
} from "./chunk.5MED2A3H.js";
import {
  e as e2
} from "./chunk.YXKHB4AC.js";
import {
  T,
  e,
  h,
  n,
  o,
  r,
  r2
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/menu-item/menu-item.scss
var menu_item_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: block;\n}\n\n.menu-item {\n  position: relative;\n  display: flex;\n  align-items: stretch;\n  font-family: var(--sl-font-sans);\n  font-size: var(--sl-font-size-medium);\n  font-weight: var(--sl-font-weight-normal);\n  line-height: var(--sl-line-height-normal);\n  letter-spacing: var(--sl-letter-spacing-normal);\n  text-align: left;\n  color: var(--sl-color-gray-700);\n  padding: var(--sl-spacing-xx-small) var(--sl-spacing-x-large);\n  transition: var(--sl-transition-fast) fill;\n  user-select: none;\n  white-space: nowrap;\n  cursor: pointer;\n}\n.menu-item.menu-item--focused:not(.menu-item--disabled) {\n  outline: none;\n  background-color: var(--sl-color-primary-500);\n  color: var(--sl-color-white);\n}\n.menu-item.menu-item--disabled {\n  outline: none;\n  color: var(--sl-color-gray-400);\n  cursor: not-allowed;\n}\n.menu-item .menu-item__label {\n  flex: 1 1 auto;\n}\n.menu-item .menu-item__prefix {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n}\n.menu-item .menu-item__prefix ::slotted(*) {\n  margin-right: var(--sl-spacing-x-small);\n}\n.menu-item .menu-item__suffix {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n}\n.menu-item .menu-item__suffix ::slotted(*) {\n  margin-left: var(--sl-spacing-x-small);\n}\n\n.menu-item .menu-item__check {\n  display: flex;\n  position: absolute;\n  left: 0.5em;\n  top: calc(50% - 0.5em);\n  visibility: hidden;\n  align-items: center;\n  font-size: inherit;\n}\n\n.menu-item--checked .menu-item__check {\n  visibility: visible;\n}";

// src/components/menu-item/menu-item.ts
var SlMenuItem = class extends h {
  constructor() {
    super(...arguments);
    this.hasFocus = false;
    this.checked = false;
    this.value = "";
    this.disabled = false;
  }
  focus(options) {
    this.menuItem.focus(options);
  }
  blur() {
    this.menuItem.blur();
  }
  handleBlur() {
    this.hasFocus = false;
  }
  handleFocus() {
    this.hasFocus = true;
  }
  handleMouseEnter() {
    this.focus();
  }
  handleMouseLeave() {
    this.blur();
  }
  render() {
    return T`
      <div
        part="base"
        class=${e2({
      "menu-item": true,
      "menu-item--checked": this.checked,
      "menu-item--disabled": this.disabled,
      "menu-item--focused": this.hasFocus
    })}
        role="menuitem"
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-checked=${this.checked ? "true" : "false"}
        tabindex=${l(!this.disabled ? "0" : void 0)}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        <span part="checked-icon" class="menu-item__check">
          <sl-icon name="check" library="system" aria-hidden="true"></sl-icon>
        </span>

        <span part="prefix" class="menu-item__prefix">
          <slot name="prefix"></slot>
        </span>

        <span part="label" class="menu-item__label">
          <slot></slot>
        </span>

        <span part="suffix" class="menu-item__suffix">
          <slot name="suffix"></slot>
        </span>
      </div>
    `;
  }
};
SlMenuItem.styles = r(menu_item_default);
__decorateClass([
  o(".menu-item")
], SlMenuItem.prototype, "menuItem", 2);
__decorateClass([
  r2()
], SlMenuItem.prototype, "hasFocus", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlMenuItem.prototype, "checked", 2);
__decorateClass([
  e()
], SlMenuItem.prototype, "value", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlMenuItem.prototype, "disabled", 2);
SlMenuItem = __decorateClass([
  n("sl-menu-item")
], SlMenuItem);
var menu_item_default2 = SlMenuItem;

export {
  menu_item_default2 as menu_item_default
};
