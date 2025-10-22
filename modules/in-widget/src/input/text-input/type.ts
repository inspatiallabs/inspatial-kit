import type { JSX } from "@in/runtime/types";
import type { StyleProps } from "@in/style";
import type { NumberFieldStyle } from "./numberfield/style.ts";
import type { PasswordFieldStyle } from "./passwordfield/style.ts";
import type { SearchFieldStyle } from "./searchfield/style.ts";
import type { TextFieldStyle } from "./textfield/style.ts";
import type { EmailFieldStyle } from "./emailfield/style.ts";

/*####################################(TEXT INPUT PROPS)####################################*/
type TextInputSharedProps = JSX.SharedProps & {
  value?: string;
  placeholder?: string;
};

export type TextInputProps = TextInputSharedProps &
  TextInputSharedProps & {
    cta?: {
      clear?: () => void;
      action?: () => void;
    };
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
  TextInputSharedProps;

/*####################################(EMAILFIELD PROPS)####################################*/
export type EmailFieldProps = StyleProps<typeof EmailFieldStyle.wrapper> &
  TextInputSharedProps;

/*####################################(PASSWORDFIELD PROPS)####################################*/
export type PasswordFieldProps = StyleProps<typeof PasswordFieldStyle.wrapper> &
  TextInputSharedProps;

/*####################################(NUMBERFIELD PROPS)####################################*/
export type NumberFieldProps = StyleProps<typeof NumberFieldStyle.wrapper> &
  TextInputSharedProps;

/*####################################(TEXTFIELD PROPS)####################################*/
export type TextFieldProps = StyleProps<typeof TextFieldStyle.wrapper> &
  TextInputSharedProps;
