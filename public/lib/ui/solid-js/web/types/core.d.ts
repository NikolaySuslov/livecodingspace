import { createRoot, createRenderEffect, createComponent, getOwner, sharedConfig, awaitSuspense } from "../..";
declare function memo<T>(fn: () => T, equals: boolean): import("../..").Accessor<T>;
export { getOwner, createComponent, createRoot as root, createRenderEffect as effect, memo, sharedConfig, awaitSuspense as asyncWrap };
