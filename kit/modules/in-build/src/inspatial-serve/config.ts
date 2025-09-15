// deno-lint-ignore-file no-empty
import { InZero } from "@in/zero";
import { env, type RuntimeProps } from "@in/vader/env";

export type SourceMapMode = "linked" | "inline" | "external" | false;

export interface InServeConfig {
  server?: {
    httpPorts?: number[];
    wsPorts?: number[];
    host?: string;
    injectClient?: boolean;
    clientScriptUrl?: string;
    cacheControl?: string;
    assetRouteBase?: string;
  };
  paths?: {
    srcDir?: string;
    distDir?: string;
    htmlEntry?: string;
    htmlDist?: string;
    assetSrcDir?: string;
    assetDistDir?: string;
    favicon?: string;
    renderEntry?: string;
    cssInput?: string;
    cssOutput?: string;
    jsOutput?: string;
  };
  watch?: {
    include?: string[];
    includeFramework?: string[];
    exclude?: string[];
  };
  build?: {
    js?: {
      engine?: "inprocess" | "subprocess";
      entrypoints?: string[];
      outputDir?: string;
      output?: string;
      platform?: RuntimeProps
      minify?: boolean;
      codeSplitting?: boolean;
      format?: "esm" | "iife" | "cjs";
      inlineImports?: boolean;
      external?: string[];
      packages?: "bundle" | "external";
      sourcemap?: SourceMapMode;
      write?: boolean;
      htmlEntrypoints?: boolean;
    };
    css?: {
      input?: string;
      output?: string;
      contentGlobs?: string[];
    };
    html?: {
      enabled?: boolean;
    };
    timing?: {
      debounceMs?: number;
      waitAttempts?: number;
      waitIntervalMs?: number;
      cssStabilizeAttempts?: number;
      cssStabilizeIntervalMs?: number;
    };
  };
  discovery?: {
    renderSearch?: string[];
    kitRoots?: string[];
  };
}

export interface InServeResolvedConfig {
  server: Required<Required<InServeConfig>["server"]>;
  paths: Required<Required<InServeConfig>["paths"]>;
  watch: Required<Required<InServeConfig>["watch"]>;
  build: Required<Required<InServeConfig>["build"]> & {
    js: Required<NonNullable<InServeConfig["build"]>["js"]>;
    css: Required<NonNullable<InServeConfig["build"]>["css"]>;
    html: Required<NonNullable<InServeConfig["build"]>["html"]>;
    timing: Required<NonNullable<InServeConfig["build"]>["timing"]>;
  };
  discovery: Required<Required<InServeConfig>["discovery"]>;
}

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
      minify: true,
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
};

function normalizePath(p: string): string {
  return p.replace(/\\/g, "/");
}

function getEnv(name: string): string | undefined {
  try {
    const D = (globalThis as any).Deno;
    if (D?.env?.get) return D.env.get(name);
  } catch {}
  return undefined;
}

function parseNumberArray(value?: string): number[] | undefined {
  if (!value) return undefined;
  try {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n));
  } catch {
    return undefined;
  }
}

function parseStringArray(value?: string): string[] | undefined {
  if (!value) return undefined;
  try {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return undefined;
  }
}

function parseSourceMapMode(value?: string): SourceMapMode | undefined {
  if (!value) return undefined;
  const v = value.toLowerCase().trim();
  if (v === "false" || v === "off" || v === "none") return false;
  if (v === "linked" || v === "inline" || v === "external")
    return v as SourceMapMode;
  return undefined;
}

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
        parseNumberArray(getEnv("INSPATIAL_SERVE_HTTP_PORTS")) ||
        userCfg.server?.httpPorts ||
        defaultConfig.server.httpPorts,
      wsPorts:
        parseNumberArray(getEnv("INSPATIAL_SERVE_WS_PORTS")) ||
        userCfg.server?.wsPorts ||
        defaultConfig.server.wsPorts,
      host: userCfg.server?.host || defaultConfig.server.host,
      injectClient:
        (getEnv("INSPATIAL_SERVE_INJECT_CLIENT")?.toLowerCase() === "false"
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
          (getEnv("INSPATIAL_SERVE_JS_ENGINE") as any) ||
          userCfg.build?.js?.engine ||
          defaultConfig.build.js.engine,
        entrypoints:
          parseStringArray(getEnv("INSPATIAL_SERVE_JS_ENTRYPOINTS")) ||
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
            getEnv("INSPATIAL_SERVE_JS_SOURCEMAP")
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
  };

  return merged;
}
