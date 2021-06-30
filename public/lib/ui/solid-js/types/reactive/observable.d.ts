import { Accessor } from "./signal";
export declare type ObservableObserver<T> = ((v: T) => void) | {
    next: (v: T) => void;
    error?: (v: any) => void;
    complete?: (v: boolean) => void;
};
export declare function observable<T>(input: Accessor<T>): {
    [x: number]: () => any;
    subscribe(observer: ObservableObserver<T>): {
        unsubscribe(): void;
    };
};
