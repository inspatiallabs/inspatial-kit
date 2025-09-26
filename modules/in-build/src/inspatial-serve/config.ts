import { InZero } from "@in/zero";
import {
  env,
  normalizePath,
  parseNumberArray,
  parseStringArray,
} from "@in/vader";
import type {
  InServeResolvedConfig,
  InServeConfig,
  SourceMapMode,
} from "./type.ts";

/*##############################(DEFAULT CONFIG)##############################*/
const defaultConfig: InServeResolvedConfig = {
  server: {
    httpPorts: [6310, 6311, 6312],
    wsPorts: [8888, 8889, 8890],
    host: "localhost",
    injectClient: true,
    clientScriptUrl: "",
    cacheControl: "no-store",
    assetRouteBase: "/asset/",
  },
  paths: {
    srcDir: "./src",
    distDir: "./dist",
    htmlEntry: "./index.html",
    htmlDist: "./dist/index.html",
    assetSrcDir: "./src/asset",
    assetDistDir: "./dist/asset",
    favicon: "./src/asset/favicon.png",
    renderEntry: "./src/config/render.ts",
    cssInput: "./src/config/app.css",
    cssOutput: "./dist/kit.css",
    jsOutput: "./dist/bundle.js",
  },
  watch: {
    include: ["./src", "./index.html"],
    includeFramework: ["@inspatial/kit", "../kit/src", "../kit/modules"],
    exclude: ["node_modules", "dist", ".git"],
  },
  build: {
    js: {
      engine: "inprocess",
      entrypoints: [],
      outputDir: "./dist",
      output: "",
      platform: "browser",
      minify: false, // Code is beautiful when you can read it 😂
      codeSplitting: false,
      format: "esm",
      inlineImports: false,
      external: [],
      packages: "bundle",
      sourcemap: false,
      write: true,
      htmlEntrypoints: false,
    },
    css: {
      engine: "iss",
      input: "./src/config/app.css",
      output: "./dist/kit.css",
      contentGlobs: ["src/**/*.{ts,tsx,js,jsx}"],
    },
    html: {
      enabled: true,
    },
    timing: {
      debounceMs: 100,
      waitAttempts: 50,
      waitIntervalMs: 100,
      cssStabilizeAttempts: 10,
      cssStabilizeIntervalMs: 100,
    },
  },
  discovery: {
    renderSearch: [
      "./render.ts",
      "./src/render.ts",
      "./src/config/render.ts",
      "./config/render.ts",
      "./app/render.ts",
    ],
    kitRoots: ["@inspatial/kit", "../kit/src", "../kit/modules"],
  },
  appTriggerTypes: [],
};

/*##############################(PARSE SOURCE MAP MODE)##############################*/
function parseSourceMapMode(value?: string): SourceMapMode | undefined {
  if (!value) return undefined;
  const v = value.toLowerCase().trim();
  if (v === "false" || v === "off" || v === "none") return false;
  if (v === "linked" || v === "inline" || v === "external")
    return v as SourceMapMode;
  return undefined;
}

