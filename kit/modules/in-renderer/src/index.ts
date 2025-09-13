// Primary mode-based API (recommended approach)
export { createRenderer, type RenderModeOptions } from "./modes.ts";
export type {
  ExtensionSignal,
  RendererExtension,
  RendererExtensions,
  ComposedExtensions,
} from "@in/extension";
export { createExtension } from "@in/extension";
export {
  createRuntimeTemplate,
  applyRuntimeTemplate,
  type RuntimeTemplateApply,
} from "./runtime-template.ts";

// Base renderer factory (for advanced users)
export { createRenderer as createBaseRenderer } from "./create-renderer.ts";

// Individual renderers (for direct control - Only for advanced users and framework authors)
export { DOMRenderer as createDOMRenderer } from "@in/dom";
export { SSRRenderer as createSSRRenderer } from "@in/ssr";
export { AndroidXRRenderer as createAndroidXRRenderer } from "@in/android-xr";
export { VisionOSRenderer as createVisionOSRenderer } from "@in/vision-os";
export { HorizonOSRenderer as createHorizonOSRenderer } from "@in/horizon-os";
export { XRRenderer as createXRRenderer } from "@in/xr";
export { GPURenderer as createGPURenderer } from "@in/gpu";
export { NativeScriptRenderer as createNativeScriptRenderer } from "@in/nativescript";
