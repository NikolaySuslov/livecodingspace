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

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/textarea/textarea.scss
var textarea_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n.form-control .form-control__label {\n  display: none;\n}\n.form-control .form-control__help-text {\n  display: none;\n}\n\n.form-control--has-label .form-control__label {\n  display: inline-block;\n  color: var(--sl-input-label-color);\n  margin-bottom: var(--sl-spacing-xxx-small);\n}\n.form-control--has-label.form-control--small .form-control__label {\n  font-size: var(--sl-input-label-font-size-small);\n}\n.form-control--has-label.form-control--medium .form-control__label {\n  font-size: var(--sl-input-label-font-size-medium);\n}\n.form-control--has-label.form-control--large .form-control_label {\n  font-size: var(--sl-input-label-font-size-large);\n}\n\n.form-control--has-help-text .form-control__help-text {\n  display: block;\n  color: var(--sl-input-help-text-color);\n}\n.form-control--has-help-text .form-control__help-text ::slotted(*) {\n  margin-top: var(--sl-spacing-xxx-small);\n}\n.form-control--has-help-text.form-control--small .form-control__help-text {\n  font-size: var(--sl-input-help-text-font-size-small);\n}\n.form-control--has-help-text.form-control--medium .form-control__help-text {\n  font-size: var(--sl-input-help-text-font-size-medium);\n}\n.form-control--has-help-text.form-control--large .form-control__help-text {\n  font-size: var(--sl-input-help-text-font-size-large);\n}\n\n:host {\n  display: block;\n}\n\n.textarea {\n  display: flex;\n  align-items: center;\n  position: relative;\n  width: 100%;\n  font-family: var(--sl-input-font-family);\n  font-weight: var(--sl-input-font-weight);\n  line-height: var(--sl-line-height-normal);\n  letter-spacing: var(--sl-input-letter-spacing);\n  background-color: var(--sl-input-background-color);\n  border: solid var(--sl-input-border-width) var(--sl-input-border-color);\n  vertical-align: middle;\n  transition: var(--sl-transition-fast) color, var(--sl-transition-fast) border, var(--sl-transition-fast) box-shadow;\n  cursor: text;\n}\n.textarea:hover:not(.textarea--disabled) {\n  background-color: var(--sl-input-background-color-hover);\n  border-color: var(--sl-input-border-color-hover);\n}\n.textarea:hover:not(.textarea--disabled) .textarea__control {\n  color: var(--sl-input-color-hover);\n}\n.textarea.textarea--focused:not(.textarea--disabled) {\n  background-color: var(--sl-input-background-color-focus);\n  border-color: var(--sl-input-border-color-focus);\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n  color: var(--sl-input-color-focus);\n}\n.textarea.textarea--focused:not(.textarea--disabled) .textarea__control {\n  color: var(--sl-input-color-focus);\n}\n.textarea.textarea--disabled {\n  background-color: var(--sl-input-background-color-disabled);\n  border-color: var(--sl-input-border-color-disabled);\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.textarea.textarea--disabled .textarea__control {\n  color: var(--sl-input-color-disabled);\n}\n.textarea.textarea--disabled .textarea__control::placeholder {\n  color: var(--sl-input-placeholder-color-disabled);\n}\n\n.textarea__control {\n  flex: 1 1 auto;\n  font-family: inherit;\n  font-size: inherit;\n  font-weight: inherit;\n  line-height: 1.4;\n  color: var(--sl-input-color);\n  border: none;\n  background: none;\n  box-shadow: none;\n  cursor: inherit;\n  -webkit-appearance: none;\n}\n.textarea__control::-webkit-search-decoration, .textarea__control::-webkit-search-cancel-button, .textarea__control::-webkit-search-results-button, .textarea__control::-webkit-search-results-decoration {\n  -webkit-appearance: none;\n}\n.textarea__control::placeholder {\n  color: var(--sl-input-placeholder-color);\n  user-select: none;\n}\n.textarea__control:focus {\n  outline: none;\n}\n\n.textarea--small {\n  border-radius: var(--sl-input-border-radius-small);\n  font-size: var(--sl-input-font-size-small);\n}\n.textarea--small .textarea__control {\n  padding: 0.5em var(--sl-input-spacing-small);\n}\n\n.textarea--medium {\n  border-radius: var(--sl-input-border-radius-medium);\n  font-size: var(--sl-input-font-size-medium);\n}\n.textarea--medium .textarea__control {\n  padding: 0.5em var(--sl-input-spacing-medium);\n}\n\n.textarea--large {\n  border-radius: var(--sl-input-border-radius-large);\n  font-size: var(--sl-input-font-size-large);\n}\n.textarea--large .textarea__control {\n  padding: 0.5em var(--sl-input-spacing-large);\n}\n\n.textarea--resize-none .textarea__control {\n  resize: none;\n}\n\n.textarea--resize-vertical .textarea__control {\n  resize: vertical;\n}\n\n.textarea--resize-auto .textarea__control {\n  height: auto;\n  resize: none;\n}";

// src/components/textarea/textarea.ts
var id = 0;
var SlTextarea = class extends h {
  constructor() {
    super(...arguments);
    this.inputId = `textarea-${++id}`;
    this.helpTextId = `textarea-help-text-${id}`;
    this.labelId = `textarea-label-${id}`;
    this.hasFocus = false;
    this.hasHelpTextSlot = false;
    this.hasLabelSlot = false;
    this.size = "medium";
    this.value = "";
    this.helpText = "";
    this.rows = 4;
    this.resize = "vertical";
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.invalid = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.handleSlotChange = this.handleSlotChange.bind(this);
    this.resizeObserver = new ResizeObserver(() => this.setTextareaHeight());
    this.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    this.handleSlotChange();
    this.updateComplete.then(() => {
      this.setTextareaHeight();
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
  select() {
    return this.input.select();
  }
  scrollPosition(position) {
    if (position) {
      if (typeof position.top === "number")
        this.input.scrollTop = position.top;
      if (typeof position.left === "number")
        this.input.scrollLeft = position.left;
      return;
    }
    return {
      top: this.input.scrollTop,
      left: this.input.scrollTop
    };
  }
  setSelectionRange(selectionStart, selectionEnd, selectionDirection = "none") {
    return this.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
  }
  setRangeText(replacement, start, end, selectMode = "preserve") {
    this.input.setRangeText(replacement, start, end, selectMode);
    if (this.value !== this.input.value) {
      this.value = this.input.value;
      this.slInput.emit();
    }
    if (this.value !== this.input.value) {
      this.value = this.input.value;
      this.setTextareaHeight();
      this.slInput.emit();
      this.slChange.emit();
    }
  }
  reportValidity() {
    return this.input.reportValidity();
  }
  setCustomValidity(message) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }
  handleChange() {
    this.value = this.input.value;
    this.slChange.emit();
  }
  handleInput() {
    this.value = this.input.value;
    this.setTextareaHeight();
    this.slInput.emit();
  }
  handleBlur() {
    this.hasFocus = false;
    this.slBlur.emit();
  }
  handleFocus() {
    this.hasFocus = true;
    this.slFocus.emit();
  }
  handleRowsChange() {
    this.setTextareaHeight();
  }
  handleSlotChange() {
    this.hasHelpTextSlot = hasSlot(this, "help-text");
    this.hasLabelSlot = hasSlot(this, "label");
  }
  handleValueChange() {
    this.invalid = !this.input.checkValidity();
  }
  setTextareaHeight() {
    if (this.resize === "auto") {
      this.input.style.height = "auto";
      this.input.style.height = this.input.scrollHeight + "px";
    } else {
      this.input.style.height = void 0;
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
      size: this.size
    }, T`
        <div
          part="base"
          class=${e2({
      textarea: true,
      "textarea--small": this.size === "small",
      "textarea--medium": this.size === "medium",
      "textarea--large": this.size === "large",
      "textarea--disabled": this.disabled,
      "textarea--focused": this.hasFocus,
      "textarea--empty": this.value.length === 0,
      "textarea--invalid": this.invalid,
      "textarea--resize-none": this.resize === "none",
      "textarea--resize-vertical": this.resize === "vertical",
      "textarea--resize-auto": this.resize === "auto"
    })}
        >
          <textarea
            part="textarea"
            id=${this.inputId}
            class="textarea__control"
            name=${l(this.name)}
            .value=${this.value}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            placeholder=${l(this.placeholder)}
            rows=${l(this.rows)}
            minlength=${l(this.minlength)}
            maxlength=${l(this.maxlength)}
            autocapitalize=${l(this.autocapitalize)}
            autocorrect=${l(this.autocorrect)}
            ?autofocus=${this.autofocus}
            spellcheck=${l(this.spellcheck)}
            inputmode=${l(this.inputmode)}
            aria-labelledby=${l(getLabelledBy({
      label: this.label,
      labelId: this.labelId,
      hasLabelSlot: this.hasLabelSlot,
      helpText: this.helpText,
      helpTextId: this.helpTextId,
      hasHelpTextSlot: this.hasHelpTextSlot
    }))}
            @change=${this.handleChange.bind(this)}
            @input=${this.handleInput.bind(this)}
            @focus=${this.handleFocus.bind(this)}
            @blur=${this.handleBlur.bind(this)}
          ></textarea>
        </div>
      `);
  }
};
SlTextarea.styles = r(textarea_default);
__decorateClass([
  o(".textarea__control")
], SlTextarea.prototype, "input", 2);
__decorateClass([
  r2()
], SlTextarea.prototype, "hasFocus", 2);
__decorateClass([
  r2()
], SlTextarea.prototype, "hasHelpTextSlot", 2);
__decorateClass([
  r2()
], SlTextarea.prototype, "hasLabelSlot", 2);
__decorateClass([
  e({ reflect: true })
], SlTextarea.prototype, "size", 2);
__decorateClass([
  e()
], SlTextarea.prototype, "name", 2);
__decorateClass([
  e()
], SlTextarea.prototype, "value", 2);
__decorateClass([
  e()
], SlTextarea.prototype, "label", 2);
__decorateClass([
  e({ attribute: "help-text" })
], SlTextarea.prototype, "helpText", 2);
__decorateClass([
  e()
], SlTextarea.prototype, "placeholder", 2);
__decorateClass([
  e({ type: Number })
], SlTextarea.prototype, "rows", 2);
__decorateClass([
  e()
], SlTextarea.prototype, "resize", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlTextarea.prototype, "disabled", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlTextarea.prototype, "readonly", 2);
__decorateClass([
  e({ type: Number })
], SlTextarea.prototype, "minlength", 2);
__decorateClass([
  e({ type: Number })
], SlTextarea.prototype, "maxlength", 2);
__decorateClass([
  e()
], SlTextarea.prototype, "pattern", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlTextarea.prototype, "required", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlTextarea.prototype, "invalid", 2);
__decorateClass([
  e()
], SlTextarea.prototype, "autocapitalize", 2);
__decorateClass([
  e()
], SlTextarea.prototype, "autocorrect", 2);
__decorateClass([
  e()
], SlTextarea.prototype, "autocomplete", 2);
__decorateClass([
  e({ type: Boolean })
], SlTextarea.prototype, "autofocus", 2);
__decorateClass([
  e({ type: Boolean })
], SlTextarea.prototype, "spellcheck", 2);
__decorateClass([
  e()
], SlTextarea.prototype, "inputmode", 2);
__decorateClass([
  event("sl-change")
], SlTextarea.prototype, "slChange", 2);
__decorateClass([
  event("sl-input")
], SlTextarea.prototype, "slInput", 2);
__decorateClass([
  event("sl-focus")
], SlTextarea.prototype, "slFocus", 2);
__decorateClass([
  event("sl-blur")
], SlTextarea.prototype, "slBlur", 2);
__decorateClass([
  watch("rows")
], SlTextarea.prototype, "handleRowsChange", 1);
__decorateClass([
  watch("helpText"),
  watch("label")
], SlTextarea.prototype, "handleSlotChange", 1);
__decorateClass([
  watch("value")
], SlTextarea.prototype, "handleValueChange", 1);
SlTextarea = __decorateClass([
  n("sl-textarea")
], SlTextarea);
var textarea_default2 = SlTextarea;

export {
  textarea_default2 as textarea_default
};
