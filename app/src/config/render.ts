// deno-lint-ignore-file
import { createRenderer } from "@inspatial/renderer";
import { App } from "@inspatial/app/(application)/(window)/flat.tsx";

// 1. Create InSpatial renderer
createRenderer({
  mode: "auto",
  debug: "verbose",
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