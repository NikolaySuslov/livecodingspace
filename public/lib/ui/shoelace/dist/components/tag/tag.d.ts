import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlTag extends LitElement {
    static styles: import("lit").CSSResult;
    type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text';
    size: 'small' | 'medium' | 'large';
    pill: boolean;
    clearable: boolean;
    slClear: EventEmitter<void>;
    handleClearClick(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-tag': SlTag;
    }
}
