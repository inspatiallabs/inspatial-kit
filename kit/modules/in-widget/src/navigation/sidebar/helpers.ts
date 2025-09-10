/**
 * Function to determine if a route is active based on current route
 * Uses browser location as fallback when route system is not available
 */
export function useActiveRoute(
  to?: string,
  match: "exact" | "prefix" | "custom" = "exact",
  customMatcher?: (currentRoute: string) => boolean
): boolean {
  if (!to) return false;

  // Try to get current path from multiple sources
  let currentPath = "";
  
  // 1. Try globalThis route system (if available)
  const globalRoute = (globalThis as any).route;
  if (globalRoute?.get) {
    try {
      currentPath = globalRoute.get();
    } catch {
      // Continue to fallback
    }
  }
  
  // 2. Try InRoute extension
  if (!currentPath) {
    const inRoute = (globalThis as any).InRoute;
    if (inRoute?.get) {
      try {
        currentPath = inRoute.get();
      } catch {
        // Continue to fallback
      }
    }
  }
  
  // 3. Fallback to browser location
  if (!currentPath && typeof globalThis !== "undefined" && (globalThis as any).location) {
    currentPath = (globalThis as any).location.pathname + (globalThis as any).location.search;
  }

  if (!currentPath) return false;

  if (customMatcher) return customMatcher(currentPath);

  if (match === "exact") return currentPath === to;
  if (match === "prefix") return currentPath.startsWith(to);

  return false;
}
