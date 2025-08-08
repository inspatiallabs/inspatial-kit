import type { RendererExtension, ExtensionSignal } from "@inspatial/renderer";

/*################################(Types)################################*/

interface ThemeProps {
  themeState: { mode: ExtensionSignal<string> };
}

/*################################(Extension)################################*/
export const ThemeExtension: RendererExtension = {
  name: "ThemeExtension",
  setup() {
    // Lazy import to avoid circular graph issues
    import("./state.ts").then((m: ThemeProps) => {
      const { themeState } = m;
      const apply = () => {
        const mode = themeState.mode.peek?.() ?? themeState.mode.get?.();
        if (mode) document.documentElement.setAttribute("data-theme", mode);
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
