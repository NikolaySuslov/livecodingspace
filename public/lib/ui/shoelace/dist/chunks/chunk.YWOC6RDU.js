import {
  o as o2
} from "./chunk.EPTJRW4G.js";
import {
  clamp
} from "./chunk.T56CG5BM.js";
import {
  i
} from "./chunk.DA3UDEH5.js";
import {
  focusVisible
} from "./chunk.XAZSQ3AT.js";
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

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/rating/rating.scss
var rating_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  --symbol-color: var(--sl-color-gray-300);\n  --symbol-color-active: #ffbe00;\n  --symbol-size: 1.2rem;\n  --symbol-spacing: var(--sl-spacing-xxx-small);\n  display: inline-flex;\n}\n\n.rating {\n  position: relative;\n  display: inline-flex;\n  border-radius: var(--sl-border-radius-medium);\n  vertical-align: middle;\n}\n.rating:focus {\n  outline: none;\n}\n.rating.focus-visible:focus {\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n\n.rating__symbols {\n  display: inline-flex;\n  position: relative;\n  font-size: var(--symbol-size);\n  line-height: 0;\n  color: var(--symbol-color);\n  white-space: nowrap;\n  cursor: pointer;\n}\n.rating__symbols > * {\n  padding: var(--symbol-spacing);\n}\n\n.rating__symbols--indicator {\n  position: absolute;\n  top: 0;\n  left: 0;\n  color: var(--symbol-color-active);\n  pointer-events: none;\n}\n\n.rating__symbol {\n  transition: var(--sl-transition-fast) transform;\n}\n\n.rating__symbol--hover {\n  transform: scale(1.2);\n}\n\n.rating--disabled .rating__symbols,\n.rating--readonly .rating__symbols {\n  cursor: default;\n}\n.rating--disabled .rating__symbol--hover,\n.rating--readonly .rating__symbol--hover {\n  transform: none;\n}\n\n.rating--disabled {\n  opacity: 0.5;\n}\n.rating--disabled .rating__symbols {\n  cursor: not-allowed;\n}";

