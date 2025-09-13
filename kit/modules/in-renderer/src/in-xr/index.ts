import { AndroidXRRenderer } from "@in/android-xr";
import { VisionOSRenderer } from "@in/vision-os";
import { HorizonOSRenderer } from "@in/horizon-os";
import { GPURenderer } from "@in/gpu";
import type { EnvironmentInfo } from "@in/vader/env/index.ts";
import { type RendererExtensions, composeExtensions } from "@in/extension";

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
