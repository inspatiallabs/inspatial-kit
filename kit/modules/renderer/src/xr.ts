import { AndroidXRRenderer } from "./android-xr.ts";
import { VisionOSRenderer } from "./vision-os.ts";
import { HorizonOSRenderer } from "./horizon-os.ts";
import { GPURenderer } from "./gpu.ts";
import type { EnvironmentInfo } from "@in/vader/env";
import {
  type RendererExtensions,
  composeExtensions,
} from "@in/extension";

export interface XROptions {
  rendererID?: string;
  environment?: EnvironmentInfo;
  extensions?: RendererExtensions;
}

/**
 * XR renderer for AndroidXR, VisionOS, and HorizonOS platforms
 */
export function XRRenderer(options: XROptions = {}): any {
  const { rendererID = "XR", environment } = options;
  const { setups } = composeExtensions(options.extensions);

  // Platform-specific XR implementation
  if (environment?.type === "androidxr") {
    return AndroidXRRenderer({
      rendererID: "AndroidXR",
      extensions: options.extensions,
    });
  } else if (environment?.type === "visionos") {
    return VisionOSRenderer({ rendererID: "VisionOS" });
  } else if (environment?.type === "horizonos") {
    return HorizonOSRenderer({ rendererID: "HorizonOS" });
  }

  // Generic XR fallback
  return GPURenderer({ rendererID, extensions: options.extensions });
}
