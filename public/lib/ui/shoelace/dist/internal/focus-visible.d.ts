export declare function observe(el: HTMLElement): void;
export declare function unobserve(el: HTMLElement): void;
export declare const focusVisible: {
    observe: typeof observe;
    unobserve: typeof unobserve;
};
