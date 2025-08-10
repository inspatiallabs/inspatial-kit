import { detectEnvironment, getRendererType } from "./environment.ts";
import type { EnvironmentInfo } from "./environment.ts";
import { XRRenderer } from "./xr.ts";
import { NativeScriptRenderer } from "./nativescript.ts";
import type { RendererExtensions } from "./extensions.ts";

/**
 * Universal Renderer Configuration
 */
export interface UniversalExtensions {
  /** Force a specific renderer type instead of auto-detection */
  forceRenderer?: "dom" | "ssr" | "native" | "xr";
  /** Environment detection override */
  environment?: EnvironmentInfo;
  /** Renderer-specific options */
  extensions?: RendererExtensions;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Create a universal renderer that automatically detects the environment
 * and chooses the appropriate renderer implementation
 */
export async function createUniversalRenderer(
  options: UniversalExtensions = {}
): Promise<any> {
  const { forceRenderer, environment, extensions, debug = false } = options;

  // Detect environment
  const env = environment || detectEnvironment();

  if (debug) {
    console.log("🌍 InSpatial Universal Renderer");
    console.log("📊 Environment detected:", env);
  }

  // Determine renderer type
  const rendererType = forceRenderer || getRendererType(env);

  if (debug) {
    console.log("🎨 Renderer type selected:", rendererType);
  }

  // Create appropriate renderer based on environment
  switch (rendererType) {
    case "dom": {
      // Import DOM renderer dynamically to avoid issues in non-DOM environments
      const { DOMRenderer } = await import("./dom.ts");
      const renderer = DOMRenderer({ rendererID: "Universal-DOM", extensions });

      if (debug) {
        console.log("✅ DOM renderer created");
      }

      return renderer;
    }

    case "native": {
      // Create NativeScript renderer for native mobile apps
      const nativeRenderer = NativeScriptRenderer({
        rendererID: "Universal-NativeScript",
        extensions,
      });

      if (debug) {
        console.log("✅ NativeScript renderer created");
      }

      return nativeRenderer;
    }

    case "xr": {
      // Create XR renderer for AndroidXR, VisionOS, and HorizonOS
      const xrRenderer = XRRenderer({
        rendererID: "Universal-XR",
        environment: env,
        extensions,
      });

      if (debug) {
        console.log(`✅ XR renderer created for ${env.platform}`);
      }

      return xrRenderer;
    }

    case "ssr": {
      // Import SSR renderer for server-side environments
      const { SSRRenderer } = await import("./ssr.ts");
      const renderer = SSRRenderer({
        rendererID: "Universal-SSR",
        extensions,
      });

      if (debug) {
        console.log("✅ SSR renderer created");
      }

      return renderer;
    }

    default: {
      // Fallback to DOM renderer (most capable, works everywhere)
      const { DOMRenderer } = await import("./dom.ts");
      const renderer = DOMRenderer({
        rendererID: "Universal-DOM-Fallback",
        extensions,
      });

      if (debug) {
        console.log("✅ DOM renderer created (fallback)");
      }

      return renderer;
    }
  }
}

/**
 * Convenience function for quick universal renderer creation
 */
export function createRenderer(): Promise<any> {
  return createUniversalRenderer();
}

// Re-export environment utilities
export {
  detectEnvironment,
  getRendererType,
  supportsFeature,
} from "./environment.ts";

// Re-export individual renderers
export { DOMRenderer } from "./dom.ts";
export { SSRRenderer } from "./ssr.ts";
export { AndroidXRRenderer } from "./android-xr.ts";
export { VisionOSRenderer } from "./vision-os.ts";
export { HorizonOSRenderer } from "./horizon-os.ts";
export { GenericXRRenderer } from "./generic-xr.ts";
export { XRRenderer } from "./xr.ts";
export { NativeScriptRenderer } from "./nativescript.ts";
