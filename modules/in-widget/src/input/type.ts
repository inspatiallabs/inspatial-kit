import type { TextInputProps } from "./text-input/type.ts";
import type { ChoiceInputProps } from "./choice-input/type.ts";
import type { JSX } from "@in/runtime/types";

/*################################(INPUT FIELD PROPS)################################*/
export type InputFieldProps = {
  variant?: TextInputProps["type"] | ChoiceInputProps["type"];
  // | SelectInputProps["type"];
} & JSX.SharedProps;
