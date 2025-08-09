import {
  withTriggerProps,
  registerStandardDOMEvents,
} from "./trigger-props.ts";
import type { RendererExtension } from "../../renderer/extensions.ts";

/**
 * InSpatial trigger prop extension
 * @description This extension is used to add trigger prop functionality to the InSpatial renderer. Without this extension, the trigger prop functionality will not be available so event listeners will not be triggered.
 * @example
 * ```tsx
 * import { InTriggerProp } from "@inspatial/state";
 * ```
 */
export const InTriggerProp: RendererExtension = {
  name: "trigger",
  props: {
    onDirective: withTriggerProps.onTriggerProp,
    namespaces: withTriggerProps.namespaces,
    tagNamespaceMap: withTriggerProps.tagNamespaceMap,
    tagAliases: withTriggerProps.tagAliases,
    propAliases: withTriggerProps.propAliases,
  },
  setup: () => {
    registerStandardDOMEvents();
  },
};
