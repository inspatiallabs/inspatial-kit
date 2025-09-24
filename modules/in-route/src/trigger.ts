import { isSignal } from "@in/teract/signal";
// import { createTrigger } from "@in/teract/trigger";

type RouteHandler = (detail: any) => void;
type MaybeSignalHandler =
  | RouteHandler
  | { peek(): RouteHandler; connect(cb: () => void): void };

let ROUTE_EVENT_NAME: string | null = null;
let routeDocListener: ((ev: Event) => void) | null = null;
const routeCallbacks = new Map<Element, RouteHandler>();

export function DOMRouteHandler() {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;
    ROUTE_EVENT_NAME =
      (globalThis as any).IN_ROUTE_EVENT_NAME || ROUTE_EVENT_NAME || "in-route";

    let currentHandler: RouteHandler | null = null;
    if (isSignal(val)) {
      val.connect(function () {
        const cb = val.peek();
        currentHandler =
          typeof cb === "function"
            ? (detail: any) => (cb as RouteHandler)(detail)
            : null;
        if (currentHandler) routeCallbacks.set(node, currentHandler);
        else routeCallbacks.delete(node);
      });
    } else if (typeof val === "function") {
      currentHandler = val as RouteHandler;
      routeCallbacks.set(node, currentHandler);
    }

    if (!routeDocListener) {
      routeDocListener = function (ev: Event): void {
        const detail = (ev as any).detail || ev;
        // Iterate stable snapshot to allow mutation during iteration
        for (const [el, cb] of Array.from(routeCallbacks.entries())) {
          if (!(el as any).isConnected) {
            routeCallbacks.delete(el);
            continue;
          }
          try {
            cb(detail);
          } catch {
            // ignore user handler errors
          }
        }
      };
      document.addEventListener(
        ROUTE_EVENT_NAME || "in-route",
        routeDocListener as EventListener
      );
    }
  };
}

// Register the route trigger
// export function registerRouteTrigger() {
//   createTrigger("route", DOMRouteHandler());
// }
