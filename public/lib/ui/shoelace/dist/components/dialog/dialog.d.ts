import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlDialog extends LitElement {
    static styles: import("lit").CSSResult;
    dialog: HTMLElement;
    panel: HTMLElement;
    overlay: HTMLElement;
    private componentId;
    private hasInitialized;
    private modal;
    private originalTrigger;
    private hasFooter;
    open: boolean;
    label: string;
    noHeader: boolean;
    slShow: EventEmitter<void>;
    slAfterShow: EventEmitter<void>;
    slHide: EventEmitter<void>;
    slAfterHide: EventEmitter<void>;
    slInitialFocus: EventEmitter<void>;
    slOverlayDismiss: EventEmitter<void>;
    connectedCallback(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    show(): Promise<void>;
    hide(): Promise<void>;
    handleCloseClick(): void;
    handleKeyDown(event: KeyboardEvent): void;
    handleOpenChange(): Promise<void>;
    handleOverlayClick(): void;
    handleSlotChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-dialog': SlDialog;
    }
}
