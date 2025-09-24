import { detectEnvironment, type EnvironmentInfo } from "@in/vader/env";
import type { RendererExtensions } from "@in/teract/extension";
import { createDebugContext, type DebugMode } from "@in/vader/debug";
import {
  applyRuntimeMarkup,
  type RuntimeMarkupApply,
} from "./runtime-markup.ts";

/**
 * Render Mode Configuration
 */
export interface RenderModeOptions {
  /** Primary render mode - determines the rendering strategy */
  mode?: "browser" | "xr" | "native" | "server" | "auto";
  /** Target within the mode for fine-grained control */
  target?: "interactive" | "static" | "ssr" | "auto";
  /** Platform preference (auto-detected if not specified) */
  platform?: "android" | "ios" | "web" | "desktop" | "auto";
  /** Environment detection override */
  environment?: EnvironmentInfo;
  /** Renderer extensions (typed) */
  extensions?: RendererExtensions;
  /** Debug mode - true, false, or configuration */
  debug?: DebugMode;
  /** Runtime template selection or applier. Defaults to jsx in browser-interactive */
  runtimeMarkup?:
    | "jsx"
    | "jsxsfc" // Single File Component (SFC) Powered by JSX --- NOT YET IMPLEMENTED
    | RuntimeMarkupApply;
}

/**
 * Create a renderer using the mode-based API
 * Provides smart defaults and automatic fallbacks
 */
export async function createRenderer(
  options: RenderModeOptions = {}
): Promise<any> {
  const {
    mode = "auto",
    target = "auto",
    platform = "auto",
    environment,
    extensions,
    debug = false,
    runtimeMarkup,
  } = options;

  // Create debug context
  const debugCtx = createDebugContext(debug);

  // Detect environment if not provided
  const env = environment || detectEnvironment();

  // Auto-log environment detection
  debugCtx?.logEnvironment(env);

  // Determine the actual mode to use
  const resolvedMode = mode === "auto" ? autoDetectMode(env) : mode;

  // Auto-log mode selection
  debugCtx?.logModeSelection(
    mode,
    resolvedMode,
    mode === "auto" ? "auto-detected" : undefined
  );

  // Create renderer based on resolved mode
  let renderer;

  switch (resolvedMode) {
    case "browser":
      renderer = await createBrowserRenderer({
        target,
        env,
        extensions,
        debugCtx,
        runtimeMarkup,
      });
      break;

    case "xr":
      renderer = await createXRRenderer({
        platform,
        env,
        extensions,
        debugCtx,
        runtimeMarkup,
      });
      break;

    case "native":
      renderer = await createNativeRenderer({
        platform,
        env,
        extensions,
        debugCtx,
        runtimeMarkup,
      });
      break;

    case "server":
      renderer = await createServerRenderer({
        env,
        extensions,
        debugCtx,
        runtimeMarkup,
      });
      break;

    default:
      // Ultimate fallback: DOM renderer (works in most environments)
      debugCtx?.debug.warn(
        "renderer",
        `Unknown mode "${resolvedMode}", falling back to browser mode`
      );
      renderer = await createBrowserRenderer({
        target: "auto",
        env,
        extensions,
        debugCtx,
        runtimeMarkup,
      });
  }

  // Attach debug context to renderer and global systems
  if (debugCtx && renderer) {
    renderer._debugCtx = debugCtx;

    // Set debug context globally for signals and components
    const { setSignalDebugContext } = await import("@in/teract/signal");
    const { setComponentDebugContext } = await import("@in/widget/component");

    setSignalDebugContext(debugCtx);
    setComponentDebugContext(debugCtx);

    // Also make it available globally for HOT and other systems
    (globalThis as any).debug = debugCtx.debug;
  }

  return renderer;
}

/**
 * Auto-detect the best mode based on environment
 */
function autoDetectMode(env: EnvironmentInfo): string {
  // XR environments get XR mode
  if (
    env.type === "androidxr" ||
    env.type === "visionos" ||
    env.type === "horizonos"
  ) {
    return "xr";
  }

  // Native mobile environments
  if (env.type === "nativescript" || env.type === "lynx") {
    return "native";
  }

  // Server-side environments without DOM
  if (
    (env.type === "node" || env.type === "deno" || env.type === "bun") &&
    !env.features.hasDOM
  ) {
    return "server";
  }

  // Default to browser mode for most cases (DOM, Capacitor, SSR with DOM, electron, web workers, etc.)
  return "browser";
}

