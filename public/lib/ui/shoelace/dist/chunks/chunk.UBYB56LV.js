import {
  event
} from "./chunk.XX234VRK.js";
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

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/form/form.scss
var form_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: block;\n}";

// src/components/form/form.ts
var SlForm = class extends h {
  constructor() {
    super(...arguments);
    this.novalidate = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.formControls = [
      {
        tag: "button",
        serialize: (el, formData) => el.name && !el.disabled ? formData.append(el.name, el.value) : null,
        click: (event2) => {
          const target = event2.target;
          if (target.type === "submit") {
            this.submit();
          }
        }
      },
      {
        tag: "input",
        serialize: (el, formData) => {
          if (!el.name || el.disabled) {
            return;
          }
          if ((el.type === "checkbox" || el.type === "radio") && !el.checked) {
            return;
          }
          if (el.type === "file") {
            [...el.files].map((file) => formData.append(el.name, file));
            return;
          }
          formData.append(el.name, el.value);
        },
        click: (event2) => {
          const target = event2.target;
          if (target.type === "submit") {
            this.submit();
          }
        },
        keyDown: (event2) => {
          const target = event2.target;
          if (event2.key === "Enter" && !event2.defaultPrevented && !["checkbox", "file", "radio"].includes(target.type)) {
            this.submit();
          }
        }
      },
      {
        tag: "select",
        serialize: (el, formData) => {
          if (el.name && !el.disabled) {
            if (el.multiple) {
              const selectedOptions = [...el.querySelectorAll("option:checked")];
              if (selectedOptions.length) {
                selectedOptions.map((option) => formData.append(el.name, option.value));
              } else {
                formData.append(el.name, "");
              }
            } else {
              formData.append(el.name, el.value);
            }
          }
        }
      },
      {
        tag: "sl-button",
        serialize: (el, formData) => el.name && !el.disabled ? formData.append(el.name, el.value) : null,
        click: (event2) => {
          const target = event2.target;
          if (target.submit) {
            this.submit();
          }
        }
      },
      {
        tag: "sl-checkbox",
        serialize: (el, formData) => el.name && el.checked && !el.disabled ? formData.append(el.name, el.value) : null
      },
      {
        tag: "sl-color-picker",
        serialize: (el, formData) => el.name && !el.disabled ? formData.append(el.name, el.value) : null
      },
      {
        tag: "sl-input",
        serialize: (el, formData) => el.name && !el.disabled ? formData.append(el.name, el.value) : null,
        keyDown: (event2) => {
          if (event2.key === "Enter" && !event2.defaultPrevented) {
            this.submit();
          }
        }
      },
      {
        tag: "sl-radio",
        serialize: (el, formData) => el.name && el.checked && !el.disabled ? formData.append(el.name, el.value) : null
      },
      {
        tag: "sl-range",
        serialize: (el, formData) => {
          if (el.name && !el.disabled) {
            formData.append(el.name, el.value + "");
          }
        }
      },
      {
        tag: "sl-select",
        serialize: (el, formData) => {
          if (el.name && !el.disabled) {
            if (el.multiple) {
              const selectedOptions = [...el.value];
              if (selectedOptions.length) {
                selectedOptions.map((value) => formData.append(el.name, value));
              } else {
                formData.append(el.name, "");
              }
            } else {
              formData.append(el.name, el.value + "");
            }
          }
        }
      },
      {
        tag: "sl-switch",
        serialize: (el, formData) => el.name && el.checked && !el.disabled ? formData.append(el.name, el.value) : null
      },
      {
        tag: "sl-textarea",
        serialize: (el, formData) => el.name && !el.disabled ? formData.append(el.name, el.value) : null
      },
      {
        tag: "textarea",
        serialize: (el, formData) => el.name && !el.disabled ? formData.append(el.name, el.value) : null
      }
    ];
  }
  getFormData() {
    const formData = new FormData();
    const formControls = this.getFormControls();
    formControls.map((el) => this.serializeElement(el, formData));
    return formData;
  }
  getFormControls() {
    const slot = this.form.querySelector("slot");
    const tags = this.formControls.map((control) => control.tag);
    return slot.assignedElements({ flatten: true }).reduce((all, el) => all.concat(el, [...el.querySelectorAll("*")]), []).filter((el) => tags.includes(el.tagName.toLowerCase()));
  }
  submit() {
    const formData = this.getFormData();
    const formControls = this.getFormControls();
    const formControlsThatReport = formControls.filter((el) => typeof el.reportValidity === "function");
    if (!this.novalidate) {
      for (const el of formControlsThatReport) {
        const isValid = el.reportValidity();
        if (!isValid) {
          return false;
        }
      }
    }
    this.slSubmit.emit({ detail: { formData, formControls } });
    return true;
  }
  handleClick(event2) {
    const target = event2.target;
    const tag = target.tagName.toLowerCase();
    for (const formControl of this.formControls) {
      if (formControl.tag === tag && formControl.click) {
        formControl.click(event2);
      }
    }
  }
  handleKeyDown(event2) {
    const target = event2.target;
    const tag = target.tagName.toLowerCase();
    for (const formControl of this.formControls) {
      if (formControl.tag === tag && formControl.keyDown) {
        formControl.keyDown(event2);
      }
    }
  }
  serializeElement(el, formData) {
    const tag = el.tagName.toLowerCase();
    for (const formControl of this.formControls) {
      if (formControl.tag === tag) {
        return formControl.serialize(el, formData);
      }
    }
    return null;
  }
  render() {
    return T`
      <div part="base" class="form" role="form" @click=${this.handleClick} @keydown=${this.handleKeyDown}>
        <slot></slot>
      </div>
    `;
  }
};
SlForm.styles = r(form_default);
__decorateClass([
  o(".form")
], SlForm.prototype, "form", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlForm.prototype, "novalidate", 2);
__decorateClass([
  event("sl-submit")
], SlForm.prototype, "slSubmit", 2);
SlForm = __decorateClass([
  n("sl-form")
], SlForm);
var form_default2 = SlForm;

export {
  form_default2 as form_default
};
