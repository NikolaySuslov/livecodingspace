import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
import type SlDropdown from '../dropdown/dropdown';
import type SlInput from '../input/input';
export default class SlColorPicker extends LitElement {
    static styles: import("lit").CSSResult;
    input: SlInput;
    previewButton: HTMLButtonElement;
    dropdown: SlDropdown;
    private lastValueEmitted;
    private inputValue;
    private hue;
    private saturation;
    private lightness;
    private alpha;
    private showCopyFeedback;
    value: string;
    format: 'hex' | 'rgb' | 'hsl';
    inline: boolean;
    size: 'small' | 'medium' | 'large';
    noFormatToggle: boolean;
    name: string;
    disabled: boolean;
    invalid: boolean;
    hoist: boolean;
    opacity: boolean;
    uppercase: boolean;
    swatches: string[];
    slChange: EventEmitter<void>;
    connectedCallback(): void;
    getFormattedValue(format?: 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsla'): string;
    reportValidity(): boolean | Promise<void>;
    setCustomValidity(message: string): void;
    handleCopy(): void;
    handleFormatToggle(): void;
    handleAlphaDrag(event: any): void;
    handleHueDrag(event: any): void;
    handleGridDrag(event: any): void;
    handleDrag(event: any, container: HTMLElement, onMove: (x: number, y: number) => void): void;
    handleAlphaKeyDown(event: KeyboardEvent): void;
    handleHueKeyDown(event: KeyboardEvent): void;
    handleGridKeyDown(event: KeyboardEvent): void;
    handleInputChange(event: CustomEvent): void;
    handleInputKeyDown(event: KeyboardEvent): void;
    handleDropdownAfterHide(): void;
    normalizeColorString(colorString: string): string;
    parseColor(colorString: string): false | {
        hsl: {
            h: any;
            s: any;
            l: any;
            string: string;
        };
        hsla: {
            h: any;
            s: any;
            l: any;
            a: any;
            string: string;
        };
        rgb: {
            r: any;
            g: any;
            b: any;
            string: string;
        };
        rgba: {
            r: any;
            g: any;
            b: any;
            a: any;
            string: string;
        };
        hex: string;
        hexa: string;
    };
    setColor(colorString: string): boolean;
    setLetterCase(string: string): string;
    syncValues(): void;
    handleFormatChange(): void;
    handleOpacityChange(): void;
    handleValueChange(oldValue: string, newValue: string): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-color-picker': SlColorPicker;
    }
}
