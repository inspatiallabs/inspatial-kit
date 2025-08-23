import { generateUniqueId } from "@in/vader";
import { env } from "@in/vader/env/index.ts";
import { isSignal } from "@in/teract/signal/index.ts";
import { createTrigger } from "@in/teract/trigger/index.ts";
import {
  InCloudClient,
  InLiveClient,
  Currencies,
  MimeTypes,
} from "jsr:@inspatial/cloud-client";
import type {
  Settings,
  SettingsEventMap,
  SettingsListener,
  EntryTypeListener,
  SocketStatus,
} from "jsr:@inspatial/cloud-client/types";

/*######################################(INIT)######################################*/

declare global {
  var incloud: {
    api?: InCloudClient;
    live?: InLiveClient;
  };
  var cloud: {
    api?: InCloudClient;
    live?: InLiveClient;
  };
}

interface InCloudGlobal {
  incloud?: { api?: InCloudClient; live?: InLiveClient };
  location?: Location;
}

const g = globalThis as unknown as InCloudGlobal;

if (!g.incloud) {
  g.incloud = {
    api: undefined,
    live: undefined,
  };
}

/*######################################(Handlers)######################################*/
export function setInCloudApi(api: InCloudClient) {
  g.incloud = g.incloud || {};
  g.incloud.api = api;
}

export function setInCloudLive(live: InLiveClient) {
  g.incloud = g.incloud || {};
  g.incloud.live = live;
}

/*######################################(InCloud)######################################*/
export const incloud = {
  get api(): InCloudClient {
    if (!g.incloud?.api) {
      throw new Error(
        "InCloudClient is not initialized. Please call setInCloudApi() first."
      );
    }
    return g.incloud.api as InCloudClient;
  },
  get live(): InLiveClient {
    if (!g.incloud?.live) {
      throw new Error(
        "InLiveClient is not initialized. Please call setInCloudLive() first."
      );
    }
    return g.incloud.live as InLiveClient;
  },
};

/*######################################(Refresh App on Reconnect)######################################*/
export function refreshAppOnReconnect(): () => void {
  const id = incloud.live.onConnectionStatus((status: SocketStatus) => {
    if (status === "reconnected") {
      if (typeof globalThis !== "undefined" && (globalThis as any)?.location) {
        (globalThis as any).location.reload();
      }
    }
  });
  return () => incloud.live.removeConnectionStatusListener(id);
}

/*######################################(Listen)######################################*/

export const listenSettings = <
  S extends Settings,
  E extends keyof SettingsEventMap<S> = keyof SettingsEventMap<S>
>(
  settings: string,
  callback: SettingsListener<S, E>["callback"],
  onUnMount?: () => void
): (() => void) => {
  const id = generateUniqueId();
  incloud.live.onSettings(settings, {
    name: id,
    callback,
  });
  return () => {
    incloud.live.removeSettingsListener(settings, id);
    if (onUnMount) onUnMount();
  };
};

export const listenList = <T extends Record<string, any>>(
  entryType: string,
  callback: EntryTypeListener<T>["callback"],
  onUnMount?: () => void
): (() => void) => {
  const id = generateUniqueId();
  incloud.live.onEntryType(entryType, {
    name: id,
    callback,
  });
  return () => {
    incloud.live.removeEntryTypeListener(entryType, id);
    if (onUnMount) onUnMount();
  };
};

/*######################################(CLOUD)######################################*/
// Resolve Cloud Host from environment with secure defaults
function resolveCloudHost(): string {
  // Prefer explicit variables; support multiple keys across bundlers
  const candidates: Array<string | undefined> = [
    env.getRuntimeAware("IN_CLOUD_LOCAL"),
    env.getRuntimeAware("IN_CLOUD_HOST"),
    env.getRuntimeAware("IN_CLOUD"),
    env.getRuntimeAware("VITE_IN_CLOUD_HOST"),
    env.getRuntimeAware("PACK_IN_CLOUD_HOST"),
    env.getRuntimeAware("SERVE_IN_CLOUD_HOST"),
    env.getRuntimeAware("INS_CLOUD_HOST"),
    env.getRuntimeAware("INSPATIAL_CLOUD_HOST"),
  ];

  let host = candidates.find((v) => typeof v === "string" && v.length > 0);

  // Fallbacks: use location.origin in production, localhost in development
  if (!host) {
    if (env.isDevelopment()) {
      host = "http://localhost:8000";
    } else if (typeof globalThis !== "undefined" && g.location?.origin) {
      host = g.location.origin as string;
    } else {
      // final safe fallback
      host = "https://localhost";
    }
  }

  // Normalize: remove trailing slash
  if (host.endsWith("/")) host = host.slice(0, -1);

  // Enforce HTTPS in production
  if (!env.isDevelopment() && host.startsWith("http:")) {
    host = host.replace(/^http:/, "https:");
  }

  return host;
}

