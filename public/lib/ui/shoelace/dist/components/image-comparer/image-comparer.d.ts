import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlImageComparer extends LitElement {
    static styles: import("lit").CSSResult;
    base: HTMLElement;
    handle: HTMLElement;
    position: number;
    slChange: EventEmitter<void>;
    handleDrag(event: any): void;
    handleKeyDown(event: KeyboardEvent): void;
    handlePositionChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-image-comparer': SlImageComparer;
    }
}
