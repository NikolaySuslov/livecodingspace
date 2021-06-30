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

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/switch/switch.scss
var switch_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  --height: var(--sl-toggle-size);\n  --thumb-size: calc(var(--sl-toggle-size) + 4px);\n  --width: calc(var(--height) * 2);\n  display: inline-block;\n}\n\n.switch {\n  display: inline-flex;\n  align-items: center;\n  font-family: var(--sl-input-font-family);\n  font-size: var(--sl-input-font-size-medium);\n  font-weight: var(--sl-input-font-weight);\n  color: var(--sl-input-color);\n  vertical-align: middle;\n  cursor: pointer;\n}\n\n.switch__control {\n  flex: 0 0 auto;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: var(--width);\n  height: var(--height);\n  background-color: var(--sl-color-gray-300);\n  border: solid var(--sl-input-border-width) var(--sl-color-gray-300);\n  border-radius: var(--height);\n  transition: var(--sl-transition-fast) border-color, var(--sl-transition-fast) background-color;\n}\n.switch__control .switch__thumb {\n  width: var(--thumb-size);\n  height: var(--thumb-size);\n  background-color: var(--sl-color-white);\n  border-radius: 50%;\n  border: solid var(--sl-input-border-width) var(--sl-input-border-color);\n  transform: translateX(calc(var(--width) / -2 + var(--thumb-size) / 2 - (var(--thumb-size) - var(--height)) / 2));\n  transition: var(--sl-transition-fast) transform ease, var(--sl-transition-fast) background-color, var(--sl-transition-fast) border-color, var(--sl-transition-fast) box-shadow;\n}\n.switch__control input[type=checkbox] {\n  position: absolute;\n  opacity: 0;\n  padding: 0;\n  margin: 0;\n  pointer-events: none;\n}\n\n.switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover {\n  background-color: var(--sl-color-gray-200);\n  border-color: var(--sl-color-gray-200);\n}\n.switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover .switch__thumb {\n  background-color: var(--sl-color-white);\n  border-color: var(--sl-input-border-color);\n}\n\n.switch.switch--focused:not(.switch--checked):not(.switch--disabled) .switch__control {\n  background-color: var(--sl-color-gray-200);\n  border-color: var(--sl-color-gray-200);\n}\n.switch.switch--focused:not(.switch--checked):not(.switch--disabled) .switch__control .switch__thumb {\n  background-color: var(--sl-color-white);\n  border-color: var(--sl-color-primary-500);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n\n.switch--checked .switch__control {\n  background-color: var(--sl-color-primary-500);\n  border-color: var(--sl-color-primary-500);\n}\n.switch--checked .switch__control .switch__thumb {\n  background-color: var(--sl-color-white);\n  border-color: var(--sl-color-primary-500);\n  transform: translateX(calc(var(--width) / 2 - var(--thumb-size) / 2 + (var(--thumb-size) - var(--height)) / 2));\n}\n\n.switch.switch--checked:not(.switch--disabled) .switch__control:hover {\n  background-color: var(--sl-color-primary-400);\n  border-color: var(--sl-color-primary-400);\n}\n.switch.switch--checked:not(.switch--disabled) .switch__control:hover .switch__thumb {\n  background-color: var(--sl-color-white);\n  border-color: var(--sl-color-primary-500);\n}\n\n.switch.switch--checked:not(.switch--disabled).switch--focused .switch__control {\n  background-color: var(--sl-color-primary-400);\n  border-color: var(--sl-color-primary-400);\n}\n.switch.switch--checked:not(.switch--disabled).switch--focused .switch__control .switch__thumb {\n  background-color: var(--sl-color-white);\n  border-color: var(--sl-color-primary-500);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n\n.switch--disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.switch__label {\n  line-height: var(--height);\n  margin-left: 0.5em;\n  user-select: none;\n}";

// src/components/switch/switch.ts
var id = 0;
var SlSwitch = class extends h {
  constructor() {
    super(...arguments);
    this.switchId = `switch-${++id}`;
    this.labelId = `switch-label-${id}`;
    this.hasFocus = false;
    this.disabled = false;
    this.required = false;
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
  handleClick() {
    this.checked = !this.checked;
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
    if (event2.key === "ArrowLeft") {
      event2.preventDefault();
      this.checked = false;
    }
    if (event2.key === "ArrowRight") {
      event2.preventDefault();
      this.checked = true;
    }
  }
  handleMouseDown(event2) {
    event2.preventDefault();
    this.input.focus();
  }
  handleCheckedChange() {
    if (this.input) {
      this.input.checked = this.checked;
      this.slChange.emit();
    }
  }
  render() {
    return T`
      <label
        part="base"
        for=${this.switchId}
        class=${e2({
      switch: true,
      "switch--checked": this.checked,
      "switch--disabled": this.disabled,
      "switch--focused": this.hasFocus
    })}
        @mousedown=${this.handleMouseDown}
      >
        <span part="control" class="switch__control">
          <span part="thumb" class="switch__thumb"></span>

          <input
            id=${this.switchId}
            type="checkbox"
            name=${l(this.name)}
            value=${l(this.value)}
            ?checked=${this.checked}
            ?disabled=${this.disabled}
            ?required=${this.required}
            role="switch"
            aria-checked=${this.checked ? "true" : "false"}
            aria-labelledby=${this.labelId}
            @click=${this.handleClick}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
            @keydown=${this.handleKeyDown}
          />
        </span>

        <span part="label" id=${this.labelId} class="switch__label">
          <slot></slot>
        </span>
      </label>
    `;
  }
};
SlSwitch.styles = r(switch_default);
__decorateClass([
  o('input[type="checkbox"]')
], SlSwitch.prototype, "input", 2);
__decorateClass([
  r2()
], SlSwitch.prototype, "hasFocus", 2);
__decorateClass([
  e()
], SlSwitch.prototype, "name", 2);
__decorateClass([
  e()
], SlSwitch.prototype, "value", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSwitch.prototype, "disabled", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSwitch.prototype, "required", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSwitch.prototype, "checked", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSwitch.prototype, "invalid", 2);
__decorateClass([
  event("sl-blur")
], SlSwitch.prototype, "slBlur", 2);
__decorateClass([
  event("sl-change")
], SlSwitch.prototype, "slChange", 2);
__decorateClass([
  event("sl-focus")
], SlSwitch.prototype, "slFocus", 2);
__decorateClass([
  watch("checked")
], SlSwitch.prototype, "handleCheckedChange", 1);
SlSwitch = __decorateClass([
  n("sl-switch")
], SlSwitch);
var switch_default2 = SlSwitch;

export {
  switch_default2 as switch_default
};
