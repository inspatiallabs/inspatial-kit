
## Extension

### Extending InSpatial Renderer/App

InSpatial Kit exposes a lightweight extension API. An extension is a plain object created with `createExtension({ meta, capabilities, lifecycle, ... })` and consumed by renderers via `extensions: [/* your extensions */]`.

- **Directive layer (renderer-agnostic)**: Provide `capabilities.rendererProps.onDirective(prefix, key, prop?)` to resolve namespaced props (e.g., `datax:title`, `svg:xlink:href`). Also provide `namespaces`, `tagNamespaceMap`, and `tagAliases` if needed.
- **Lifecycle**: Use `lifecycle.setup(renderer)` for one-time registration (e.g., registering trigger props). Validation hooks are optional (`validate`).
- **Events**: All event listeners must flow through the trigger prop system. Register new events with `createTrigger()` and ensure `InTrigger` is present.

### Demo: a tiny directive extension

Add a `datax:*` directive that maps to `data-*` attributes across platforms.

```js
// extensions/datax.ts
import { createExtension } from "@inspatial/kit/extension";

export function InDataX() {
  return createExtension({
    meta: {
      key: "InDataX",
      name: "datax",
      description: "Adds datax:* → data-* attribute resolution",
      verified: true,
      type: "Universal",
      version: "0.1.0",
    },
    capabilities: {
      rendererProps: {
        onDirective(prefix, key) {
          if (prefix !== "datax") return undefined;
          const attr = `data-${key}`;
          return (node, value) => {
            if (value == null || value === false)
              (node as any).removeAttribute?.(attr);
            else (node as any).setAttribute?.(attr, String(value));
          };
        },
      },
    },
    scope: {}, // ...
    permissions: {}, // ...
    lifecycle: {
      setup() {}, //...
    },
  });
}
```

Usage:

```js
import { createRenderer } from "@inspatial/kit/renderer";
import { InTrigger } from "@inspatial/kit/trigger/InTrigger"; // enables on:* props
import { InDataX } from "./extensions/datax";

createRenderer({
  mode: "auto",
  extensions: [InTrigger(), InDataX()],
}).then((InSpatial) => {
  InSpatial.render(document.getElementById("app"), () => (
    <button datax:variant="primary" on:tap={() => console.log("tap")}>
      OK
    </button>
  ));
});
```

Notes:

- The demo shows a directive resolver (no raw listeners). For custom events, register via the trigger bridge and keep `InTrigger()` installed so `on:*` props resolve.

### Extending InSpatial Cloud

```ts
import { CloudExtension } from "@inspatial/cloud";

export const userAgentExtension = new CloudExtension("userAgent", {
  label: "User Agent",
  description: "This extension provides user-agent parsing",
  config: {
    userAgentDebug: {
      type: "boolean",
      description: "Enable user agent printing to console",
      default: true,
    },
    userAgentEnabled: {
      type: "boolean",
      description: "Enable user agent parsing",
      default: true,
    },
  },
  requestLifecycle: {
    setup: [
      {
        name: "parseUserAgent",
        handler(inRequest, config) {
          if (!config.userAgentEnabled) return;

          const agent = parseUserAgent(inRequest.headers.get("user-agent"));
          inRequest.context.register("userAgent", agent);

          if (config.userAgentDebug) {
            const userAgent = inRequest.context.get("userAgent");
            console.log({ userAgent });
          }
        },
      },
    ],
  },
  install() {},
}) as CloudExtension;
```