/**
 * Create browser-mode renderer (DOM/HTML smart selection)
 */
async function createBrowserRenderer({
  target,
  env,
  extensions,
  debugCtx,
  runtimeMarkup,
}: any): Promise<any> {
  // Smart target detection within browser mode
  let resolvedTarget = target;
  if (target === "auto") {
    // If we're in SSR context or explicitly want static, use HTML
    if (env.type === "node" || env.type === "deno" || env.type === "bun") {
      resolvedTarget = "static";
    } else {
      resolvedTarget = "interactive";
    }
  }

  if (resolvedTarget === "static" || resolvedTarget === "ssr") {
    // Use SSR renderer for static/SSR
    const { SSRRenderer } = await import("@in/ssr");
    const renderer = SSRRenderer({
      rendererID: "Browser-Static",
      extensions,
    });

    debugCtx?.logRendererCreation("Browser-Static", renderer);
    return renderer;
  } else {
    // Use DOM renderer for interactive (DEFAULT for browser mode)
    const { DOMRenderer } = await import("@in/dom/renderer");
    const renderer = DOMRenderer({
      rendererID: "Browser-Interactive",
      extensions,
    });

    // Apply runtime template: default to jsx unless explicitly disabled (undefined => jsx)
    try {
      await applyRuntimeMarkup(
        renderer,
        runtimeMarkup === undefined ? "jsx" : runtimeMarkup
      );
    } catch (e) {
      debugCtx?.debug.warn("renderer", "Failed to apply runtime template", e);
    }
    debugCtx?.logRendererCreation("Browser-Interactive", renderer);
    return renderer;
  }
}

/**
 * Create XR-mode renderer (WebXR default with platform fallbacks)
 */
async function createXRRenderer({
  platform: _platform,
  env: _env,
  extensions,
  debugCtx,
  runtimeMarkup,
}: any): Promise<any> {
  const { XRRenderer } = await import("@in/xr");

  // XR mode defaults to WebXR (GenericXR) unless specific platform detected
  const renderer = XRRenderer({
    rendererID: "XR-Mode",
    environment: _env,
    extensions,
  });

  // Default to JSX runtime for XR when none specified (explicit setting overrides)
  try {
    await applyRuntimeMarkup(
      renderer,
      runtimeMarkup === undefined ? "jsx" : runtimeMarkup
    );
  } catch (e) {
    debugCtx?.debug.warn("renderer", "Failed to apply runtime template", e);
  }
  debugCtx?.logRendererCreation(`XR-${_env.type || "WebXR"}`, renderer);
  return renderer;
}

/**
 * Create native-mode renderer
 */
async function createNativeRenderer({
  platform: _platform,
  env: _env,
  extensions,
  debugCtx,
  runtimeMarkup,
}: any): Promise<any> {
  const { NativeScriptRenderer } = await import("@in/nativescript");

  const renderer = NativeScriptRenderer({
    rendererID: "Native-Mode",
    extensions,
  });

  // Default to JSX runtime for Native when none specified (explicit setting overrides)
  try {
    await applyRuntimeMarkup(
      renderer,
      runtimeMarkup === undefined ? "jsx" : runtimeMarkup
    );
  } catch (e) {
    debugCtx?.debug.warn("renderer", "Failed to apply runtime template", e);
  }
  debugCtx?.logRendererCreation("Native-NativeScript", renderer);
  return renderer;
}

/**
 * Create server-mode renderer (HTML for SSR)
 */
async function createServerRenderer({
  env: _env,
  extensions,
  debugCtx,
  runtimeMarkup,
}: any): Promise<any> {
  const { SSRRenderer } = await import("@in/ssr");

  const renderer = SSRRenderer({
    rendererID: "Server-SSR",
    extensions,
  });

  // Server-side generally should not apply client runtimes; apply only if explicitly requested
  if (runtimeMarkup) {
    try {
      await applyRuntimeMarkup(renderer, runtimeMarkup);
    } catch (e) {
      debugCtx?.debug.warn("renderer", "Failed to apply runtime template", e);
    }
  }
  debugCtx?.logRendererCreation("Server-SSR", renderer);
  return renderer;
}
