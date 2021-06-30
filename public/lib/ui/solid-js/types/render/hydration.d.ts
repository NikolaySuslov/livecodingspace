declare type HydrationContext = {
    id: string;
    count: number;
    loadResource?: (id: string) => Promise<any>;
};
declare type SharedConfig = {
    context?: HydrationContext;
    resources?: {
        [key: string]: any;
    };
    registry?: Map<string, Element>;
};
export declare const sharedConfig: SharedConfig;
export declare function setHydrateContext(context?: HydrationContext): void;
export declare function nextHydrateContext(): HydrationContext | undefined;
export {};
