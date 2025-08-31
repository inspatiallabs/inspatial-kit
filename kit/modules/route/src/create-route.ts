import { Route } from "./route.ts";
import { createSignal, type Signal } from "@in/teract/signal";
import {
  isSafeHref as _isSafeHref,
  type normalizeHref as _normalizeHref,
} from "./sanitize.ts";
import { detectBrowserEngine } from "@in/vader/env";

export type RouterMode = "spa" | "mpa" | "auto";

export interface RouteOptions<T extends { to: string }> {
  routes?: T[] | Record<string, T>;
  prefix?: string;
  mode?: RouterMode;
  /** Optional view mappings by route name */
  views?: Record<string, any>;
  /** Optional view mappings by absolute path (e.g., "/counter") */
  viewsByPath?: Record<string, any>;
  /** Optional default view when no mapping found */
  defaultView?: any;
  /** Advanced core Route options passthrough */
  interceptLinks?: boolean;
  ignoreUnknown?: boolean;
  delegateUnknown?: boolean;
  eventName?: string;
  hooks?: any[];
  routeName?: string;
}

export interface CurrentRoute {
  to: string;
  params: Record<string, string>;
  query: Record<string, string>;
  name?: string;
}

export interface RouteApi {
  // navigation
  navigate(to: string, opts?: { replace?: boolean }): Promise<boolean>;
  /** Preferred alias for navigate */
  to(
    to:
      | string
      | {
          name: string;
          params?: Record<string, string>;
          query?: Record<string, string>;
          replace?: boolean;
        },
    opts?: { replace?: boolean; params?: Record<string, string>; query?: Record<string, string> }
  ): Promise<boolean>;
  redirect(to: string): Promise<boolean>;
  reload(): void;
  back(): void;
  forward(): void;
  /** Get the current route url (including query params and hash) */
  get(): string;
  resetScrollPosition(): void;
  dispose?: () => void;
  generateUrl(
    name: string,
    params?: Record<string, string>,
    query?: Record<string, string>
  ): string;

  // signals
  current: Signal<CurrentRoute | null>;
  canGoBack: Signal<boolean>;
  transition: Signal<"idle" | "navigating" | "error">;
  error?: Signal<any | null>;
  // view mapping API (renderer-agnostic)
  views: (map: Record<string, any>) => RouteApi;
  viewsByPath: (map: Record<string, any>) => RouteApi;
  default: (fallback: any) => RouteApi;
  /** Computed selected view/component based on current route */
  selected: Signal<any>;
}

