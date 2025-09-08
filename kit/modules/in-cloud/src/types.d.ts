import type { SocketStatus } from "@inspatial/cloud-client/types";

export interface ExtensionTriggerTypes {
  cloudStatus: { type: "cloudStatus"; status: SocketStatus | string };
  cloudReconnected: void;
  cloudNotify: { type: string; title?: string; message: string };
}
