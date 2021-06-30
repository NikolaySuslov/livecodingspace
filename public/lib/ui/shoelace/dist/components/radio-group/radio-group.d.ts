import { LitElement } from 'lit';
export default class SlRadioGroup extends LitElement {
    static styles: import("lit").CSSResult;
    label: string;
    noFieldset: boolean;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-radio-group': SlRadioGroup;
    }
}
