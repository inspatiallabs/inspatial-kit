import {
  withTriggerProps,
  registerStandardDOMProps,
  registerUniversalTriggerProps,
} from "./trigger-props.ts";
import { createExtension } from "../../renderer/extensions.ts";

/**
 * InSpatial trigger prop extension
 * @description This extension is used to add trigger prop functionality to the InSpatial renderer. Without this extension, the trigger prop functionality will not be available so event listeners will not be triggered.
 * @example
 * ```tsx
 * import { InTriggerProp } from "@inspatial/state";
 * ```
 */
export const InTriggerProp = createExtension({
  meta: {
    key: "intriggerprop",
    name: "trigger",
    description: "Universal trigger props and directive resolver",
    author: { name: "InSpatial" },
    verified: true,
    price: 0,
    status: "installed",
    type: "Universal",
    version: "0.1.0",
  },
  scope: {
    clientScope: "progressive",
    editorScopes: ["Windows", "Scenes", "Cloud", "InDev"],
  },
  capabilities: {
    rendererProps: {
      onDirective: withTriggerProps.onTriggerProp,
      namespaces: withTriggerProps.namespaces,
      tagNamespaceMap: withTriggerProps.tagNamespaceMap,
      tagAliases: withTriggerProps.tagAliases,
      propAliases: withTriggerProps.propAliases,
    },
  },
  lifecycle: {
    setup: () => {
      registerStandardDOMProps();
      registerUniversalTriggerProps()
    },
  },
});
