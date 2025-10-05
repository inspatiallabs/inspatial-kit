import { type FilterPattern } from "@in/vader";

export interface LoaderContext {
  resourcePath: string;
  getOptions?(): LoaderOptions | undefined;
  callback?: (err: any, code?: string, map?: any) => void;
  sourceMap?: boolean;
}

export interface LoaderOptions {
  importSource?: string | string[];
  importSourcePaths?: string[];
}

export interface WebpackCompiler {
  context: string;
  options: {
    mode?: string;
    module?: {
      rules?: WebpackRule[];
    };
  };
}

export interface WebpackRule {
  test: ((filepath: string) => boolean) | RegExp;
  use: Array<{
    loader: string;
    options?: any;
  }>;
}

export interface InPackPluginOptions {
  include?: FilterPattern;
  exclude?: FilterPattern;
  importSource?: string | string[];
  enabled?: boolean;
  [key: string]: any;
}
