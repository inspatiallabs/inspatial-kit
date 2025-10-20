import type { JSX } from "@in/runtime/types";

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
export type SearchFieldProps = TextInputProps;

/*####################################(EMAILFIELD PROPS)####################################*/
export type EmailFieldProps = TextInputProps;

/*####################################(PASSWORDFIELD PROPS)####################################*/
export type PasswordFieldProps = TextInputProps;

/*####################################(NUMBERFIELD PROPS)####################################*/
export type NumberFieldProps = TextInputProps;

/*####################################(TEXTFIELD PROPS)####################################*/
export type TextFieldProps = TextInputProps;