/*##############################(RESOLVE SERVE CONFIG)##############################*/
export async function resolveServeConfig(): Promise<InServeResolvedConfig> {
  let userCfg: InServeConfig = {};
  try {
    const denoJson = await InZero.readTextFile("./deno.json");
    const json = JSON.parse(denoJson || "{}");
    userCfg = (json?.inspatial?.serve || {}) as InServeConfig;
  } catch {
    // env parsing failure ignored
  }

  const merged: InServeResolvedConfig = {
    server: {
      httpPorts:
        parseNumberArray(env.get("INSPATIAL_SERVE_HTTP_PORTS")) ||
        userCfg.server?.httpPorts ||
        defaultConfig.server.httpPorts,
      wsPorts:
        parseNumberArray(env.get("INSPATIAL_SERVE_WS_PORTS")) ||
        userCfg.server?.wsPorts ||
        defaultConfig.server.wsPorts,
      host: userCfg.server?.host || defaultConfig.server.host,
      injectClient:
        (env.get("INSPATIAL_SERVE_INJECT_CLIENT")?.toLowerCase() === "false"
          ? false
          : undefined) ??
        userCfg.server?.injectClient ??
        defaultConfig.server.injectClient,
      clientScriptUrl:
        userCfg.server?.clientScriptUrl || defaultConfig.server.clientScriptUrl,
      cacheControl:
        userCfg.server?.cacheControl || defaultConfig.server.cacheControl,
      assetRouteBase:
        userCfg.server?.assetRouteBase || defaultConfig.server.assetRouteBase,
    },
    paths: {
      srcDir: normalizePath(
        userCfg.paths?.srcDir || defaultConfig.paths.srcDir
      ),
      distDir: normalizePath(
        userCfg.paths?.distDir || defaultConfig.paths.distDir
      ),
      htmlEntry: normalizePath(
        userCfg.paths?.htmlEntry || defaultConfig.paths.htmlEntry
      ),
      htmlDist: normalizePath(
        userCfg.paths?.htmlDist || defaultConfig.paths.htmlDist
      ),
      assetSrcDir: normalizePath(
        userCfg.paths?.assetSrcDir || defaultConfig.paths.assetSrcDir
      ),
      assetDistDir: normalizePath(
        userCfg.paths?.assetDistDir || defaultConfig.paths.assetDistDir
      ),
      favicon: normalizePath(
        userCfg.paths?.favicon || defaultConfig.paths.favicon
      ),
      renderEntry: normalizePath(
        userCfg.paths?.renderEntry || defaultConfig.paths.renderEntry
      ),
      cssInput: normalizePath(
        userCfg.paths?.cssInput || defaultConfig.paths.cssInput
      ),
      cssOutput: normalizePath(
        userCfg.paths?.cssOutput || defaultConfig.paths.cssOutput
      ),
      jsOutput: normalizePath(
        userCfg.paths?.jsOutput || defaultConfig.paths.jsOutput
      ),
    },
    watch: {
      include: (userCfg.watch?.include || defaultConfig.watch.include).map(
        normalizePath
      ),
      includeFramework: (
        userCfg.watch?.includeFramework || defaultConfig.watch.includeFramework
      ).map(normalizePath),
      exclude: (userCfg.watch?.exclude || defaultConfig.watch.exclude).map(
        normalizePath
      ),
    },
    build: {
      js: {
        engine:
          (env.get("INSPATIAL_SERVE_JS_ENGINE") as any) ||
          userCfg.build?.js?.engine ||
          defaultConfig.build.js.engine,
        entrypoints:
          parseStringArray(env.get("INSPATIAL_SERVE_JS_ENTRYPOINTS")) ||
          userCfg.build?.js?.entrypoints ||
          [],
        outputDir: normalizePath(
          userCfg.build?.js?.outputDir || defaultConfig.build.js.outputDir
        ),
        output: normalizePath(
          userCfg.build?.js?.output || defaultConfig.build.js.output
        ),
        platform:
          userCfg.build?.js?.platform || defaultConfig.build.js.platform,
        minify: userCfg.build?.js?.minify ?? defaultConfig.build.js.minify,
        codeSplitting:
          userCfg.build?.js?.codeSplitting ??
          defaultConfig.build.js.codeSplitting,
        format: userCfg.build?.js?.format || defaultConfig.build.js.format,
        inlineImports:
          userCfg.build?.js?.inlineImports ??
          defaultConfig.build.js.inlineImports,
        external:
          userCfg.build?.js?.external || defaultConfig.build.js.external,
        packages:
          userCfg.build?.js?.packages || defaultConfig.build.js.packages,
        sourcemap: ((): SourceMapMode => {
          // 1) ENV override wins
          const envOverride = parseSourceMapMode(
            env.get("INSPATIAL_SERVE_JS_SOURCEMAP")
          );
          if (envOverride !== undefined) return envOverride;
          // 2) User config if present
          if (userCfg.build?.js?.sourcemap !== undefined) {
            return userCfg.build.js.sourcemap as SourceMapMode;
          }
          // 3) Automatic: disable in production
          if (env.isProduction()) return false;
          // 4) Fallback to defaults
          return defaultConfig.build.js.sourcemap as SourceMapMode;
        })(),
        write: userCfg.build?.js?.write ?? defaultConfig.build.js.write,
        htmlEntrypoints:
          userCfg.build?.js?.htmlEntrypoints ??
          defaultConfig.build.js.htmlEntrypoints,
      },
      css: {
        engine: ((env.get("INSPATIAL_SERVE_CSS_ENGINE") as any) ||
          userCfg.build?.css?.engine ||
          defaultConfig.build.css.engine) as any,
        input: normalizePath(
          userCfg.build?.css?.input || defaultConfig.build.css.input
        ),
        output: normalizePath(
          userCfg.build?.css?.output || defaultConfig.build.css.output
        ),
        contentGlobs: (
          userCfg.build?.css?.contentGlobs ||
          defaultConfig.build.css.contentGlobs
        ).map(normalizePath),
      },
      html: {
        enabled:
          userCfg.build?.html?.enabled ?? defaultConfig.build.html.enabled,
      },
      timing: {
        debounceMs:
          userCfg.build?.timing?.debounceMs ??
          defaultConfig.build.timing.debounceMs,
        waitAttempts:
          userCfg.build?.timing?.waitAttempts ??
          defaultConfig.build.timing.waitAttempts,
        waitIntervalMs:
          userCfg.build?.timing?.waitIntervalMs ??
          defaultConfig.build.timing.waitIntervalMs,
        cssStabilizeAttempts:
          userCfg.build?.timing?.cssStabilizeAttempts ??
          defaultConfig.build.timing.cssStabilizeAttempts,
        cssStabilizeIntervalMs:
          userCfg.build?.timing?.cssStabilizeIntervalMs ??
          defaultConfig.build.timing.cssStabilizeIntervalMs,
      },
    },
    discovery: {
      renderSearch: (
        userCfg.discovery?.renderSearch || defaultConfig.discovery.renderSearch
      ).map(normalizePath),
      kitRoots: (
        userCfg.discovery?.kitRoots || defaultConfig.discovery.kitRoots
      ).map(normalizePath),
    },
    appTriggerTypes: [],
  };

  // App-level trigger type overrides
  try {
    const denoJson = await InZero.readTextFile("./deno.json");
    const json = JSON.parse(denoJson || "{}");
    const appLevel = json?.inspatial?.triggerTypes as string[] | undefined;
    if (Array.isArray(appLevel)) {
      merged.appTriggerTypes = appLevel.map(normalizePath);
    }
  } catch {}

  return merged;
}
