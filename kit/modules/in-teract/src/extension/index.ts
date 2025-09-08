import type { Signal } from "@in/teract/signal";

/*################################(Prop Setter & Directive Resolver)################################*/

export type PropSetter = (node: Element, value: unknown) => void;
export type DirectiveResolver = (
  prefix: string,
  key: string,
  prop?: string
) => PropSetter | undefined;

/*################################(Extension Signals)################################*/
export type ExtensionSignal<T> = Pick<
  Signal<T>,
  "get" | "peek" | "connect" | "subscribe"
>;

/*################################(Extension Metadata)################################*/

// Marketplace and identity metadata
export interface ExtensionMeta {
  key: string;
  name: string;
  description?: string;
  icon?: string;
  media?: string[];
  author?: { name: string; url?: string; contact?: string };
  verified?: boolean;
  price?: number; // default 0
  status?: "installed" | "uninstalled";
  type?: "InDev" | "NonDev" | "Universal";
  version?: string;
  compatibility?: {
    minRunVersion?: string;
    maxRunVersion?: string;
    minCloudVersion?: string;
    engines?: string[];
  };
}

/*################################(Extension Scopes)################################*/
// Scope model
export type ServerScope = "mcp" | "incloud" | "devserver";
export type ClientScope = "popup" | "progressive" | "full";
export type EditorScope = "Windows" | "Scenes" | "Cloud" | "InDev";

export interface WindowsSubScopes {
  numbers?: string[]; // e.g., cornerRadius, opacity
  strings?: string[]; // e.g., fontFamily, fontWeight
}

export interface ExtensionScopeConfig {
  serverScope?: ServerScope;
  clientScope?: ClientScope;
  editorScopes?: EditorScope[];
  subScopes?: {
    windows?: WindowsSubScopes;
    // future: scenes?: {...}, cloud?: {...}
  };
}

/*################################(Extension Permissions)################################*/
// Permissions
export interface ExtensionPermissions {
  network?: true | { domains: string[] };
  storage?: { local?: boolean; session?: boolean; indexed?: boolean };
  env?: { keys: string[] };
  renderer?: { props?: boolean; directives?: string[] };
  triggers?: { needs: string[] };
  cloud?: { apiGroups?: string[]; roles?: string[] };
  files?: { read?: string[]; write?: string[] };
}

/*################################(Extension Triggers)################################*/
// Trigger declaration for extensions
export interface TriggerDeclaration<T = any> {
  handler: (node: Element, value: any) => void | (() => void);
  type?: T; // Type hint for TypeScript
  description?: string;
  platforms?: string[]; // Optional platform restrictions
}

export type ExtensionTriggers = Record<string, TriggerDeclaration>;

/*################################(Extension Capabilities)################################*/
// Capability buckets
export interface RendererPropsCaps {
  onDirective?: DirectiveResolver | DirectiveResolver[];
  namespaces?: Record<string, string>;
  tagNamespaceMap?: Record<string, string>;
  tagAliases?: Record<string, string>;
  // propAliases removed: prefer native prop vs attribute resolution in renderer
}

export interface ExtensionCapabilities {
  rendererProps?: RendererPropsCaps;
  /**
   * Create Triggers for Extension
   */
  triggers?: ExtensionTriggers; // Extension-defined triggers
  // uiSurfaces, serverHooks, settings, i18n can be added progressively
}

/*################################(Extension Lifecycle)################################*/
// Lifecycle
export interface ExtensionLifecycle {
  onInstall?: () => void | Promise<void>;
  onUninstall?: () => void | Promise<void>;
  onEnable?: () => void | Promise<void>;
  onDisable?: () => void | Promise<void>;
  setup?: (renderer?: any) => void | Promise<void>;
  validate?: () => void;
}

/*################################(Extension Props)################################*/
export interface ExtensionProps {
  meta: ExtensionMeta;
  scope?: ExtensionScopeConfig;
  permissions?: ExtensionPermissions;
  capabilities?: ExtensionCapabilities;
  lifecycle?: ExtensionLifecycle;
}

/*################################(Extension Renderer)################################*/
/**
 * RendererExtension (next-gen) — the single canonical shape used everywhere.
 * It carries metadata plus the renderer-facing surface.
 */
/*##################################################################################*/
export interface RendererExtension {
  // Renderer surface consumed by renderers/composeExtensions
  name: string;

  // Rich metadata for host/runtime and marketplace
  meta: ExtensionMeta;
  scope?: ExtensionScopeConfig;
  permissions?: ExtensionPermissions;
  capabilities?: ExtensionCapabilities;
  lifecycle?: ExtensionLifecycle;
}

export type RendererExtensions =
  | RendererExtension
  | RendererExtension[]
  | undefined;

/*################################(Normalized Extensions)################################*/
export interface ComposedExtensions {
  onDirective?: DirectiveResolver;
  namespaces: Record<string, string>;
  tagNamespaceMap: Record<string, string>;
  tagAliases: Record<string, string>;
  setups: Array<(renderer: any) => void>;
  triggers: Map<string, TriggerDeclaration>; // Collected triggers from all extensions
}

export function composeExtensions(
  extensions?: RendererExtensions
): ComposedExtensions {
  const extArray = (
    !extensions ? [] : Array.isArray(extensions) ? extensions : [extensions]
  ) as RendererExtension[];

  const namespaces: Record<string, string> = {};
  const tagNamespaceMap: Record<string, string> = {};
  const tagAliases: Record<string, string> = {};
  const resolvers: DirectiveResolver[] = [];
  const setups: Array<(renderer: any) => void> = [];
  const triggers = new Map<string, TriggerDeclaration>();

  for (const ext of extArray) {
    // Global setup & validation from lifecycle
    const setup = ext?.lifecycle?.setup;
    if (setup) setups.push(setup);
    const validate = ext?.lifecycle?.validate;
    if (validate) {
      try {
        validate();
      } catch (e) {
        console.warn(`[extensions] validate() failed for ${ext.name}:`, e);
      }
    }

    // Props capability (renderer-agnostic directive layer)
    const props = ext?.capabilities?.rendererProps;
    if (props) {
      if (props.namespaces) Object.assign(namespaces, props.namespaces);
      if (props.tagNamespaceMap)
        Object.assign(tagNamespaceMap, props.tagNamespaceMap);
      if (props.tagAliases) Object.assign(tagAliases, props.tagAliases);
      const r = props.onDirective;
      if (Array.isArray(r)) resolvers.push(...r.filter(Boolean));
      else if (r) resolvers.push(r);
    }

    // Collect triggers from extension
    const extTriggers = ext?.capabilities?.triggers;
    if (extTriggers) {
      for (const [name, declaration] of Object.entries(extTriggers)) {
        triggers.set(name, declaration);
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
    setups,
    triggers,
  };
}

/*################################(Create Extension)################################*/
/**
 * Create a unified InSpatial extension. Returns the canonical RendererExtension
 * shape that renderers consume and hosts use for metadata/scoping.
 */
/*##################################################################################*/
export function createExtension(props: ExtensionProps): RendererExtension {
  const { meta, scope, permissions, capabilities, lifecycle } = props;

  const rendererExt: RendererExtension = {
    name: meta.name || meta.key,
    meta,
    scope,
    permissions,
    capabilities,
    lifecycle,
  };

  return rendererExt;
}
