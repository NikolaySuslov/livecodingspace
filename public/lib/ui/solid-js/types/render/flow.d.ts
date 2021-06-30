import { Accessor } from "../reactive/signal";
import type { JSX } from "../jsx";
export declare function For<T, U extends JSX.Element>(props: {
    each: readonly T[];
    fallback?: JSX.Element;
    children: (item: T, index: Accessor<number>) => U;
}): Accessor<U[]>;
export declare function Index<T, U extends JSX.Element>(props: {
    each: readonly T[];
    fallback?: JSX.Element;
    children: (item: Accessor<T>, index: number) => U;
}): Accessor<U[]>;
export declare function Show<T>(props: {
    when: T | undefined | null | false;
    fallback?: JSX.Element;
    children: JSX.Element | ((item: T) => JSX.Element);
}): () => JSX.Element;
export declare function Switch(props: {
    fallback?: JSX.Element;
    children: JSX.Element;
}): Accessor<JSX.Element>;
export declare type MatchProps<T> = {
    when: T | undefined | null | false;
    children: JSX.Element | ((item: T) => JSX.Element);
};
export declare function Match<T>(props: MatchProps<T>): JSX.Element;
export declare function ErrorBoundary(props: {
    fallback: JSX.Element | ((err: any, reset: () => void) => JSX.Element);
    children: JSX.Element;
}): Accessor<JSX.Element>;
