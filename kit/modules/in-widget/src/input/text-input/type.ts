export type TextInputProps = JSX.SharedProps & {
  value?: string;
  cta?: {
    clear?: () => void;
    action?: () => void;
  };
  placeholder?: string;
  type:
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
