/// <reference types="node" />
declare type RenderToStringResults = {
    html: string;
    script: string;
};
export declare function renderToString<T>(fn: () => T, options?: {
    eventNames?: string[];
}): RenderToStringResults;
export declare function renderToStringAsync<T>(fn: () => T, options?: {
    eventNames?: string[];
    timeoutMs?: number;
}): Promise<RenderToStringResults>;
export declare function renderToNodeStream<T>(fn: () => T, options?: {
    eventNames?: string[];
}): {
    stream: NodeJS.ReadableStream;
    script: string;
};
export declare function renderToWebStream<T>(fn: () => T, options?: {
    eventNames?: string[];
}): {
    writeTo: (writer: WritableStreamDefaultWriter) => Promise<void>;
    script: string;
};
export declare function ssr(template: string[] | string, ...nodes: any[]): {
    t: string;
};
export declare function resolveSSRNode(node: any): string;
export declare function ssrClassList(value: {
    [k: string]: boolean;
}): string;
export declare function ssrStyle(value: {
    [k: string]: string;
}): string;
export declare function ssrSpread(accessor: any): () => string;
export declare function ssrBoolean(key: string, value: boolean): string;
export declare function escape(html: string): string;
export {};
