import type { Signal } from "@in/teract/signal";
import type { TextInputProps } from "./text-input/type.ts";
import type { ChoiceInputProps } from "./choice-input/type.ts";

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
export type InputFieldProps = JSX.SharedProps &
  InputFieldSchema & {
    variant?: TextInputProps["type"] | ChoiceInputProps["type"];
    // | SelectInputProps["type"];
  };
