import { Route } from "./route.ts";
import { createSignal, type Signal } from "../signal/index.ts";
import { isSafeHref, normalizeHref } from "./sanitize.ts";

export type RouterMode = "spa" | "mpa" | "auto";

export interface RouteOptions<T extends { path: string }> {
  routes?: T[] | Record<string, T>;
  prefix?: string;
  mode?: RouterMode;
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

  function updateCanGoBack(): void {
    try {
      // Heuristic; real impl can inspect history state depth if available
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
    if (!res) return false;
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
    if (typeof globalThis !== "undefined" && (globalThis as any).location)
      (globalThis as any).location.reload();
  }
  function back(): void {
    if (typeof globalThis !== "undefined" && (globalThis as any).history)
      (globalThis as any).history.back();
  }
  function forward(): void {
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
  };

  // Chained fs() sugar to reduce cognitive load: createRoute(...).fs({ manifest, loaders })
  (api as any).fs = (opts: {
    manifest: import("./types.ts").InRouteManifest;
    loaders?: {
      pageFiles: Record<string, () => Promise<any>>;
      layoutFiles?: Record<string, () => Promise<any>>;
      loadingFiles?: Record<string, () => Promise<any>>;
    };
    mode?: RouterMode;
  }) => {
    // Dynamic import to avoid circular deps eagerly
    const modPromise = import("./create-fs-route.ts");
    return modPromise.then(({ createFsRoute }) =>
      createFsRoute({
        manifest: opts.manifest,
        loaders: opts.loaders,
        mode: opts.mode,
      })
    ) as unknown as RouteApi;
  };

  // Initialize current if in browser
  if (typeof globalThis !== "undefined" && (globalThis as any).location) {
    route.start();
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

  return api;
}
