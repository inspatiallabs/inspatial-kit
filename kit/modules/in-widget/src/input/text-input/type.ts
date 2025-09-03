export interface TextInputProps extends JSX.SharedProps {
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
}
