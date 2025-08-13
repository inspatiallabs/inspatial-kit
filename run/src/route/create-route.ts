import { Route } from "./route.ts";
import { createSignal, type Signal } from "../signal/index.ts";
import { isSafeHref, normalizeHref } from "./sanitize.ts";
import { detectBrowserEngine } from "../env/index.ts";

export type RouterMode = "spa" | "mpa" | "auto";

export interface RouteOptions<T extends { path: string }> {
  routes?: T[] | Record<string, T>;
  prefix?: string;
  mode?: RouterMode;
  /** Optional view mappings by route name */
  views?: Record<string, any>;
  /** Optional view mappings by absolute path (e.g., "/counter") */
  viewsByPath?: Record<string, any>;
  /** Optional default view when no mapping found */
  defaultView?: any;
}

export interface CurrentRoute {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  name?: string;
}

export interface RouteApi {
  // navigation
  navigate(path: string, opts?: { replace?: boolean }): Promise<boolean>;
  redirect(path: string): Promise<boolean>;
  reload(): void;
  back(): void;
  forward(): void;
  get(): string;
  resetScrollPosition(): void;
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
  // chained API for fs integration
  fs?: (opts: {
    manifest: import("./types.ts").InRouteManifest;
    loaders?: {
      pageFiles: Record<string, () => Promise<any>>;
      layoutFiles?: Record<string, () => Promise<any>>;
      loadingFiles?: Record<string, () => Promise<any>>;
    };
    mode?: RouterMode;
  }) => RouteApi;
}

export function createRoute<T extends { path: string }>(
  options: RouteOptions<T> = {}
): RouteApi {
  const { routes = [], prefix = "", mode: _mode = "auto" } = options;

  const route = new Route(routes as any, { prefix });
  const current = createSignal<CurrentRoute | null>(null);
  const canGoBack = createSignal<boolean>(false);
  const transition = createSignal<"idle" | "navigating" | "error">("idle");
  const error = createSignal<any | null>(null);

  // =================== (View Mapping) ===================
  const nameToView: Record<string, any> = Object.assign(
    {},
    options.views || {}
  );
  const pathToView: Record<string, any> = Object.assign(
    {},
    options.viewsByPath || {}
  );
  let defaultView: any = options.defaultView;

  // Collect inline route views if provided as part of route records (best-effort)
  try {
    if (!Array.isArray(routes) && routes && typeof routes === "object") {
      for (const [name, cfg] of Object.entries(routes as Record<string, any>)) {
        if (cfg && typeof cfg === "object" && cfg.view) {
          nameToView[name] = cfg.view;
        }
      }
    }
  } catch {
    // ignore parse failures
  }

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
    path: string,
    opts?: { replace?: boolean }
  ): Promise<boolean> {
    // Normalize and safety checks for DOM
    if (typeof globalThis !== "undefined" && (globalThis as any).document) {
      const safe = isSafeHref(path, { prefix });
      if (!safe) return false;
      path = normalizeHref(path, prefix);
    }

    transition.set("navigating");
    error.set(null);
    const res = await route.navigate(path, !(opts && opts.replace));
    if (!res) {
      // Update current to reflect the attempted path for consumers (e.g., InRouteView)
      current.set({
        path,
        params: {},
        query: Object.fromEntries(
          new URLSearchParams((globalThis as any).location?.search || "")
        ),
        name: undefined,
      });
      transition.set("error");
      updateCanGoBack();
      return false;
    }
    current.set({
      path,
      params: res.params,
      query: Object.fromEntries(
        new URLSearchParams((globalThis as any).location?.search || "")
      ),
      name: (res.route as any).name,
    });
    updateCanGoBack();
    resetScrollPosition();
    transition.set("idle");
    return true;
  }

  function redirect(path: string): Promise<boolean> {
    return navigate(path, { replace: true });
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
    return current.get()?.path || "";
  }
  function resetScrollPosition(): void {
    if (typeof globalThis !== "undefined" && (globalThis as any).scrollTo)
      (globalThis as any).scrollTo(0, 0);
  }

  const api: RouteApi = {
    navigate,
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

  // Initialize current if in browser
  if (typeof globalThis !== "undefined" && (globalThis as any).location) {
    route.start();
    // Sync current signal when navigation happens via native anchor interception
    try {
      (globalThis as any).document?.addEventListener?.(
        "in-route",
        (ev: any) => {
          try {
            const detail = ev?.detail || {};
            const path = String(detail.path || "");
            const queryObj = detail.query || {};
            const qs = new URLSearchParams(queryObj).toString();
            const fullPath = qs ? `${path}?${qs}` : path;
            current.set({
              path: fullPath,
              params: detail.params || {},
              query: queryObj,
              name: detail.route?.name,
            });
            updateCanGoBack();
            transition.set("idle");
          } catch {
            // best-effort sync
          }
        }
      );
    } catch {
      // ignore listener failures in non-DOM contexts
    }
    // Prime current
    const path =
      (globalThis as any).location.pathname +
      (globalThis as any).location.search;
    route.navigate(path, false).then((res) => {
      if (res) {
        current.set({
          path,
          params: res.params,
          query: Object.fromEntries(
            new URLSearchParams((globalThis as any).location?.search || "")
          ),
          name: (res.route as any).name,
        });
        updateCanGoBack();
      }
    });
  }

  // Selected view signal (renderer-agnostic)
  const selected = createSignal<any>(null as any);
  // Recompute selected whenever current changes
  current.connect(() => {
    const cur = current.peek();
    const path = (cur?.path || (globalThis as any).location?.pathname || "/")
      .split("?")[0]
      .split("#")[0];
    const name = cur?.name;
    let view: any = undefined;
    if (name && nameToView[name]) view = nameToView[name];
    else if (path && pathToView[path]) view = pathToView[path];
    else view = defaultView;
    selected.poke(view);
    selected.trigger();
  });
  // Expose on API
  (api as any).selected = selected as Signal<any>;

  return api;
}
