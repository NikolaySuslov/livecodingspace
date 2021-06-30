import { LitElement, TemplateResult } from 'lit';
import { EventEmitter } from '../../internal/decorators';
import type SlDropdown from '../dropdown/dropdown';
import type SlMenu from '../menu/menu';
import type SlMenuItem from '../menu-item/menu-item';
export default class SlSelect extends LitElement {
    static styles: import("lit").CSSResult;
    dropdown: SlDropdown;
    input: HTMLInputElement;
    menu: SlMenu;
    private inputId;
    private helpTextId;
    private labelId;
    private resizeObserver;
    private hasFocus;
    private hasHelpTextSlot;
    private hasLabelSlot;
    private isOpen;
    private displayLabel;
    private displayTags;
    multiple: boolean;
    maxTagsVisible: number;
    disabled: boolean;
    name: string;
    placeholder: string;
    size: 'small' | 'medium' | 'large';
    hoist: boolean;
    value: string | Array<string>;
    pill: boolean;
    label: string;
    helpText: string;
    required: boolean;
    clearable: boolean;
    invalid: boolean;
    slClear: EventEmitter<void>;
    slChange: EventEmitter<void>;
    slFocus: EventEmitter<void>;
    slBlur: EventEmitter<void>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    reportValidity(): boolean;
    setCustomValidity(message: string): void;
    getItemLabel(item: SlMenuItem): string;
    getItems(): SlMenuItem[];
    getValueAsArray(): string[];
    handleBlur(): void;
    handleClearClick(event: MouseEvent): void;
    handleDisabledChange(): void;
    handleFocus(): void;
    handleKeyDown(event: KeyboardEvent): void;
    handleLabelClick(): void;
    handleMenuSelect(event: CustomEvent): void;
    handleMenuShow(): void;
    handleMenuHide(): void;
    handleMultipleChange(): void;
    handleSlotChange(): Promise<void>;
    handleTagInteraction(event: KeyboardEvent | MouseEvent): void;
    handleValueChange(): void;
    resizeMenu(): void;
    syncItemsFromValue(): void;
    syncValueFromItems(): void;
    render(): TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-select': SlSelect;
    }
}