// src/components/rating/rating.ts
var SlRating = class extends h {
  constructor() {
    super(...arguments);
    this.hoverValue = 0;
    this.isHovering = false;
    this.value = 0;
    this.max = 5;
    this.precision = 1;
    this.readonly = false;
    this.disabled = false;
    this.getSymbol = (value) => '<sl-icon name="star-fill" library="system"></sl-icon>';
  }
  focus(options) {
    this.rating.focus(options);
  }
  blur() {
    this.rating.blur();
  }
  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => focusVisible.observe(this.rating));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    focusVisible.unobserve(this.rating);
  }
  getValueFromMousePosition(event2) {
    return this.getValueFromXCoordinate(event2.clientX);
  }
  getValueFromTouchPosition(event2) {
    return this.getValueFromXCoordinate(event2.touches[0].clientX);
  }
  getValueFromXCoordinate(coordinate) {
    const containerLeft = this.rating.getBoundingClientRect().left;
    const containerWidth = this.rating.getBoundingClientRect().width;
    return clamp(this.roundToPrecision((coordinate - containerLeft) / containerWidth * this.max, this.precision), 0, this.max);
  }
  handleClick(event2) {
    this.setValue(this.getValueFromMousePosition(event2));
  }
  setValue(newValue) {
    if (this.disabled || this.readonly) {
      return;
    }
    this.value = newValue === this.value ? 0 : newValue;
    this.isHovering = false;
  }
  handleKeyDown(event2) {
    if (this.disabled || this.readonly) {
      return;
    }
    if (event2.key === "ArrowLeft") {
      const decrement = event2.shiftKey ? 1 : this.precision;
      this.value = Math.max(0, this.value - decrement);
      event2.preventDefault();
    }
    if (event2.key === "ArrowRight") {
      const increment = event2.shiftKey ? 1 : this.precision;
      this.value = Math.min(this.max, this.value + increment);
      event2.preventDefault();
    }
    if (event2.key === "Home") {
      this.value = 0;
      event2.preventDefault();
    }
    if (event2.key === "End") {
      this.value = this.max;
      event2.preventDefault();
    }
  }
  handleMouseEnter() {
    this.isHovering = true;
  }
  handleMouseMove(event2) {
    this.hoverValue = this.getValueFromMousePosition(event2);
  }
  handleMouseLeave() {
    this.isHovering = false;
  }
  handleTouchStart(event2) {
    this.hoverValue = this.getValueFromTouchPosition(event2);
    event2.preventDefault();
  }
  handleTouchMove(event2) {
    this.isHovering = true;
    this.hoverValue = this.getValueFromTouchPosition(event2);
  }
  handleTouchEnd(event2) {
    this.isHovering = false;
    this.setValue(this.hoverValue);
    event2.preventDefault();
  }
  handleValueChange() {
    this.slChange.emit();
  }
  roundToPrecision(numberToRound, precision = 0.5) {
    const multiplier = 1 / precision;
    return Math.ceil(numberToRound * multiplier) / multiplier;
  }
  render() {
    const counter = Array.from(Array(this.max).keys());
    let displayValue = 0;
    if (this.disabled || this.readonly) {
      displayValue = this.value;
    } else {
      displayValue = this.isHovering ? this.hoverValue : this.value;
    }
    return T`
      <div
        part="base"
        class=${e2({
      rating: true,
      "rating--readonly": this.readonly,
      "rating--disabled": this.disabled
    })}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-readonly=${this.readonly ? "true" : "false"}
        aria-value=${this.value}
        aria-valuemin=${0}
        aria-valuemax=${this.max}
        tabindex=${this.disabled ? "-1" : "0"}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mouseenter=${this.handleMouseEnter}
        @touchstart=${this.handleTouchStart}
        @mouseleave=${this.handleMouseLeave}
        @touchend=${this.handleTouchEnd}
        @mousemove=${this.handleMouseMove}
        @touchmove=${this.handleTouchMove}
      >
        <span class="rating__symbols rating__symbols--inactive">
          ${counter.map((index) => {
      return T`
              <span
                class=${e2({
        rating__symbol: true,
        "rating__symbol--hover": this.isHovering && Math.ceil(displayValue) === index + 1
      })}
                role="presentation"
                @mouseenter=${this.handleMouseEnter.bind(this)}
              >
                ${o2(this.getSymbol(index + 1))}
              </span>
            `;
    })}
        </span>

        <span class="rating__symbols rating__symbols--indicator">
          ${counter.map((index) => {
      return T`
              <span
                class=${e2({
        rating__symbol: true,
        "rating__symbol--hover": this.isHovering && Math.ceil(displayValue) === index + 1
      })}
                style=${i({
        clipPath: displayValue > index + 1 ? "none" : `inset(0 ${100 - (displayValue - index) / 1 * 100}% 0 0)`
      })}
                role="presentation"
              >
                ${o2(this.getSymbol(index + 1))}
              </span>
            `;
    })}
        </span>
      </div>
    `;
  }
};
SlRating.styles = r(rating_default);
__decorateClass([
  o(".rating")
], SlRating.prototype, "rating", 2);
__decorateClass([
  r2()
], SlRating.prototype, "hoverValue", 2);
__decorateClass([
  r2()
], SlRating.prototype, "isHovering", 2);
__decorateClass([
  e({ type: Number })
], SlRating.prototype, "value", 2);
__decorateClass([
  e({ type: Number })
], SlRating.prototype, "max", 2);
__decorateClass([
  e({ type: Number })
], SlRating.prototype, "precision", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlRating.prototype, "readonly", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlRating.prototype, "disabled", 2);
__decorateClass([
  e()
], SlRating.prototype, "getSymbol", 2);
__decorateClass([
  event("sl-change")
], SlRating.prototype, "slChange", 2);
__decorateClass([
  watch("value")
], SlRating.prototype, "handleValueChange", 1);
SlRating = __decorateClass([
  n("sl-rating")
], SlRating);
var rating_default2 = SlRating;

export {
  rating_default2 as rating_default
};
