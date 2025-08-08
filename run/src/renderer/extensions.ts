import type { Signal } from "../signal/signal.ts"

export type PropSetter = (node: Element, value: unknown) => void;
export type DirectiveResolver = (
  prefix: string,
  key: string,
  prop?: string
) => PropSetter | undefined;

export type ExtensionSignal<T> = Pick<Signal<T>, "get" | "peek" | "connect" | "subscribe">

/**
 * Renderer-agnostic extension surface
 * Keep this minimal and generic.
 */
export interface RendererExtension {
  name: string;
  /** Global setup hook, called after renderer is created */
  setup?: (renderer: any) => void;
  /** Optional validation hook in dev builds */
  validate?: () => void;
  /** Renderer-specific capability buckets */
  props?: {
    onDirective?: DirectiveResolver | DirectiveResolver[];
    namespaces?: Record<string, string>;
    tagNamespaceMap?: Record<string, string>;
    tagAliases?: Record<string, string>;
    propAliases?: Record<string, string>;
  };
}

export type RendererExtensions =
  | RendererExtension
  | RendererExtension[]
  | undefined;

export interface NormalizedExtensions {
  onDirective?: DirectiveResolver;
  namespaces: Record<string, string>;
  tagNamespaceMap: Record<string, string>;
  tagAliases: Record<string, string>;
  propAliases: Record<string, string>;
  setups: Array<(renderer: any) => void>;
}

export function normalizeExtensions(
  extensions?: RendererExtensions
): NormalizedExtensions {
  const extArray = (
    !extensions ? [] : Array.isArray(extensions) ? extensions : [extensions]
  ) as RendererExtension[];

  const namespaces: Record<string, string> = {};
  const tagNamespaceMap: Record<string, string> = {};
  const tagAliases: Record<string, string> = {};
  const propAliases: Record<string, string> = {};
  const resolvers: DirectiveResolver[] = [];
  const setups: Array<(renderer: any) => void> = [];

  for (const ext of extArray) {
    // Global setup
    if (ext?.setup) setups.push(ext.setup);
    if (ext?.validate) {
      try {
        ext.validate();
      } catch (e) {
        console.warn(`[extensions] validate() failed for ${ext.name}:`, e);
      }
    }

    // Props capability (renderer-agnostic directive layer)
    const props = ext?.props;
    if (props) {
      if (props.namespaces) Object.assign(namespaces, props.namespaces);
      if (props.tagNamespaceMap) Object.assign(tagNamespaceMap, props.tagNamespaceMap);
      if (props.tagAliases) Object.assign(tagAliases, props.tagAliases);
      if (props.propAliases) Object.assign(propAliases, props.propAliases);
      const r = props.onDirective;
      if (Array.isArray(r)) resolvers.push(...r.filter(Boolean));
      else if (r) resolvers.push(r);
    }
  }

  let onDirective: DirectiveResolver | undefined;
  if (resolvers.length) {
    onDirective = (prefix, key, prop) => {
      for (const r of resolvers) {
        const setter = r(prefix, key, prop);
        if (setter) return setter;
      }
      return undefined;
    };
  }

  return {
    onDirective,
    namespaces,
    tagNamespaceMap,
    tagAliases,
    propAliases,
    setups,
  };
}
