import { envSupportsFeature } from "@in/vader/env";
import { createExtension, type ExtensionSignal } from "@in/teract/extension";
import { ThemeFormat, ThemeStyle } from "./style.ts";

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
          // 1) Inject baseline theme variables with lower precedence (separate <style>),
          //    and never override a user runtime theme if already present.
          // if (envSupportsFeature("hasDocument")) {
          //   try {
          //     const USER_THEME_ID = "in-theme-runtime";
          //     const BASELINE_ID = "in-theme-baseline";
          //     if (!document.getElementById(USER_THEME_ID)) {
          //       let el = document.getElementById(
          //         BASELINE_ID
          //       ) as HTMLStyleElement | null;
          //       if (!el) {
          //         el = document.createElement("style");
          //         el.id = BASELINE_ID;
          //         // Append early so any user theme inserted later overrides it by cascade order
          //         document.head.appendChild(el);
          //       }
          //       const rootVars = Object.entries(ThemeFormat.inspatial)
          //         .map(([k, v]) => `${k}:${v};`)
          //         .join("");
          //       const darkVars = Object.entries(
          //         (ThemeFormat.inspatial as any).dark || {}
          //       )
          //         .map(([k, v]) => `${k}:${v};`)
          //         .join("");
          //       const ATTR = "data-theme";
          //       el.textContent = `:root{${rootVars}}\n[${ATTR}="dark"]{${darkVars}}`;
          //     }
          //   } catch {}
          // }

          // // 2) Apply ThemeStyle defaults globally (class on <html>)
          // if (envSupportsFeature("hasDocument")) {
          //   try {
          //     const cls = ThemeStyle.getStyle?.() || "";
          //     if (cls) {
          //       for (const c of cls.split(/\s+/).filter(Boolean)) {
          //         document.documentElement.classList.add(c);
          //       }
          //     }
          //   } catch {}
          // }

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
