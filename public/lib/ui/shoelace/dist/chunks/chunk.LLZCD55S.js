import {
  l
} from "./chunk.5MED2A3H.js";
import {
  e
} from "./chunk.YXKHB4AC.js";
import {
  T
} from "./chunk.5PIDMFOE.js";

// src/internal/form-control.ts
var renderFormControl = (props, input) => {
  const hasLabel = props.label ? true : !!props.hasLabelSlot;
  const hasHelpText = props.helpText ? true : !!props.hasHelpTextSlot;
  return T`
    <div
      part="form-control"
      class=${e({
    "form-control": true,
    "form-control--small": props.size === "small",
    "form-control--medium": props.size === "medium",
    "form-control--large": props.size === "large",
    "form-control--has-label": hasLabel,
    "form-control--has-help-text": hasHelpText
  })}
    >
      <label
        part="label"
        id=${l(props.labelId)}
        class="form-control__label"
        for=${props.inputId}
        aria-hidden=${hasLabel ? "false" : "true"}
        @click=${(event) => props.onLabelClick ? props.onLabelClick(event) : null}
      >
        <slot name="label">${props.label}</slot>
      </label>

      <div class="form-control__input">${T`${input}`}</div>

      <div
        part="help-text"
        id=${l(props.helpTextId)}
        class="form-control__help-text"
        aria-hidden=${hasHelpText ? "false" : "true"}
      >
        <slot name="help-text">${props.helpText}</slot>
      </div>
    </div>
  `;
};
function getLabelledBy(props) {
  const labelledBy = [
    props.label || props.hasLabelSlot ? props.labelId : "",
    props.helpText || props.hasHelpTextSlot ? props.helpTextId : ""
  ].filter((val) => val);
  return labelledBy.join(" ") || void 0;
}

export {
  renderFormControl,
  getLabelledBy
};
