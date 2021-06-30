import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
import type SlMenuItem from '../menu-item/menu-item';
export default class SlMenu extends LitElement {
    static styles: import("lit").CSSResult;
    menu: HTMLElement;
    defaultSlot: HTMLSlotElement;
    private items;
    private typeToSelectString;
    private typeToSelectTimeout;
    slSelect: EventEmitter<{
        item: SlMenuItem;
    }>;
    typeToSelect(key: string): void;
    syncItems(): void;
    getActiveItem(): SlMenuItem;
    setActiveItem(item: SlMenuItem): void;
    handleClick(event: MouseEvent): void;
    handleKeyDown(event: KeyboardEvent): void;
    handleSlotChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-menu': SlMenu;
    }
}
