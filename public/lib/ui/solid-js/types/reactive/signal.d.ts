import type { JSX } from "../jsx";
export declare type Accessor<T> = () => T;
export declare const equalFn: <T>(a: T, b: T) => boolean;
export declare var Owner: Owner | null;
export declare var Listener: Computation<any> | null;
declare global {
    var _$afterUpdate: () => void;
}
interface Signal<T> {
    value?: T;
    observers: Computation<any>[] | null;
    observerSlots: number[] | null;
    pending: T | {};
    tValue?: T;
    comparator?: (prev: T, next: T) => boolean;
    name?: string;
}
interface Owner {
    owned: Computation<any>[] | null;
    cleanups: (() => void)[] | null;
    owner: Owner | null;
    context: any | null;
    attached?: boolean;
    sourceMap?: Record<string, {
        value: unknown;
    }>;
    name?: string;
    componentName?: string;
}
interface Computation<T> extends Owner {
    fn: (v?: T) => T;
    state: number;
    sources: Signal<T>[] | null;
    sourceSlots: number[] | null;
    value?: T;
    updatedAt: number | null;
    pure: boolean;
    user?: boolean;
    suspense?: SuspenseContextType;
}
interface Memo<T> extends Signal<T>, Computation<T> {
    tOwned?: Computation<any>[];
}
export declare function createRoot<T>(fn: (dispose: () => void) => T, detachedOwner?: Owner): T;
export declare function createSignal<T>(): [
    get: Accessor<T | undefined>,
    set: <U extends T | undefined>(v?: U) => U
];
export declare function createSignal<T>(value: T, options?: {
    equals?: false | ((prev: T, next: T) => boolean);
    name?: string;
    internal?: boolean;
}): [get: Accessor<T>, set: (v: T) => T];
export declare function createComputed<T>(fn: (v?: T) => T | undefined): void;
export declare function createComputed<T>(fn: (v: T) => T, value: T, options?: {
    name?: string;
}): void;
export declare function createRenderEffect<T>(fn: (v?: T) => T | undefined): void;
export declare function createRenderEffect<T>(fn: (v: T) => T, value: T, options?: {
    name?: string;
}): void;
export declare function createEffect<T>(fn: (v?: T) => T | undefined): void;
export declare function createEffect<T>(fn: (v: T) => T, value: T, options?: {
    name?: string;
}): void;
export declare function createMemo<T>(fn: (v?: T) => T, value?: undefined, options?: {
    equals?: false | ((prev: T, next: T) => boolean);
    name?: string;
}): Accessor<T>;
export declare function createMemo<T>(fn: (v: T) => T, value: T, options?: {
    equals?: false | ((prev: T, next: T) => boolean);
    name?: string;
}): Accessor<T>;
export interface Resource<T> extends Accessor<T | undefined> {
    loading: boolean;
    error: any;
}
export declare type ResourceReturn<T> = [
    Resource<T>,
    {
        mutate: (v: T | undefined) => T | undefined;
        refetch: () => void;
    }
];
export declare function createResource<T, U = true>(fetcher: (k: U, getPrev: Accessor<T | undefined>) => T | Promise<T>, options?: {
    initialValue?: T;
    name?: string;
}): ResourceReturn<T>;
export declare function createResource<T, U>(source: U | false | null | (() => U | false | null), fetcher: (k: U, getPrev: Accessor<T | undefined>) => T | Promise<T>, options?: {
    initialValue?: T;
    name?: string;
}): ResourceReturn<T>;
export declare function createDeferred<T>(source: Accessor<T>, options?: {
    equals?: false | ((prev: T, next: T) => boolean);
    name?: string;
    timeoutMs?: number;
}): Accessor<T>;
export declare function createSelector<T, U>(source: Accessor<T>, fn?: (a: U, b: T) => boolean, options?: {
    name?: string;
}): (key: U) => boolean;
export declare function batch<T>(fn: () => T): T;
export declare function untrack<T>(fn: Accessor<T>): T;
export declare function on<T, U>(deps: Array<() => T> | (() => T), fn: (value: Array<T> | T, prev: Array<T> | T, prevResults?: U) => U, options?: {
    defer?: boolean;
}): (prev?: U) => U | undefined;
export declare function onMount(fn: () => void): void;
export declare function onCleanup(fn: () => void): () => void;
export declare function onError(fn: (err: any) => void): void;
export declare function getListener(): Computation<any> | null;
export declare function getOwner(): Owner | null;
export declare function runWithOwner(o: Owner, fn: () => any): any;
export declare function useTransition(): [Accessor<boolean>, (fn: () => void, cb?: () => void) => void];
export declare function resumeEffects(e: Computation<any>[]): void;
export declare function devComponent<T>(Comp: (props: T) => JSX.Element, props: T): JSX.Element;
export declare function hashValue(v: any): string;
export declare function registerGraph(name: string, value: {
    value: unknown;
}): string;
interface GraphRecord {
    [k: string]: GraphRecord | unknown;
}
export declare function serializeGraph(owner?: Owner | null): GraphRecord;
export interface Context<T> {
    id: symbol;
    Provider: (props: {
        value: T;
        children: any;
    }) => any;
    defaultValue: T;
}
export declare function createContext<T>(): Context<T | undefined>;
export declare function createContext<T>(defaultValue: T): Context<T>;
export declare function useContext<T>(context: Context<T>): T;
export declare function children(fn: Accessor<any>): Accessor<unknown>;
declare type SuspenseContextType = {
    increment?: () => void;
    decrement?: () => void;
    inFallback?: () => boolean;
    effects?: Computation<any>[];
    resolved?: boolean;
};
export declare function getSuspenseContext(): Context<SuspenseContextType> & {
    active?(): boolean;
    increment?(): void;
    decrement?(): void;
};
export declare function writeSignal(this: Signal<any> | Memo<any>, value: any, isComp?: boolean): any;
export {};
