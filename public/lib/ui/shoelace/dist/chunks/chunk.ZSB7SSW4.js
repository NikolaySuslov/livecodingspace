import {
  l
} from "./chunk.5MED2A3H.js";
import {
  event,
  watch
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

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/radio/radio.scss
var radio_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: inline-block;\n}\n\n.radio {\n  display: inline-flex;\n  align-items: center;\n  font-family: var(--sl-input-font-family);\n  font-size: var(--sl-input-font-size-medium);\n  font-weight: var(--sl-input-font-weight);\n  color: var(--sl-input-color);\n  vertical-align: middle;\n  cursor: pointer;\n}\n\n.radio__icon {\n  display: inline-flex;\n  width: var(--sl-toggle-size);\n  height: var(--sl-toggle-size);\n}\n.radio__icon svg {\n  width: 100%;\n  height: 100%;\n}\n\n.radio__control {\n  flex: 0 0 auto;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: var(--sl-toggle-size);\n  height: var(--sl-toggle-size);\n  border: solid var(--sl-input-border-width) var(--sl-input-border-color);\n  border-radius: 50%;\n  background-color: var(--sl-input-background-color);\n  color: transparent;\n  transition: var(--sl-transition-fast) border-color, var(--sl-transition-fast) background-color, var(--sl-transition-fast) color, var(--sl-transition-fast) box-shadow;\n}\n.radio__control input[type=radio] {\n  position: absolute;\n  opacity: 0;\n  padding: 0;\n  margin: 0;\n  pointer-events: none;\n}\n\n.radio:not(.radio--checked):not(.radio--disabled) .radio__control:hover {\n  border-color: var(--sl-input-border-color-hover);\n  background-color: var(--sl-input-background-color-hover);\n}\n\n.radio.radio--focused:not(.radio--checked):not(.radio--disabled) .radio__control {\n  border-color: var(--sl-input-border-color-focus);\n  background-color: var(--sl-input-background-color-focus);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n\n.radio--checked .radio__control {\n  color: var(--sl-color-white);\n  border-color: var(--sl-color-primary-500);\n  background-color: var(--sl-color-primary-500);\n}\n\n.radio.radio--checked:not(.radio--disabled) .radio__control:hover {\n  border-color: var(--sl-color-primary-400);\n  background-color: var(--sl-color-primary-400);\n}\n\n.radio.radio--checked:not(.radio--disabled).radio--focused .radio__control {\n  border-color: var(--sl-color-primary-400);\n  background-color: var(--sl-color-primary-400);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n\n.radio--disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.radio:not(.radio--checked) svg circle {\n  opacity: 0;\n}\n\n.radio__label {\n  line-height: var(--sl-toggle-size);\n  margin-left: 0.5em;\n  user-select: none;\n}";

// src/components/radio/radio.ts
var id = 0;
var SlRadio = class extends h {
  constructor() {
    super(...arguments);
    this.inputId = `radio-${++id}`;
    this.labelId = `radio-label-${id}`;
    this.hasFocus = false;
    this.disabled = false;
    this.checked = false;
    this.invalid = false;
  }
  click() {
    this.input.click();
  }
  focus(options) {
    this.input.focus(options);
  }
  blur() {
    this.input.blur();
  }
  reportValidity() {
    return this.input.reportValidity();
  }
  setCustomValidity(message) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }
  getAllRadios() {
    const radioGroup = this.closest("sl-radio-group");
    if (!radioGroup) {
      return [];
    }
    return [...radioGroup.querySelectorAll("sl-radio")].filter((radio) => radio.name === this.name);
  }
  getSiblingRadios() {
    return this.getAllRadios().filter((radio) => radio !== this);
  }
  handleCheckedChange() {
    if (this.checked) {
      this.getSiblingRadios().map((radio) => radio.checked = false);
    }
    this.input.checked = this.checked;
    this.slChange.emit();
  }
  handleClick() {
    this.checked = true;
  }
  handleBlur() {
    this.hasFocus = false;
    this.slBlur.emit();
  }
  handleFocus() {
    this.hasFocus = true;
    this.slFocus.emit();
  }
  handleKeyDown(event2) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event2.key)) {
      const radios = this.getAllRadios().filter((radio) => !radio.disabled);
      const incr = ["ArrowUp", "ArrowLeft"].includes(event2.key) ? -1 : 1;
      let index = radios.indexOf(this) + incr;
      if (index < 0)
        index = radios.length - 1;
      if (index > radios.length - 1)
        index = 0;
      this.getAllRadios().map((radio) => radio.checked = false);
      radios[index].focus();
      radios[index].checked = true;
      event2.preventDefault();
    }
  }
  handleMouseDown(event2) {
    event2.preventDefault();
    this.input.focus();
  }
  render() {
    return T`
      <label
        part="base"
        class=${e2({
      radio: true,
      "radio--checked": this.checked,
      "radio--disabled": this.disabled,
      "radio--focused": this.hasFocus
    })}
        for=${this.inputId}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      >
        <span part="control" class="radio__control">
          <span part="checked-icon" class="radio__icon">
            <svg viewBox="0 0 16 16">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g fill="currentColor">
                  <circle cx="8" cy="8" r="3.42857143"></circle>
                </g>
              </g>
            </svg>
          </span>

          <input
            id=${this.inputId}
            type="radio"
            name=${l(this.name)}
            value=${l(this.value)}
            ?checked=${this.checked}
            ?disabled=${this.disabled}
            aria-checked=${this.checked ? "true" : "false"}
            aria-disabled=${this.disabled ? "true" : "false"}
            aria-labelledby=${this.labelId}
            @click=${this.handleClick}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
          />
        </span>

        <span part="label" id=${this.labelId} class="radio__label">
          <slot></slot>
        </span>
      </label>
    `;
  }
};
SlRadio.styles = r(radio_default);
__decorateClass([
  o('input[type="radio"]')
], SlRadio.prototype, "input", 2);
__decorateClass([
  r2()
], SlRadio.prototype, "hasFocus", 2);
__decorateClass([
  e()
], SlRadio.prototype, "name", 2);
__decorateClass([
  e()
], SlRadio.prototype, "value", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlRadio.prototype, "disabled", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlRadio.prototype, "checked", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlRadio.prototype, "invalid", 2);
__decorateClass([
  event("sl-blur")
], SlRadio.prototype, "slBlur", 2);
__decorateClass([
  event("sl-change")
], SlRadio.prototype, "slChange", 2);
__decorateClass([
  event("sl-focus")
], SlRadio.prototype, "slFocus", 2);
__decorateClass([
  watch("checked")
], SlRadio.prototype, "handleCheckedChange", 1);
SlRadio = __decorateClass([
  n("sl-radio")
], SlRadio);
var radio_default2 = SlRadio;

export {
  radio_default2 as radio_default
};
