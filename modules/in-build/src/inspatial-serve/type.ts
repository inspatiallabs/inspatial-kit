import type { RuntimeProps } from "@in/vader/env";

/*##############################(SOURCE MAP MODE TYPE)##############################*/
export type SourceMapMode = "linked" | "inline" | "external" | false;

/*##############################(IN SERVE CONFIG TYPE)##############################*/
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
      platform?: RuntimeProps;
      minify?: boolean;
      codeSplitting?: boolean;
      format?: "esm" | "iife";
      inlineImports?: boolean;
      external?: string[];
      packages?: "bundle" | "external";
      sourcemap?: SourceMapMode;
      write?: boolean;
      htmlEntrypoints?: boolean;
    };
    css?: {
      engine?: "iss" | "tailwind" | "none";
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

/*##############################(IN SERVE RESOLVED CONFIG TYPE)##############################*/
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
