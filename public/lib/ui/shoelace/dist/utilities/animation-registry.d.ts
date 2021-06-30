interface ElementAnimation {
    keyframes: Keyframe[];
    options?: KeyframeAnimationOptions;
}
export declare function setDefaultAnimation(animationName: string, animation: ElementAnimation): void;
export declare function setAnimation(el: Element, animationName: string, animation: ElementAnimation): void;
export declare function getAnimation(el: Element, animationName: string): ElementAnimation;
export {};
