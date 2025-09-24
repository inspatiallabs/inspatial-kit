import type { SocketStatus } from "jsr:@inspatial/cloud-client@^0.1.28/types";

export interface ExtensionTriggerTypes {
  cloudStatus: { type: "cloudStatus"; status: SocketStatus | string };
  cloudReconnected: void;
  cloudNotify: { type: string; title?: string; message: string };
}
