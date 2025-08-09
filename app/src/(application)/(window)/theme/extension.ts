import type { RendererExtension, ExtensionSignal } from "@inspatial/renderer";
import { supportsFeature } from "@inspatial/run";

/*################################(Types)################################*/

interface ThemeProps {
  themeState: { mode: ExtensionSignal<string> };
}

/*################################(Extension)################################*/
/**
 * InSpatial Theme Extension
 * @description This extension is used to apply and control the theme of your application.
 */
export const InTheme: RendererExtension = {
  name: "InTheme",
  setup(_renderer?: any) {
    // Lazy import to avoid circular graph issues
    import("./state.ts").then((m: ThemeProps) => {
      const { themeState } = m;
      const apply = () => {
        const mode = themeState.mode.peek?.() ?? themeState.mode.get?.();
        // For DOM Renderers
        if (supportsFeature("hasDocument")) {
          if (mode) document.documentElement.setAttribute("data-theme", mode);
          return;
        }
        // Non-DOM environments (native/gpu/etc...): no-op for now
        // Future: integrate per-renderer theming here
      };
      // Initial apply
      apply();
      // Reactive updates
      if (themeState.mode?.connect) {
        themeState.mode.connect(apply);
      }
    });
  },
} as const;
