import {
  hasSlot
} from "./chunk.FMCX45AD.js";
import {
  e
} from "./chunk.YXKHB4AC.js";
import {
  T,
  h,
  n,
  r,
  r2
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/card/card.scss
var card_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  --border-color: var(--sl-color-gray-200);\n  --border-radius: var(--sl-border-radius-medium);\n  --border-width: 1px;\n  --padding: var(--sl-spacing-large);\n  display: inline-block;\n}\n\n.card {\n  display: flex;\n  flex-direction: column;\n  background-color: var(--sl-color-white);\n  box-shadow: var(--sl-shadow-x-small);\n  border: solid var(--border-width) var(--border-color);\n  border-radius: var(--border-radius);\n}\n\n.card__image {\n  border-top-left-radius: var(--border-radius);\n  border-top-right-radius: var(--border-radius);\n  margin: calc(-1 * var(--border-width));\n  overflow: hidden;\n}\n.card__image ::slotted(img) {\n  display: block;\n  width: 100%;\n}\n\n.card:not(.card--has-image) .card__image {\n  display: none;\n}\n\n.card__header {\n  border-bottom: solid var(--border-width) var(--border-color);\n  padding: calc(var(--padding) / 2) var(--padding);\n}\n\n.card:not(.card--has-header) .card__header {\n  display: none;\n}\n\n.card__body {\n  padding: var(--padding);\n}\n\n.card--has-footer .card__footer {\n  border-top: solid var(--border-width) var(--border-color);\n  padding: var(--padding);\n}\n\n.card:not(.card--has-footer) .card__footer {\n  display: none;\n}";

// src/components/card/card.ts
var SlCard = class extends h {
  constructor() {
    super(...arguments);
    this.hasFooter = false;
    this.hasImage = false;
    this.hasHeader = false;
  }
  handleSlotChange() {
    this.hasFooter = hasSlot(this, "footer");
    this.hasImage = hasSlot(this, "image");
    this.hasHeader = hasSlot(this, "header");
  }
  render() {
    return T`
      <div
        part="base"
        class=${e({
      card: true,
      "card--has-footer": this.hasFooter,
      "card--has-image": this.hasImage,
      "card--has-header": this.hasHeader
    })}
      >
        <div part="image" class="card__image">
          <slot name="image" @slotchange=${this.handleSlotChange}></slot>
        </div>

        <div part="header" class="card__header">
          <slot name="header" @slotchange=${this.handleSlotChange}></slot>
        </div>

        <div part="body" class="card__body">
          <slot></slot>
        </div>

        <div part="footer" class="card__footer">
          <slot name="footer" @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;
  }
};
SlCard.styles = r(card_default);
__decorateClass([
  r2()
], SlCard.prototype, "hasFooter", 2);
__decorateClass([
  r2()
], SlCard.prototype, "hasImage", 2);
__decorateClass([
  r2()
], SlCard.prototype, "hasHeader", 2);
SlCard = __decorateClass([
  n("sl-card")
], SlCard);
var card_default2 = SlCard;

export {
  card_default2 as card_default
};
