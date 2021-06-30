export default class Modal {
    element: HTMLElement;
    tabDirection: 'forward' | 'backward';
    constructor(element: HTMLElement);
    activate(): void;
    deactivate(): void;
    isActive(): boolean;
    handleFocusIn(event: Event): void;
    handleKeyDown(event: KeyboardEvent): void;
}
