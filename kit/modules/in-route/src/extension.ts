import { createExtension } from "@in/extension";
import { DOMRouteHandler } from "./trigger.ts";

/**
 * InRoute extension for routing functionality
 * Currently only exposes a custom route trigger that allows you to listen to route navigation events
 *
 */
export function InRoute() {
  return createExtension({
    meta: {
      key: "InRoute",
      name: "InRoute",
      description: "InSpatial routing system with route trigger integration",
      author: { name: "InSpatial" },
      verified: true,
      price: 0,
      status: "installed",
      type: "Universal",
      version: "0.1.0",
    },
    capabilities: {
      triggers: {
        route: {
          handler: DOMRouteHandler(),
          type: {} as {
            path: string;
            params?: Record<string, string>;
            query?: Record<string, string>;
            name?: string;
          },
          description: "Fires on route navigation events",
        },
      },
    },
  });
}
