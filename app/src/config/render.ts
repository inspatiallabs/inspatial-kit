// deno-lint-ignore-file
import { createRenderer } from "@inspatial/renderer";
import { triggerPropExtension } from "@inspatial/state";
import { App } from "@inspatial/app/(application)/(window)/flat.tsx";

// 1. Create InSpatial renderer with trigger props integration
createRenderer({
  mode: "auto",
  debug: "minimal",
  extensions: [triggerPropExtension],
}).then((InSpatial: any) => {
  InSpatial.render(document.getElementById("app"), App);
});

// 2. Set up typescript for JSX Components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: any;
    }
  }
}
