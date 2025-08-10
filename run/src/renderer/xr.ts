import { AndroidXRRenderer } from "./android-xr.ts";
import { VisionOSRenderer } from "./vision-os.ts";
import { HorizonOSRenderer } from "./horizon-os.ts";
import { GenericXRRenderer } from "./generic-xr.ts";
import type { EnvironmentInfo } from "./environment.ts";
import { type RendererExtensions, composeExtensions } from "./extensions.ts";

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
  return GenericXRRenderer({ rendererID, extensions: options.extensions });
}
