import { TemplateResult } from 'lit';
export declare const renderFormControl: (props: {
    inputId: string;
    size: 'small' | 'medium' | 'large';
    labelId?: string | undefined;
    label?: string | undefined;
    hasLabelSlot?: boolean | undefined;
    helpTextId?: string | undefined;
    helpText?: string | undefined;
    hasHelpTextSlot?: boolean | undefined;
    onLabelClick?: ((event: MouseEvent) => void) | undefined;
}, input: TemplateResult) => TemplateResult<1>;
export declare function getLabelledBy(props: {
    labelId: string;
    label: string;
    hasLabelSlot: boolean;
    helpTextId: string;
    helpText: string;
    hasHelpTextSlot: boolean;
}): string | undefined;
