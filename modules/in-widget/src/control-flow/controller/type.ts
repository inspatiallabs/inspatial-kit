import type { Signal } from "@in/teract/signal";
import type { JSX } from "@in/runtime/types";
import type { StyleProps } from "@in/style";
import type { ControllerStyle } from "./style.ts";
import type { CheckboxProps, RadioProps, SwitchProps } from "@in/widget/input";
import type { ButtonProps, TabProps } from "@in/widget/ornament";
import type { TypographyProps } from "@in/widget/typography";

/*####################################(STATE-LIKE)####################################*/
export type StateLike<T> = {
  snapshot: () => T;
  batch?: (fn: (s: any) => void) => void;
} & { [K in keyof T]?: Signal<T[K]> };

/*####################################(STATE VALUE EXTRACTOR)####################################*/
export type StateValueFromLike<S> = S extends { snapshot: () => infer V }
  ? V
  : never;

/*####################################(PATH SEGMENTS)####################################*/
type PathSegments<S extends string> = S extends `${infer A}.${infer B}`
  ? [A, ...PathSegments<B>]
  : [S];

/*####################################(VALUE AT PATH)####################################*/
export type ValueAtPath<T, P extends string> = PathSegments<P> extends [infer H]
  ? H extends keyof T
    ? T[H]
    : never
  : PathSegments<P> extends [infer H, ...infer R]
  ? H extends keyof T
    ? ValueAtPath<NonNullable<T[H]>, Extract<R, string[]>[number]>
    : never
  : never;

/*####################################(FORM PATH)####################################*/
export type FormPath<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends (infer U)[]
        ? `${K}` | `${K}.[${number}]` | `${K}.[${number}].${FormPath<U>}`
        : T[K] extends object
        ? `${K}` | `${K}.${FormPath<T[K]>}`
        : `${K}`;
    }[keyof T & (string | number)]
  : never;

/*####################################(VALIDATE ON)####################################*/
type ValidateOn = "submit" | "change" | "blur" | "all";

/*####################################(OPTION ITEM)####################################*/
type OptionItem<V = any> = {
  label?: any;
  icon?: any;
  value: V;
  disabled?: boolean;
};

type ControllerMode = "manipulator" | "form";

/*####################################(FIELD KIND)####################################*/
const FieldKind = {
  alphabet: { component: ["textfield", "color"] as const },
  choice: {
    component: ["tab", "select", "radio", "switch", "checkbox"] as const,
  },
  numeric: { component: ["numberfield", "counter"] as const },
} as const;

type FieldKind = keyof typeof FieldKind;
type ComponentsOf<K extends FieldKind> =
  (typeof FieldKind)[K]["component"][number];

/*####################################(FIELD FOR)####################################*/
type FieldFor<V> = V extends string
  ?
      | {
          type: "alphabet";
          component: ComponentsOf<"alphabet">;
          props?: Record<string, any>;
        }
      | {
          type: "choice";
          component: ComponentsOf<"choice">;
          options: readonly OptionItem<V>[];
          props?: Record<string, any>;
        }
  : V extends number
  ?
      | {
          type: "numeric";
          component: ComponentsOf<"numeric">;
          props?: Record<string, any>;
        }
      | {
          type: "choice";
          component: ComponentsOf<"choice">;
          options: readonly OptionItem<V>[];
          props?: Record<string, any>;
        }
  : {
      type: "choice";
      component: ComponentsOf<"choice">;
      options: readonly OptionItem<V>[];
      props?: Record<string, any>;
    };

/*####################################(CONTROLLER SETTING ITEM)####################################*/
export type ControllerSettingItem<T, P extends FormPath<T> = FormPath<T>> = {
  name?: string;
  path?: P;
  initialValue?: ValueAtPath<T, P>;
  description?: string;
  field: FieldFor<ValueAtPath<T, P>>;
  validate?: (
    val: ValueAtPath<T, P>,
    values: Partial<T>
  ) => string | undefined | Promise<string | undefined>;
};

/*####################################(CONTROLLER CONFIG)####################################*/
export type ControllerConfig<
  TC extends Record<string, any>,
  TT extends Record<string, any> = TC
> = {
  id: string;
  mode?: ControllerMode;
  /** Whether to show reset buttons for when a field is dirty (changed) */
  hasReset?: boolean;
  /** Optional external state to operate on (embedded mode) */
  state?: StateLike<TT>;
  /** Optional path aliasing: controllerPath -> targetPath */
  map?: Partial<Record<FormPath<TC>, FormPath<TT> | string>>;
  /** Initial controller-owned state (when not embedded) */
  initialState?: TC;
  /** Initial controller-owned values (when in form mode) */
  initialValue?: Partial<TC>;
  validateOn?: ValidateOn;
  resolver?: (
    values: Partial<TC>
  ) =>
    | Promise<{ errors?: Record<string, string> }>
    | { errors?: Record<string, string> };
  settings?: ControllerSettingItem<TC>[];
  storage?: any;
};

