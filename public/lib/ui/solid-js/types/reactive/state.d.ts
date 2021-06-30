export declare const $RAW: unique symbol, $NODE: unique symbol, $PROXY: unique symbol, $NAME: unique symbol;
export declare type StateNode = {
    [$NODE]?: any;
    [$PROXY]?: any;
    [$NAME]?: string;
    [k: string]: any;
    [k: number]: any;
};
declare type AddSymbolToPrimitive<T> = T extends {
    [Symbol.toPrimitive]: infer V;
} ? {
    [Symbol.toPrimitive]: V;
} : {};
declare type AddSymbolIterator<T> = T extends {
    [Symbol.iterator]: infer V;
} ? {
    [Symbol.iterator]: V;
} : {};
declare type AddSymbolToStringTag<T> = T extends {
    [Symbol.toStringTag]: infer V;
} ? {
    [Symbol.toStringTag]: V;
} : {};
declare type AddCallable<T> = T extends {
    (...x: any[]): infer V;
} ? {
    (...x: Parameters<T>): V;
} : {};
export declare type NotWrappable = string | number | boolean | Function | null;
export declare type State<T> = {
    [P in keyof T]: T[P] extends object ? State<T[P]> & T[P] : T[P];
} & {
    [$RAW]?: T;
} & AddSymbolToPrimitive<T> & AddSymbolIterator<T> & AddSymbolToStringTag<T> & AddCallable<T>;
export declare function isWrappable(obj: any): boolean;
export declare function unwrap<T extends StateNode>(item: any, set?: Set<unknown>): T;
export declare function getDataNodes(target: StateNode): any;
export declare function proxyDescriptor(target: StateNode, property: string | number | symbol): PropertyDescriptor | undefined;
export declare function createDataNode(): {
    (): void;
    set: () => void;
};
export declare function setProperty(state: StateNode, property: string | number, value: any): void;
export declare function updatePath(current: StateNode, path: any[], traversed?: (number | string)[]): void;
export declare type StateSetter<T> = Partial<T> | ((prevState: T extends NotWrappable ? T : State<T>, traversed?: (string | number)[]) => Partial<T> | void);
export declare type StatePathRange = {
    from?: number;
    to?: number;
    by?: number;
};
export declare type ArrayFilterFn<T> = (item: T extends any[] ? T[number] : never, index: number) => boolean;
export declare type Part<T> = keyof T | Array<keyof T> | StatePathRange | ArrayFilterFn<T>;
export declare type Next<T, K> = K extends keyof T ? T[K] : K extends Array<keyof T> ? T[K[number]] : T extends any[] ? K extends StatePathRange ? T[number] : K extends ArrayFilterFn<T> ? T[number] : never : never;
export interface SetStateFunction<T> {
    <Setter extends StateSetter<T>>(...args: [Setter]): void;
    <K1 extends Part<T>, Setter extends StateSetter<Next<T, K1>>>(...args: [K1, Setter]): void;
    <K1 extends Part<T>, K2 extends Part<Next<T, K1>>, Setter extends StateSetter<Next<Next<T, K1>, K2>>>(...args: [K1, K2, Setter]): void;
    <K1 extends Part<T>, K2 extends Part<Next<T, K1>>, K3 extends Part<Next<Next<T, K1>, K2>>, Setter extends StateSetter<Next<Next<Next<T, K1>, K2>, K3>>>(...args: [K1, K2, K3, Setter]): void;
    <K1 extends Part<T>, K2 extends Part<Next<T, K1>>, K3 extends Part<Next<Next<T, K1>, K2>>, K4 extends Part<Next<Next<Next<T, K1>, K2>, K3>>, Setter extends StateSetter<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>>>(...args: [K1, K2, K3, K4, Setter]): void;
    <K1 extends Part<T>, K2 extends Part<Next<T, K1>>, K3 extends Part<Next<Next<T, K1>, K2>>, K4 extends Part<Next<Next<Next<T, K1>, K2>, K3>>, K5 extends Part<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>>, Setter extends StateSetter<Next<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>, K5>>>(...args: [K1, K2, K3, K4, K5, Setter]): void;
    <K1 extends Part<T>, K2 extends Part<Next<T, K1>>, K3 extends Part<Next<Next<T, K1>, K2>>, K4 extends Part<Next<Next<Next<T, K1>, K2>, K3>>, K5 extends Part<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>>, K6 extends Part<Next<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>, K5>>, Setter extends StateSetter<Next<Next<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>, K5>, K6>>>(...args: [K1, K2, K3, K4, K5, K6, Setter]): void;
    <K1 extends Part<T>, K2 extends Part<Next<T, K1>>, K3 extends Part<Next<Next<T, K1>, K2>>, K4 extends Part<Next<Next<Next<T, K1>, K2>, K3>>, K5 extends Part<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>>, K6 extends Part<Next<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>, K5>>, K7 extends Part<Next<Next<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>, K5>, K6>>, Setter extends StateSetter<Next<Next<Next<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>, K5>, K6>, K7>>>(...args: [K1, K2, K3, K4, K5, K6, K7, Setter]): void;
    <K1 extends Part<T>, K2 extends Part<Next<T, K1>>, K3 extends Part<Next<Next<T, K1>, K2>>, K4 extends Part<Next<Next<Next<T, K1>, K2>, K3>>, K5 extends Part<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>>, K6 extends Part<Next<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>, K5>>, K7 extends Part<Next<Next<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>, K5>, K6>>, K8 extends Part<Next<Next<Next<Next<Next<Next<Next<T, K1>, K2>, K3>, K4>, K5>, K6>, K7>>>(...args: [K1, K2, K3, K4, K5, K6, K7, K8, ...(Part<any> | StateSetter<any>)[]]): void;
}
export declare function createState<T extends StateNode>(state: T | State<T>, options?: {
    name?: string;
}): [get: State<T>, set: SetStateFunction<T>];
export {};
