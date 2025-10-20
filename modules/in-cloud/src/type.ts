import type { Signal } from "@in/teract/signal";
// import type { InputFieldProps } from "@in/widget/input";

/*################################(ENTRY FIELD CONTROLS)################################*/
export interface EntryFieldControls {
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
    // field?: InputFieldProps["variant"];
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
