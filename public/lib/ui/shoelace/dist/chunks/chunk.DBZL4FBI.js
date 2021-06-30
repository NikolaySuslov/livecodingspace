import {
  createPopper
} from "./chunk.GADG7AUG.js";
import {
  animateTo,
  parseDuration,
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

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/tooltip/tooltip.scss
var tooltip_default = ':host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  --max-width: 20rem;\n  --hide-delay: 0ms;\n  --show-delay: 150ms;\n  display: contents;\n}\n\n.tooltip-positioner {\n  position: absolute;\n  z-index: var(--sl-z-index-tooltip);\n  pointer-events: none;\n}\n\n.tooltip {\n  max-width: var(--max-width);\n  border-radius: var(--sl-tooltip-border-radius);\n  background-color: var(--sl-tooltip-background-color);\n  font-family: var(--sl-tooltip-font-family);\n  font-size: var(--sl-tooltip-font-size);\n  font-weight: var(--sl-tooltip-font-weight);\n  line-height: var(--sl-tooltip-line-height);\n  color: var(--sl-tooltip-color);\n  padding: var(--sl-tooltip-padding);\n}\n.tooltip:after {\n  content: "";\n  position: absolute;\n  width: 0;\n  height: 0;\n}\n\n.tooltip-positioner[data-popper-placement^=top] .tooltip {\n  transform-origin: bottom;\n}\n.tooltip-positioner[data-popper-placement^=bottom] .tooltip {\n  transform-origin: top;\n}\n.tooltip-positioner[data-popper-placement^=left] .tooltip {\n  transform-origin: right;\n}\n.tooltip-positioner[data-popper-placement^=right] .tooltip {\n  transform-origin: left;\n}\n\n.tooltip-positioner[data-popper-placement^=bottom] .tooltip:after {\n  bottom: 100%;\n  left: calc(50% - var(--sl-tooltip-arrow-size));\n  border-bottom: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);\n  border-left: var(--sl-tooltip-arrow-size) solid transparent;\n  border-right: var(--sl-tooltip-arrow-size) solid transparent;\n}\n\n.tooltip-positioner[data-popper-placement=bottom-start] .tooltip:after {\n  left: var(--sl-tooltip-arrow-start-end-offset);\n}\n\n.tooltip-positioner[data-popper-placement=bottom-end] .tooltip:after {\n  right: var(--sl-tooltip-arrow-start-end-offset);\n  left: auto;\n}\n\n.tooltip-positioner[data-popper-placement^=top] .tooltip:after {\n  top: 100%;\n  left: calc(50% - var(--sl-tooltip-arrow-size));\n  border-top: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);\n  border-left: var(--sl-tooltip-arrow-size) solid transparent;\n  border-right: var(--sl-tooltip-arrow-size) solid transparent;\n}\n\n.tooltip-positioner[data-popper-placement=top-start] .tooltip:after {\n  left: var(--sl-tooltip-arrow-start-end-offset);\n}\n\n.tooltip-positioner[data-popper-placement=top-end] .tooltip:after {\n  right: var(--sl-tooltip-arrow-start-end-offset);\n  left: auto;\n}\n\n.tooltip-positioner[data-popper-placement^=left] .tooltip:after {\n  top: calc(50% - var(--sl-tooltip-arrow-size));\n  left: 100%;\n  border-left: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);\n  border-top: var(--sl-tooltip-arrow-size) solid transparent;\n  border-bottom: var(--sl-tooltip-arrow-size) solid transparent;\n}\n\n.tooltip-positioner[data-popper-placement=left-start] .tooltip:after {\n  top: var(--sl-tooltip-arrow-start-end-offset);\n}\n\n.tooltip-positioner[data-popper-placement=left-end] .tooltip:after {\n  top: auto;\n  bottom: var(--sl-tooltip-arrow-start-end-offset);\n}\n\n.tooltip-positioner[data-popper-placement^=right] .tooltip:after {\n  top: calc(50% - var(--sl-tooltip-arrow-size));\n  right: 100%;\n  border-right: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);\n  border-top: var(--sl-tooltip-arrow-size) solid transparent;\n  border-bottom: var(--sl-tooltip-arrow-size) solid transparent;\n}\n\n.tooltip-positioner[data-popper-placement=right-start] .tooltip:after {\n  top: var(--sl-tooltip-arrow-start-end-offset);\n}\n\n.tooltip-positioner[data-popper-placement=right-end] .tooltip:after {\n  top: auto;\n  bottom: var(--sl-tooltip-arrow-start-end-offset);\n}';

// src/components/tooltip/tooltip.ts
var id = 0;
var SlTooltip = class extends h {
  constructor() {
    super(...arguments);
    this.componentId = `tooltip-${++id}`;
    this.hasInitialized = false;
    this.content = "";
    this.placement = "top";
    this.disabled = false;
    this.distance = 10;
    this.open = false;
    this.skidding = 0;
    this.trigger = "hover focus";
  }
  connectedCallback() {
    super.connectedCallback();
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.updateComplete.then(() => {
      this.addEventListener("blur", this.handleBlur, true);
      this.addEventListener("focus", this.handleFocus, true);
      this.addEventListener("click", this.handleClick);
      this.addEventListener("keydown", this.handleKeyDown);
      this.addEventListener("mouseover", this.handleMouseOver);
      this.addEventListener("mouseout", this.handleMouseOut);
      this.target = this.getTarget();
      this.syncOptions();
    });
  }
  firstUpdated() {
    this.tooltip.hidden = !this.open;
    this.updateComplete.then(() => this.hasInitialized = true);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("blur", this.handleBlur, true);
    this.removeEventListener("focus", this.handleFocus, true);
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
    this.removeEventListener("mouseover", this.handleMouseOver);
    this.removeEventListener("mouseout", this.handleMouseOut);
    if (this.popover) {
      this.popover.destroy();
    }
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
  getTarget() {
    const target = [...this.children].find((el) => el.tagName.toLowerCase() !== "style" && el.getAttribute("slot") !== "content");
    if (!target) {
      throw new Error("Invalid tooltip target: no child element was found.");
    }
    return target;
  }
  handleBlur() {
    if (this.hasTrigger("focus")) {
      this.hide();
    }
  }
  handleClick() {
    if (this.hasTrigger("click")) {
      this.open ? this.hide() : this.show();
    }
  }
  handleFocus() {
    if (this.hasTrigger("focus")) {
      this.show();
    }
  }
  handleKeyDown(event2) {
    if (this.open && event2.key === "Escape") {
      event2.stopPropagation();
      this.hide();
    }
  }
  handleMouseOver() {
    if (this.hasTrigger("hover")) {
      const delay = parseDuration(getComputedStyle(this).getPropertyValue("--show-delay"));
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => this.show(), delay);
    }
  }
  handleMouseOut() {
    if (this.hasTrigger("hover")) {
      const delay = parseDuration(getComputedStyle(this).getPropertyValue("--hide-delay"));
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => this.hide(), delay);
    }
  }
  async handleOpenChange() {
    if (!this.hasInitialized || this.disabled) {
      return;
    }
    if (this.open) {
      this.slShow.emit();
      await stopAnimations(this.tooltip);
      if (this.popover) {
        this.popover.destroy();
      }
      this.popover = createPopper(this.target, this.positioner, {
        placement: this.placement,
        strategy: "absolute",
        modifiers: [
          {
            name: "flip",
            options: {
              boundary: "viewport"
            }
          },
          {
            name: "offset",
            options: {
              offset: [this.skidding, this.distance]
            }
          }
        ]
      });
      this.tooltip.hidden = false;
      const { keyframes, options } = getAnimation(this, "tooltip.show");
      await animateTo(this.tooltip, keyframes, options);
      this.slAfterShow.emit();
    } else {
      this.slHide.emit();
      await stopAnimations(this.tooltip);
      const { keyframes, options } = getAnimation(this, "tooltip.hide");
      await animateTo(this.tooltip, keyframes, options);
      this.tooltip.hidden = true;
      if (this.popover) {
        this.popover.destroy();
      }
      this.slAfterHide.emit();
    }
  }
  handleOptionsChange() {
    this.syncOptions();
  }
  handleDisabledChange() {
    if (this.disabled && this.open) {
      this.hide();
    }
  }
  handleSlotChange() {
    const oldTarget = this.target;
    const newTarget = this.getTarget();
    if (newTarget !== oldTarget) {
      if (oldTarget) {
        oldTarget.removeAttribute("aria-describedby");
      }
      newTarget.setAttribute("aria-describedby", this.componentId);
    }
  }
  hasTrigger(triggerType) {
    const triggers = this.trigger.split(" ");
    return triggers.includes(triggerType);
  }
  syncOptions() {
    if (this.popover) {
      this.popover.setOptions({
        placement: this.placement,
        strategy: "absolute",
        modifiers: [
          {
            name: "flip",
            options: {
              boundary: "viewport"
            }
          },
          {
            name: "offset",
            options: {
              offset: [this.skidding, this.distance]
            }
          }
        ]
      });
    }
  }
  render() {
    return T`
      <slot @slotchange=${this.handleSlotChange.bind(this)}></slot>

      <div class="tooltip-positioner">
        <div
          part="base"
          id=${this.componentId}
          class=${e2({
      tooltip: true,
      "tooltip--open": this.open
    })}
          role="tooltip"
          aria-hidden=${this.open ? "false" : "true"}
        >
          <slot name="content">${this.content}</slot>
        </div>
      </div>
    `;
  }
};
SlTooltip.styles = r(tooltip_default);
__decorateClass([
  o(".tooltip-positioner")
], SlTooltip.prototype, "positioner", 2);
__decorateClass([
  o(".tooltip")
], SlTooltip.prototype, "tooltip", 2);
__decorateClass([
  e()
], SlTooltip.prototype, "content", 2);
__decorateClass([
  e()
], SlTooltip.prototype, "placement", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlTooltip.prototype, "disabled", 2);
__decorateClass([
  e({ type: Number })
], SlTooltip.prototype, "distance", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlTooltip.prototype, "open", 2);
__decorateClass([
  e({ type: Number })
], SlTooltip.prototype, "skidding", 2);
__decorateClass([
  e()
], SlTooltip.prototype, "trigger", 2);
__decorateClass([
  event("sl-show")
], SlTooltip.prototype, "slShow", 2);
__decorateClass([
  event("sl-after-show")
], SlTooltip.prototype, "slAfterShow", 2);
__decorateClass([
  event("sl-hide")
], SlTooltip.prototype, "slHide", 2);
__decorateClass([
  event("sl-after-hide")
], SlTooltip.prototype, "slAfterHide", 2);
__decorateClass([
  watch("open")
], SlTooltip.prototype, "handleOpenChange", 1);
__decorateClass([
  watch("placement"),
  watch("distance"),
  watch("skidding")
], SlTooltip.prototype, "handleOptionsChange", 1);
__decorateClass([
  watch("disabled")
], SlTooltip.prototype, "handleDisabledChange", 1);
SlTooltip = __decorateClass([
  n("sl-tooltip")
], SlTooltip);
var tooltip_default2 = SlTooltip;
setDefaultAnimation("tooltip.show", {
  keyframes: [
    { opacity: 0, transform: "scale(0.8)" },
    { opacity: 1, transform: "scale(1)" }
  ],
  options: { duration: 150, easing: "ease" }
});
setDefaultAnimation("tooltip.hide", {
  keyframes: [
    { opacity: 1, transform: "scale(1)" },
    { opacity: 0, transform: "scale(0.8)" }
  ],
  options: { duration: 150, easing: "ease" }
});

export {
  tooltip_default2 as tooltip_default
};
