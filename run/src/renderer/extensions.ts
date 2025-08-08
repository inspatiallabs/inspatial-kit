export type PropSetter = (node: Element, value: unknown) => void;
export type DirectiveResolver = (
  prefix: string,
  key: string,
  prop?: string
) => PropSetter | undefined;

export interface RendererExtension {
  name: string;
  onDirective?: DirectiveResolver | DirectiveResolver[];
  namespaces?: Record<string, string>;
  tagNamespaceMap?: Record<string, string>;
  tagAliases?: Record<string, string>;
  propAliases?: Record<string, string>;
  /** Optional setup hook, called after renderer is created */
  setup?: (renderer: any) => void;
  /** Optional validation hook in dev builds */
  validate?: () => void;
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
    if (ext?.namespaces) Object.assign(namespaces, ext.namespaces);
    if (ext?.tagNamespaceMap)
      Object.assign(tagNamespaceMap, ext.tagNamespaceMap);
    if (ext?.tagAliases) Object.assign(tagAliases, ext.tagAliases);
    if (ext?.propAliases) Object.assign(propAliases, ext.propAliases);
    const r = ext?.onDirective;
    if (Array.isArray(r)) resolvers.push(...r.filter(Boolean));
    else if (r) resolvers.push(r);
    if (ext?.setup) setups.push(ext.setup);
    if (ext?.validate) {
      try {
        ext.validate();
      } catch (e) {
        console.warn(`[extensions] validate() failed for ${ext.name}:`, e);
      }
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
