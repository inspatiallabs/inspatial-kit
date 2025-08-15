// Primary mode-based API (recommended approach)
export { createRenderer, type RenderModeOptions } from "./modes.ts";
export type {
  ExtensionSignal,
  RendererExtension,
  RendererExtensions,
  ComposedExtensions,
} from "@in/extension";
export { createExtension } from "@in/extension";

// Base renderer factory (for advanced users)
export { createRenderer as createBaseRenderer } from "./create-renderer.ts";

// Individual renderers (for direct control - Only for advanced users and framework authors)
export { DOMRenderer } from "@in/dom";
export { SSRRenderer } from "@in/ssr";
export { AndroidXRRenderer } from "@in/android-xr";
export { VisionOSRenderer } from "@in/vision-os";
export { HorizonOSRenderer } from "@in/horizon-os";
export { XRRenderer } from "@in/xr";
export { GPURenderer } from "@in/gpu";
export { NativeScriptRenderer } from "@in/nativescript";
