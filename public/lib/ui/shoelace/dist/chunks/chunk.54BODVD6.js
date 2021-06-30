import {
  hasSlot
} from "./chunk.FMCX45AD.js";
import {
  l
} from "./chunk.5MED2A3H.js";
import {
  event
} from "./chunk.XX234VRK.js";
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

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/button/button.scss
var button_default = ':host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: inline-block;\n  width: auto;\n  cursor: pointer;\n}\n\n.button {\n  display: inline-flex;\n  align-items: stretch;\n  justify-content: center;\n  width: 100%;\n  border-style: solid;\n  border-width: var(--sl-input-border-width);\n  font-family: var(--sl-input-font-family);\n  font-weight: var(--sl-font-weight-semibold);\n  text-decoration: none;\n  user-select: none;\n  white-space: nowrap;\n  vertical-align: middle;\n  padding: 0;\n  transition: var(--sl-transition-fast) background-color, var(--sl-transition-fast) color, var(--sl-transition-fast) border, var(--sl-transition-fast) box-shadow;\n  cursor: inherit;\n}\n.button::-moz-focus-inner {\n  border: 0;\n}\n.button:focus {\n  outline: none;\n}\n.button.button--disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.button.button--disabled * {\n  pointer-events: none;\n}\n.button ::slotted(sl-icon) {\n  pointer-events: none;\n}\n\n.button__prefix,\n.button__suffix {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n}\n\n.button__label ::slotted(sl-icon) {\n  vertical-align: -2px;\n}\n\n.button.button--default {\n  background-color: var(--sl-color-white);\n  border-color: var(--sl-color-gray-300);\n  color: var(--sl-color-gray-600);\n}\n.button.button--default:hover:not(.button--disabled) {\n  background-color: var(--sl-color-primary-50);\n  border-color: var(--sl-color-primary-300);\n  color: var(--sl-color-primary-600);\n}\n.button.button--default:focus:not(.button--disabled) {\n  background-color: var(--sl-color-primary-50);\n  border-color: var(--sl-color-primary-300);\n  color: var(--sl-color-primary-600);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n.button.button--default:active:not(.button--disabled) {\n  background-color: var(--sl-color-primary-100);\n  border-color: var(--sl-color-primary-400);\n  color: var(--sl-color-primary-700);\n}\n.button.button--primary {\n  background-color: var(--sl-color-primary-500);\n  border-color: var(--sl-color-primary-500);\n  color: var(--sl-color-primary-text);\n}\n.button.button--primary:hover:not(.button--disabled) {\n  background-color: var(--sl-color-primary-400);\n  border-color: var(--sl-color-primary-400);\n  color: var(--sl-color-primary-text);\n}\n.button.button--primary:focus:not(.button--disabled) {\n  background-color: var(--sl-color-primary-400);\n  border-color: var(--sl-color-primary-400);\n  color: var(--sl-color-primary-text);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n.button.button--primary:active:not(.button--disabled) {\n  background-color: var(--sl-color-primary-500);\n  border-color: var(--sl-color-primary-500);\n  color: var(--sl-color-primary-text);\n}\n.button.button--success {\n  background-color: var(--sl-color-success-500);\n  border-color: var(--sl-color-success-500);\n  color: var(--sl-color-success-text);\n}\n.button.button--success:hover:not(.button--disabled) {\n  background-color: var(--sl-color-success-400);\n  border-color: var(--sl-color-success-400);\n  color: var(--sl-color-success-text);\n}\n.button.button--success:focus:not(.button--disabled) {\n  background-color: var(--sl-color-success-400);\n  border-color: var(--sl-color-success-400);\n  color: var(--sl-color-success-text);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-success);\n}\n.button.button--success:active:not(.button--disabled) {\n  background-color: var(--sl-color-success-500);\n  border-color: var(--sl-color-success-500);\n  color: var(--sl-color-success-text);\n}\n.button.button--info {\n  background-color: var(--sl-color-info-500);\n  border-color: var(--sl-color-info-500);\n  color: var(--sl-color-info-text);\n}\n.button.button--info:hover:not(.button--disabled) {\n  background-color: var(--sl-color-info-400);\n  border-color: var(--sl-color-info-400);\n  color: var(--sl-color-info-text);\n}\n.button.button--info:focus:not(.button--disabled) {\n  background-color: var(--sl-color-info-400);\n  border-color: var(--sl-color-info-400);\n  color: var(--sl-color-info-text);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-info);\n}\n.button.button--info:active:not(.button--disabled) {\n  background-color: var(--sl-color-info-500);\n  border-color: var(--sl-color-info-500);\n  color: var(--sl-color-info-text);\n}\n.button.button--warning {\n  background-color: var(--sl-color-warning-500);\n  border-color: var(--sl-color-warning-500);\n  color: var(--sl-color-warning-text);\n}\n.button.button--warning:hover:not(.button--disabled) {\n  background-color: var(--sl-color-warning-400);\n  border-color: var(--sl-color-warning-400);\n  color: var(--sl-color-warning-text);\n}\n.button.button--warning:focus:not(.button--disabled) {\n  background-color: var(--sl-color-warning-400);\n  border-color: var(--sl-color-warning-400);\n  color: var(--sl-color-warning-text);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-warning);\n}\n.button.button--warning:active:not(.button--disabled) {\n  background-color: var(--sl-color-warning-500);\n  border-color: var(--sl-color-warning-500);\n  color: var(--sl-color-warning-text);\n}\n.button.button--danger {\n  background-color: var(--sl-color-danger-500);\n  border-color: var(--sl-color-danger-500);\n  color: var(--sl-color-danger-text);\n}\n.button.button--danger:hover:not(.button--disabled) {\n  background-color: var(--sl-color-danger-400);\n  border-color: var(--sl-color-danger-400);\n  color: var(--sl-color-danger-text);\n}\n.button.button--danger:focus:not(.button--disabled) {\n  background-color: var(--sl-color-danger-400);\n  border-color: var(--sl-color-danger-400);\n  color: var(--sl-color-danger-text);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-danger);\n}\n.button.button--danger:active:not(.button--disabled) {\n  background-color: var(--sl-color-danger-500);\n  border-color: var(--sl-color-danger-500);\n  color: var(--sl-color-danger-text);\n}\n\n.button--text {\n  background-color: transparent;\n  border-color: transparent;\n  color: var(--sl-color-primary-500);\n}\n.button--text:hover:not(.button--disabled) {\n  background-color: transparent;\n  border-color: transparent;\n  color: var(--sl-color-primary-400);\n}\n.button--text:focus:not(.button--disabled) {\n  background-color: transparent;\n  border-color: transparent;\n  color: var(--sl-color-primary-400);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n.button--text:active:not(.button--disabled) {\n  background-color: transparent;\n  border-color: transparent;\n  color: var(--sl-color-primary-600);\n}\n\n.button--small {\n  font-size: var(--sl-button-font-size-small);\n  height: var(--sl-input-height-small);\n  line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);\n  border-radius: var(--sl-input-border-radius-small);\n}\n\n.button--medium {\n  font-size: var(--sl-button-font-size-medium);\n  height: var(--sl-input-height-medium);\n  line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);\n  border-radius: var(--sl-input-border-radius-medium);\n}\n\n.button--large {\n  font-size: var(--sl-button-font-size-large);\n  height: var(--sl-input-height-large);\n  line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);\n  border-radius: var(--sl-input-border-radius-large);\n}\n\n.button--pill.button--small {\n  border-radius: var(--sl-input-height-small);\n}\n.button--pill.button--medium {\n  border-radius: var(--sl-input-height-medium);\n}\n.button--pill.button--large {\n  border-radius: var(--sl-input-height-large);\n}\n\n.button--circle {\n  padding-left: 0;\n  padding-right: 0;\n}\n.button--circle.button--small {\n  width: var(--sl-input-height-small);\n  border-radius: 50%;\n}\n.button--circle.button--medium {\n  width: var(--sl-input-height-medium);\n  border-radius: 50%;\n}\n.button--circle.button--large {\n  width: var(--sl-input-height-large);\n  border-radius: 50%;\n}\n.button--circle .button__prefix,\n.button--circle .button__suffix,\n.button--circle .button__caret {\n  display: none;\n}\n\n.button--caret .button__suffix {\n  display: none;\n}\n.button--caret .button__caret {\n  display: flex;\n  align-items: center;\n}\n.button--caret .button__caret svg {\n  width: 1em;\n  height: 1em;\n}\n\n.button--loading {\n  position: relative;\n  cursor: wait;\n}\n.button--loading .button__prefix,\n.button--loading .button__label,\n.button--loading .button__suffix,\n.button--loading .button__caret {\n  visibility: hidden;\n}\n.button--loading sl-spinner {\n  --indicator-color: currentColor;\n  position: absolute;\n  height: 1em;\n  width: 1em;\n  top: calc(50% - 0.5em);\n  left: calc(50% - 0.5em);\n}\n\n.button ::slotted(sl-badge) {\n  position: absolute;\n  top: 0;\n  right: 0;\n  transform: translateY(-50%) translateX(50%);\n  pointer-events: none;\n}\n\n.button--has-label.button--small .button__label {\n  padding: 0 var(--sl-spacing-small);\n}\n.button--has-label.button--medium .button__label {\n  padding: 0 var(--sl-spacing-medium);\n}\n.button--has-label.button--large .button__label {\n  padding: 0 var(--sl-spacing-large);\n}\n\n.button--has-prefix.button--small {\n  padding-left: var(--sl-spacing-x-small);\n}\n.button--has-prefix.button--small .button__label {\n  padding-left: var(--sl-spacing-x-small);\n}\n.button--has-prefix.button--medium {\n  padding-left: var(--sl-spacing-small);\n}\n.button--has-prefix.button--medium .button__label {\n  padding-left: var(--sl-spacing-small);\n}\n.button--has-prefix.button--large {\n  padding-left: var(--sl-spacing-small);\n}\n.button--has-prefix.button--large .button__label {\n  padding-left: var(--sl-spacing-small);\n}\n\n.button--has-suffix.button--small,\n.button--caret.button--small {\n  padding-right: var(--sl-spacing-x-small);\n}\n.button--has-suffix.button--small .button__label,\n.button--caret.button--small .button__label {\n  padding-right: var(--sl-spacing-x-small);\n}\n.button--has-suffix.button--medium,\n.button--caret.button--medium {\n  padding-right: var(--sl-spacing-small);\n}\n.button--has-suffix.button--medium .button__label,\n.button--caret.button--medium .button__label {\n  padding-right: var(--sl-spacing-small);\n}\n.button--has-suffix.button--large,\n.button--caret.button--large {\n  padding-right: var(--sl-spacing-small);\n}\n.button--has-suffix.button--large .button__label,\n.button--caret.button--large .button__label {\n  padding-right: var(--sl-spacing-small);\n}\n\n:host(.sl-button-group__button--first) .button {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n:host(.sl-button-group__button--inner) .button {\n  border-radius: 0;\n}\n\n:host(.sl-button-group__button--last) .button {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n:host(.sl-button-group__button:not(.sl-button-group__button--first)) {\n  margin-left: calc(-1 * var(--sl-input-border-width));\n}\n\n:host(.sl-button-group__button:not(.sl-button-group__button--focus, .sl-button-group__button--first, [type=default]):not(:hover, :active, :focus)) .button:after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  border-left: solid 1px #fff4;\n  mix-blend-mode: lighten;\n}\n\n:host(.sl-button-group__button--hover) {\n  z-index: 1;\n}\n\n:host(.sl-button-group__button--focus) {\n  z-index: 2;\n}';

