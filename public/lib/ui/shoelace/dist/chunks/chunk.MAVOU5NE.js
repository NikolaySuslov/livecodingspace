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
  r
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/alert/alert.scss
var alert_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: contents;\n  margin: 0;\n}\n\n.alert {\n  position: relative;\n  display: flex;\n  align-items: stretch;\n  background-color: var(--sl-color-white);\n  border: solid 1px var(--sl-color-gray-200);\n  border-top-width: 3px;\n  border-radius: var(--sl-border-radius-medium);\n  box-shadow: var(--box-shadow);\n  font-family: var(--sl-font-sans);\n  font-size: var(--sl-font-size-small);\n  font-weight: var(--sl-font-weight-normal);\n  line-height: 1.6;\n  color: var(--sl-color-gray-700);\n  margin: inherit;\n}\n\n.alert__icon {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  font-size: var(--sl-font-size-large);\n}\n.alert__icon ::slotted(*) {\n  margin-left: var(--sl-spacing-large);\n}\n\n.alert--primary {\n  border-top-color: var(--sl-color-primary-500);\n}\n.alert--primary .alert__icon {\n  color: var(--sl-color-primary-500);\n}\n\n.alert--success {\n  border-top-color: var(--sl-color-success-500);\n}\n.alert--success .alert__icon {\n  color: var(--sl-color-success-500);\n}\n\n.alert--info {\n  border-top-color: var(--sl-color-info-500);\n}\n.alert--info .alert__icon {\n  color: var(--sl-color-info-500);\n}\n\n.alert--warning {\n  border-top-color: var(--sl-color-warning-500);\n}\n.alert--warning .alert__icon {\n  color: var(--sl-color-warning-500);\n}\n\n.alert--danger {\n  border-top-color: var(--sl-color-danger-500);\n}\n.alert--danger .alert__icon {\n  color: var(--sl-color-danger-500);\n}\n\n.alert__message {\n  flex: 1 1 auto;\n  padding: var(--sl-spacing-large);\n  overflow: hidden;\n}\n\n.alert__close {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  font-size: var(--sl-font-size-large);\n  padding-right: var(--sl-spacing-medium);\n}";

// src/components/alert/alert.ts
var toastStack = Object.assign(document.createElement("div"), { className: "sl-toast-stack" });
var SlAlert = class extends h {
  constructor() {
    super(...arguments);
    this.hasInitialized = false;
    this.open = false;
    this.closable = false;
    this.type = "primary";
    this.duration = Infinity;
  }
  firstUpdated() {
    this.base.hidden = !this.open;
    this.updateComplete.then(() => this.hasInitialized = true);
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
  async toast() {
    return new Promise((resolve) => {
      if (!toastStack.parentElement) {
        document.body.append(toastStack);
      }
      toastStack.appendChild(this);
      requestAnimationFrame(() => {
        this.clientWidth;
        this.show();
      });
      this.addEventListener("sl-after-hide", () => {
        toastStack.removeChild(this);
        resolve();
        if (!toastStack.querySelector("sl-alert")) {
          toastStack.remove();
        }
      }, { once: true });
    });
  }
  restartAutoHide() {
    clearTimeout(this.autoHideTimeout);
    if (this.open && this.duration < Infinity) {
      this.autoHideTimeout = setTimeout(() => this.hide(), this.duration);
    }
  }
  handleCloseClick() {
    this.hide();
  }
  handleMouseMove() {
    this.restartAutoHide();
  }
  async handleOpenChange() {
    if (!this.hasInitialized) {
      return;
    }
    if (this.open) {
      this.slShow.emit();
      if (this.duration < Infinity) {
        this.restartAutoHide();
      }
      await stopAnimations(this.base);
      this.base.hidden = false;
      const { keyframes, options } = getAnimation(this, "alert.show");
      await animateTo(this.base, keyframes, options);
      this.slAfterShow.emit();
    } else {
      this.slHide.emit();
      clearTimeout(this.autoHideTimeout);
      await stopAnimations(this.base);
      const { keyframes, options } = getAnimation(this, "alert.hide");
      await animateTo(this.base, keyframes, options);
      this.base.hidden = true;
      this.slAfterHide.emit();
    }
  }
  handleDurationChange() {
    this.restartAutoHide();
  }
  render() {
    return T`
      <div
        part="base"
        class=${e2({
      alert: true,
      "alert--open": this.open,
      "alert--closable": this.closable,
      "alert--primary": this.type === "primary",
      "alert--success": this.type === "success",
      "alert--info": this.type === "info",
      "alert--warning": this.type === "warning",
      "alert--danger": this.type === "danger"
    })}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        aria-hidden=${this.open ? "false" : "true"}
        @mousemove=${this.handleMouseMove.bind(this)}
      >
        <span part="icon" class="alert__icon">
          <slot name="icon"></slot>
        </span>

        <span part="message" class="alert__message">
          <slot></slot>
        </span>

        ${this.closable ? T`
              <span class="alert__close">
                <sl-icon-button
                  exportparts="base:close-button"
                  name="x"
                  library="system"
                  @click=${this.handleCloseClick.bind(this)}
                ></sl-icon-button>
              </span>
            ` : ""}
      </div>
    `;
  }
};
SlAlert.styles = r(alert_default);
__decorateClass([
  o('[part="base"]')
], SlAlert.prototype, "base", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlAlert.prototype, "open", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlAlert.prototype, "closable", 2);
__decorateClass([
  e({ reflect: true })
], SlAlert.prototype, "type", 2);
__decorateClass([
  e({ type: Number })
], SlAlert.prototype, "duration", 2);
__decorateClass([
  event("sl-show")
], SlAlert.prototype, "slShow", 2);
__decorateClass([
  event("sl-after-show")
], SlAlert.prototype, "slAfterShow", 2);
__decorateClass([
  event("sl-hide")
], SlAlert.prototype, "slHide", 2);
__decorateClass([
  event("sl-after-hide")
], SlAlert.prototype, "slAfterHide", 2);
__decorateClass([
  watch("open")
], SlAlert.prototype, "handleOpenChange", 1);
__decorateClass([
  watch("duration")
], SlAlert.prototype, "handleDurationChange", 1);
SlAlert = __decorateClass([
  n("sl-alert")
], SlAlert);
var alert_default2 = SlAlert;
setDefaultAnimation("alert.show", {
  keyframes: [
    { opacity: 0, transform: "scale(0.8)" },
    { opacity: 1, transform: "scale(1)" }
  ],
  options: { duration: 250, easing: "ease" }
});
setDefaultAnimation("alert.hide", {
  keyframes: [
    { opacity: 1, transform: "scale(1)" },
    { opacity: 0, transform: "scale(0.8)" }
  ],
  options: { duration: 250, easing: "ease" }
});

export {
  alert_default2 as alert_default
};
