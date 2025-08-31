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
import { EditorView } from "./(editor)/view.tsx";
import { FPS } from "@inspatial/kit/performance";
import { ThemeController } from "@inspatial/kit/theme";
import { KitBorder } from "@inspatial/kit/ornament";

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
    { name: "editor", to: "/editor", view: EditorView },

    /*################################(Example)################################*/

    { name: "routeTest", to: "/route-test", view: RouteTestWindow },
    { name: "counter", to: "/counter", view: CounterAppWindow },
  ],
  defaultView: ErrorWindow,
});

/*################################(Render)################################*/
export function AppRoutes() {
  const Selected = route.selected;
  return () => (
    <>
      <Dynamic is={Selected} />
      {/* <KitBorder />
      <AppMenu /> */}
      <FPS />
      <ThemeController className="absolute bottom-4 left-4 z-100" />
      <PresentationOutlet />
    </>
  );
}
