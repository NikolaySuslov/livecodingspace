export declare function animateTo(el: HTMLElement, keyframes: Keyframe[], options?: KeyframeAnimationOptions): Promise<unknown>;
export declare function parseDuration(delay: number | string): number;
export declare function prefersReducedMotion(): boolean;
export declare function stopAnimations(el: HTMLElement): Promise<unknown[]>;
export declare function shimKeyframesHeightAuto(keyframes: Keyframe[], calculatedHeight: number): (Keyframe & {
    height: string | number | null | undefined;
})[];
