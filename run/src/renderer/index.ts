// Primary mode-based API (recommended approach)
export { createRenderer, type RenderModeOptions } from "./modes.ts";
export type {
  ExtensionSignal,
  RendererExtension,
  RendererExtensions,
  ComposedExtensions,
} from "./extensions.ts";
export { createExtension } from "./extensions.ts";

// Legacy universal renderer (for backwards compatibility)
export {
  createUniversalRenderer,
  createRenderer as createAutoRenderer,
  detectEnvironment,
  supportsFeature,
} from "./universal.ts";

// Base renderer factory (for advanced users)
export { createRenderer as createBaseRenderer } from "./create-renderer.ts";

// Individual renderers (for direct control - Only for advanced users and framework authors)
export { DOMRenderer } from "./dom.ts";
export { SSRRenderer } from "./ssr.ts";
export { AndroidXRRenderer } from "./android-xr.ts";
export { VisionOSRenderer } from "./vision-os.ts";
export { HorizonOSRenderer } from "./horizon-os.ts";
export { GenericXRRenderer } from "./generic-xr.ts";
export { XRRenderer } from "./xr.ts";
export { NativeScriptRenderer } from "./nativescript.ts";
