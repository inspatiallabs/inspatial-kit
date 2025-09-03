import type { EnvironmentProvider } from "./environment.ts";

/**
 * Supported JavaScript runtimes
 */
export type Runtime = "deno" | "node" | "bun" | "browser";

/**
 * Runtime-specific environment providers
 */
export const runtimeProviders: Record<Runtime, () => EnvironmentProvider> = {
  node: () => ({
    get: (key: string) => (globalThis as any).process?.env[key],
  }),
  deno: () => ({
    get: (key: string) => (globalThis as any).Deno?.env.get(key),
  }),
  bun: () => ({
    get: (key: string) => (globalThis as any).Bun?.env[key],
  }),
  browser: () => ({
    get: (key: string) => {
      // In browser, try to get from import.meta.env first
      try {
        const importMetaEnv = (globalThis as any).import?.meta?.env;
        if (importMetaEnv && key in importMetaEnv) {
          const value = importMetaEnv[key];
          // Convert boolean values to strings for consistency
          return typeof value === "boolean" ? String(value) : value;
        }
      } catch {
        // Ignore import.meta access errors
      }

      // Fallback: try to access process.env if it exists (some bundlers provide it)
      try {
        return (globalThis as any).process?.env?.[key];
      } catch {
        // No environment variables available in pure browser environment
        return undefined;
      }
    },
  }),
};

/**
 * Detect current runtime
 */
export function detectRuntime(): Runtime | undefined {
  // Check for browser environment first (has window or import.meta but no server runtimes)
  const hasWindow = typeof (globalThis as any).window === "object";
  const hasImportMeta = typeof (globalThis as any).import?.meta === "object";
  const hasProcess = typeof (globalThis as any).process?.env === "object";
  const hasDeno = typeof (globalThis as any).Deno?.env?.get === "function";
  const hasBun = typeof (globalThis as any).Bun?.env === "object";

  // If we have Deno/Node/Bun specific APIs, detect those first
  if (hasDeno) return "deno";
  if (hasProcess && !hasWindow) return "node"; // Node.js without DOM
  if (hasBun) return "bun";

  // If we have browser indicators or process.env in a browser context, it's browser
  if (hasWindow || hasImportMeta || (hasProcess && hasWindow)) {
    return "browser";
  }

  // Default to browser for unknown environments
  return "browser";
}

/**
 * Runtime information interface
 */
export interface RuntimeInfo {
  name: Runtime;
  version?: string;
  platform?: string;
  supportsImportMeta: boolean;
  supportsProcessEnv: boolean;
  permissions?: {
    env: boolean;
    read?: boolean;
    write?: boolean;
  };
}

/**
 * Get detailed runtime information
 */
export function getRuntimeInfo(): RuntimeInfo | undefined {
  const runtime = detectRuntime();
  if (!runtime) return undefined;

  const info: RuntimeInfo = {
    name: runtime,
    supportsImportMeta: typeof (globalThis as any).import?.meta !== "undefined",
    supportsProcessEnv: typeof (globalThis as any).process?.env === "object",
  };

  switch (runtime) {
    case "node":
      info.version = (globalThis as any).process?.versions?.node;
      info.platform = (globalThis as any).process?.platform;
      info.permissions = { env: true };
      break;

    // deno-lint-ignore no-case-declarations
    case "deno":
      info.version = (globalThis as any).Deno?.version?.deno;
      info.platform = (globalThis as any).Deno?.build?.os;
      // Check Deno permissions
      const denoPermissions = (globalThis as any).Deno?.permissions;
      if (denoPermissions) {
        try {
          info.permissions = {
            env: true, // We'll assume env access since we're using InZero.env
          };
        } catch {
          info.permissions = { env: false };
        }
      }
      break;

    case "bun":
      info.version = (globalThis as any).Bun?.version;
      info.platform = (globalThis as any).process?.platform;
      info.permissions = { env: true };
      break;
  }

  return info;
}
