import type { StyleProps } from "@in/style";
import type { Signal } from "@in/teract/signal";
import type { InputFieldStyle } from "./style.ts";

/*################################(INPUT FIELD SCHEMA)################################*/
export interface InputFieldSchema {
  name?: string;
  unique?: "yes" | "no";
  required?: "yes" | "no";
  visible?: "yes" | "no";
  locked?: "yes" | "no";
  defaultValues?: unknown;
  hidden?: "yes" | "no";
  min?: number;
  max?: number;
  validation?: {
    type?: "auto" | "manual";
    message?: string;
    pattern?: string;
  };
  condition?: {
    field?: InputFieldProps["variant"];
    operator?: Signal<
      | "eq"
      | "neq"
      | "gt"
      | "gte"
      | "lt"
      | "lte"
      | "includes"
      | "excludes"
      | "isEmpty"
      | "isNotEmpty"
    >;
    value?: any;
  };
  blacklists?: unknown;
}

/*################################(INPUT FIELD PROPS)################################*/
export type InputFieldProps = StyleProps<typeof InputFieldStyle> &
  JSX.SharedProps &
  InputFieldSchema & {
    placeholder?: string;
    variant?:
      | "textfield"
      | "searchfield"
      | "numberfield"
      | "emailfield"
      | "phonefield"
      | "passwordfield"
      | "currencyfield"
      | "pinfield"
      | "urlfield"
      | "locationfield"
      | "datefield"
      | "timefield"
      | "filefield"
      | "switch"
      | "slider"
      | "checkbox"
      | "tag"
      | "joystick"
      | "intelligence"
      | "multiselect"
      | "counter"
      | "alignbox"
      | "togglegroup"
      | "choicegroup";
  };
