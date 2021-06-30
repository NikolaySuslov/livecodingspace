export { createRoot, createSignal, createEffect, createRenderEffect, createComputed, createDeferred, createSelector, createMemo, createResource, onMount, onCleanup, onError, untrack, batch, on, useTransition, createContext, useContext, children, getListener, getOwner, runWithOwner, equalFn } from "./reactive/signal";
export type { Accessor, Resource, ResourceReturn, Context } from "./reactive/signal";
export { createState, unwrap, $RAW } from "./reactive/state";
export type { State, SetStateFunction, NotWrappable, StateNode, StateSetter, StatePathRange, ArrayFilterFn, Part, Next } from "./reactive/state";
export * from "./reactive/mutable";
export * from "./reactive/observable";
export * from "./reactive/stateModifiers";
export * from "./reactive/scheduler";
export * from "./reactive/array";
export * from "./render";
import type { JSX } from "./jsx";
declare type JSXElement = JSX.Element;
export type { JSXElement, JSX };
export declare function awaitSuspense(): void;
import { writeSignal, serializeGraph } from "./reactive/signal";
declare let DEV: {
    writeSignal: typeof writeSignal;
    serializeGraph: typeof serializeGraph;
};
export { DEV };
declare global {
    var Solid$$: boolean;
}
