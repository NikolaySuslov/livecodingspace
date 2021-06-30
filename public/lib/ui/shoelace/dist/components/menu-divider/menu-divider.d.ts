import { LitElement } from 'lit';
export default class SlMenuDivider extends LitElement {
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-menu-divider': SlMenuDivider;
    }
}
