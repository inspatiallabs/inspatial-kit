// deno-lint-ignore-file
import "./kit.css";
import { createRenderer } from "@inspatial/run/renderer";
import { App } from "../app/window/flat.tsx";

// 1. Create InSpatial renderer
createRenderer({
  mode: "browser",
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
