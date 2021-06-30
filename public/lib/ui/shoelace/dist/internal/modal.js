import { getTabbableElements } from '../internal/tabbable';
let activeModals = [];
export default class Modal {
    constructor(element) {
        this.tabDirection = 'forward';
        this.element = element;
        this.handleFocusIn = this.handleFocusIn.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    activate() {
        activeModals.push(this.element);
        document.addEventListener('focusin', this.handleFocusIn);
        document.addEventListener('keydown', this.handleKeyDown);
    }
    deactivate() {
        activeModals = activeModals.filter(modal => modal !== this.element);
        document.removeEventListener('focusin', this.handleFocusIn);
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    isActive() {
        return activeModals[activeModals.length - 1] === this.element;
    }
    handleFocusIn(event) {
        const path = event.composedPath();
        if (this.isActive() && !path.includes(this.element)) {
            const tabbableElements = getTabbableElements(this.element);
            const index = this.tabDirection === 'backward' ? tabbableElements.length - 1 : 0;
            tabbableElements[index].focus({ preventScroll: true });
        }
    }
    handleKeyDown(event) {
        if (event.key === 'Tab' && event.shiftKey) {
            this.tabDirection = 'backward';
            setTimeout(() => (this.tabDirection = 'forward'));
        }
    }
}
