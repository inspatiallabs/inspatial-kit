import { createRenderer } from "@inspatial/renderer";
import { envSupportsFeature } from "@inspatial/env";
import { InTrigger } from "@inspatial/state";
import { InTheme } from "@inspatial/app/app/(extensions)/in-theme/index.ts";
import { InServe } from "@inspatial/serve";
// import { InRoute } from "@inspatial/route";
import { AppRoutes } from "../app/routes.tsx";

/*################################(Create InSpatial Renderer)################################*/

createRenderer({
  mode: "auto",
  debug: "minimal",
  extensions: [
    InServe,
    InTrigger,
    InTheme,
    // InRoute()
  ],
}).then((InSpatial: any) => {
  // Only attempt DOM mount when running in a browser/DOM environment
  if (envSupportsFeature("hasDocument")) {
    InSpatial.render(document.getElementById("app"), AppRoutes); 
  }
});
