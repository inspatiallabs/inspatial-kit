import { createRoute } from "@inspatial/kit/route";
import { Dynamic } from "@inspatial/kit/control-flow";
import { AppWindow } from "./window.tsx";
import { CounterAppWindow } from "./(example)/counter/window.tsx";
import { ProjectsWindow } from "./(dashboard)/projects/window.tsx";
import { ErrorWindow } from "./error.tsx";
import { RouteTestWindow } from "./(example)/route-test/window.tsx";

/*################################(Route)################################*/
// Programmatic routing
export const route = createRoute({
  mode: "auto",
  routes: [
    { name: "home", to: "/", view: AppWindow },
    {
      name: "projects",
      to: "/projects",
      view: ProjectsWindow,
      // children: [
      //   { name: "projects.counter", to: "counter", view: CounterAppWindow },
      // ],
    },
    { name: "routeTest", to: "/route-test", view: RouteTestWindow },
    { name: "counter", to: "/counter", view: CounterAppWindow },
  ],
  defaultView: ErrorWindow,
});

/*################################(Render)################################*/
export function AppRoutes() {
  const Selected = route.selected;
  return () => <Dynamic is={Selected} />;
}
