import { LitElement } from 'lit';
export default class SlProgressRing extends LitElement {
    static styles: import("lit").CSSResult;
    indicator: SVGCircleElement;
    size: number;
    strokeWidth: number;
    percentage: number;
    firstUpdated(): void;
    handlePercentageChange(): void;
    updateProgress(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-progress-ring': SlProgressRing;
    }
}
