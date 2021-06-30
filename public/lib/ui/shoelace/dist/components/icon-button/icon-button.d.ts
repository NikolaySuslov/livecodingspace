import { LitElement } from 'lit';
export default class SlIconButton extends LitElement {
    static styles: import("lit").CSSResult;
    button: HTMLButtonElement;
    name: string;
    library: string;
    src: string;
    label: string;
    disabled: boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-icon-button': SlIconButton;
    }
}
