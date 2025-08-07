// deno-lint-ignore-file
import { createRenderer } from "@inspatial/renderer";
// import { withTriggerProps } from "@inspatial/trigger";
import { App } from "@inspatial/app/(application)/(window)/flat.tsx";

// 1. Create InSpatial renderer with trigger props integration
createRenderer({
  mode: "auto",
  debug: "minimal",
  // extensions: {
  //   onDirective: withTriggerProps.onTriggerProp,
  //   namespaces: withTriggerProps.namespaces,
  //   tagNamespaceMap: withTriggerProps.tagNamespaceMap,
  //   tagAliases: withTriggerProps.tagAliases,
  //   propAliases: withTriggerProps.propAliases,
  // }
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