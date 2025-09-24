import { createExtension } from "@in/teract/extension";
import { incloud } from "./cloud.ts";
import type { SocketStatus } from "jsr:@inspatial/cloud-client@^0.1.28/types";
import {
  cloudStatusHandler,
  cloudReconnectedHandler,
  cloudNotifyHandler,
} from "./trigger.ts";

type ReconnectPolicy = "reload" | { onReconnect: () => void };

export function InCloud(options?: { reconnect?: ReconnectPolicy }) {
  return createExtension({
    meta: {
      key: "InCloud",
      name: "InCloud",
      description:
        "InSpatial Cloud API & InLive setup with trigger-prop integration",
      author: { name: "InSpatial" },
      verified: true,
      price: 0,
      status: "installed",
      type: "Universal",
      version: "0.1.0",
    },
    capabilities: {
      triggers: {
        cloudStatus: {
          handler: cloudStatusHandler,
          type: {} as { type: "cloudStatus"; status: SocketStatus | string },
          description: "Fires when cloud connection status changes",
        },
        cloudReconnected: {
          handler: cloudReconnectedHandler,
          type: undefined as void,
          description: "Fires when cloud connection is re-established",
        },
        cloudNotify: {
          handler: cloudNotifyHandler,
          type: {} as { type: string; title?: string; message: string },
          description: "Fires when cloud sends a notification",
        },
      },
    },
    lifecycle: {
      setup() {
        // Triggers are automatically registered by the extension system
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
