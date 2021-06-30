import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlRadio extends LitElement {
    static styles: import("lit").CSSResult;
    input: HTMLInputElement;
    private inputId;
    private labelId;
    private hasFocus;
    name: string;
    value: string;
    disabled: boolean;
    checked: boolean;
    invalid: boolean;
    slBlur: EventEmitter<void>;
    slChange: EventEmitter<void>;
    slFocus: EventEmitter<void>;
    click(): void;
    focus(options?: FocusOptions): void;
    blur(): void;
    reportValidity(): boolean;
    setCustomValidity(message: string): void;
    getAllRadios(): this[];
    getSiblingRadios(): this[];
    handleCheckedChange(): void;
    handleClick(): void;
    handleBlur(): void;
    handleFocus(): void;
    handleKeyDown(event: KeyboardEvent): void;
    handleMouseDown(event: MouseEvent): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-radio': SlRadio;
    }
}
