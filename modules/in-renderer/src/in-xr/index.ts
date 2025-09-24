import { createAndroidXRRenderer } from "@in/android-xr";
import { createVisionOSRenderer } from "@in/vision-os";
import { createHorizonOSRenderer } from "@in/horizon-os";
import { createGPURenderer } from "@in/gpu";
import type { EnvironmentInfo } from "@in/vader/env";
import {
  type RendererExtensions,
  composeExtensions,
} from "@in/teract/extension";

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
    return createAndroidXRRenderer({
      rendererID: "AndroidXR",
      extensions: options.extensions,
    });
  } else if (environment?.type === "visionos") {
    return createVisionOSRenderer({ rendererID: "VisionOS" });
  } else if (environment?.type === "horizonos") {
    return createHorizonOSRenderer({ rendererID: "HorizonOS" });
  }

  // Generic XR fallback
  return createGPURenderer({ rendererID, extensions: options.extensions });
}

export { XRRenderer as createXRRenderer };
