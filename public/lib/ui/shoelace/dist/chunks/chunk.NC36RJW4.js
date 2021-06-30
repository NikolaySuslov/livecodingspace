// src/utilities/animation-registry.ts
var defaultAnimationRegistry = new Map();
var customAnimationRegistry = new WeakMap();
function setDefaultAnimation(animationName, animation) {
  defaultAnimationRegistry.set(animationName, animation);
}
function setAnimation(el, animationName, animation) {
  customAnimationRegistry.set(el, Object.assign({}, customAnimationRegistry.get(el), {
    [animationName]: animation
  }));
}
function getAnimation(el, animationName) {
  const customAnimation = customAnimationRegistry.get(el);
  if (customAnimation && customAnimation[animationName]) {
    return customAnimation[animationName];
  }
  const defaultAnimation = defaultAnimationRegistry.get(animationName);
  if (defaultAnimation) {
    return defaultAnimation;
  }
  return {
    keyframes: [],
    options: { duration: 0 }
  };
}

export {
  setDefaultAnimation,
  setAnimation,
  getAnimation
};
