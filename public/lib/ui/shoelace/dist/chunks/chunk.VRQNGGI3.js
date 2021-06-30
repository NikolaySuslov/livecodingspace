import {
  e as e2
} from "./chunk.YXKHB4AC.js";
import {
  T,
  e,
  h,
  n,
  r
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/responsive-media/responsive-media.scss
var responsive_media_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: block;\n}\n\n.responsive-media {\n  position: relative;\n}\n.responsive-media ::slotted(*) {\n  position: absolute !important;\n  top: 0 !important;\n  left: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n}\n\n.responsive-media--cover ::slotted(embed),\n.responsive-media--cover ::slotted(iframe),\n.responsive-media--cover ::slotted(img),\n.responsive-media--cover ::slotted(video) {\n  object-fit: cover !important;\n}\n\n.responsive-media--contain ::slotted(embed),\n.responsive-media--contain ::slotted(iframe),\n.responsive-media--contain ::slotted(img),\n.responsive-media--contain ::slotted(video) {\n  object-fit: contain !important;\n}";

// src/components/responsive-media/responsive-media.ts
var SlResponsiveMedia = class extends h {
  constructor() {
    super(...arguments);
    this.aspectRatio = "16:9";
    this.fit = "cover";
  }
  render() {
    const split = this.aspectRatio.split(":");
    const x = parseInt(split[0]);
    const y = parseInt(split[1]);
    const paddingBottom = x && y ? `${y / x * 100}%` : "0";
    return T`
      <div
        class=${e2({
      "responsive-media": true,
      "responsive-media--cover": this.fit === "cover",
      "responsive-media--contain": this.fit === "contain"
    })}
        style="padding-bottom: ${paddingBottom}"
      >
        <slot></slot>
      </div>
    `;
  }
};
SlResponsiveMedia.styles = r(responsive_media_default);
__decorateClass([
  e({ attribute: "aspect-ratio" })
], SlResponsiveMedia.prototype, "aspectRatio", 2);
__decorateClass([
  e()
], SlResponsiveMedia.prototype, "fit", 2);
SlResponsiveMedia = __decorateClass([
  n("sl-responsive-media")
], SlResponsiveMedia);
var responsive_media_default2 = SlResponsiveMedia;

export {
  responsive_media_default2 as responsive_media_default
};
