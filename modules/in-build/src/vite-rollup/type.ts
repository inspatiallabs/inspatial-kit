import type { FilterPattern } from "@in/vader";

export interface InVitePluginOptions {
  include?: FilterPattern;
  exclude?: FilterPattern;
  importSource?: string | string[];
  enabled?: boolean;
  ssr?: boolean;
  setGlobalFlag?: boolean;
}

export interface TransformResult {
  code: string;
  map: any;
}

export interface ViteEnvArg {
  command: string;
  mode?: string;
}

export interface VitePluginConfig {
  define?: Record<string, any>;
}

export interface VitePlugin {
  name: string;
  apply?:
    | "build"
    | "serve"
    | ((this: void, config: any, env: ViteEnvArg) => boolean);
  enforce?: "pre" | "post";
  config?(user: VitePluginConfig, envArg: ViteEnvArg): VitePluginConfig | void;
  transform?(code: string, id: string, ssr?: boolean): TransformResult | null;
}
