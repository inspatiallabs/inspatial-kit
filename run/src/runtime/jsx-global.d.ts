import type { ComponentProps } from "../kit/component/index.ts";
import type { Signal } from "../signal/signal.ts";
import type { UniversalTriggerProps } from "../state/trigger/trigger-props.ts";

/*################################(JSX Prop Types)################################*/
// Allow JSX to be used with opinionated prop types and attributes per-app declarations
/*################################################################################*/

export {};

declare global {
  namespace JSX {
    // The JSX element type produced by the renderer
    // Keep minimal to satisfy TS without leaking details
    type Element = unknown;

    // Allow class components if needed
    // Minimal to keep DX simple
    interface ElementClass {
      // optional render marker
      render?: (...args: any[]) => any;
    }

    // Tell TS which prop name holds children
    type ElementChildrenAttribute = { children: Record<PropertyKey, never> };

    // Common prop value types
    type PropLike = string | number | boolean | null | undefined;
    type ClassObject = Record<string, boolean | Signal<boolean>>;
    type ClassArray = Array<
      string | number | boolean | null | undefined | Signal<any>
    >;
    type ClassLike =
      | string
      | number
      | boolean
      | null
      | undefined
      | ClassObject
      | ClassArray
      | Signal<any>;
    type PlatformStyle = Record<string, PropLike>;
    type UniversalStyle =
      | string
      | PlatformStyle
      | {
          web?: PlatformStyle | CSSStyleDeclaration | undefined;
          ios?: PlatformStyle;
          android?: PlatformStyle;
          [platform: string]:
            | PlatformStyle
            | PropLike
            | CSSStyleDeclaration
            | undefined;
        };

    // Directive-like props (style:*, class:*, ns:key)
    type StylePropKey = `style:${string}`;
    type ClassPropKey = `class:${string}`;
    type NamespacePropKey = `${string}:${string}`;
    type EventHandler = (...args: any[]) => any;
    type TriggerPropKey = `on:${UniversalTriggerProps | string}`;

    // Attributes available on all intrinsic elements
    interface IntrinsicAttributes {
      key?: any;
      $ref?: ComponentProps["$ref"];
    }

    type CommonProps = {
      id?: string;
      class?: ClassLike;
      className?: ClassLike;
      style?: UniversalStyle;
      children?: any;
      // Permissive catch-all so base JSX works without strict prop maps
      [prop: string]: any;
    } & {
      // Specific directive groups with narrowed value types
      [K in StylePropKey]?: string | number | null | undefined | UniversalStyle;
    } & {
      [K in ClassPropKey]?: boolean | string | number | null | undefined;
    } & {
      [K in TriggerPropKey]?: EventHandler | any;
    } & { [K in NamespacePropKey]?: unknown }; // Fallback for other namespaced directives (e.g., svg:xlink)

    // Default: allow any tag name with our common/templated props
    interface IntrinsicElements {
      [elemName: string]: CommonProps;
    }
  }
}
