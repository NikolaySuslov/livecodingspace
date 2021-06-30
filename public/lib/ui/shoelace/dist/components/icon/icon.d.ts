import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlIcon extends LitElement {
    static styles: import("lit").CSSResult;
    private svg;
    name: string;
    src: string;
    label: string;
    library: string;
    slLoad: EventEmitter<void>;
    slError: EventEmitter<{
        status: number;
    }>;
    connectedCallback(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    getLabel(): string;
    private getUrl;
    redraw(): void;
    setIcon(): Promise<void>;
    handleChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-icon': SlIcon;
    }
}
