import { State, NotWrappable } from "./state";
export declare type ReconcileOptions = {
    key?: string | null;
    merge?: boolean;
};
export declare function reconcile<T>(value: T | State<T>, options?: ReconcileOptions): (state: T extends NotWrappable ? T : State<T>) => T extends NotWrappable ? T : State<T>;
export declare function produce<T>(fn: (state: T) => void): (state: T extends NotWrappable ? T : State<T>) => T extends NotWrappable ? T : State<T>;
