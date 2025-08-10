/*################################(InSpatial Serve Renderer Extension)################################*/
// ------------------------------
// Renderer Extension Integration
// ------------------------------
import { createExtension } from "../../renderer/extensions.ts";
import { detectEnvironment } from "../../renderer/environment.ts";
import { InSpatialServe } from "./core.ts";

/**
 * Renderer extension that boots the dev server when executed in a server
 * environment (Deno/Node/Bun without DOM). No-ops in the browser.
 */
export const InServe = createExtension({
  meta: {
    key: "inserve",
    name: "InSpatialServe",
    description: "InSpatial development server with build and hot reload",
    author: { name: "InSpatial" },
    verified: true,
    price: 0,
    status: "installed",
    type: "InDev",
    version: "0.1.0",
  },
  scope: {
    serverScope: "devserver",
    editorScopes: ["InDev"],
  },
  permissions: {
    files: { read: ["./src/**", "./index.html"], write: ["./dist/**"] },
    network: true,
  },
  lifecycle: {
    async setup() {
      try {
        const env = detectEnvironment();
        const isServerSide =
          (env.type === "deno" || env.type === "node" || env.type === "bun") &&
          !env.features.hasDOM;

        if (!isServerSide) return; // only run on server-side CLIs

        // Prevent duplicate boots in the same process
        const flagKey = "__inspatialServeStarted";
        if ((globalThis as any)[flagKey]) return;
        (globalThis as any)[flagKey] = true;

        await new InSpatialServe().run();
      } catch (_) {
        // Silently ignore in environments where serving isn't possible
      }
    },
  },
});
