import { Accessor } from "./signal";
export declare function mapArray<T, U>(list: Accessor<readonly T[]>, mapFn: (v: T, i: Accessor<number>) => U, options?: {
    fallback?: Accessor<any>;
}): () => U[];
export declare function indexArray<T, U>(list: Accessor<readonly T[]>, mapFn: (v: Accessor<T>, i: number) => U, options?: {
    fallback?: Accessor<any>;
}): () => U[];
