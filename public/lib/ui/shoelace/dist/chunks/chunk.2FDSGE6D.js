import {
  getLabelledBy,
  renderFormControl
} from "./chunk.LLZCD55S.js";
import {
  getTextContent,
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

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/select/select.scss
var select_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n.form-control .form-control__label {\n  display: none;\n}\n.form-control .form-control__help-text {\n  display: none;\n}\n\n.form-control--has-label .form-control__label {\n  display: inline-block;\n  color: var(--sl-input-label-color);\n  margin-bottom: var(--sl-spacing-xxx-small);\n}\n.form-control--has-label.form-control--small .form-control__label {\n  font-size: var(--sl-input-label-font-size-small);\n}\n.form-control--has-label.form-control--medium .form-control__label {\n  font-size: var(--sl-input-label-font-size-medium);\n}\n.form-control--has-label.form-control--large .form-control_label {\n  font-size: var(--sl-input-label-font-size-large);\n}\n\n.form-control--has-help-text .form-control__help-text {\n  display: block;\n  color: var(--sl-input-help-text-color);\n}\n.form-control--has-help-text .form-control__help-text ::slotted(*) {\n  margin-top: var(--sl-spacing-xxx-small);\n}\n.form-control--has-help-text.form-control--small .form-control__help-text {\n  font-size: var(--sl-input-help-text-font-size-small);\n}\n.form-control--has-help-text.form-control--medium .form-control__help-text {\n  font-size: var(--sl-input-help-text-font-size-medium);\n}\n.form-control--has-help-text.form-control--large .form-control__help-text {\n  font-size: var(--sl-input-help-text-font-size-large);\n}\n\n:host {\n  --focus-ring: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n  display: block;\n}\n\n.select {\n  display: block;\n}\n\n.select__box {\n  display: inline-flex;\n  align-items: center;\n  justify-content: start;\n  position: relative;\n  width: 100%;\n  font-family: var(--sl-input-font-family);\n  font-weight: var(--sl-input-font-weight);\n  letter-spacing: var(--sl-input-letter-spacing);\n  background-color: var(--sl-input-background-color);\n  border: solid var(--sl-input-border-width) var(--sl-input-border-color);\n  vertical-align: middle;\n  overflow: hidden;\n  transition: var(--sl-transition-fast) color, var(--sl-transition-fast) border, var(--sl-transition-fast) box-shadow;\n  cursor: pointer;\n}\n\n.select:not(.select--disabled) .select__box:hover {\n  background-color: var(--sl-input-background-color-hover);\n  border-color: var(--sl-input-border-color-hover);\n  color: var(--sl-input-color-hover);\n}\n\n.select:not(.select--disabled) .select__box:focus {\n  background-color: var(--sl-input-background-color-focus);\n  border-color: var(--sl-input-border-color-focus);\n  box-shadow: var(--focus-ring);\n  outline: none;\n  color: var(--sl-input-color-focus);\n}\n\n.select--disabled .select__box {\n  background-color: var(--sl-input-background-color-disabled);\n  border-color: var(--sl-input-border-color-disabled);\n  color: var(--sl-input-color-disabled);\n  opacity: 0.5;\n  cursor: not-allowed;\n  outline: none;\n}\n.select--disabled .select__tags,\n.select--disabled .select__clear {\n  pointer-events: none;\n}\n\n.select__label {\n  flex: 1 1 auto;\n  display: flex;\n  align-items: center;\n  user-select: none;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n  overflow-x: auto;\n  overflow-y: hidden;\n  white-space: nowrap;\n}\n.select__label::-webkit-scrollbar {\n  width: 0;\n  height: 0;\n}\n\n.select__clear {\n  flex: 0 0 auto;\n}\n\n.select__icon {\n  flex: 0 0 auto;\n  display: inline-flex;\n  transition: var(--sl-transition-medium) transform ease;\n}\n\n.select--open .select__icon {\n  transform: rotate(-180deg);\n}\n\n.select--placeholder-visible .select__label {\n  color: var(--sl-input-placeholder-color);\n}\n\n.select--disabled.select--placeholder-visible .select__label {\n  color: var(--sl-input-placeholder-color-disabled);\n}\n\n.select__tags {\n  display: inline-flex;\n  align-items: center;\n  flex-wrap: wrap;\n  justify-content: left;\n  margin-left: var(--sl-spacing-xx-small);\n}\n\n.select__hidden-select {\n  clip: rect(0 0 0 0);\n  clip-path: inset(50%);\n  height: 1px;\n  overflow: hidden;\n  position: absolute;\n  white-space: nowrap;\n  width: 1px;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.select--small .select__box {\n  border-radius: var(--sl-input-border-radius-small);\n  font-size: var(--sl-input-font-size-small);\n  min-height: var(--sl-input-height-small);\n}\n.select--small .select__label {\n  margin: 0 var(--sl-input-spacing-small);\n}\n.select--small .select__clear {\n  margin-right: var(--sl-input-spacing-small);\n}\n.select--small .select__icon {\n  margin-right: var(--sl-input-spacing-small);\n}\n.select--small .select__tags {\n  padding-bottom: 2px;\n}\n.select--small .select__tags sl-tag {\n  padding-top: 2px;\n}\n.select--small .select__tags sl-tag:not(:last-of-type) {\n  margin-right: var(--sl-spacing-xx-small);\n}\n.select--small.select--has-tags .select__label {\n  margin-left: 0;\n}\n\n.select--medium .select__box {\n  border-radius: var(--sl-input-border-radius-medium);\n  font-size: var(--sl-input-font-size-medium);\n  min-height: var(--sl-input-height-medium);\n}\n.select--medium .select__label {\n  margin: 0 var(--sl-input-spacing-medium);\n}\n.select--medium .select__clear {\n  margin-right: var(--sl-input-spacing-medium);\n}\n.select--medium .select__icon {\n  margin-right: var(--sl-input-spacing-medium);\n}\n.select--medium .select__tags {\n  padding-bottom: 3px;\n}\n.select--medium .select__tags sl-tag {\n  padding-top: 3px;\n}\n.select--medium .select__tags sl-tag:not(:last-of-type) {\n  margin-right: var(--sl-spacing-xx-small);\n}\n.select--medium.select--has-tags .select__label {\n  margin-left: 0;\n}\n\n.select--large .select__box {\n  border-radius: var(--sl-input-border-radius-large);\n  font-size: var(--sl-input-font-size-large);\n  min-height: var(--sl-input-height-large);\n}\n.select--large .select__label {\n  margin: 0 var(--sl-input-spacing-large);\n}\n.select--large .select__clear {\n  margin-right: var(--sl-input-spacing-large);\n}\n.select--large .select__icon {\n  margin-right: var(--sl-input-spacing-large);\n}\n.select--large .select__tags {\n  padding-bottom: 4px;\n}\n.select--large .select__tags sl-tag {\n  padding-top: 4px;\n}\n.select--large .select__tags sl-tag:not(:last-of-type) {\n  margin-right: var(--sl-spacing-xx-small);\n}\n.select--large.select--has-tags .select__label {\n  margin-left: 0;\n}\n\n.select--pill.select--small .select__box {\n  border-radius: var(--sl-input-height-small);\n}\n.select--pill.select--medium .select__box {\n  border-radius: var(--sl-input-height-medium);\n}\n.select--pill.select--large .select__box {\n  border-radius: var(--sl-input-height-large);\n}";

// src/components/select/select.ts
var id = 0;
var SlSelect = class extends h {
  constructor() {
    super(...arguments);
    this.inputId = `select-${++id}`;
    this.helpTextId = `select-help-text-${id}`;
    this.labelId = `select-label-${id}`;
    this.hasFocus = false;
    this.hasHelpTextSlot = false;
    this.hasLabelSlot = false;
    this.isOpen = false;
    this.displayLabel = "";
    this.displayTags = [];
    this.multiple = false;
    this.maxTagsVisible = 3;
    this.disabled = false;
    this.name = "";
    this.placeholder = "";
    this.size = "medium";
    this.hoist = false;
    this.value = "";
    this.pill = false;
    this.required = false;
    this.clearable = false;
    this.invalid = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.handleSlotChange = this.handleSlotChange.bind(this);
    this.resizeObserver = new ResizeObserver(() => this.resizeMenu());
    this.updateComplete.then(() => {
      this.resizeObserver.observe(this);
      this.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
      this.syncItemsFromValue();
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.unobserve(this);
    this.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
  }
  reportValidity() {
    return this.input.reportValidity();
  }
  setCustomValidity(message) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }
  getItemLabel(item) {
    const slot = item.shadowRoot.querySelector("slot:not([name])");
    return getTextContent(slot);
  }
  getItems() {
    return [...this.querySelectorAll("sl-menu-item")];
  }
  getValueAsArray() {
    return Array.isArray(this.value) ? this.value : [this.value];
  }
  handleBlur() {
    this.hasFocus = false;
    this.slBlur.emit();
  }
  handleClearClick(event2) {
    event2.stopPropagation();
    this.value = this.multiple ? [] : "";
    this.slClear.emit();
    this.syncItemsFromValue();
  }
  handleDisabledChange() {
    if (this.disabled && this.isOpen) {
      this.dropdown.hide();
    }
  }
  handleFocus() {
    this.hasFocus = true;
    this.slFocus.emit();
  }
  handleKeyDown(event2) {
    const target = event2.target;
    const items = this.getItems();
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    if (target.tagName.toLowerCase() === "sl-tag") {
      return;
    }
    if (event2.key === "Tab") {
      if (this.isOpen) {
        this.dropdown.hide();
      }
      return;
    }
    if (["ArrowDown", "ArrowUp"].includes(event2.key)) {
      event2.preventDefault();
      if (!this.isOpen) {
        this.dropdown.show();
      }
      if (event2.key === "ArrowDown" && firstItem) {
        firstItem.focus();
        return;
      }
      if (event2.key === "ArrowUp" && lastItem) {
        lastItem.focus();
        return;
      }
    }
    if (!this.isOpen) {
      event2.stopPropagation();
      event2.preventDefault();
      this.dropdown.show();
      this.menu.typeToSelect(event2.key);
    }
  }
  handleLabelClick() {
    var _a;
    const box = (_a = this.shadowRoot) == null ? void 0 : _a.querySelector(".select__box");
    box.focus();
  }
  handleMenuSelect(event2) {
    const item = event2.detail.item;
    if (this.multiple) {
      this.value = this.value.includes(item.value) ? this.value.filter((v) => v !== item.value) : [...this.value, item.value];
    } else {
      this.value = item.value;
    }
    this.syncItemsFromValue();
  }
  handleMenuShow() {
    this.resizeMenu();
    this.isOpen = true;
  }
  handleMenuHide() {
    this.isOpen = false;
  }
  handleMultipleChange() {
    const value = this.getValueAsArray();
    this.value = this.multiple ? value : value[0] || "";
    this.syncItemsFromValue();
  }
  async handleSlotChange() {
    this.hasHelpTextSlot = hasSlot(this, "help-text");
    this.hasLabelSlot = hasSlot(this, "label");
    const items = this.getItems();
    await Promise.all(items.map((item) => item.render)).then(() => this.syncItemsFromValue());
  }
  handleTagInteraction(event2) {
    const path = event2.composedPath();
    const clearButton = path.find((el) => {
      if (el instanceof HTMLElement) {
        const element = el;
        return element.classList.contains("tag__clear");
      }
      return false;
    });
    if (clearButton) {
      event2.stopPropagation();
    }
  }
  handleValueChange() {
    this.syncItemsFromValue();
    this.slChange.emit();
  }
  resizeMenu() {
    var _a;
    const box = (_a = this.shadowRoot) == null ? void 0 : _a.querySelector(".select__box");
    this.menu.style.width = `${box.clientWidth}px`;
    if (this.dropdown) {
      this.dropdown.reposition();
    }
  }
  syncItemsFromValue() {
    const items = this.getItems();
    const value = this.getValueAsArray();
    items.map((item) => item.checked = value.includes(item.value));
    if (this.multiple) {
      const checkedItems = items.filter((item) => value.includes(item.value));
      this.displayLabel = checkedItems[0] ? this.getItemLabel(checkedItems[0]) : "";
      this.displayTags = checkedItems.map((item) => {
        return T`
          <sl-tag
            exportparts="base:tag"
            type="info"
            size=${this.size}
            ?pill=${this.pill}
            clearable
            @click=${this.handleTagInteraction}
            @keydown=${this.handleTagInteraction}
            @sl-clear=${(event2) => {
          event2.stopPropagation();
          if (!this.disabled) {
            item.checked = false;
            this.syncValueFromItems();
          }
        }}
          >
            ${this.getItemLabel(item)}
          </sl-tag>
        `;
      });
      if (this.maxTagsVisible > 0 && this.displayTags.length > this.maxTagsVisible) {
        const total = this.displayTags.length;
        this.displayLabel = "";
        this.displayTags = this.displayTags.slice(0, this.maxTagsVisible);
        this.displayTags.push(T`
          <sl-tag exportparts="base:tag" type="info" size=${this.size}> +${total - this.maxTagsVisible} </sl-tag>
        `);
      }
    } else {
      const checkedItem = items.filter((item) => item.value === value[0])[0];
      this.displayLabel = checkedItem ? this.getItemLabel(checkedItem) : "";
      this.displayTags = [];
    }
  }
  syncValueFromItems() {
    const items = this.getItems();
    const checkedItems = items.filter((item) => item.checked);
    const checkedValues = checkedItems.map((item) => item.value);
    if (this.multiple) {
      this.value = this.value.filter((val) => checkedValues.includes(val));
    } else {
      this.value = checkedValues.length > 0 ? checkedValues[0] : "";
    }
  }
  render() {
    var _a;
    const hasSelection = this.multiple ? this.value.length > 0 : this.value !== "";
    return renderFormControl({
      inputId: this.inputId,
      label: this.label,
      labelId: this.labelId,
      hasLabelSlot: this.hasLabelSlot,
      helpTextId: this.helpTextId,
      helpText: this.helpText,
      hasHelpTextSlot: this.hasHelpTextSlot,
      size: this.size,
      onLabelClick: () => this.handleLabelClick()
    }, T`
        <sl-dropdown
          part="base"
          .hoist=${this.hoist}
          .closeOnSelect=${!this.multiple}
          .containingElement=${this}
          ?disabled=${this.disabled}
          class=${e2({
      select: true,
      "select--open": this.isOpen,
      "select--empty": ((_a = this.value) == null ? void 0 : _a.length) === 0,
      "select--focused": this.hasFocus,
      "select--clearable": this.clearable,
      "select--disabled": this.disabled,
      "select--multiple": this.multiple,
      "select--has-tags": this.multiple && this.displayTags.length > 0,
      "select--placeholder-visible": this.displayLabel === "",
      "select--small": this.size === "small",
      "select--medium": this.size === "medium",
      "select--large": this.size === "large",
      "select--pill": this.pill,
      "select--invalid": this.invalid
    })}
          @sl-show=${this.handleMenuShow}
          @sl-hide=${this.handleMenuHide}
        >
          <div
            slot="trigger"
            id=${this.inputId}
            class="select__box"
            role="combobox"
            aria-labelledby=${l(getLabelledBy({
      label: this.label,
      labelId: this.labelId,
      hasLabelSlot: this.hasLabelSlot,
      helpText: this.helpText,
      helpTextId: this.helpTextId,
      hasHelpTextSlot: this.hasHelpTextSlot
    }))}
            aria-haspopup="true"
            aria-expanded=${this.isOpen ? "true" : "false"}
            tabindex=${this.disabled ? "-1" : "0"}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
            @keydown=${this.handleKeyDown}
          >
            <div class="select__label">
              ${this.displayTags.length ? T` <span part="tags" class="select__tags"> ${this.displayTags} </span> ` : this.displayLabel || this.placeholder}
            </div>

            ${this.clearable && hasSelection ? T`
                  <sl-icon-button
                    exportparts="base:clear-button"
                    class="select__clear"
                    name="x-circle"
                    library="system"
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  ></sl-icon-button>
                ` : ""}

            <span part="icon" class="select__icon" aria-hidden="true">
              <sl-icon name="chevron-down" library="system"></sl-icon>
            </span>

            <!-- The hidden input tricks the browser's built-in validation so it works as expected. We use an input
            instead of a select because, otherwise, iOS will show a list of options during validation. -->
            <input
              class="select__hidden-select"
              aria-hidden="true"
              ?required=${this.required}
              .value=${hasSelection ? "1" : ""}
              tabindex="-1"
            />
          </div>

          <sl-menu part="menu" class="select__menu" @sl-select=${this.handleMenuSelect}>
            <slot @slotchange=${this.handleSlotChange}></slot>
          </sl-menu>
        </sl-dropdown>
      `);
  }
};
SlSelect.styles = r(select_default);
__decorateClass([
  o(".select")
], SlSelect.prototype, "dropdown", 2);
__decorateClass([
  o(".select__hidden-select")
], SlSelect.prototype, "input", 2);
__decorateClass([
  o(".select__menu")
], SlSelect.prototype, "menu", 2);
__decorateClass([
  r2()
], SlSelect.prototype, "hasFocus", 2);
__decorateClass([
  r2()
], SlSelect.prototype, "hasHelpTextSlot", 2);
__decorateClass([
  r2()
], SlSelect.prototype, "hasLabelSlot", 2);
__decorateClass([
  r2()
], SlSelect.prototype, "isOpen", 2);
__decorateClass([
  r2()
], SlSelect.prototype, "displayLabel", 2);
__decorateClass([
  r2()
], SlSelect.prototype, "displayTags", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSelect.prototype, "multiple", 2);
__decorateClass([
  e({ attribute: "max-tags-visible", type: Number })
], SlSelect.prototype, "maxTagsVisible", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSelect.prototype, "disabled", 2);
__decorateClass([
  e()
], SlSelect.prototype, "name", 2);
__decorateClass([
  e()
], SlSelect.prototype, "placeholder", 2);
__decorateClass([
  e()
], SlSelect.prototype, "size", 2);
__decorateClass([
  e({ type: Boolean })
], SlSelect.prototype, "hoist", 2);
__decorateClass([
  e()
], SlSelect.prototype, "value", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSelect.prototype, "pill", 2);
__decorateClass([
  e()
], SlSelect.prototype, "label", 2);
__decorateClass([
  e({ attribute: "help-text" })
], SlSelect.prototype, "helpText", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSelect.prototype, "required", 2);
__decorateClass([
  e({ type: Boolean })
], SlSelect.prototype, "clearable", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSelect.prototype, "invalid", 2);
__decorateClass([
  event("sl-clear")
], SlSelect.prototype, "slClear", 2);
__decorateClass([
  event("sl-change")
], SlSelect.prototype, "slChange", 2);
__decorateClass([
  event("sl-focus")
], SlSelect.prototype, "slFocus", 2);
__decorateClass([
  event("sl-blur")
], SlSelect.prototype, "slBlur", 2);
__decorateClass([
  watch("disabled")
], SlSelect.prototype, "handleDisabledChange", 1);
__decorateClass([
  watch("multiple")
], SlSelect.prototype, "handleMultipleChange", 1);
__decorateClass([
  watch("helpText"),
  watch("label")
], SlSelect.prototype, "handleSlotChange", 1);
__decorateClass([
  watch("value")
], SlSelect.prototype, "handleValueChange", 1);
SlSelect = __decorateClass([
  n("sl-select")
], SlSelect);
var select_default2 = SlSelect;

export {
  select_default2 as select_default
};
