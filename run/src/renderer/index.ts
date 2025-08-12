// Primary mode-based API (recommended approach)
export { createRenderer, type RenderModeOptions } from "./modes.ts";
export type {
  ExtensionSignal,
  RendererExtension,
  RendererExtensions,
  ComposedExtensions,
} from "./create-extension.ts";
export { createExtension } from "./create-extension.ts";

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
