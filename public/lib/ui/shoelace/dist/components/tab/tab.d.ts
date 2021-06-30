import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlTab extends LitElement {
    static styles: import("lit").CSSResult;
    tab: HTMLElement;
    private componentId;
    panel: string;
    active: boolean;
    closable: boolean;
    disabled: boolean;
    slClose: EventEmitter<void>;
    focus(options?: FocusOptions): void;
    blur(): void;
    handleCloseClick(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-tab': SlTab;
    }
}
