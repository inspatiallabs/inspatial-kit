import {
  createFilter,
  type FilterPattern,
  DEFAULT_INCLUDE_PATTERNS,
} from "@in/vader";
import type {
  InPackPluginOptions,
  WebpackCompiler,
  WebpackRule,
} from "./type.ts";

// Cross-runtime path utilities
const pathUtils = {
  join: (...segments: string[]): string => {
    // Simple cross-runtime path joining
    return segments.join("/").replace(/\/+/g, "/");
  },
};

interface RequireLike {
  resolve(id: string): string;
}

// Cross-runtime require resolution (for webpack compatibility)
function createCrossRuntimeRequire(basePath: string): RequireLike {
  if (
    typeof (globalThis as any).Deno !== "undefined" &&
    (globalThis as any).Deno.realPathSync
  ) {
    // Deno environment - provide basic require-like functionality
    return {
      resolve: (id: string): string => {
        // For Deno, return the module ID as-is or resolve relative to base
        if (id.startsWith("@")) {
          return id; // Package imports
        }
        return new URL(id, `file://${basePath}/`).pathname;
      },
    };
  } else if (
    typeof (globalThis as any).require !== "undefined" &&
    (globalThis as any).require.resolve
  ) {
    // Node.js environment - use native require
    // Use dynamic import or require.resolve to avoid eval warnings
    try {
      const moduleObj = (globalThis as any).require("module");
      if (moduleObj && moduleObj.createRequire) {
        return moduleObj.createRequire(basePath);
      }
    } catch {
      // Fallback if module access fails
    }
    return (globalThis as any).require;
  } else {
    // Fallback for other environments
    return {
      resolve: (id: string): string => id,
    };
  }
}

export class InPack {
  private importSource: string | string[];
  private include?: FilterPattern;
  private exclude?: FilterPattern;
  private loaderOpts: any;
  private enabled?: boolean;

  /**
   * @param opts Configuration options
   */
  constructor(opts: InPackPluginOptions = {}) {
    const {
      include,
      exclude,
      importSource = ["@inspatial/kit/build", "@in/build"],
      enabled,
      ...loaderOpts
    } = opts;

    this.importSource = importSource;
    this.include = include;
    this.exclude = exclude;
    this.loaderOpts = { importSource, ...loaderOpts };
    this.enabled = enabled;
  }

  apply(compiler: WebpackCompiler): void {
    // Use webpack mode if available, fallback to NODE_ENV
    const webpackMode = compiler.options.mode;
    const enabled =
      this.enabled ??
      (webpackMode
        ? webpackMode !== "production"
        : typeof (globalThis as any).process !== "undefined"
        ? (globalThis as any).process.env?.NODE_ENV !== "production"
        : true);
    if (!enabled) return;

    const contextPath = pathUtils.join(compiler.context, "index.js");
    const requireFn = createCrossRuntimeRequire(contextPath);
    const sources = Array.isArray(this.importSource)
      ? Array.from(new Set(this.importSource))
      : [this.importSource];
    const importSourcePaths = sources.map((s) => requireFn.resolve(s));

    this.loaderOpts.importSource = sources;
    this.loaderOpts.importSourcePaths = importSourcePaths;

    const filter = createFilter(
      this.include || DEFAULT_INCLUDE_PATTERNS,
      this.exclude
    );

    const test = (filepath: string): boolean => {
      if (importSourcePaths.some((p) => filepath === p)) return true;
      return filter(filepath);
    };

    const rule: WebpackRule = {
      test,
      use: [
        {
          loader: "@inspatial/kit/build",
          options: this.loaderOpts,
        },
      ],
    };

    compiler.options.module ??= {};
    compiler.options.module.rules ??= [];
    compiler.options.module.rules.unshift(rule);
  }
}
