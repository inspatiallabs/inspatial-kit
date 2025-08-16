import type { ComponentProps } from "@in/kit";
import type { Signal } from "@in/teract/signal";
import type { InUniversalTriggerPropsType } from "@in/teract/trigger/index.ts";
import type { ISSProps as ISSPropsType } from "@in/style";

/*################################(JSX/Runtime Prop Types)################################*/
// Global declaration for JSX to be used with opinionated prop types and attributes
// per-app declarations: These become exposed at runtime e.g. `JSX.ISSProps` without
// the need for `import type { ISSProps } from "@in/style";` in each app.
/*########################################################################################*/

export {};

declare global {
  namespace JSX {
    // The JSX element type produced by the renderer
    // Keep minimal to satisfy TS without leaking details
    type Element = unknown;

    // Allow class widget or components if needed
    // Minimal to keep DX simple
    interface ElementClass {
      // optional render marker
      render?: (...args: any[]) => any;
    }

    // Tell TS which prop name holds children
    type ElementChildrenAttribute = { children: Record<PropertyKey, never> };

    // Shared / Common prop value types
    type PropLike = string | number | boolean | null | undefined;
    type ClassObject = Record<string, boolean | Signal<boolean>>;
    type ClassArray = Array<
      string | number | boolean | null | undefined | Signal<any>
    >;
    type ClassProps =
      | string
      | number
      | boolean
      | null
      | undefined
      | ClassObject
      | ClassArray
      | Signal<any>;
    type PlatformStyle = Record<string, PropLike>;
    /**InSpatial style sheet (ISS) properties */
    type ISSProps = ISSPropsType;
    type IOStyle = any | unknown; // very likely to be ISSProps
    type VisionOSStyle = any | unknown; // very likely to be ISSProps
    type AndroidXRStyle = any | unknown; // very likely to be ISSProps
    type AndroidStyle = any | unknown; // very likely to be ISSProps
    type HorizonOSStyle = any | unknown; // very likely to be ISSProps
    type WebStyle = ISSPropsType;
    type UniversalStyleProps =
      | string
      | PlatformStyle
      | {
          web?: PlatformStyle | WebStyle | undefined;
          ios?: PlatformStyle | IOStyle | undefined;
          android?: PlatformStyle | AndroidStyle | undefined;
          visionOS?: PlatformStyle | VisionOSStyle | undefined;
          androidXR?: PlatformStyle | AndroidXRStyle | undefined;
          horizonOS?: PlatformStyle | HorizonOSStyle | undefined;
          [platform: string]:
            | PlatformStyle
            | PropLike
            | WebStyle
            | IOStyle
            | AndroidStyle
            | VisionOSStyle
            | AndroidXRStyle
            | HorizonOSStyle
            | undefined;
        };

    // Directive-like props (style:*, class:*, ns:key)
    type StylePropKey = `style:${string}`;
    type ClassPropKey = `class:${string}`;
    type NamespacePropKey = `${string}:${string}`;
    type EventHandler = (...args: any[]) => any;
    type TriggerPropKey = `on:${InUniversalTriggerPropsType | string}`;
    type UniversalTriggerProps = InUniversalTriggerPropsType | string;

    // Attributes available on all intrinsic elements
    interface IntrinsicAttributes {
      key?: any;
      $ref?: ComponentProps["$ref"];
    }

    /**
     * SharedProps are a set of commonly used properties that can be applied to various widget or components across your application.
     * These props provide a consistent interface for frequently recurring attributes, enhancing reusability and maintainability.
     * Use this interface to extend a widget or component's props when you find yourself repeatedly defining the same properties.
     *
     * @example
     * ```tsx
     * interface MyComponentProps extends JSX.SharedProps {
     *   // Additional widget or component-specific props can be defined here
     * }
     *
     * function MyComponent({ children, className, asChild, disabled }: MyComponentProps) {
     *   // Component implementation
     * }
     * ```
     */
    type SharedProps = {
      /** Unique identifier for the widget or component. */
      id?: string;

      /** Reference to a widget or component instance. */
      $ref?: IntrinsicAttributes["$ref"];

      /** Trigger props are used to handle events and actions within the widget or component.
       *
       * @example
       * ```tsx
       * <Button on:tap={() => alert("Button tapped")} />
       * ```
       */
      on?: TriggerPropKey;

      /** Children are the elements that will be rendered within the widget or component. */
      children?: any;

      /** InSpatial style sheet class name(s) for the widget or component. */
      class?: ClassProps;

      /** InSpatial style sheet class name(s) for the widget or component. */
      className?: ClassProps;

      /** InSpatial style sheet properties for the widget or component. */
      style?: UniversalStyleProps;

      /** If true, renders the widget or component as a child element. */
      asChild?: boolean;

      /** If true, sets the widget or component to a disabled state. */
      disabled?: boolean;

      /** If true, sets the widget or component to a debug state. */
      debug?: boolean;

      // Permissive catch-all so base JSX works without strict prop maps
      [prop: string]: any;
    } & {
      // Specific directive groups with narrowed value types
      [K in StylePropKey]?:
        | string
        | number
        | null
        | undefined
        | UniversalStyleProps;
    } & {
      [K in ClassPropKey]?: boolean | string | number | null | undefined;
    } & {
      [K in TriggerPropKey]?: EventHandler | any;
    } & { [K in NamespacePropKey]?: unknown }; // Fallback for other namespaced directives (e.g., svg:xlink)

    // Default: All elements will default to InSpatial's shared props
    interface IntrinsicElements {
      [elemName: string]: SharedProps;
    }
  }
}
