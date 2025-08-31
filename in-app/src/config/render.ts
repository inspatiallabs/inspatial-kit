import { createRenderer } from "@inspatial/kit/renderer";
import { envSupportsFeature } from "@inspatial/kit/vader/env";
import { InTrigger } from "@inspatial/kit/trigger";
import { InTheme } from "@inspatial/kit/theme";
import { InServe } from "@inspatial/kit/build";
import { InPresentation } from "@inspatial/kit/presentation";
import { AppRoutes } from "../app/routes.tsx";
import { InCloud } from "@inspatial/kit/cloud";

/*################################(Create InSpatial Renderer)################################*/

createRenderer({
  mode: "auto",
  debug: "minimal",
  extensions: [
    InServe(),
    InTrigger(), // exposes universal and standard triggers
    InTheme(),
    InPresentation(), // exposes triggers like on:presentation
    InCloud({ reconnect: "reload" }), // exposes triggers like on:cloudStatus / on:cloudReconnected
  ],
}).then((InSpatial: any) => {
  // Only attempt DOM mount when running in a browser/DOM environment
  if (envSupportsFeature("hasDocument")) {
    InSpatial.render(document.getElementById("app"), AppRoutes);
  }
});
