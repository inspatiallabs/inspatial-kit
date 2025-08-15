import type { ExtensionSignal } from "@inspatial/kit/extension";
import { envSupportsFeature } from "@inspatial/kit/env";
import { createExtension } from "@inspatial/kit/extension";

/*################################(Types)################################*/

interface ThemeExtensionProps {
  useTheme: { mode: ExtensionSignal<string> };
}

/*################################(Extension)################################*/
/**
 * InSpatial Theme Extension
 * @description Applies and controls the theme of your application across renderers.
 */
export function InTheme() {
  return createExtension({
    meta: {
      key: "intheme",
      name: "InTheme",
      description: "Theme management for InSpatial applications",
      author: { name: "InSpatial" },
      verified: true,
      price: 0,
      status: "installed",
      type: "Universal",
      version: "0.1.0",
    },
    scope: {
      clientScope: "progressive",
      editorScopes: ["Windows"],
    },
    lifecycle: {
      setup() {
        import("./state.ts").then((m: ThemeExtensionProps) => {
          const { useTheme } = m;
          const apply = () => {
            const mode = useTheme.mode.peek?.() ?? useTheme.mode.get?.();
            if (envSupportsFeature("hasDocument")) {
              if (mode)
                document.documentElement.setAttribute("data-theme", mode);
            }
          };
          apply();
          if (useTheme.mode?.connect) {
            useTheme.mode.connect(apply);
          }
        });
      },
    },
  });
}
