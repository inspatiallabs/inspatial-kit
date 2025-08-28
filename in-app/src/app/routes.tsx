import { createRoute } from "@inspatial/kit/route";
import { Dynamic } from "@inspatial/kit/control-flow";
import { PresentationOutlet } from "@inspatial/kit/presentation";
import { AppWindow } from "./window.tsx";
import { CounterAppWindow } from "./(example)/counter/window.tsx";
import { ProjectsWindow } from "./(dashboard)/projects/window.tsx";
import { ErrorWindow } from "./error.tsx";
import { RouteTestWindow } from "./(example)/route-test/window.tsx";
import { AuthWindow } from "./(auth)/window.tsx";
import { AppMenu } from "./menu.tsx";
import { AccountView } from "./(auth)/account.tsx";
import { TableView } from "./(example)/table/view.tsx";

/*################################(Route)################################*/
// Programmatic routing
export const route = createRoute({
  mode: "auto",
  routes: [
    { name: "home", to: "/", view: AppWindow },
    { name: "auth", to: "/auth", view: AuthWindow },
    { name: "account", to: "/account", view: AccountView },
    {
      name: "projects",
      to: "/projects",
      view: ProjectsWindow,
      // children: [
      //   { name: "projects.counter", to: "counter", view: CounterAppWindow },
      // ],
    },

    /*################################(Example)################################*/
    
    { name: "routeTest", to: "/route-test", view: RouteTestWindow },
    { name: "counter", to: "/counter", view: CounterAppWindow },
    { name: "table", to: "/table", view: TableView },
  ],
  defaultView: ErrorWindow,
});

/*################################(Render)################################*/
export function AppRoutes() {
  const Selected = route.selected;
  return () => (
    <>
      <Dynamic is={Selected} />
      <AppMenu />
      <PresentationOutlet />
    </>
  );
}
