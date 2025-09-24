// deno-lint-ignore-file no-namespace
import type { Signal, InUniversalTriggerPropsType } from "@in/teract";
import type { ISSProps as ISSPropsType } from "@in/style";

/*################################(InSpatial Runtime Types)################################*/
// Standalone type definitions that can be imported or used globally
/*########################################################################################*/

// Extension trigger types - augmented by extensions at compile time
export namespace InSpatial {
  export interface ExtensionTriggers {
    [key: string]: any;
  }
}

export type GeneratedTriggers = InSpatial.ExtensionTriggers;

export namespace JSX {
  // The JSX element type produced by the renderer
  // Keep minimal to satisfy TS without leaking details
  export type Element = unknown;

  // Allow class widget or components if needed
  // Minimal to keep DX simple
  export interface ElementClass {
    // optional render marker
    render?: (...args: any[]) => any;
  }

  // Tell TS which prop name holds children
  export type ElementChildrenAttribute = { children: Record<PropertyKey, never> };

  // Shared / Common prop value types
  export type PropLike = string | number | boolean | null | undefined;
  export type ClassObject = Record<string, boolean | Signal<boolean>>;
  export type ClassArray = Array<
    string | number | boolean | null | undefined | Signal<any>
  >;
  export type ClassProps =
    | string
    | number
    | boolean
    | null
    | undefined
    | ClassObject
    | ClassArray
    | Signal<any>;
  export type PlatformStyle = Record<string, PropLike>;
  /**InSpatial style sheet (ISS) properties */
  export type ISSProps = ISSPropsType;
  export type IOStyle = any | unknown; // very likely to be ISSProps
  export type VisionOSStyle = any | unknown; // very likely to be ISSProps
  export type AndroidXRStyle = any | unknown; // very likely to be ISSProps
  export type AndroidStyle = any | unknown; // very likely to be ISSProps
  export type HorizonOSStyle = any | unknown; // very likely to be ISSProps
  export type WebStyle = ISSPropsType;
  export type UniversalStyleProps =
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
  export type StylePropKey = `style:${string}`;
  export type ClassPropKey = `class:${string}`;
  export type NamespacePropKey = `${string}:${string}`;
  export type EventHandler = (...args: any[]) => any;
  export type ExtensionTriggerKeys = keyof GeneratedTriggers;
  // Restrict known keys to enable IntelliSense.
  export type AllTriggerKeys = InUniversalTriggerPropsType | ExtensionTriggerKeys;
  export type TriggerPropKey = `on:${AllTriggerKeys}`;
  export type UniversalTriggerProps = AllTriggerKeys;
  export type KnownOnPropKey = `on:${
    | InUniversalTriggerPropsType
    | ExtensionTriggerKeys}`;
  export type KnownOnProps = {
    [K in KnownOnPropKey]?: K extends `on:${infer T}`
      ? T extends keyof GeneratedTriggers
        ? ((payload: GeneratedTriggers[T]) => any) | any
        : EventHandler | any
      : EventHandler | any;
  };

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
   * function MyComponent({ children, className, disabled }: MyComponentProps) {
   *   // Component implementation
   * }
   * ```
   */
  export type SharedProps = {
    /** Unique identifier for the widget or component. */
    id?: string;

    /** Reference to a widget or component instance. */
    $ref?: string;

    /** Trigger props are used to handle events and actions within the widget or component.
     *
     * @example
     * ```tsx
     * <Button on:tap={() => alert("Button tapped")} />
     * ```
     */
    on?: TriggerPropKey;

    /** Children are the elements that will be rendered within the widget or component. */
    children?: unknown;

    /** InSpatial style sheet class name(s) for the widget or component. */
    class?: ClassProps;

    /** InSpatial style sheet class name(s) for the widget or component. */
    className?: ClassProps;

    /** InSpatial style sheet properties for the widget or component. */
    style?: UniversalStyleProps;

    /** If true, sets the widget or component to a disabled state. */
    disabled?: boolean;

    /** If true, sets the widget or component to a debug state. */
    debug?: boolean;

    // Permissive catch-all so base JSX works without strict prop maps
    [prop: string]: any;
  } & KnownOnProps & {
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
      // Known, strongly-typed on: props
      [K in KnownOnPropKey]?: KnownOnProps[K];
    } & { [K in NamespacePropKey]?: unknown }; // Fallback for other namespaced directives (e.g., svg:xlink)

  // Default: All elements will default to InSpatial's shared props
  export interface IntrinsicElements {
    [elemName: string]: SharedProps;
  }
  // Attributes available on all intrinsic elements
  export interface IntrinsicAttributes extends SharedProps {
    key?: any;
  }

  /*################################(JSX/Runtime Generic Types)################################*/
  // From here onwards, we add generic types that are not specific to InSpatial
  /*########################################################################################*/

  /**
   * ActionPropsReturnValue is a generic interface for server action return values.
   * It provides a structure for returning data and/or errors from server actions.
   *
   * @interface ActionPropsReturnValue<T>
   * @template T - The type of the data being returned.
   * @property {T} [data] - The data returned from the server action.
   * @property {string | null} [error] - An error message, if any.
   *
   * @example
   * ```ts
   * async function myServerAction(): Promise<ActionPropsReturnValue<User>> {
   *   try {
   *     const user = await fetchUser();
   *     return { data: user };
   *   } catch (error) {
   *     return { error: error.message };
   *   }
   * }
   * ```
   */
  export interface ActionPropsReturnValue<T> {
    data?: T;
    error?: string | null;
  }

  /**
   * ActionProps defines the structure for action properties used in forms or server actions.
   * It includes fields for success messages, errors, data, and blur states.
   *
   * @interface ActionProps
   * @property {string} [success] - A success message.
   * @property {ActionStringMap} [errors] - A map of error messages.
   * @property {any} [data] - Any data associated with the action.
   * @property {ActionStringToBooleanMap} [blurs] - A map of blur states for form fields.
   *
   * @example
   * ```tsx
   * const actionProps: ActionProps = {
   *   success: "Form submitted successfully",
   *   errors: { email: "Invalid email format" },
   *   data: { userId: 123 },
   *   blurs: { email: true, password: false }
   * };
   * ```
   */
  export interface ActionProps {
    success?: string;
    errors?: ActionStringMap;
    data?: any;
    blurs?: ActionStringToBooleanMap;
  }

  export interface ActionStringMap {
    [key: string]: string;
  }

  export interface ActionStringToBooleanMap {
    [key: string]: boolean;
  }

  /**********************************(Form Mode Props)**********************************/

  /**
   * FormModeProps defines the mode of a form, indicating whether it's for creating or updating data.
   *
   * @interface FormModeProps
   * @property {"CREATE" | "UPDATE"} formMode - The current mode of the form.
   *
   * @example
   * ```tsx
   * function MyForm({ formMode }: FormModeProps) {
   *   return (
   *     <form>
   *       <h2>{formMode === "CREATE" ? "Create New Item" : "Update Item"}</h2>
   *     </form>
   *   );
   * }
   * ```
   */

  export interface FormModeProps {
    formMode: "CREATE" | "UPDATE";
  }

  /**********************************(Generic Types)**********************************/

  /** Read-write accessor. */
  //deno-lint-ignore no-explicit-any
  export type rw = any;

  /** Callback function. */
  // deno-lint-ignore ban-types
  export type callback = Function;

  /** Record. */
  export type record<T = unknown> = Record<PropertyKey, T>;

  /** Extract value type from Record. */
  export type RecordValue<T> = T extends Record<PropertyKey, infer U>
    ? U
    : never;

  /** Extract key type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map | Map}. */
  export type MapKey<T> = T extends Map<infer U, unknown> ? U : never;

  /** Extract value type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map | Map}. */
  export type MapValue<T> = T extends Map<unknown, infer U> ? U : never;

  /** Extract value type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set | Set}. */
  export type SetValue<T> = T extends Set<infer U> ? U : never;

  /** Extract key type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap | WeakMap}. */
  export type WeakMapKey<T> = T extends WeakMap<infer U, unknown> ? U : never;

  /** Extract value type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap | WeakMap}. */
  export type WeakMapValue<T> = T extends WeakMap<WeakKey, infer U> ? U : never;

  /** Extract value type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakSet | WeakSet}. */
  export type WeakSetValue<T> = T extends Set<infer U> ? U : never;

  /** Optional type. */
  export type Optional<T> = T | undefined;

  /** Nullable type. */
  export type Nullable<T> = T | null;

  /** Promisable type.  */
  export type Promisable<T> = T | Promise<T>;

  /** Arrayable type. */
  export type Arrayable<T> = T | Array<T>;

  /** Non `void` type. */
  export type NonVoid<T> = T extends void ? never : T;

  /** Extract function argument. */
  // deno-lint-ignore no-explicit-any
  export type Arg<
    T extends (...args: any[]) => any,
    index extends number = 0,
    required extends boolean = false
  > = required extends true
    ? NonNullable<Parameters<T>[index]>
    : Parameters<T>[index];

  /** Omit first argument from a function. */
  // deno-lint-ignore no-explicit-any
  export type OmitFirstArg<F> = F extends (
    _0: any,
    ...args: infer T
  ) => infer ReturnType
    ? (...args: T) => ReturnType
    : never;

  /** Deep partial type. */
  export type DeepPartial<T> = T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;

  /** Deep readonly type. */
  export type DeepReadonly<T> = T extends object
    ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
    : T;

  /** Deep non nullable type. */
  export type DeepNonNullable<T> = {
    [P in keyof T]: T[P] extends object
      ? DeepNonNullable<NonNullable<T[P]>>
      : NonNullable<T[P]>;
  };

  /** Typed array type. */
  export type TypedArray =
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array;

  /** Possible values to `typeof` operator. */
  export type TypeOf =
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "symbol"
    | "undefined"
    | "object"
    | "function";

  /** Check if a type is `any`. */
  export type IsAny<T> = boolean extends (T extends never ? true : false)
    ? true
    : false;

  /** Check if a type is not `any`. */
  export type IsNotAny<T> = IsAny<T> extends true ? false : true;
}