export function createRoute<T extends { to: string }>(
  options: RouteOptions<T> = {}
): RouteApi {
  const {
    routes = [],
    prefix = "",
    mode: _mode = "auto",
    interceptLinks,
    ignoreUnknown,
    delegateUnknown,
    eventName,
    hooks,
    routeName,
  } = options;

  type AnyRoute = {
    name?: string;
    to: string;
    view?: any;
    redirect?: string;
    hooks?: any[];
    children?: AnyRoute[];
  };

  function joinPath(parent: string, child: string): string {
    if (!child) return parent || "/";
    if (child.startsWith("/")) return child; // absolute
    const p = parent.endsWith("/") ? parent.slice(0, -1) : parent || "";
    return (p || "") + "/" + child;
  }

  // Intentionally unused helper reserved for future name inference
  // function _toRouteName(parent: string | undefined, current?: string): string {
  //   if (current && current.length) return current;
  //   return parent || "";
  // }

  function flatten(
    input: T[] | Record<string, T> | AnyRoute[] | Record<string, AnyRoute>,
    parentName?: string,
    parentPath: string = ""
  ): {
    flatRoutes: Record<
      string,
      { to: string; redirect?: string; hooks?: any[] }
    >;
    nameToView: Record<string, any>;
    pathToView: Record<string, any>;
  } {
    const flatRoutes: Record<
      string,
      { to: string; redirect?: string; hooks?: any[] }
    > = {};
    const nameToView: Record<string, any> = {};
    const pathToView: Record<string, any> = {};

    const entries: AnyRoute[] = Array.isArray(input)
      ? (input as AnyRoute[])
      : Object.entries(input as Record<string, AnyRoute>).map(([k, v]) => ({
          name: (v as AnyRoute).name ?? k,
          ...(v as AnyRoute),
        }));

    for (const r of entries) {
      // Determine names and paths
      const routeName =
        r.name ||
        (parentName
          ? parentName +
            "." +
            (r.to || "").replace(/\/$/, "").split("/").filter(Boolean).pop()
          : (r.to || "").replace(/^\/+/, "")) ||
        Math.random().toString(36).slice(2);
      const fullPath = prefix + joinPath(parentPath, r.to);

      // Record flat route (exclude view, children)
      flatRoutes[routeName] = {
        to: fullPath,
        redirect: r.redirect,
        hooks: r.hooks,
      };

      // Collect views
      if ((r as any).view) {
        nameToView[routeName] = (r as any).view;
        pathToView[fullPath] = (r as any).view;
      }

      if (Array.isArray(r.children) && r.children.length) {
        const child = flatten(r.children, routeName, fullPath);
        Object.assign(flatRoutes, child.flatRoutes);
        Object.assign(nameToView, child.nameToView);
        Object.assign(pathToView, child.pathToView);
      }
    }

    return { flatRoutes, nameToView, pathToView };
  }

  // Build routing table from both array/object inputs with nested children
  const {
    flatRoutes,
    nameToView: collectedNameViews,
    pathToView: collectedPathViews,
  } = flatten(routes as any);

  // Honor explicit mappings passed in options as overrides/additions
  const nameToView: Record<string, any> = Object.assign(
    {},
    collectedNameViews,
    options.views || {}
  );
  const pathToView: Record<string, any> = Object.assign(
    {},
    collectedPathViews,
    options.viewsByPath || {}
  );
  let defaultView: any = options.defaultView;

  // Determine interceptLinks based on mode when not explicitly provided
  const finalInterceptLinks =
    typeof interceptLinks === "boolean"
      ? interceptLinks
      : _mode === "mpa"
      ? false
      : true;

  const route = new Route(
    flatRoutes as any,
    {
      prefix: "", // prefix applied during flattening
      interceptLinks: finalInterceptLinks,
      ignoreUnknown,
      delegateUnknown,
      eventName: eventName || "in-route",
      hooks,
      routeName,
    } as any
  );
  // Expose the event name globally for trigger bridge consumers
  try {
    (globalThis as any).__IN_ROUTE_EVENT_NAME = eventName || "in-route";
  } catch {
    // ignore non-DOM contexts
  }
  const current = createSignal<CurrentRoute | null>(null);
  const canGoBack = createSignal<boolean>(false);
  const transition = createSignal<"idle" | "navigating" | "error">("idle");
  const error = createSignal<any | null>(null);

  // =================== (View Mapping) ===================

  function updateCanGoBack(): void {
    try {
      const navApi: any = (globalThis as any).navigation;
      if (navApi && detectBrowserEngine() === "chromium") {
        const entries = navApi.entries?.() || [];
        const current = navApi.currentEntry;
        const idx = entries.findIndex((e: any) => e?.key === current?.key);
        canGoBack.set(idx > 0);
        return;
      }
      // Fallback heuristic
      canGoBack.set((history as any).length > 1);
    } catch {
      canGoBack.set(false);
    }
  }

  async function navigate(
    target:
      | string
      | {
          name: string;
          params?: Record<string, string>;
          query?: Record<string, string>;
          replace?: boolean;
        },
    opts?: {
      replace?: boolean;
      params?: Record<string, string>;
      query?: Record<string, string>;
    }
  ): Promise<boolean> {
    let path = "";
    // Resolve target: named route, absolute URL, or path
    try {
      if (typeof target === "string") {
        const isAbsoluteUrl = /^(https?:)?\/\//i.test(target);
        if (isAbsoluteUrl) {
          // External or same-origin absolute URL
          const dest = new URL(
            target,
            (globalThis as any).location?.origin || "http://localhost"
          );
          const origin = (globalThis as any).location?.origin;
          if (origin && dest.origin === origin) {
            path = dest.pathname + dest.search + dest.hash;
          } else {
            // External navigation (full page)
            if (_isSafeHref(dest.href, { requireSameOrigin: false })) {
              try {
                // Ensure ref=inspatial is present for external http(s) links
                if (
                  (dest.protocol === "http:" || dest.protocol === "https:") &&
                  !dest.searchParams.has("ref")
                ) {
                  dest.searchParams.set("ref", "inspatial");
                }
                (globalThis as any).location.assign(dest.href);
                return true;
              } catch {
                /* ignore external nav failure */
              }
            }
            return false;
          }
        } else if (target.startsWith("/")) {
          path = target;
        } else {
          // Assume named route
          try {
            const url = route.generateUrl(target, opts?.params, opts?.query);
            path = url;
          } catch {
            // Fallback: treat as plain path
            path = target;
          }
        }
      } else if (target && typeof target === "object") {
        const url = route.generateUrl(target.name, target.params, target.query);
        path = url;
        opts = { ...(opts || {}), replace: target.replace ?? opts?.replace };
      }
    } catch {
      // Malformed inputs
      return false;
    }

    transition.set("navigating");
    error.set(null);
    const res = await route.navigate(path, !(opts && opts.replace));
    if (!res) {
      transition.set("error");
      return false;
    }
    return true;
  }

  function redirect(to: string): Promise<boolean> {
    return navigate(to, { replace: true });
  }

  // Preferred alias for navigate()
  function to(
    target:
      | string
      | {
          name: string;
          params?: Record<string, string>;
          query?: Record<string, string>;
          replace?: boolean;
        },
    opts?: { replace?: boolean; params?: Record<string, string>; query?: Record<string, string> }
  ): Promise<boolean> {
    return navigate(target as any, opts);
  }

  function reload(): void {
    const navApi: any = (globalThis as any).navigation;
    if (navApi && detectBrowserEngine() === "chromium") {
      try {
        navApi.reload?.();
        return;
      } catch {
        // ignore navigation api reload errors
      }
    }
    if (typeof globalThis !== "undefined" && (globalThis as any).location)
      (globalThis as any).location.reload();
  }
  function back(): void {
    const navApi: any = (globalThis as any).navigation;
    if (navApi && detectBrowserEngine() === "chromium") {
      try {
        navApi.back?.();
        return;
      } catch {
        // ignore navigation api back errors
      }
    }
    if (typeof globalThis !== "undefined" && (globalThis as any).history)
      (globalThis as any).history.back();
  }
  function forward(): void {
    const navApi: any = (globalThis as any).navigation;
    if (navApi && detectBrowserEngine() === "chromium") {
      try {
        navApi.forward?.();
        return;
      } catch {
        // ignore navigation api forward errors
      }
    }
    if (typeof globalThis !== "undefined" && (globalThis as any).history)
      (globalThis as any).history.forward();
  }
  function get(): string {
    if (typeof globalThis !== "undefined" && (globalThis as any).location)
      return (
        (globalThis as any).location.pathname +
        (globalThis as any).location.search +
        (globalThis as any).location.hash
      );
    return current.get()?.to || "";
  }
  function resetScrollPosition(): void {
    if (typeof globalThis !== "undefined" && (globalThis as any).scrollTo)
      (globalThis as any).scrollTo(0, 0);
  }

  const api: RouteApi = {
    navigate,
    to,
    redirect,
    reload,
    back,
    forward,
    get,
    resetScrollPosition,
    generateUrl: (
      name: string,
      params?: Record<string, string>,
      query?: Record<string, string>
    ) => route.generateUrl(name, params, query),
    current,
    canGoBack,
    transition,
    error,
    views(map: Record<string, any>) {
      Object.assign(nameToView, map || {});
      // Touch selected update
      selected.trigger();
      return api;
    },
    viewsByPath(map: Record<string, any>) {
      Object.assign(pathToView, map || {});
      selected.trigger();
      return api;
    },
    default(fallback: any) {
      defaultView = fallback;
      selected.trigger();
      return api;
    },
    selected: undefined as any,
  };

  // Selected view signal (renderer-agnostic)
  const selected = createSignal<any>(null as any);
  const recomputeSelected = () => {
    const cur = current.peek();
    const path = (cur?.to || (globalThis as any).location?.pathname || "/")
      .split("?")[0]
      .split("#")[0];
    const name = cur?.name;
    let view: any = undefined;
    if (name && nameToView[name]) view = nameToView[name];
    else if (path && pathToView[path]) view = pathToView[path];
    else view = defaultView;
    selected.poke(view);
    selected.trigger();
  };
  // Recompute selected whenever current changes
  current.connect(recomputeSelected);

  // Initialize current if in browser
  let boundRouteEventHandler: ((ev: any) => void) | undefined;
  if (typeof globalThis !== "undefined" && (globalThis as any).location) {
    // Attach listener first to avoid missing the initial start event
    try {
      boundRouteEventHandler = (ev: any) => {
        try {
          const detail = ev?.detail || {};
          const path = String(detail.path || "");
          const queryObj = detail.query || {};
          const qs = new URLSearchParams(queryObj).toString();
          const fullPath = qs ? `${path}?${qs}` : path;
          current.set({
            to: fullPath,
            params: detail.params || {},
            query: queryObj,
            name: detail.route?.name,
          });
          updateCanGoBack();
          resetScrollPosition();
          transition.set("idle");
        } catch {
          // best-effort sync
        }
      };
      (globalThis as any).document?.addEventListener?.(
        eventName || "in-route",
        boundRouteEventHandler
      );
    } catch {
      // ignore listener failures in non-DOM contexts
    }
    // Start route after listener is attached
    route.start();
    // Prime selection from current location if no event fired yet
    recomputeSelected();
  }

  // Expose on API
  (api as any).selected = selected as Signal<any>;
  // Optional cleanup
  (api as any).dispose = () => {
    try {
      if (boundRouteEventHandler) {
        (globalThis as any).document?.removeEventListener?.(
          eventName || "in-route",
          boundRouteEventHandler as any
        );
      }
    } catch {
      // ignore
    }
    try {
      route.stop?.();
    } catch {
      // ignore
    }
  };

  return api;
}