// src/components/button/button.ts
var SlButton = class extends h {
  constructor() {
    super(...arguments);
    this.hasFocus = false;
    this.hasLabel = false;
    this.hasPrefix = false;
    this.hasSuffix = false;
    this.type = "default";
    this.size = "medium";
    this.caret = false;
    this.disabled = false;
    this.loading = false;
    this.pill = false;
    this.circle = false;
    this.submit = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.handleSlotChange();
  }
  click() {
    this.button.click();
  }
  focus(options) {
    this.button.focus(options);
  }
  blur() {
    this.button.blur();
  }
  handleSlotChange() {
    this.hasLabel = hasSlot(this);
    this.hasPrefix = hasSlot(this, "prefix");
    this.hasSuffix = hasSlot(this, "suffix");
  }
  handleBlur() {
    this.hasFocus = false;
    this.slBlur.emit();
  }
  handleFocus() {
    this.hasFocus = true;
    this.slFocus.emit();
  }
  handleClick(event2) {
    if (this.disabled || this.loading) {
      event2.preventDefault();
      event2.stopPropagation();
    }
  }
  render() {
    const isLink = this.href ? true : false;
    const interior = T`
      <span part="prefix" class="button__prefix">
        <slot @slotchange=${this.handleSlotChange} name="prefix"></slot>
      </span>
      <span part="label" class="button__label">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </span>
      <span part="suffix" class="button__suffix">
        <slot @slotchange=${this.handleSlotChange} name="suffix"></slot>
      </span>
      ${this.caret ? T`
            <span part="caret" class="button__caret">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          ` : ""}
      ${this.loading ? T`<sl-spinner></sl-spinner>` : ""}
    `;
    const button = T`
      <button
        part="base"
        class=${e2({
      button: true,
      "button--default": this.type === "default",
      "button--primary": this.type === "primary",
      "button--success": this.type === "success",
      "button--info": this.type === "info",
      "button--warning": this.type === "warning",
      "button--danger": this.type === "danger",
      "button--text": this.type === "text",
      "button--small": this.size === "small",
      "button--medium": this.size === "medium",
      "button--large": this.size === "large",
      "button--caret": this.caret,
      "button--circle": this.circle,
      "button--disabled": this.disabled,
      "button--focused": this.hasFocus,
      "button--loading": this.loading,
      "button--pill": this.pill,
      "button--has-label": this.hasLabel,
      "button--has-prefix": this.hasPrefix,
      "button--has-suffix": this.hasSuffix
    })}
        ?disabled=${this.disabled}
        type=${this.submit ? "submit" : "button"}
        name=${l(this.name)}
        value=${l(this.value)}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        ${interior}
      </button>
    `;
    const link = T`
      <a
        ref=${(el) => this.button = el}
        part="base"
        class=${e2({
      button: true,
      "button--default": this.type === "default",
      "button--primary": this.type === "primary",
      "button--success": this.type === "success",
      "button--info": this.type === "info",
      "button--warning": this.type === "warning",
      "button--danger": this.type === "danger",
      "button--text": this.type === "text",
      "button--small": this.size === "small",
      "button--medium": this.size === "medium",
      "button--large": this.size === "large",
      "button--caret": this.caret,
      "button--circle": this.circle,
      "button--disabled": this.disabled,
      "button--focused": this.hasFocus,
      "button--loading": this.loading,
      "button--pill": this.pill,
      "button--has-label": this.hasLabel,
      "button--has-prefix": this.hasPrefix,
      "button--has-suffix": this.hasSuffix
    })}
        href=${l(this.href)}
        target=${l(this.target)}
        download=${l(this.download)}
        rel=${l(this.target ? "noreferrer noopener" : void 0)}
        role="button"
        aria-disabled=${this.disabled ? "true" : "false"}
        tabindex=${this.disabled ? "-1" : "0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        ${interior}
      </a>
    `;
    return isLink ? link : button;
  }
};
SlButton.styles = r(button_default);
__decorateClass([
  o(".button")
], SlButton.prototype, "button", 2);
__decorateClass([
  r2()
], SlButton.prototype, "hasFocus", 2);
__decorateClass([
  r2()
], SlButton.prototype, "hasLabel", 2);
__decorateClass([
  r2()
], SlButton.prototype, "hasPrefix", 2);
__decorateClass([
  r2()
], SlButton.prototype, "hasSuffix", 2);
__decorateClass([
  e({ reflect: true })
], SlButton.prototype, "type", 2);
__decorateClass([
  e({ reflect: true })
], SlButton.prototype, "size", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlButton.prototype, "caret", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlButton.prototype, "disabled", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlButton.prototype, "loading", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlButton.prototype, "pill", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlButton.prototype, "circle", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlButton.prototype, "submit", 2);
__decorateClass([
  e()
], SlButton.prototype, "name", 2);
__decorateClass([
  e()
], SlButton.prototype, "value", 2);
__decorateClass([
  e()
], SlButton.prototype, "href", 2);
__decorateClass([
  e()
], SlButton.prototype, "target", 2);
__decorateClass([
  e()
], SlButton.prototype, "download", 2);
__decorateClass([
  event("sl-blur")
], SlButton.prototype, "slBlur", 2);
__decorateClass([
  event("sl-focus")
], SlButton.prototype, "slFocus", 2);
SlButton = __decorateClass([
  n("sl-button")
], SlButton);
var button_default2 = SlButton;

export {
  button_default2 as button_default
};
