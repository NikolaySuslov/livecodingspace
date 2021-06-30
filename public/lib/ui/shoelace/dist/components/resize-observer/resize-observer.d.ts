import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlResizeObserver extends LitElement {
    static styles: import("lit").CSSResult;
    private resizeObserver;
    private observedElements;
    slResize: EventEmitter<{
        entries: ResizeObserverEntry[];
    }>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleSlotChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-resize-observer': SlResizeObserver;
    }
}
