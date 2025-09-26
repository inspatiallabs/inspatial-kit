import { createExtension } from "@in/teract/extension";
import { envSupportsFeature } from "@in/vader/env";
import { registerPresentationTrigger } from "./trigger.ts";

export function InPresentation(opts?: { zIndex?: number }) {
  return createExtension({
    meta: {
      key: "inpresentation",
      name: "InPresentation",
      description: "Global overlay layer and presentation triggers",
      author: { name: "InSpatial" },
      verified: true,
      price: 0,
      status: "installed",
      type: "Universal",
      version: "0.1.0",
    },
    scope: {
      clientScope: "progressive",
      editorScopes: ["Windows"],
    },
    lifecycle: {
      setup() {
        if (!envSupportsFeature("hasDocument")) return;
        // Just register the trigger, portal mounting handled by PresentationOutlet component
        registerPresentationTrigger();
        (globalThis as any).__presentation_portal_ready = true;
      },
    },
  });
}
