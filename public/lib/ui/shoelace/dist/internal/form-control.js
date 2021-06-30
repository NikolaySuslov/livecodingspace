import { html } from 'lit';
import { classMap } from 'lit-html/directives/class-map';
import { ifDefined } from 'lit-html/directives/if-defined';
export const renderFormControl = (props, input) => {
    const hasLabel = props.label ? true : !!props.hasLabelSlot;
    const hasHelpText = props.helpText ? true : !!props.hasHelpTextSlot;
    return html `
    <div
      part="form-control"
      class=${classMap({
        'form-control': true,
        'form-control--small': props.size === 'small',
        'form-control--medium': props.size === 'medium',
        'form-control--large': props.size === 'large',
        'form-control--has-label': hasLabel,
        'form-control--has-help-text': hasHelpText
    })}
    >
      <label
        part="label"
        id=${ifDefined(props.labelId)}
        class="form-control__label"
        for=${props.inputId}
        aria-hidden=${hasLabel ? 'false' : 'true'}
        @click=${(event) => (props.onLabelClick ? props.onLabelClick(event) : null)}
      >
        <slot name="label">${props.label}</slot>
      </label>

      <div class="form-control__input">${html `${input}`}</div>

      <div
        part="help-text"
        id=${ifDefined(props.helpTextId)}
        class="form-control__help-text"
        aria-hidden=${hasHelpText ? 'false' : 'true'}
      >
        <slot name="help-text">${props.helpText}</slot>
      </div>
    </div>
  `;
};
export function getLabelledBy(props) {
    const labelledBy = [
        props.label || props.hasLabelSlot ? props.labelId : '',
        props.helpText || props.hasHelpTextSlot ? props.helpTextId : ''
    ].filter(val => val);
    return labelledBy.join(' ') || undefined;
}
