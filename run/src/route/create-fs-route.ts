import { createRoute, type RouteApi } from "./create-route.ts";
import type { InRouteManifest, RouteNode } from "./types.ts";
import { createFsRuntime } from "./runtime.ts";

export interface FsRouteOptions {
  manifest: InRouteManifest;
  mode?: "spa" | "mpa" | "auto";
  loaders?: {
    pageFiles: Record<string, () => Promise<any>>;
    layoutFiles?: Record<string, () => Promise<any>>;
    loadingFiles?: Record<string, () => Promise<any>>;
  };
}

/** Create a router bound to a filesystem manifest. */
export function createFsRoute({
  manifest,
  mode = "auto",
  loaders,
}: FsRouteOptions): RouteApi {
  // Flatten manifest routes into a named map to enable generateUrl(name,...)
  const byName: Record<
    string,
    { path: string; redirect?: string; name?: string; hooks?: any[] }
  > = {};

  function routeKeyFromPath(fullPath: string): string {
    if (fullPath === "/" || fullPath === (manifest.prefix || "") + "/")
      return "root";
    return fullPath
      .replace(manifest.prefix || "", "")
      .replace(/\{([^}]+)\}/g, "_$1")
      .replace(/[^a-zA-Z0-9_]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function walk(node: RouteNode, base = ""): void {
    const full = base + node.path;
    const key = node.name || routeKeyFromPath(full) || "route";
    byName[key] = { path: full, redirect: node.redirect, name: key };
    node.children?.forEach((c) => walk(c, full));
  }
  for (const r of manifest.routes) walk(r, manifest.prefix || "");

  const router = createRoute({
    routes: byName as any,
    prefix: manifest.prefix || "",
    mode,
  });

  // Expose route instance globally for extension-driven prefetch
  try {
    (globalThis as any).InRoute = router;
  } catch {
    // ignore if global is not available
  }

  // Prefetch hooks (hover/idle/viewport can call into this)
  const fsRuntime = loaders ? createFsRuntime(manifest, loaders) : null;
  async function prefetch(path: string): Promise<void> {
    if (!fsRuntime) return;
    try {
      await fsRuntime.prefetch(path);
    } catch {
      // prefetch is best-effort
    }
  }
  (router as any).prefetch = prefetch;
  return router;
}
