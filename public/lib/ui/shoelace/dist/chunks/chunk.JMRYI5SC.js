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

// src/internal/string.ts
function uppercaseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/drawer/drawer.scss
var drawer_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  --size: 25rem;\n  --header-spacing: var(--sl-spacing-large);\n  --body-spacing: var(--sl-spacing-large);\n  --footer-spacing: var(--sl-spacing-large);\n  display: contents;\n}\n\n.drawer {\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  overflow: hidden;\n}\n\n.drawer--contained {\n  position: absolute;\n  z-index: initial;\n}\n\n.drawer--fixed {\n  position: fixed;\n  z-index: var(--sl-z-index-drawer);\n}\n\n.drawer__panel {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  z-index: 2;\n  max-width: 100%;\n  max-height: 100%;\n  background-color: var(--sl-panel-background-color);\n  box-shadow: var(--sl-shadow-x-large);\n  transition: var(--sl-transition-medium) transform;\n  overflow: auto;\n  pointer-events: all;\n}\n.drawer__panel:focus {\n  outline: none;\n}\n\n.drawer--top .drawer__panel {\n  top: 0;\n  right: auto;\n  bottom: auto;\n  left: 0;\n  width: 100%;\n  height: var(--size);\n}\n\n.drawer--end .drawer__panel {\n  top: 0;\n  right: 0;\n  bottom: auto;\n  left: auto;\n  width: var(--size);\n  height: 100%;\n}\n\n.drawer--bottom .drawer__panel {\n  top: auto;\n  right: auto;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: var(--size);\n}\n\n.drawer--start .drawer__panel {\n  top: 0;\n  right: auto;\n  bottom: auto;\n  left: 0;\n  width: var(--size);\n  height: 100%;\n}\n\n.drawer__header {\n  display: flex;\n}\n\n.drawer__title {\n  flex: 1 1 auto;\n  font-size: var(--sl-font-size-large);\n  line-height: var(--sl-line-height-dense);\n  padding: var(--header-spacing);\n}\n\n.drawer__close {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  font-size: var(--sl-font-size-x-large);\n  padding: 0 var(--header-spacing);\n}\n\n.drawer__body {\n  flex: 1 1 auto;\n  padding: var(--body-spacing);\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n.drawer__footer {\n  text-align: right;\n  padding: var(--footer-spacing);\n}\n.drawer__footer ::slotted(sl-button:not(:last-of-type)) {\n  margin-right: var(--sl-spacing-x-small);\n}\n\n.drawer:not(.drawer--has-footer) .drawer__footer {\n  display: none;\n}\n\n.drawer__overlay {\n  display: block;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-color: var(--sl-overlay-background-color);\n  pointer-events: all;\n}\n\n.drawer--contained .drawer__overlay {\n  position: absolute;\n}";

// src/components/drawer/drawer.ts
var hasPreventScroll = isPreventScrollSupported();
var id = 0;
var SlDrawer = class extends h {
  constructor() {
    super(...arguments);
    this.componentId = `drawer-${++id}`;
    this.hasInitialized = false;
    this.hasFooter = false;
    this.open = false;
    this.label = "";
    this.placement = "end";
    this.contained = false;
    this.noHeader = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.modal = new modal_default(this);
    this.handleSlotChange();
  }
  firstUpdated() {
    this.drawer.hidden = !this.open;
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
      if (!this.contained) {
        this.modal.activate();
        lockBodyScrolling(this);
      }
      await Promise.all([stopAnimations(this.drawer), stopAnimations(this.overlay)]);
      this.drawer.hidden = false;
      if (hasPreventScroll) {
        const slInitialFocus = this.slInitialFocus.emit({ cancelable: true });
        if (!slInitialFocus.defaultPrevented) {
          this.panel.focus({ preventScroll: true });
        }
      }
      const panelAnimation = getAnimation(this, `drawer.show${uppercaseFirstLetter(this.placement)}`);
      const overlayAnimation = getAnimation(this, "drawer.overlay.show");
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
      unlockBodyScrolling(this);
      await Promise.all([stopAnimations(this.drawer), stopAnimations(this.overlay)]);
      const panelAnimation = getAnimation(this, `drawer.hide${uppercaseFirstLetter(this.placement)}`);
      const overlayAnimation = getAnimation(this, "drawer.overlay.hide");
      await Promise.all([
        animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options),
        animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options)
      ]);
      this.drawer.hidden = true;
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
      drawer: true,
      "drawer--open": this.open,
      "drawer--top": this.placement === "top",
      "drawer--end": this.placement === "end",
      "drawer--bottom": this.placement === "bottom",
      "drawer--start": this.placement === "start",
      "drawer--contained": this.contained,
      "drawer--fixed": !this.contained,
      "drawer--has-footer": this.hasFooter
    })}
        @keydown=${this.handleKeyDown}
      >
        <div part="overlay" class="drawer__overlay" @click=${this.handleOverlayClick} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open ? "false" : "true"}
          aria-label=${l(this.noHeader ? this.label : void 0)}
          aria-labelledby=${l(!this.noHeader ? `${this.componentId}-title` : void 0)}
          tabindex="0"
        >
          ${!this.noHeader ? T`
                <header part="header" class="drawer__header">
                  <span part="title" class="drawer__title" id=${`${this.componentId}-title`}>
                    <!-- If there's no label, use an invisible character to prevent the heading from collapsing -->
                    <slot name="label"> ${this.label || String.fromCharCode(65279)} </slot>
                  </span>
                  <sl-icon-button
                    exportparts="base:close-button"
                    class="drawer__close"
                    name="x"
                    library="system"
                    @click=${this.handleCloseClick}
                  ></sl-icon-button>
                </header>
              ` : ""}

          <div part="body" class="drawer__body">
            <slot></slot>
          </div>

          <footer part="footer" class="drawer__footer">
            <slot name="footer" @slotchange=${this.handleSlotChange}></slot>
          </footer>
        </div>
      </div>
    `;
  }
};
SlDrawer.styles = r(drawer_default);
__decorateClass([
  o(".drawer")
], SlDrawer.prototype, "drawer", 2);
__decorateClass([
  o(".drawer__panel")
], SlDrawer.prototype, "panel", 2);
__decorateClass([
  o(".drawer__overlay")
], SlDrawer.prototype, "overlay", 2);
__decorateClass([
  r2()
], SlDrawer.prototype, "hasFooter", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlDrawer.prototype, "open", 2);
__decorateClass([
  e({ reflect: true })
], SlDrawer.prototype, "label", 2);
__decorateClass([
  e({ reflect: true })
], SlDrawer.prototype, "placement", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlDrawer.prototype, "contained", 2);
__decorateClass([
  e({ attribute: "no-header", type: Boolean, reflect: true })
], SlDrawer.prototype, "noHeader", 2);
__decorateClass([
  event("sl-show")
], SlDrawer.prototype, "slShow", 2);
__decorateClass([
  event("sl-after-show")
], SlDrawer.prototype, "slAfterShow", 2);
__decorateClass([
  event("sl-hide")
], SlDrawer.prototype, "slHide", 2);
__decorateClass([
  event("sl-after-hide")
], SlDrawer.prototype, "slAfterHide", 2);
__decorateClass([
  event("sl-initial-focus")
], SlDrawer.prototype, "slInitialFocus", 2);
__decorateClass([
  event("sl-overlay-dismiss")
], SlDrawer.prototype, "slOverlayDismiss", 2);
__decorateClass([
  watch("open")
], SlDrawer.prototype, "handleOpenChange", 1);
SlDrawer = __decorateClass([
  n("sl-drawer")
], SlDrawer);
var drawer_default2 = SlDrawer;
setDefaultAnimation("drawer.showTop", {
  keyframes: [
    { opacity: 0, transform: "translateY(-100%)" },
    { opacity: 1, transform: "translateY(0)" }
  ],
  options: { duration: 250, easing: "ease" }
});
setDefaultAnimation("drawer.hideTop", {
  keyframes: [
    { opacity: 1, transform: "translateY(0)" },
    { opacity: 0, transform: "translateY(-100%)" }
  ],
  options: { duration: 250, easing: "ease" }
});
setDefaultAnimation("drawer.showEnd", {
  keyframes: [
    { opacity: 0, transform: "translateX(100%)" },
    { opacity: 1, transform: "translateX(0)" }
  ],
  options: { duration: 250, easing: "ease" }
});
setDefaultAnimation("drawer.hideEnd", {
  keyframes: [
    { opacity: 1, transform: "translateX(0)" },
    { opacity: 0, transform: "translateX(100%)" }
  ],
  options: { duration: 250, easing: "ease" }
});
setDefaultAnimation("drawer.showBottom", {
  keyframes: [
    { opacity: 0, transform: "translateY(100%)" },
    { opacity: 1, transform: "translateY(0)" }
  ],
  options: { duration: 250, easing: "ease" }
});
setDefaultAnimation("drawer.hideBottom", {
  keyframes: [
    { opacity: 1, transform: "translateY(0)" },
    { opacity: 0, transform: "translateY(100%)" }
  ],
  options: { duration: 250, easing: "ease" }
});
setDefaultAnimation("drawer.showStart", {
  keyframes: [
    { opacity: 0, transform: "translateX(-100%)" },
    { opacity: 1, transform: "translateX(0)" }
  ],
  options: { duration: 250, easing: "ease" }
});
setDefaultAnimation("drawer.hideStart", {
  keyframes: [
    { opacity: 1, transform: "translateX(0)" },
    { opacity: 0, transform: "translateX(-100%)" }
  ],
  options: { duration: 250, easing: "ease" }
});
setDefaultAnimation("drawer.overlay.show", {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  options: { duration: 250 }
});
setDefaultAnimation("drawer.overlay.hide", {
  keyframes: [{ opacity: 1 }, { opacity: 0 }],
  options: { duration: 250 }
});

export {
  drawer_default2 as drawer_default
};
