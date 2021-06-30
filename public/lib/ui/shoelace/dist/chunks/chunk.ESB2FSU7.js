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

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/skeleton/skeleton.scss
var skeleton_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  --border-radius: var(--sl-border-radius-pill);\n  --color: var(--sl-color-gray-200);\n  --sheen-color: var(--sl-color-gray-100);\n  display: block;\n  position: relative;\n}\n\n.skeleton {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  min-height: 1rem;\n}\n\n.skeleton__indicator {\n  flex: 1 1 auto;\n  background: var(--color);\n  border-radius: var(--border-radius);\n}\n\n.skeleton--sheen .skeleton__indicator {\n  background: linear-gradient(270deg, var(--sheen-color), var(--color), var(--color), var(--sheen-color));\n  background-size: 400% 100%;\n  background-size: 400% 100%;\n  animation: sheen 8s ease-in-out infinite;\n}\n\n.skeleton--pulse .skeleton__indicator {\n  animation: pulse 2s ease-in-out 0.5s infinite;\n}\n\n@keyframes sheen {\n  0% {\n    background-position: 200% 0;\n  }\n  to {\n    background-position: -200% 0;\n  }\n}\n@keyframes pulse {\n  0% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.4;\n  }\n  100% {\n    opacity: 1;\n  }\n}";

// src/components/skeleton/skeleton.ts
var SlSkeleton = class extends h {
  constructor() {
    super(...arguments);
    this.effect = "sheen";
  }
  render() {
    return T`
      <div
        part="base"
        class=${e2({
      skeleton: true,
      "skeleton--pulse": this.effect === "pulse",
      "skeleton--sheen": this.effect === "sheen"
    })}
        aria-busy="true"
        aria-live="polite"
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `;
  }
};
SlSkeleton.styles = r(skeleton_default);
__decorateClass([
  e()
], SlSkeleton.prototype, "effect", 2);
SlSkeleton = __decorateClass([
  n("sl-skeleton")
], SlSkeleton);
var skeleton_default2 = SlSkeleton;

export {
  skeleton_default2 as skeleton_default
};
