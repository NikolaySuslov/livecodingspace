import {
  getLabelledBy,
  renderFormControl
} from "./chunk.LLZCD55S.js";
import {
  hasSlot
} from "./chunk.FMCX45AD.js";
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

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/range/range.scss
var range_default = ':host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n.form-control .form-control__label {\n  display: none;\n}\n.form-control .form-control__help-text {\n  display: none;\n}\n\n.form-control--has-label .form-control__label {\n  display: inline-block;\n  color: var(--sl-input-label-color);\n  margin-bottom: var(--sl-spacing-xxx-small);\n}\n.form-control--has-label.form-control--small .form-control__label {\n  font-size: var(--sl-input-label-font-size-small);\n}\n.form-control--has-label.form-control--medium .form-control__label {\n  font-size: var(--sl-input-label-font-size-medium);\n}\n.form-control--has-label.form-control--large .form-control_label {\n  font-size: var(--sl-input-label-font-size-large);\n}\n\n.form-control--has-help-text .form-control__help-text {\n  display: block;\n  color: var(--sl-input-help-text-color);\n}\n.form-control--has-help-text .form-control__help-text ::slotted(*) {\n  margin-top: var(--sl-spacing-xxx-small);\n}\n.form-control--has-help-text.form-control--small .form-control__help-text {\n  font-size: var(--sl-input-help-text-font-size-small);\n}\n.form-control--has-help-text.form-control--medium .form-control__help-text {\n  font-size: var(--sl-input-help-text-font-size-medium);\n}\n.form-control--has-help-text.form-control--large .form-control__help-text {\n  font-size: var(--sl-input-help-text-font-size-large);\n}\n\n:host {\n  --thumb-size: 20px;\n  --tooltip-offset-y: 10px;\n  --track-color: var(--sl-color-gray-200);\n  --track-height: 6px;\n  display: block;\n}\n\n.range {\n  position: relative;\n}\n.range .range__control {\n  -webkit-appearance: none;\n  width: 100%;\n  height: var(--sl-input-height-medium);\n  background: transparent;\n  line-height: var(--sl-input-height-medium);\n  vertical-align: middle;\n}\n.range .range__control::-webkit-slider-runnable-track {\n  width: 100%;\n  height: var(--track-height);\n  background-color: var(--track-color);\n  border-radius: 3px;\n  border: none;\n}\n.range .range__control::-webkit-slider-thumb {\n  border: none;\n  width: var(--thumb-size);\n  height: var(--thumb-size);\n  border-radius: 50%;\n  background-color: var(--sl-color-primary-500);\n  border: solid var(--sl-input-border-width) var(--sl-color-primary-500);\n  -webkit-appearance: none;\n  margin-top: calc(var(--thumb-size) / -2 + var(--track-height) / 2);\n  transition: var(--sl-transition-fast) border-color, var(--sl-transition-fast) background-color, var(--sl-transition-fast) color, var(--sl-transition-fast) box-shadow, var(--sl-transition-fast) transform;\n  cursor: pointer;\n}\n.range .range__control:not(:disabled)::-webkit-slider-thumb:hover {\n  background-color: var(--sl-color-primary-400);\n  border-color: var(--sl-color-primary-400);\n}\n.range .range__control:not(:disabled):focus::-webkit-slider-thumb {\n  background-color: var(--sl-color-primary-400);\n  border-color: var(--sl-color-primary-400);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n.range .range__control:not(:disabled)::-webkit-slider-thumb:active {\n  background-color: var(--sl-color-primary-500);\n  border-color: var(--sl-color-primary-500);\n  cursor: grabbing;\n}\n.range .range__control::-moz-focus-outer {\n  border: 0;\n}\n.range .range__control::-moz-range-track {\n  width: 100%;\n  height: var(--track-height);\n  background-color: var(--track-color);\n  border-radius: 3px;\n  border: none;\n}\n.range .range__control::-moz-range-thumb {\n  border: none;\n  height: var(--thumb-size);\n  width: var(--thumb-size);\n  border-radius: 50%;\n  background-color: var(--sl-color-primary-500);\n  border-color: var(--sl-color-primary-500);\n  transition: var(--sl-transition-fast) border-color, var(--sl-transition-fast) background-color, var(--sl-transition-fast) color, var(--sl-transition-fast) box-shadow, var(--sl-transition-fast) transform;\n  cursor: pointer;\n}\n.range .range__control:not(:disabled)::-moz-range-thumb:hover {\n  background-color: var(--sl-color-primary-400);\n  border-color: var(--sl-color-primary-400);\n}\n.range .range__control:not(:disabled):focus::-moz-range-thumb {\n  background-color: var(--sl-color-primary-400);\n  border-color: var(--sl-color-primary-400);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n.range .range__control:not(:disabled)::-moz-range-thumb:active {\n  background-color: var(--sl-color-primary-600);\n  border-color: var(--sl-color-primary-600);\n  cursor: grabbing;\n}\n.range .range__control:focus {\n  outline: none;\n}\n.range .range__control:disabled {\n  opacity: 0.5;\n}\n.range .range__control:disabled::-webkit-slider-thumb {\n  cursor: not-allowed;\n}\n.range .range__control:disabled::-moz-range-thumb {\n  cursor: not-allowed;\n}\n\n.range__tooltip {\n  position: absolute;\n  z-index: var(--sl-z-index-tooltip);\n  left: 1px;\n  border-radius: var(--sl-tooltip-border-radius);\n  background-color: var(--sl-tooltip-background-color);\n  font-family: var(--sl-tooltip-font-family);\n  font-size: var(--sl-tooltip-font-size);\n  font-weight: var(--sl-tooltip-font-weight);\n  line-height: var(--sl-tooltip-line-height);\n  color: var(--sl-tooltip-color);\n  opacity: 0;\n  padding: var(--sl-tooltip-padding);\n  transition: var(--sl-transition-fast) opacity;\n  pointer-events: none;\n}\n.range__tooltip:after {\n  content: "";\n  position: absolute;\n  width: 0;\n  height: 0;\n  left: 50%;\n  margin-left: calc(-1 * var(--sl-tooltip-arrow-size));\n}\n\n.range--tooltip-visible .range__tooltip {\n  opacity: 1;\n}\n\n.range--tooltip-top .range__tooltip {\n  top: calc(-1 * var(--thumb-size) - var(--tooltip-offset-y));\n}\n.range--tooltip-top .range__tooltip:after {\n  border-top: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);\n  border-left: var(--sl-tooltip-arrow-size) solid transparent;\n  border-right: var(--sl-tooltip-arrow-size) solid transparent;\n  top: 100%;\n}\n\n.range--tooltip-bottom .range__tooltip {\n  bottom: calc(-1 * var(--thumb-size) - var(--tooltip-offset-y));\n}\n.range--tooltip-bottom .range__tooltip:after {\n  border-bottom: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);\n  border-left: var(--sl-tooltip-arrow-size) solid transparent;\n  border-right: var(--sl-tooltip-arrow-size) solid transparent;\n  bottom: 100%;\n}';

