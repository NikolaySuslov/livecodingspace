import {
  focusVisible
} from "./chunk.XAZSQ3AT.js";
import {
  animateTo,
  shimKeyframesHeightAuto,
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

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/details/details.scss
var details_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: block;\n}\n\n.details {\n  border: solid 1px var(--sl-color-gray-200);\n  border-radius: var(--sl-border-radius-medium);\n  overflow-anchor: none;\n}\n\n.details--disabled {\n  opacity: 0.5;\n}\n\n.details__header {\n  display: flex;\n  align-items: center;\n  border-radius: inherit;\n  padding: var(--sl-spacing-medium);\n  user-select: none;\n  cursor: pointer;\n}\n.details__header:focus {\n  outline: none;\n}\n\n.focus-visible .details__header:focus {\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n\n.details--disabled .details__header {\n  cursor: not-allowed;\n}\n.details--disabled .details__header:focus {\n  outline: none;\n  box-shadow: none;\n}\n\n.details__summary {\n  flex: 1 1 auto;\n  display: flex;\n  align-items: center;\n}\n\n.details__summary-icon {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  transition: var(--sl-transition-medium) transform ease;\n}\n\n.details--open .details__summary-icon {\n  transform: rotate(90deg);\n}\n\n.details__body {\n  overflow: hidden;\n}\n\n.details__content {\n  padding: var(--sl-spacing-medium);\n}";

// src/components/details/details.ts
var id = 0;
var SlDetails = class extends h {
  constructor() {
    super(...arguments);
    this.componentId = `details-${++id}`;
    this.hasInitialized = false;
    this.open = false;
    this.disabled = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => focusVisible.observe(this.details));
  }
  firstUpdated() {
    this.body.hidden = !this.open;
    this.body.style.height = this.open ? "auto" : "0";
    this.updateComplete.then(() => this.hasInitialized = true);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    focusVisible.unobserve(this.details);
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
  handleSummaryClick() {
    if (!this.disabled) {
      this.open ? this.hide() : this.show();
      this.header.focus();
    }
  }
  handleSummaryKeyDown(event2) {
    if (event2.key === "Enter" || event2.key === " ") {
      event2.preventDefault();
      this.open ? this.hide() : this.show();
    }
    if (event2.key === "ArrowUp" || event2.key === "ArrowLeft") {
      event2.preventDefault();
      this.hide();
    }
    if (event2.key === "ArrowDown" || event2.key === "ArrowRight") {
      event2.preventDefault();
      this.show();
    }
  }
  async handleOpenChange() {
    if (!this.hasInitialized) {
      return;
    }
    if (this.open) {
      this.slShow.emit();
      await stopAnimations(this);
      this.body.hidden = false;
      const { keyframes, options } = getAnimation(this, "details.show");
      await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
      this.body.style.height = "auto";
      this.slAfterShow.emit();
    } else {
      this.slHide.emit();
      await stopAnimations(this);
      const { keyframes, options } = getAnimation(this, "details.hide");
      await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
      this.body.hidden = true;
      this.body.style.height = "auto";
      this.slAfterHide.emit();
    }
  }
  render() {
    return T`
      <div
        part="base"
        class=${e2({
      details: true,
      "details--open": this.open,
      "details--disabled": this.disabled
    })}
      >
        <header
          part="header"
          id=${`${this.componentId}-header`}
          class="details__header"
          role="button"
          aria-expanded=${this.open ? "true" : "false"}
          aria-controls=${`${this.componentId}-content`}
          aria-disabled=${this.disabled ? "true" : "false"}
          tabindex=${this.disabled ? "-1" : "0"}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <div part="summary" class="details__summary">
            <slot name="summary">${this.summary}</slot>
          </div>

          <span part="summary-icon" class="details__summary-icon">
            <sl-icon name="chevron-right" library="system"></sl-icon>
          </span>
        </header>

        <div class="details__body">
          <div
            part="content"
            id=${`${this.componentId}-content`}
            class="details__content"
            role="region"
            aria-labelledby=${`${this.componentId}-header`}
          >
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
};
SlDetails.styles = r(details_default);
__decorateClass([
  o(".details")
], SlDetails.prototype, "details", 2);
__decorateClass([
  o(".details__header")
], SlDetails.prototype, "header", 2);
__decorateClass([
  o(".details__body")
], SlDetails.prototype, "body", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlDetails.prototype, "open", 2);
__decorateClass([
  e()
], SlDetails.prototype, "summary", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlDetails.prototype, "disabled", 2);
__decorateClass([
  event("sl-show")
], SlDetails.prototype, "slShow", 2);
__decorateClass([
  event("sl-after-show")
], SlDetails.prototype, "slAfterShow", 2);
__decorateClass([
  event("sl-hide")
], SlDetails.prototype, "slHide", 2);
__decorateClass([
  event("sl-after-hide")
], SlDetails.prototype, "slAfterHide", 2);
__decorateClass([
  watch("open")
], SlDetails.prototype, "handleOpenChange", 1);
SlDetails = __decorateClass([
  n("sl-details")
], SlDetails);
var details_default2 = SlDetails;
setDefaultAnimation("details.show", {
  keyframes: [
    { height: "0", opacity: "0" },
    { height: "auto", opacity: "1" }
  ],
  options: { duration: 250, easing: "linear" }
});
setDefaultAnimation("details.hide", {
  keyframes: [
    { height: "auto", opacity: "1" },
    { height: "0", opacity: "0" }
  ],
  options: { duration: 250, easing: "linear" }
});

export {
  details_default2 as details_default
};
