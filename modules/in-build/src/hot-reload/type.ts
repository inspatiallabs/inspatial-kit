import { KEY_HOTWRAP, KEY_HOTWRAPPED } from "./const.ts";

/*################################(Hot Module Replacement Interfaces)################################*/
export interface HotModuleReplacement {
  accept(): void;
  dispose(callback: (data: any) => void): void;
  invalidate?(reason: string): void;
  data?: any;
}

/*################################(Extended Import Meta)################################*/
export interface ExtendedImportMeta {
  hot?: HotModuleReplacement;
  webpackHot?: any;
}

export interface HotReloadOptions {
  builtins: Set<Function>;
  makeDyn: (fn: Function, errorHandler: Function) => any;
  Component: new (...args: any[]) => any;
  createComponentRaw: (tpl: any, props?: any, ...children: any[]) => any;
}

export interface HotModuleData {
  [KEY_HOTWRAP]?: any;
}

export interface HotModule {
  data?: HotModuleData;
  accept(): void;
  dispose(callback: (data: HotModuleData) => void): void;
  invalidate?(reason: string): void;
}

export interface SetupOptions {
  data?: HotModuleData;
  current: Promise<any>;
  accept(): void;
  dispose(callback: (data: HotModuleData) => void): void;
  invalidate(reason: string): void;
}

export interface WrappedFunction extends Function {
  [KEY_HOTWRAP]?: any;
  [KEY_HOTWRAPPED]?: boolean;
  hot?: boolean;
  value?: Function;
}
