import { createRoute, type RouteApi } from "@inspatial/route";
import { $ } from "@inspatial/state";
import { Dynamic } from "@inspatial/kit";
import { AppWindow } from "./window.tsx";
import { CounterAppWindow } from "./(example)/counter/window.tsx";
import { ProjectsWindow } from "./(dashboard)/projects/window.tsx";

// Programmatic routing
export const route = createRoute({
  routes: {
    home: { path: "/" },
    counter: { path: "/counter" },
    projects: { path: "/projects" },
  },
});

// Expose for Link and programmatic navigation
try {
  (globalThis as unknown as { InRoute?: RouteApi }).InRoute = route;
} catch {
  // ignore if global object is not writable in this environment
}

// Simple view that renders a window based on current route
export function AppRoutes() {
  const Selected = $(() => {
    const raw =
      route.current.get()?.path ||
      (typeof location !== "undefined" ? location.pathname : "/");
    const path = raw.split("?")[0].split("#")[0];
    if (path === "/counter") return CounterAppWindow;
    if (path === "/projects") return ProjectsWindow;
    return AppWindow;
  });

  return () => <Dynamic is={Selected} />;
}
