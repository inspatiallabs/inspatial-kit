import "./theme.ts"
import { createRenderer } from "../../../modules/in-renderer/src/in-renderer/index.ts";
import { InTrigger } from "../../../modules/in-teract/src/index.ts";
import { InServe } from "../../../modules/in-build/src/index.ts";
import { envSupportsFeature } from "../../../modules/in-vader/src/index.ts";
import { AppRoutes } from "../app/routes.tsx";
// import { InTheme } from "../../../modules/in-widget/src/theme/extension.ts"

/*################################(Create InSpatial Renderer)################################*/
createRenderer({
  mode: "browser",
  debug: "verbose",
  extensions: [
    InServe(),
    // InTheme(),
    InTrigger(), // exposes universal and standard triggers
  ],
}).then((InSpatial: any) => {
  // Only attempt DOM mount when running in a browser/DOM environment
  if (envSupportsFeature("hasDocument")) {
    InSpatial.render(document.getElementById("app"), AppRoutes);
  }
});
