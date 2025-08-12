import {
  type RendererExtension,
  createExtension,
} from "../renderer/create-extension.ts";
import {
  InDOMTriggerProps,
  InUniversalTriggerProps,
  createTriggerHandle,
} from "../state/trigger/trigger-props.ts";
import { isSafeHref } from "./sanitize.ts";

export function InRoute(): RendererExtension {
  return createExtension({
    meta: {
      key: "inroute",
      name: "InRoute Extension",
      description: "Filesystem and programmatic routing integration",
      version: "0.1.0",
    },
    capabilities: {
      rendererProps: {
        onDirective(prefix, _key) {
          // Accept route directives, but actual behavior is handled by router/runtime
          if (prefix === "use") return (() => {}) as any;
          return undefined;
        },
      },
    },
    lifecycle: {
      setup() {
        // Register trigger-props so components can use on:tap, on:pointerenter, etc.
        try {
          InDOMTriggerProps();
          InUniversalTriggerProps();
        } catch {
          // trigger-props registration best-effort
        }

        // Minimal safety-only capture for plain anchors (block unsafe schemes)
        if ((globalThis as any).document) {
          const onClickCapture = (event: any) => {
            const link = (event.target as Element)?.closest?.("a");
            if (!link) return;
            const href = link.getAttribute("href") || "";
            if (!isSafeHref(href)) {
              event.preventDefault();
              event.stopPropagation();
            }
          };
          (globalThis as any).document.addEventListener(
            "click",
            onClickCapture,
            { capture: true }
          );

          // Prefetch via trigger: map pointerenter to a prefetch callback if route is exposed
          createTriggerHandle("pointerenter", (_node, _cb: any) => {
            const rt: any = (globalThis as any).InRoute;
            if (!rt || typeof rt.prefetch !== "function") return;
            _node.addEventListener("pointerenter", (e: any) => {
              const a = (e.target as Element)?.closest?.("a");
              if (!a) return;
              const href = a.getAttribute("href") || "";
              rt.prefetch(href);
            });
          });
        }
      },
    },
  });
}
