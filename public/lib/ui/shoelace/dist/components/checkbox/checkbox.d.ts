import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlCheckbox extends LitElement {
    static styles: import("lit").CSSResult;
    input: HTMLInputElement;
    private inputId;
    private labelId;
    private hasFocus;
    name: string;
    value: string;
    disabled: boolean;
    required: boolean;
    checked: boolean;
    indeterminate: boolean;
    invalid: boolean;
    slBlur: EventEmitter<void>;
    slChange: EventEmitter<void>;
    slFocus: EventEmitter<void>;
    firstUpdated(): void;
    click(): void;
    focus(options?: FocusOptions): void;
    blur(): void;
    reportValidity(): boolean;
    setCustomValidity(message: string): void;
    handleClick(): void;
    handleBlur(): void;
    handleFocus(): void;
    handleLabelMouseDown(event: MouseEvent): void;
    handleStateChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-checkbox': SlCheckbox;
    }
}
