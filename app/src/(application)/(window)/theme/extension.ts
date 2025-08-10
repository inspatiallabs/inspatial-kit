import type { ExtensionSignal } from "@inspatial/renderer";
import { supportsFeature } from "@inspatial/run";
import { createExtension } from "@inspatial/renderer";

/*################################(Types)################################*/

interface ThemeProps {
  themeState: { mode: ExtensionSignal<string> };
}

/*################################(Extension)################################*/
/**
 * InSpatial Theme Extension
 * @description Applies and controls the theme of your application across renderers.
 */
export const InTheme = createExtension({
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
      import("./state.ts").then((m: ThemeProps) => {
        const { themeState } = m;
        const apply = () => {
          const mode = themeState.mode.peek?.() ?? themeState.mode.get?.();
          if (supportsFeature("hasDocument")) {
            if (mode) document.documentElement.setAttribute("data-theme", mode);
          }
        };
        apply();
        if (themeState.mode?.connect) {
          themeState.mode.connect(apply);
        }
      });
    },
  },
});