const cloudHost = resolveCloudHost();

// Resolve WS Host with override support; fallback to HTTP host with ws scheme
function resolveWsHost(httpHost: string): string {
  const wsCandidates: Array<string | undefined> = [
    env.getRuntimeAware("IN_CLOUD_WS_HOST"),
    env.getRuntimeAware("IN_CLOUD_WS"),
    env.getRuntimeAware("VITE_IN_CLOUD_WS_HOST"),
    env.getRuntimeAware("PACK_IN_CLOUD_WS_HOST"),
    env.getRuntimeAware("SERVE_IN_CLOUD_WS_HOST"),
  ];
  let wsHost = wsCandidates.find((v) => typeof v === "string" && v.length > 0);
  if (!wsHost) {
    wsHost = `${httpHost.replace(/^http(s?):/, "ws$1:")}`;
  }
  if (wsHost.endsWith("/")) wsHost = wsHost.slice(0, -1);
  return wsHost;
}

type NotifyOptions = {
  type: "info" | "success" | "warning" | "error" | string;
  message?: string;
};
const api = new InCloudClient(`${cloudHost}/api`, {
  // Keep default notify non-intrusive; apps can override via setInCloudApi
  onNotify: (options: NotifyOptions) => {
    try {
      const logger = options.type === "error" ? console.error : console.log;
      logger(`InCloud: ${options.type}: ${options.message ?? ""}`);
    } catch {
      console.log(`InCloud: ${options.type}: ${options.message ?? ""}`);
    }
    // Broadcast to UI via cloudNotify trigger
    const entries = Array.from(cloudNotifyCallbacks.entries());
    for (const [el, cb] of entries) {
      if (!(el as any).isConnected) {
        cloudNotifyCallbacks.delete(el);
        continue;
      }
      try {
        cb({
          type: String(options.type || "info"),
          title: "InCloud",
          message: options.message ?? "",
        });
      } catch {
        // ignore user handler errors
      }
    }
  },
});

const inLiveHost = cloudHost ? `${resolveWsHost(cloudHost)}/ws` : "";
const live = new InLiveClient(inLiveHost);

/*######################################(SET)######################################*/

globalThis.incloud.api = api;
globalThis.incloud.live = live;
// ensure live client connects so status changes can be observed immediately
try {
  live.start();
} catch (_e) {
  // ignore
}

/*######################################(Cloud Triggers)######################################*/
// Register trigger-prop handlers so UI can subscribe via on:cloudStatus / on:cloudReconnected
type StatusCb = (info: { type: "cloudStatus"; status: string }) => void;
const cloudStatusCallbacks = new Map<Element, StatusCb>();
const cloudReconnectedCallbacks = new Map<Element, () => void>();
let cloudStatusListenerId: string | null = null;

function ensureCloudStatusSubscription(): void {
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

createTrigger("cloudStatus", (node: Element, val: any) => {
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
});

createTrigger("cloudReconnected", (node: Element, val: any) => {
  if (!val) return;
  ensureCloudStatusSubscription();
  const original = isSignal(val) ? val.peek() : val;
  if (typeof original === "function") {
    cloudReconnectedCallbacks.set(node, original as () => void);
  }
});

// Notification trigger
type NotifyCb = (info: {
  type: string;
  title?: string;
  message: string;
}) => void;
const cloudNotifyCallbacks = new Map<Element, NotifyCb>();
createTrigger("cloudNotify", (node: Element, val: any) => {
  if (!val) return;
  const cb = isSignal(val) ? val.peek() : val;
  if (typeof cb === "function") {
    cloudNotifyCallbacks.set(node, cb as NotifyCb);
  }
});

/*######################################(RE-EXPORT)######################################*/
export { Currencies, MimeTypes };
/**
 * Synthetic alias for incloud
 */
export const cloud = incloud;