// src/components/range/range.ts
var id = 0;
var SlRange = class extends h {
  constructor() {
    super(...arguments);
    this.inputId = `input-${++id}`;
    this.helpTextId = `input-help-text-${id}`;
    this.labelId = `input-label-${id}`;
    this.hasFocus = false;
    this.hasHelpTextSlot = false;
    this.hasLabelSlot = false;
    this.hasTooltip = false;
    this.name = "";
    this.value = 0;
    this.label = "";
    this.helpText = "";
    this.disabled = false;
    this.invalid = false;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.tooltip = "top";
    this.tooltipFormatter = (value) => value.toString();
  }
  connectedCallback() {
    super.connectedCallback();
    this.handleSlotChange = this.handleSlotChange.bind(this);
    this.resizeObserver = new ResizeObserver(() => this.syncTooltip());
    this.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    if (this.value === void 0 || this.value === null)
      this.value = this.min;
    if (this.value < this.min)
      this.value = this.min;
    if (this.value > this.max)
      this.value = this.max;
    this.handleSlotChange();
    this.updateComplete.then(() => {
      this.syncTooltip();
      this.resizeObserver.observe(this.input);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.unobserve(this.input);
    this.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
  }
  focus(options) {
    this.input.focus(options);
  }
  blur() {
    this.input.blur();
  }
  setCustomValidity(message) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }
  handleInput() {
    this.value = Number(this.input.value);
    this.slChange.emit();
    requestAnimationFrame(() => this.syncTooltip());
  }
  handleBlur() {
    this.hasFocus = false;
    this.hasTooltip = false;
    this.slBlur.emit();
  }
  handleFocus() {
    this.hasFocus = true;
    this.hasTooltip = true;
    this.slFocus.emit();
  }
  handleSlotChange() {
    this.hasHelpTextSlot = hasSlot(this, "help-text");
    this.hasLabelSlot = hasSlot(this, "label");
  }
  handleTouchStart() {
    this.focus();
  }
  syncTooltip() {
    if (this.tooltip !== "none") {
      const percent = Math.max(0, (this.value - this.min) / (this.max - this.min));
      const inputWidth = this.input.offsetWidth;
      const tooltipWidth = this.output.offsetWidth;
      const thumbSize = getComputedStyle(this.input).getPropertyValue("--thumb-size");
      const x = `calc(${inputWidth * percent}px - calc(calc(${percent} * ${thumbSize}) - calc(${thumbSize} / 2)))`;
      this.output.style.transform = `translateX(${x})`;
      this.output.style.marginLeft = `-${tooltipWidth / 2}px`;
    }
  }
  render() {
    return renderFormControl({
      inputId: this.inputId,
      label: this.label,
      labelId: this.labelId,
      hasLabelSlot: this.hasLabelSlot,
      helpTextId: this.helpTextId,
      helpText: this.helpText,
      hasHelpTextSlot: this.hasHelpTextSlot,
      size: "medium"
    }, T`
        <div
          part="base"
          class=${e2({
      range: true,
      "range--disabled": this.disabled,
      "range--focused": this.hasFocus,
      "range--tooltip-visible": this.hasTooltip,
      "range--tooltip-top": this.tooltip === "top",
      "range--tooltip-bottom": this.tooltip === "bottom"
    })}
          @touchstart=${this.handleTouchStart.bind(this)}
        >
          <input
            part="input"
            type="range"
            class="range__control"
            name=${l(this.name)}
            ?disabled=${this.disabled}
            min=${l(this.min)}
            max=${l(this.max)}
            step=${l(this.step)}
            .value=${String(this.value)}
            aria-labelledby=${l(getLabelledBy({
      label: this.label,
      labelId: this.labelId,
      hasLabelSlot: this.hasLabelSlot,
      helpText: this.helpText,
      helpTextId: this.helpTextId,
      hasHelpTextSlot: this.hasHelpTextSlot
    }))}
            @input=${this.handleInput.bind(this)}
            @focus=${this.handleFocus.bind(this)}
            @blur=${this.handleBlur.bind(this)}
          />
          ${this.tooltip !== "none" ? T` <output part="tooltip" class="range__tooltip"> ${this.tooltipFormatter(this.value)} </output> ` : ""}
        </div>
      `);
  }
};
SlRange.styles = r(range_default);
__decorateClass([
  o(".range__control")
], SlRange.prototype, "input", 2);
__decorateClass([
  o(".range__tooltip")
], SlRange.prototype, "output", 2);
__decorateClass([
  r2()
], SlRange.prototype, "hasFocus", 2);
__decorateClass([
  r2()
], SlRange.prototype, "hasHelpTextSlot", 2);
__decorateClass([
  r2()
], SlRange.prototype, "hasLabelSlot", 2);
__decorateClass([
  r2()
], SlRange.prototype, "hasTooltip", 2);
__decorateClass([
  e()
], SlRange.prototype, "name", 2);
__decorateClass([
  e({ type: Number })
], SlRange.prototype, "value", 2);
__decorateClass([
  e()
], SlRange.prototype, "label", 2);
__decorateClass([
  e({ attribute: "help-text" })
], SlRange.prototype, "helpText", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlRange.prototype, "disabled", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlRange.prototype, "invalid", 2);
__decorateClass([
  e({ type: Number })
], SlRange.prototype, "min", 2);
__decorateClass([
  e({ type: Number })
], SlRange.prototype, "max", 2);
__decorateClass([
  e({ type: Number })
], SlRange.prototype, "step", 2);
__decorateClass([
  e()
], SlRange.prototype, "tooltip", 2);
__decorateClass([
  e()
], SlRange.prototype, "tooltipFormatter", 2);
__decorateClass([
  event("sl-change")
], SlRange.prototype, "slChange", 2);
__decorateClass([
  event("sl-blur")
], SlRange.prototype, "slBlur", 2);
__decorateClass([
  event("sl-focus")
], SlRange.prototype, "slFocus", 2);
__decorateClass([
  watch("label"),
  watch("helpText")
], SlRange.prototype, "handleSlotChange", 1);
SlRange = __decorateClass([
  n("sl-range")
], SlRange);
var range_default2 = SlRange;

export {
  range_default2 as range_default
};
