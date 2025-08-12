import { createRenderer } from "@inspatial/renderer";
import { envSupportsFeature } from "@inspatial/env";
import { AuthWindow } from "@inspatial/app/app/(auth)/window.tsx";
import { InTrigger } from "@inspatial/state";
import { InTheme } from "@inspatial/app/app/(extensions)/in-theme/index.ts";
import { InServe } from "@inspatial/serve";
import { InRoute } from "@inspatial/route";

/*################################(Create InSpatial Renderer)################################*/
createRenderer({
  mode: "auto",
  debug: "minimal",
  extensions: [InServe, InTrigger, InTheme, InRoute],
}).then((InSpatial) => {
  // Only attempt DOM mount when running in a browser/DOM environment
  if (envSupportsFeature("hasDocument")) {
    InSpatial.render(document.getElementById("app"), AuthWindow); // Your App Entry Point
  }
});
