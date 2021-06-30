import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlForm extends LitElement {
    static styles: import("lit").CSSResult;
    form: HTMLElement;
    private formControls;
    novalidate: boolean;
    slSubmit: EventEmitter<{
        formData: FormData;
        formControls: HTMLElement[];
    }>;
    connectedCallback(): void;
    getFormData(): FormData;
    getFormControls(): HTMLElement[];
    submit(): boolean;
    handleClick(event: MouseEvent): void;
    handleKeyDown(event: KeyboardEvent): void;
    serializeElement(el: HTMLElement, formData: FormData): void | null;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-form': SlForm;
    }
}
