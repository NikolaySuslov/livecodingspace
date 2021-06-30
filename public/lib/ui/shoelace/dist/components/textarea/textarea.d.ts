import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlTextarea extends LitElement {
    static styles: import("lit").CSSResult;
    input: HTMLTextAreaElement;
    private inputId;
    private helpTextId;
    private labelId;
    private resizeObserver;
    private hasFocus;
    private hasHelpTextSlot;
    private hasLabelSlot;
    size: 'small' | 'medium' | 'large';
    name: string;
    value: string;
    label: string;
    helpText: string;
    placeholder: string;
    rows: number;
    resize: 'none' | 'vertical' | 'auto';
    disabled: boolean;
    readonly: boolean;
    minlength: number;
    maxlength: number;
    pattern: string;
    required: boolean;
    invalid: boolean;
    autocapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters' | 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
    autocorrect: string;
    autocomplete: string;
    autofocus: boolean;
    spellcheck: boolean;
    inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    slChange: EventEmitter<void>;
    slInput: EventEmitter<void>;
    slFocus: EventEmitter<void>;
    slBlur: EventEmitter<void>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    focus(options?: FocusOptions): void;
    blur(): void;
    select(): void;
    scrollPosition(position?: {
        top?: number;
        left?: number;
    }): {
        top: number;
        left: number;
    } | undefined;
    setSelectionRange(selectionStart: number, selectionEnd: number, selectionDirection?: 'forward' | 'backward' | 'none'): void;
    setRangeText(replacement: string, start: number, end: number, selectMode?: 'select' | 'start' | 'end' | 'preserve'): void;
    reportValidity(): boolean;
    setCustomValidity(message: string): void;
    handleChange(): void;
    handleInput(): void;
    handleBlur(): void;
    handleFocus(): void;
    handleRowsChange(): void;
    handleSlotChange(): void;
    handleValueChange(): void;
    setTextareaHeight(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-textarea': SlTextarea;
    }
}
