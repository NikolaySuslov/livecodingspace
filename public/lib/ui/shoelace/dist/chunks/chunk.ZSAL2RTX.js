import {
  dist_exports
} from "./chunk.ZRVM725B.js";
import {
  event,
  watch
} from "./chunk.XX234VRK.js";
import {
  T,
  e,
  e2,
  h,
  n,
  r
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/animation/animation.scss
var animation_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: contents;\n}";

// src/components/animation/animation.ts
var SlAnimation = class extends h {
  constructor() {
    super(...arguments);
    this.hasStarted = false;
    this.name = "none";
    this.delay = 0;
    this.direction = "normal";
    this.duration = 1e3;
    this.easing = "linear";
    this.endDelay = 0;
    this.fill = "auto";
    this.iterations = Infinity;
    this.iterationStart = 0;
    this.playbackRate = 1;
    this.pause = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.createAnimation();
    this.handleAnimationCancel = this.handleAnimationCancel.bind(this);
    this.handleAnimationFinish = this.handleAnimationFinish.bind(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.destroyAnimation();
  }
  handleAnimationChange() {
    this.createAnimation();
  }
  handleAnimationFinish() {
    this.slFinish.emit();
  }
  handleAnimationCancel() {
    this.slCancel.emit();
  }
  handlePauseChange() {
    if (this.animation) {
      this.pause ? this.animation.pause() : this.animation.play();
      if (!this.pause && !this.hasStarted) {
        this.hasStarted = true;
        this.slStart.emit();
      }
      return true;
    } else {
      return false;
    }
  }
  handlePlaybackRateChange() {
    if (this.animation) {
      this.animation.playbackRate = this.playbackRate;
    }
  }
  handleSlotChange() {
    this.destroyAnimation();
    this.createAnimation();
  }
  async createAnimation() {
    const easing = dist_exports.easings[this.easing] || this.easing;
    const keyframes = this.keyframes ? this.keyframes : dist_exports[this.name];
    const slot = await this.defaultSlot;
    const element = slot.assignedElements()[0];
    if (!element) {
      return false;
    }
    this.destroyAnimation();
    this.animation = element.animate(keyframes, {
      delay: this.delay,
      direction: this.direction,
      duration: this.duration,
      easing,
      endDelay: this.endDelay,
      fill: this.fill,
      iterationStart: this.iterationStart,
      iterations: this.iterations
    });
    this.animation.playbackRate = this.playbackRate;
    this.animation.addEventListener("cancel", this.handleAnimationCancel);
    this.animation.addEventListener("finish", this.handleAnimationFinish);
    if (this.pause) {
      this.animation.pause();
    } else {
      this.hasStarted = true;
      this.slStart.emit();
    }
    return true;
  }
  destroyAnimation() {
    if (this.animation) {
      this.animation.cancel();
      this.animation.removeEventListener("cancel", this.handleAnimationCancel);
      this.animation.removeEventListener("finish", this.handleAnimationFinish);
      this.hasStarted = false;
    }
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch (e3) {
    }
  }
  finish() {
    try {
      this.animation.finish();
    } catch (e3) {
    }
  }
  getCurrentTime() {
    return this.animation.currentTime;
  }
  setCurrentTime(time) {
    this.animation.currentTime = time;
  }
  render() {
    return T` <slot @slotchange=${this.handleSlotChange}></slot> `;
  }
};
SlAnimation.styles = r(animation_default);
__decorateClass([
  e2("slot")
], SlAnimation.prototype, "defaultSlot", 2);
__decorateClass([
  e()
], SlAnimation.prototype, "name", 2);
__decorateClass([
  e({ type: Number })
], SlAnimation.prototype, "delay", 2);
__decorateClass([
  e()
], SlAnimation.prototype, "direction", 2);
__decorateClass([
  e({ type: Number })
], SlAnimation.prototype, "duration", 2);
__decorateClass([
  e()
], SlAnimation.prototype, "easing", 2);
__decorateClass([
  e({ attribute: "end-delay", type: Number })
], SlAnimation.prototype, "endDelay", 2);
__decorateClass([
  e()
], SlAnimation.prototype, "fill", 2);
__decorateClass([
  e({ type: Number })
], SlAnimation.prototype, "iterations", 2);
__decorateClass([
  e({ attribute: "iteration-start", type: Number })
], SlAnimation.prototype, "iterationStart", 2);
__decorateClass([
  e({ attribute: false })
], SlAnimation.prototype, "keyframes", 2);
__decorateClass([
  e({ attribute: "playback-rate", type: Number })
], SlAnimation.prototype, "playbackRate", 2);
__decorateClass([
  e({ type: Boolean })
], SlAnimation.prototype, "pause", 2);
__decorateClass([
  event("sl-cancel")
], SlAnimation.prototype, "slCancel", 2);
__decorateClass([
  event("sl-finish")
], SlAnimation.prototype, "slFinish", 2);
__decorateClass([
  event("sl-start")
], SlAnimation.prototype, "slStart", 2);
__decorateClass([
  watch("name"),
  watch("delay"),
  watch("direction"),
  watch("duration"),
  watch("easing"),
  watch("endDelay"),
  watch("fill"),
  watch("iterations"),
  watch("iterationsStart"),
  watch("keyframes")
], SlAnimation.prototype, "handleAnimationChange", 1);
__decorateClass([
  watch("pause")
], SlAnimation.prototype, "handlePauseChange", 1);
__decorateClass([
  watch("playbackRate")
], SlAnimation.prototype, "handlePlaybackRateChange", 1);
SlAnimation = __decorateClass([
  n("sl-animation")
], SlAnimation);
var animation_default2 = SlAnimation;

export {
  animation_default2 as animation_default
};
