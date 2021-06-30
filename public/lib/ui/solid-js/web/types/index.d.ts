import { Component, JSX, Accessor } from "../..";
export * from "./client";
export { For, Show, Suspense, SuspenseList, Switch, Match, Index, ErrorBoundary, mergeProps } from "../..";
export * from "./server-mock";
export declare const isServer = false;
export declare function Portal(props: {
    mount?: Node;
    useShadow?: boolean;
    isSVG?: boolean;
    children: JSX.Element;
}): Text;
declare type DynamicProps<T> = T & {
    children?: any;
    component?: Component<T> | string | keyof JSX.IntrinsicElements;
};
export declare function Dynamic<T>(props: DynamicProps<T>): Accessor<JSX.Element>;
