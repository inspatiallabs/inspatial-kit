import { createRenderer } from "@inspatial/kit/renderer";
import { envSupportsFeature } from "@inspatial/kit/vader/env";
import { InTrigger } from "@inspatial/kit/trigger";
import { InTheme } from "@inspatial/kit/theme";
import { InServe } from "@inspatial/kit/serve";
import { AppRoutes } from "../app/routes.tsx";

/*################################(Create InSpatial Renderer)################################*/

createRenderer({
  mode: "auto",
  debug: "minimal",
  extensions: [InServe(), InTrigger(), InTheme()],
}).then((InSpatial: any) => {
  // Only attempt DOM mount when running in a browser/DOM environment
  if (envSupportsFeature("hasDocument")) {
    InSpatial.render(document.getElementById("app"), AppRoutes);
  }
});