/*####################################(REGISTERED FIELD)####################################*/
export type RegisteredField<T = any> = {
  name: string;
  value: Signal<T>;
  error: Signal<string | undefined>;
  touched: Signal<boolean>;
  isDirty: Signal<boolean>;
  oninput: (evOrVal: Event | any) => void;
  onchange: (ev?: Event) => void;
  onblur?: (ev?: Event) => void;
};

/*####################################(CONTROLLER PROPS)####################################*/
export type ControllerSettingsProps<T extends Record<string, any>> = {
  id: string;
  mode: ControllerMode;
  state: { [K in keyof T]: Signal<T[K]> };
  /** True if operating over an external target state */
  embedded?: boolean;
  /** Whether to show reset buttons for when a field is dirty (changed) */
  hasReset?: boolean;
  settings?: ControllerSettingItem<T>[];
  set: <P extends FormPath<T>>(
    path: P,
    value: ValueAtPath<T, P>,
    opts?: { validate?: boolean; touch?: boolean; dirty?: boolean }
  ) => void;
  register: <P extends FormPath<T>>(
    path: P,
    opts?: { validate?: boolean }
  ) => RegisteredField<ValueAtPath<T, P>>;
  validateOn?: ValidateOn;
  validateField?: <P extends FormPath<T>>(
    path: P,
    value?: ValueAtPath<T, P>
  ) => Promise<string | undefined>;
  validateForm?: () => Promise<Record<string, string | undefined>>;
  handleSubmit?: (
    success: (values: T) => void,
    error?: (errors: Record<string, string | undefined>) => void
  ) => (e?: Event) => void;
  reset?: (
    values?: Partial<T>,
    opts?: { keepDirty?: boolean; keepTouched?: boolean; keepError?: boolean }
  ) => void;
  _errors: Record<string, Signal<string | undefined>>;
  _touched: Record<string, Signal<boolean>>;
  _dirty: Record<string, Signal<boolean>>;
};

/*####################################(CONTROLLER (COMPONENT) ROOT PROPS)####################################*/
export type ControllerRootProps = StyleProps<typeof ControllerStyle.root> &
  JSX.SharedProps;

/*####################################(CONTROLLER (COMPONENT) WRAPPER PROPS)####################################*/
export type ControllerWrapperProps = StyleProps<
  typeof ControllerStyle.wrapper
> &
  JSX.SharedProps;

/*####################################(CONTROLLER (COMPONENT) RESET PROPS)####################################*/
export type ControllerResetProps = StyleProps<typeof ControllerStyle.reset> &
  ButtonProps;

/*####################################(CONTROLLER (COMPONENT) LABEL PROPS)####################################*/
export type ControllerLabelProps = StyleProps<typeof ControllerStyle.label> &
  TypographyProps;

/*####################################(CONTROLLER (COMPONENT) TAB PROPS)####################################*/
export type ControllerTabProps = StyleProps<typeof ControllerStyle.tab> &
  TabProps;

/*####################################(CONTROLLER (COMPONENT) COLOR PROPS)####################################*/
export type ControllerColorProps = StyleProps<typeof ControllerStyle.color> &
  JSX.SharedProps; // TODO: Change to ColorFieldProps when it is available

/*####################################(CONTROLLER (COMPONENT) NUMBERFIELD PROPS)####################################*/
export type ControllerNumberfieldProps = StyleProps<
  typeof ControllerStyle.numberfield
> &
  JSX.SharedProps; // TODO: Change to NumberFieldProps when it is available

/*####################################(CONTROLLER (COMPONENT) SWITCH PROPS)####################################*/
export type ControllerSwitchProps = StyleProps<typeof ControllerStyle.switch> &
  SwitchProps;

/*####################################(CONTROLLER (COMPONENT) CHECKBOX PROPS)####################################*/
export type ControllerCheckboxProps = StyleProps<
  typeof ControllerStyle.checkbox
> &
  CheckboxProps;

/*####################################(CONTROLLER (COMPONENT) RADIO PROPS)####################################*/
export type ControllerRadioProps = StyleProps<typeof ControllerStyle.radio> &
  RadioProps;

/*####################################(CONTROLLER (COMPONENT) NOT SUPPORTED PROPS)####################################*/
export type ControllerNotSupportedProps = StyleProps<
  typeof ControllerStyle.notSupported
> &
  JSX.SharedProps;
/*####################################(CONTROLLER PROPS)####################################*/

export type ControllerProps<T extends Record<string, any>> = {
  ctl?: ControllerSettingsProps<T> | null;
  hasReset?: boolean;
  children?: {
    root?: ControllerRootProps;
    wrapper?: ControllerWrapperProps;
    reset?: ControllerResetProps;
    label?: ControllerLabelProps;
    tab?: ControllerTabProps;
    color?: ControllerColorProps;
    numberfield?: ControllerNumberfieldProps;
    switch?: ControllerSwitchProps;
    checkbox?: ControllerCheckboxProps;
    radio?: ControllerRadioProps;
    notSupported?: ControllerNotSupportedProps;
  };
};
