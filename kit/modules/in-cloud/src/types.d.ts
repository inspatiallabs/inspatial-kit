import type { SocketStatus } from "@inspatial/cloud-client/types";

// Named export only (no global augmentation). The build system composes these into globals.
export interface ExtensionTriggerTypes {
  cloudStatus: { type: "cloudStatus"; status: SocketStatus | string };
  cloudReconnected: void;
  cloudNotify: { type: string; title?: string; message: string };
}
