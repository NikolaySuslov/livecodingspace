import {
  focusVisible
} from "./chunk.XAZSQ3AT.js";
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
  r
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/icon-button/icon-button.scss
var icon_button_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: inline-block;\n}\n\n.icon-button {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  background: none;\n  border: none;\n  border-radius: var(--sl-border-radius-medium);\n  font-size: inherit;\n  color: var(--sl-color-gray-500);\n  padding: var(--sl-spacing-x-small);\n  cursor: pointer;\n  transition: var(--sl-transition-medium) color;\n  -webkit-appearance: none;\n}\n.icon-button:hover:not(.icon-button--disabled), .icon-button:focus:not(.icon-button--disabled) {\n  color: var(--sl-color-primary-500);\n}\n.icon-button:active:not(.icon-button--disabled) {\n  color: var(--sl-color-primary-600);\n}\n.icon-button:focus {\n  outline: none;\n}\n\n.icon-button--disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.focus-visible.icon-button:focus {\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}";

// src/components/icon-button/icon-button.ts
var SlIconButton = class extends h {
  constructor() {
    super(...arguments);
    this.label = "";
    this.disabled = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => focusVisible.observe(this.button));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    focusVisible.unobserve(this.button);
  }
  render() {
    return T`
      <button
        part="base"
        class=${e2({
      "icon-button": true,
      "icon-button--disabled": this.disabled
    })}
        ?disabled=${this.disabled}
        type="button"
        aria-label=${this.label}
      >
        <sl-icon
          name=${l(this.name)}
          library=${l(this.library)}
          src=${l(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </button>
    `;
  }
};
SlIconButton.styles = r(icon_button_default);
__decorateClass([
  o("button")
], SlIconButton.prototype, "button", 2);
__decorateClass([
  e()
], SlIconButton.prototype, "name", 2);
__decorateClass([
  e()
], SlIconButton.prototype, "library", 2);
__decorateClass([
  e()
], SlIconButton.prototype, "src", 2);
__decorateClass([
  e()
], SlIconButton.prototype, "label", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlIconButton.prototype, "disabled", 2);
SlIconButton = __decorateClass([
  n("sl-icon-button")
], SlIconButton);
var icon_button_default2 = SlIconButton;

export {
  icon_button_default2 as icon_button_default
};
