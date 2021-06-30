import type { JSX } from "../jsx";
export declare function SuspenseList(props: {
    children: JSX.Element;
    revealOrder: "forwards" | "backwards" | "together";
    tail?: "collapsed" | "hidden";
}): JSX.Element;
export declare function Suspense(props: {
    fallback?: JSX.Element;
    children: JSX.Element;
}): JSX.Element;
