import { createRoute } from "@inspatial/route";
import { Dynamic } from "@inspatial/kit";
import { AppWindow } from "./window.tsx";
import { CounterAppWindow } from "./(example)/counter/window.tsx";
import { ProjectsWindow } from "./(dashboard)/projects/window.tsx";
import { ErrorWindow } from "./error.tsx";
import { RouteTestWindow } from "./(example)/route-test/window.tsx";

/*################################(Route)################################*/
// Programmatic routing
export const route = createRoute({
  routes: {
    home: { path: "/", view: AppWindow },
    counter: { path: "/counter", view: CounterAppWindow },
    projects: { path: "/projects", view: ProjectsWindow },
    routeTest: { path: "/route-test", view: RouteTestWindow },
  },
  defaultView: ErrorWindow,
});

/*################################(Render)################################*/
export function AppRoutes() {
  const Selected = route.selected;
  return () => <Dynamic is={Selected} />;
}
