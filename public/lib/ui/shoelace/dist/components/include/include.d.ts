import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlInclude extends LitElement {
    static styles: import("lit").CSSResult;
    src: string;
    mode: 'cors' | 'no-cors' | 'same-origin';
    allowScripts: boolean;
    slLoad: EventEmitter<void>;
    slError: EventEmitter<{
        status: number;
    }>;
    connectedCallback(): void;
    executeScript(script: HTMLScriptElement): void;
    loadSource(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-include': SlInclude;
    }
}
