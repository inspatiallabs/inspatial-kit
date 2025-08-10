// @ts-nocheck
import { createRenderer, supportsFeature } from "@inspatial/renderer";
import { App } from "@inspatial/app/(application)/(window)/flat.tsx";
import { InTriggerProp } from "@inspatial/state";
import { InTheme } from "@inspatial/app/(application)/(window)/theme/extension.ts";
import { InServe } from "@inspatial/serve";

/*################################(Create InSpatial Renderer)################################*/
createRenderer({
  mode: "auto",
  debug: "minimal",
  extensions: [InServe, InTriggerProp, InTheme],
}).then((InSpatial) => {
  // Only attempt DOM mount when running in a browser/DOM environment
  if (supportsFeature("hasDocument")) {
    InSpatial.render(document.getElementById("app"), App);
  }
});
