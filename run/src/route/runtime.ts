import type { InRouteManifest, RouteNode, PlatformFileMap } from "./types.ts";

export type FsLoaders = {
  pageFiles: Record<string, () => Promise<any>>;
  layoutFiles?: Record<string, () => Promise<any>>;
  loadingFiles?: Record<string, () => Promise<any>>;
};

function buildPathToNodeIndex(
  manifest: InRouteManifest
): Map<string, RouteNode> {
  const index = new Map<string, RouteNode>();
  const walk = (n: RouteNode, base = "") => {
    const full = (base || "") + n.path;
    index.set(full, n);
    n.children?.forEach((c) => walk(c, full));
  };
  for (const r of manifest.routes) walk(r, manifest.prefix || "");
  return index;
}

export function createFsRuntime(manifest: InRouteManifest, loaders: FsLoaders) {
  const pathIndex = buildPathToNodeIndex(manifest);
  const cache = new Set<string>();

  function findNodeByPath(path: string): RouteNode | undefined {
    // Normalize: strip query/hash
    const clean = path.split("?")[0].split("#")[0];
    return pathIndex.get(clean);
  }

  function resolveFile(file?: string | PlatformFileMap): string | undefined {
    if (!file) return undefined;
    if (typeof file === "string") return file;
    // Platform-aware selection can be added here; default to web or any entry
    return file.web || Object.values(file)[0];
  }

  async function prefetch(path: string): Promise<void> {
    const node = findNodeByPath(path);
    if (!node) return;
    const page = resolveFile(node.files.page as any);
    if (page && !cache.has(page)) {
      const loader = loaders.pageFiles[page];
      if (typeof loader === "function") {
        await loader();
        cache.add(page);
      }
    }
    // Optionally prefetch layout/loading as well
    const layout = resolveFile(node.files.layout as any);
    if (layout && loaders.layoutFiles?.[layout] && !cache.has(layout)) {
      await loaders.layoutFiles[layout]!();
      cache.add(layout);
    }
    const loading = resolveFile(node.files.loading as any);
    if (loading && loaders.loadingFiles?.[loading] && !cache.has(loading)) {
      await loaders.loadingFiles[loading]!();
      cache.add(loading);
    }
  }

  function invalidate(filePath?: string): void {
    if (!filePath) {
      cache.clear();
      return;
    }
    cache.delete(filePath);
  }

  // HMR invalidation hook
  if (typeof globalThis !== "undefined") {
    (globalThis as any).addEventListener?.("inroute:manifest:updated", () =>
      invalidate()
    );
  }

  return { prefetch, findNodeByPath, invalidate };
}
