import { InCloudClient, InLiveClient, Currencies, MimeTypes } from "@inspatial/cloud-client";
import { env } from "@in/vader/env";

/*######################################(GLOBAL)######################################*/

declare global {
  var inCloud: {
    api?: InCloudClient;
    live?: InLiveClient;
  };
}

/*######################################(INIT)######################################*/

interface InCloudGlobal {
  inCloud?: { api?: InCloudClient; live?: InLiveClient };
  location?: Location;
}

const g = globalThis as unknown as InCloudGlobal;

if (!g.inCloud) {
  g.inCloud = {
    api: undefined,
    live: undefined,
  };
}

/*######################################(API)######################################*/
export function setInCloudApi(api: InCloudClient) {
  g.inCloud = g.inCloud || {};
  g.inCloud.api = api;
}

export function setInCloudLive(live: InLiveClient) {
  g.inCloud = g.inCloud || {};
  g.inCloud.live = live;
}

export const InCloud = {
  get api(): InCloudClient {
    if (!g.inCloud?.api) {
      throw new Error(
        "InCloudClient is not initialized. Please call setInCloudApi() first."
      );
    }
    return g.inCloud.api as InCloudClient;
  },
  get live(): InLiveClient {
    if (!g.inCloud?.live) {
      throw new Error(
        "InLiveClient is not initialized. Please call setInCloudLive() first."
      );
    }
    return g.inCloud.live as InLiveClient;
  },
};

/*######################################(CLOUD)######################################*/
// Resolve Cloud Host from environment with secure defaults
function resolveCloudHost(): string {
  // Prefer explicit variables; support multiple keys across bundlers
  const candidates: Array<string | undefined> = [
    env.getRuntimeAware("IN_CLOUD_HOST"),
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
  },
});

const inLiveHost = cloudHost
  ? `${cloudHost.replace(/^http(s?):/, "ws$1:")}/ws`
  : "";
const live = new InLiveClient(inLiveHost);

/*######################################(SET)######################################*/

globalThis.inCloud.api = api;
globalThis.inCloud.live = live;

/*######################################(EXPORT)######################################*/
export { Currencies, MimeTypes };