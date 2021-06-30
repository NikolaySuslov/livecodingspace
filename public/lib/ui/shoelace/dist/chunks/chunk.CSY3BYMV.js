import {
  getTextContent
} from "./chunk.FMCX45AD.js";
import {
  event
} from "./chunk.XX234VRK.js";
import {
  T,
  h,
  n,
  o,
  r
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/menu/menu.scss
var menu_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: block;\n}\n\n.menu {\n  padding: var(--sl-spacing-x-small) 0;\n}\n.menu:focus {\n  outline: none;\n}";

// src/components/menu/menu.ts
var SlMenu = class extends h {
  constructor() {
    super(...arguments);
    this.items = [];
    this.typeToSelectString = "";
  }
  typeToSelect(key) {
    clearTimeout(this.typeToSelectTimeout);
    this.typeToSelectTimeout = setTimeout(() => this.typeToSelectString = "", 750);
    this.typeToSelectString += key.toLowerCase();
    for (const item of this.items) {
      const slot = item.shadowRoot.querySelector("slot:not([name])");
      const label = getTextContent(slot).toLowerCase().trim();
      if (label.substring(0, this.typeToSelectString.length) === this.typeToSelectString) {
        item.focus();
        break;
      }
    }
  }
  syncItems() {
    this.items = [...this.defaultSlot.assignedElements({ flatten: true })].filter((el) => el.tagName.toLowerCase() === "sl-menu-item" && !el.disabled);
  }
  getActiveItem() {
    return this.items.filter((i) => i.shadowRoot.querySelector(".menu-item--focused"))[0];
  }
  setActiveItem(item) {
    item.focus();
  }
  handleClick(event2) {
    const target = event2.target;
    const item = target.closest("sl-menu-item");
    if (item && !item.disabled) {
      this.slSelect.emit({ detail: { item } });
    }
  }
  handleKeyDown(event2) {
    if (event2.key === "Enter") {
      const item = this.getActiveItem();
      event2.preventDefault();
      if (item) {
        this.slSelect.emit({ detail: { item } });
      }
    }
    if (event2.key === " ") {
      event2.preventDefault();
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event2.key)) {
      const selectedItem = this.getActiveItem();
      let index = selectedItem ? this.items.indexOf(selectedItem) : 0;
      if (this.items.length) {
        event2.preventDefault();
        if (event2.key === "ArrowDown") {
          index++;
        } else if (event2.key === "ArrowUp") {
          index--;
        } else if (event2.key === "Home") {
          index = 0;
        } else if (event2.key === "End") {
          index = this.items.length - 1;
        }
        if (index < 0)
          index = 0;
        if (index > this.items.length - 1)
          index = this.items.length - 1;
        this.setActiveItem(this.items[index]);
        return;
      }
    }
    this.typeToSelect(event2.key);
  }
  handleSlotChange() {
    this.syncItems();
  }
  render() {
    return T`
      <div part="base" class="menu" role="menu" @click=${this.handleClick} @keydown=${this.handleKeyDown} tabindex="0">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }
};
SlMenu.styles = r(menu_default);
__decorateClass([
  o(".menu")
], SlMenu.prototype, "menu", 2);
__decorateClass([
  o("slot")
], SlMenu.prototype, "defaultSlot", 2);
__decorateClass([
  event("sl-select")
], SlMenu.prototype, "slSelect", 2);
SlMenu = __decorateClass([
  n("sl-menu")
], SlMenu);
var menu_default2 = SlMenu;

export {
  menu_default2 as menu_default
};
