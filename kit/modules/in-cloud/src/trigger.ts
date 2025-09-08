import { isSignal } from "@in/teract/signal/index.ts";
import { createTrigger } from "@in/teract/trigger/index.ts";
import type { SocketStatus } from "jsr:@inspatial/cloud-client/types";
import { incloud } from "./cloud.ts";

/*######################################(Cloud Triggers)######################################*/
// Register trigger-prop handlers so UI can subscribe via on:cloudStatus / on:cloudReconnected
type StatusCb = (info: { type: "cloudStatus"; status: string }) => void;
const cloudStatusCallbacks = new Map<Element, StatusCb>();
const cloudReconnectedCallbacks = new Map<Element, () => void>();
let cloudStatusListenerId: string | null = null;

export function ensureCloudStatusSubscription(): void {
  if (cloudStatusListenerId) return;
  cloudStatusListenerId = incloud.live.onConnectionStatus(
    (status: SocketStatus) => {
      const entries = Array.from(cloudStatusCallbacks.entries());
      for (const [el, cb] of entries) {
        if (!(el as any).isConnected) {
          cloudStatusCallbacks.delete(el);
          continue;
        }
        try {
          cb({ type: "cloudStatus", status });
        } catch {
          // ignore user handler errors
        }
      }
      if (status === "reconnected") {
        const rEntries = Array.from(cloudReconnectedCallbacks.entries());
        for (const [el, rcb] of rEntries) {
          if (!(el as any).isConnected) {
            cloudReconnectedCallbacks.delete(el);
            continue;
          }
          try {
            rcb();
          } catch {
            // ignore user handler errors
          }
        }
      }
      if (
        cloudStatusCallbacks.size === 0 &&
        cloudReconnectedCallbacks.size === 0 &&
        cloudStatusListenerId
      ) {
        incloud.live.removeConnectionStatusListener(cloudStatusListenerId);
        cloudStatusListenerId = null;
      }
    }
  );
}

export const cloudStatusHandler = (node: Element, val: any) => {
  if (!val) return;
  ensureCloudStatusSubscription();
  const cb = isSignal(val) ? val.peek() : val;
  if (typeof cb === "function") {
    cloudStatusCallbacks.set(node, cb as StatusCb);
    // Immediately emit current status so UIs don't get stuck at initial value
    try {
      const current = (incloud.live as any)?.status as string | undefined;
      if (current) {
        (cb as StatusCb)({ type: "cloudStatus", status: current });
      }
    } catch {
      // ignore
    }
  }
};

// Extension Automatically register the triggers from capabilities.trigger
// createTrigger("cloudStatus", cloudStatusHandler);

export const cloudReconnectedHandler = (node: Element, val: any) => {
  if (!val) return;
  ensureCloudStatusSubscription();
  const original = isSignal(val) ? val.peek() : val;
  if (typeof original === "function") {
    cloudReconnectedCallbacks.set(node, original as () => void);
  }
};

// Extension Automatically register the triggers from capabilities.trigger
// createTrigger("cloudReconnected", cloudReconnectedHandler);

// Notification trigger
type NotifyCb = (info: {
  type: string;
  title?: string;
  message: string;
}) => void;
export const cloudNotifyCallbacks = new Map<Element, NotifyCb>();

export const cloudNotifyHandler = (node: Element, val: any) => {
  if (!val) return;
  const cb = isSignal(val) ? val.peek() : val;
  if (typeof cb === "function") {
    cloudNotifyCallbacks.set(node, cb as NotifyCb);
  }
};

// Extension Automatically register the triggers from capabilities.trigger
// createTrigger("cloudNotify", cloudNotifyHandler);
