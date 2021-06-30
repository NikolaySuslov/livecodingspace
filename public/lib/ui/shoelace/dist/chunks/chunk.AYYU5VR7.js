import {
  isPreventScrollSupported,
  modal_default
} from "./chunk.EAHZ6VJU.js";
import {
  lockBodyScrolling,
  unlockBodyScrolling
} from "./chunk.XAZN5AQ5.js";
import {
  animateTo,
  stopAnimations,
  waitForEvent
} from "./chunk.CTCDC263.js";
import {
  getAnimation,
  setDefaultAnimation
} from "./chunk.NC36RJW4.js";
import {
  hasSlot
} from "./chunk.FMCX45AD.js";
import {
  l
} from "./chunk.5MED2A3H.js";
import {
  event,
  watch
} from "./chunk.XX234VRK.js";
import {
  e as e2
} from "./chunk.YXKHB4AC.js";
import {
  T,
  e,
  h,
  n,
  o,
  r,
  r2
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/dialog/dialog.scss
var dialog_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  --width: 31rem;\n  --header-spacing: var(--sl-spacing-large);\n  --body-spacing: var(--sl-spacing-large);\n  --footer-spacing: var(--sl-spacing-large);\n  display: contents;\n}\n\n.dialog {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: var(--sl-z-index-dialog);\n}\n\n.dialog__panel {\n  display: flex;\n  flex-direction: column;\n  z-index: 2;\n  width: var(--width);\n  max-width: calc(100% - var(--sl-spacing-xx-large));\n  max-height: calc(100% - var(--sl-spacing-xx-large));\n  background-color: var(--sl-panel-background-color);\n  border-radius: var(--sl-border-radius-medium);\n  box-shadow: var(--sl-shadow-x-large);\n}\n.dialog__panel:focus {\n  outline: none;\n}\n\n@media screen and (max-width: 420px) {\n  .dialog__panel {\n    max-height: 80vh;\n  }\n}\n.dialog--open .dialog__panel {\n  display: flex;\n  opacity: 1;\n  transform: none;\n}\n\n.dialog__header {\n  flex: 0 0 auto;\n  display: flex;\n}\n\n.dialog__title {\n  flex: 1 1 auto;\n  font-size: var(--sl-font-size-large);\n  line-height: var(--sl-line-height-dense);\n  padding: var(--header-spacing);\n}\n\n.dialog__close {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  font-size: var(--sl-font-size-x-large);\n  padding: 0 var(--header-spacing);\n}\n\n.dialog__body {\n  flex: 1 1 auto;\n  padding: var(--body-spacing);\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n.dialog__footer {\n  flex: 0 0 auto;\n  text-align: right;\n  padding: var(--footer-spacing);\n}\n.dialog__footer ::slotted(sl-button:not(:first-of-type)) {\n  margin-left: var(--sl-spacing-x-small);\n}\n\n.dialog:not(.dialog--has-footer) .dialog__footer {\n  display: none;\n}\n\n.dialog__overlay {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-color: var(--sl-overlay-background-color);\n}";

// src/components/dialog/dialog.ts
var hasPreventScroll = isPreventScrollSupported();
var id = 0;
var SlDialog = class extends h {
  constructor() {
    super(...arguments);
    this.componentId = `dialog-${++id}`;
    this.hasInitialized = false;
    this.hasFooter = false;
    this.open = false;
    this.label = "";
    this.noHeader = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.modal = new modal_default(this);
    this.handleSlotChange();
  }
  firstUpdated() {
    this.dialog.hidden = !this.open;
    this.updateComplete.then(() => this.hasInitialized = true);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    unlockBodyScrolling(this);
  }
  async show() {
    if (this.open) {
      return;
    }
    this.open = true;
    return waitForEvent(this, "sl-after-show");
  }
  async hide() {
    if (!this.open) {
      return;
    }
    this.open = false;
    return waitForEvent(this, "sl-after-hide");
  }
  handleCloseClick() {
    this.hide();
  }
  handleKeyDown(event2) {
    if (event2.key === "Escape") {
      event2.stopPropagation();
      this.hide();
    }
  }
  async handleOpenChange() {
    if (!this.hasInitialized) {
      return;
    }
    if (this.open) {
      this.slShow.emit();
      this.originalTrigger = document.activeElement;
      this.modal.activate();
      lockBodyScrolling(this);
      await Promise.all([stopAnimations(this.dialog), stopAnimations(this.overlay)]);
      this.dialog.hidden = false;
      if (hasPreventScroll) {
        const slInitialFocus = this.slInitialFocus.emit({ cancelable: true });
        if (!slInitialFocus.defaultPrevented) {
          this.panel.focus({ preventScroll: true });
        }
      }
      const panelAnimation = getAnimation(this, "dialog.show");
      const overlayAnimation = getAnimation(this, "dialog.overlay.show");
      await Promise.all([
        animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options),
        animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options)
      ]);
      if (!hasPreventScroll) {
        const slInitialFocus = this.slInitialFocus.emit({ cancelable: true });
        if (!slInitialFocus.defaultPrevented) {
          this.panel.focus({ preventScroll: true });
        }
      }
      this.slAfterShow.emit();
    } else {
      this.slHide.emit();
      this.modal.deactivate();
      await Promise.all([stopAnimations(this.dialog), stopAnimations(this.overlay)]);
      const panelAnimation = getAnimation(this, "dialog.hide");
      const overlayAnimation = getAnimation(this, "dialog.overlay.hide");
      await Promise.all([
        animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options),
        animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options)
      ]);
      this.dialog.hidden = true;
      unlockBodyScrolling(this);
      const trigger = this.originalTrigger;
      if (trigger && typeof trigger.focus === "function") {
        setTimeout(() => trigger.focus());
      }
      this.slAfterHide.emit();
    }
  }
  handleOverlayClick() {
    const slOverlayDismiss = this.slOverlayDismiss.emit({ cancelable: true });
    if (!slOverlayDismiss.defaultPrevented) {
      this.hide();
    }
  }
  handleSlotChange() {
    this.hasFooter = hasSlot(this, "footer");
  }
  render() {
    return T`
      <div
        part="base"
        class=${e2({
      dialog: true,
      "dialog--open": this.open,
      "dialog--has-footer": this.hasFooter
    })}
        @keydown=${this.handleKeyDown}
      >
        <div part="overlay" class="dialog__overlay" @click=${this.handleOverlayClick} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open ? "false" : "true"}
          aria-label=${l(this.noHeader ? this.label : void 0)}
          aria-labelledby=${l(!this.noHeader ? `${this.componentId}-title` : void 0)}
          tabindex="0"
        >
          ${!this.noHeader ? T`
                <header part="header" class="dialog__header">
                  <span part="title" class="dialog__title" id=${`${this.componentId}-title`}>
                    <slot name="label"> ${this.label || String.fromCharCode(65279)} </slot>
                  </span>
                  <sl-icon-button
                    exportparts="base:close-button"
                    class="dialog__close"
                    name="x"
                    library="system"
                    @click="${this.handleCloseClick}"
                  ></sl-icon-button>
                </header>
              ` : ""}

          <div part="body" class="dialog__body">
            <slot></slot>
          </div>

          <footer part="footer" class="dialog__footer">
            <slot name="footer" @slotchange=${this.handleSlotChange}></slot>
          </footer>
        </div>
      </div>
    `;
  }
};
SlDialog.styles = r(dialog_default);
__decorateClass([
  o(".dialog")
], SlDialog.prototype, "dialog", 2);
__decorateClass([
  o(".dialog__panel")
], SlDialog.prototype, "panel", 2);
__decorateClass([
  o(".dialog__overlay")
], SlDialog.prototype, "overlay", 2);
__decorateClass([
  r2()
], SlDialog.prototype, "hasFooter", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlDialog.prototype, "open", 2);
__decorateClass([
  e({ reflect: true })
], SlDialog.prototype, "label", 2);
__decorateClass([
  e({ attribute: "no-header", type: Boolean, reflect: true })
], SlDialog.prototype, "noHeader", 2);
__decorateClass([
  event("sl-show")
], SlDialog.prototype, "slShow", 2);
__decorateClass([
  event("sl-after-show")
], SlDialog.prototype, "slAfterShow", 2);
__decorateClass([
  event("sl-hide")
], SlDialog.prototype, "slHide", 2);
__decorateClass([
  event("sl-after-hide")
], SlDialog.prototype, "slAfterHide", 2);
__decorateClass([
  event("sl-initial-focus")
], SlDialog.prototype, "slInitialFocus", 2);
__decorateClass([
  event("sl-overlay-dismiss")
], SlDialog.prototype, "slOverlayDismiss", 2);
__decorateClass([
  watch("open")
], SlDialog.prototype, "handleOpenChange", 1);
SlDialog = __decorateClass([
  n("sl-dialog")
], SlDialog);
var dialog_default2 = SlDialog;
setDefaultAnimation("dialog.show", {
  keyframes: [
    { opacity: 0, transform: "scale(0.8)" },
    { opacity: 1, transform: "scale(1)" }
  ],
  options: { duration: 250, easing: "ease" }
});
setDefaultAnimation("dialog.hide", {
  keyframes: [
    { opacity: 1, transform: "scale(1)" },
    { opacity: 0, transform: "scale(0.8)" }
  ],
  options: { duration: 250, easing: "ease" }
});
setDefaultAnimation("dialog.overlay.show", {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  options: { duration: 250 }
});
setDefaultAnimation("dialog.overlay.hide", {
  keyframes: [{ opacity: 1 }, { opacity: 0 }],
  options: { duration: 250 }
});

export {
  dialog_default2 as dialog_default
};
