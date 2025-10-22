import type { JSX } from "@in/runtime/types";
import type { StyleProps } from "@in/style";
import type { NumberFieldStyle } from "./numberfield/style.ts";
import type { PasswordFieldStyle } from "./passwordfield/style.ts";
import type { SearchFieldStyle } from "./searchfield/style.ts";
import type { TextFieldStyle } from "./textfield/style.ts";
import type { EmailFieldStyle } from "./emailfield/style.ts";

/*####################################(TEXT INPUT PROPS)####################################*/
export type TextInputProps = JSX.SharedProps & {
  value?: string;
  cta?: {
    clear?: () => void;
    action?: () => void;
  };
  placeholder?: string;
  type?:
    | "emailfield"
    | "passwordfield"
    | "textfield"
    | "searchfield"
    | "numberfield"
    | "phonefield"
    | "pinfield"
    | "urlfield"
    | "currencyfield"
    | "locationfield"
    | "datefield"
    | "timefield";
};

/*####################################(SEARCHFIELD PROPS)####################################*/
export type SearchFieldProps = StyleProps<typeof SearchFieldStyle.wrapper> &
  Omit<TextInputProps, "type">;

/*####################################(EMAILFIELD PROPS)####################################*/
export type EmailFieldProps = StyleProps<typeof EmailFieldStyle.wrapper> &
  Omit<TextInputProps, "type">;

/*####################################(PASSWORDFIELD PROPS)####################################*/
export type PasswordFieldProps = StyleProps<typeof PasswordFieldStyle.wrapper> &
  Omit<TextInputProps, "type">;

/*####################################(NUMBERFIELD PROPS)####################################*/
export type NumberFieldProps = StyleProps<typeof NumberFieldStyle.wrapper> &
  Omit<TextInputProps, "type">;

/*####################################(TEXTFIELD PROPS)####################################*/
export type TextFieldProps = StyleProps<typeof TextFieldStyle.wrapper> &
  Omit<TextInputProps, "type">;
