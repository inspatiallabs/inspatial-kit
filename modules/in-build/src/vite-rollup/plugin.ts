import { DEFAULT_INCLUDE_PATTERNS, createFilter } from "@in/vader"
import type { InVitePluginOptions, VitePlugin, VitePluginConfig, ViteEnvArg, TransformResult } from "./type.ts"

/*##################################(InVite)##################################*/
export function InVite(
  options: InVitePluginOptions = {}
): VitePlugin | undefined {
  const {
    include = DEFAULT_INCLUDE_PATTERNS,
    exclude,
    importSource = ["@inspatial/kit/build", "@in/build"],
    ssr = false,
    setGlobalFlag = true,
  } = options;

  const enabled = options.enabled ?? true;
  if (!enabled) return;

  const filter = createFilter(include, exclude);
  const processed = new Set<string>();

  const sources = Array.isArray(importSource)
    ? Array.from(new Set(importSource))
    : [importSource];

  const hmrBootstrap = (
    srcs: string[]
  ): string => `if (import.meta && import.meta.hot) {
  (async () => {
    let m: any = null;
    ${srcs
      .map((s) => `if (!m) { try { m = await import("${s}"); } catch {} }`)
      .join("\n    ")}
    if (!m || !m.setup) return;
    m.setup({
      data: import.meta.hot.data,
      current: import(/* @vite-ignore */ import.meta.url),
      accept() { import.meta.hot.accept() },
      dispose(cb) { import.meta.hot.dispose(cb) },
      invalidate(reason) {
        const hot = (import.meta as any).hot;
        if (hot && typeof hot.invalidate === "function") hot.invalidate(reason); else location.reload();
      }
    });
  })();
}`;

  return {
    name: "InVite",
    apply: "serve",
    enforce: "post",

    config(_user: VitePluginConfig, envArg: ViteEnvArg) {
      if (!setGlobalFlag) return;
      if (envArg.command === "serve") {
        return {
          define: {
            ...(typeof _user?.define === "object" ? _user.define : {}),
            "globalThis.__inspatialHMR": "true",
          },
        };
      }
    },
    transform(
      code: string,
      id: string,
      isSSR?: boolean
    ): TransformResult | null {
      if (isSSR && !ssr) return null;
      if (!filter(id)) return null;
      if (id.includes("node_modules")) return null;
      if (id.includes(".d.ts")) return null;
      if (processed.has(id)) return null;
      for (const s of sources) {
        if (id.endsWith(s) || id.includes(s)) return null;
      }
      processed.add(id);
      const appended = `${code}\n\n${hmrBootstrap(sources)}`;
      return { code: appended, map: null };
    },
  };
}
