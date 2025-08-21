import { createExtension } from "@in/extension/index.ts";
import { incloud } from "./cloud.ts";
import type { SocketStatus } from "@inspatial/cloud-client/types";

type ReconnectPolicy = "reload" | { onReconnect: () => void };

export function InCloud(options?: { reconnect?: ReconnectPolicy }) {
  return createExtension({
    meta: {
      key: "InCloud",
      name: "InCloud",
      description: "Cloud API and Live setup with trigger-prop integration",
      author: { name: "InSpatial" },
      verified: true,
      price: 0,
      status: "installed",
      type: "Universal",
      version: "0.1.0",
    },
    lifecycle: {
      setup() {
        // Ensure incloud is initialized by global.ts import side-effects.
        // Optionally install reconnect policy
        if (options?.reconnect) {
          const policy = options.reconnect;
          incloud.live.onConnectionStatus((status: SocketStatus) => {
            if (status === "reconnected") {
              if (policy === "reload") {
                if (
                  typeof globalThis !== "undefined" &&
                  (globalThis as any)?.location
                ) {
                  (globalThis as any).location.reload();
                }
              } else if (typeof policy?.onReconnect === "function") {
                try {
                  policy.onReconnect();
                } catch {
                  /* ignore */
                }
              }
            }
          });
        }
      },
    },
  });
}
