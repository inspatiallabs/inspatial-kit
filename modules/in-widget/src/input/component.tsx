import type { InputFieldProps } from "./type.ts";
import { iss } from "@in/style/variant";
import { Choose } from "@in/widget/control-flow";
import * as TextInput from "./text-input/index.ts";
import * as ChoiceInput from "./choice-input/index.ts";
import type { RadioProps } from "./choice-input/radio/type.ts";
import type { SwitchProps } from "./choice-input/switch/type.ts";
import type { CheckboxProps } from "./choice-input/checkbox/type.ts";
import type {
  TextFieldProps,
  SearchFieldProps,
  EmailFieldProps,
  PasswordFieldProps,
  NumberFieldProps,
} from "./text-input/index.ts";

/*################################(TEXTFIELD)################################*/
export function InputField(props: InputFieldProps) {
  /***************************(Props)***************************/

  const { variant, format, state, className, placeholder, ...rest } = props;

  const prop = {
    // Temporary base shadow fallback as ISS has a shadow bug at runtime
    className: iss("var(--shadow-hollow)", className),
    state,
    format,
    placeholder,
    // ...rest,
  };

  /***************************(Render)***************************/
  return (
    <Choose
      cases={[
        /*=========================(TEXT INPUTS)=========================*/
        {
          when: variant === "textfield",
          children: (
            <TextInput.TextField {...prop} {...(rest as TextFieldProps)} />
          ),
        },
        {
          when: variant === "searchfield",
          children: (
            <TextInput.SearchField {...prop} {...(rest as SearchFieldProps)} />
          ),
        },
        {
          when: variant === "emailfield",
          children: (
            <TextInput.EmailField {...prop} {...(rest as EmailFieldProps)} />
          ),
        },
        {
          when: variant === "passwordfield",
          children: (
            <TextInput.PasswordField
              {...prop}
              {...(rest as PasswordFieldProps)}
            />
          ),
        },
        {
          when: variant === "numberfield",
          children: (
            <TextInput.NumberField {...prop} {...(rest as NumberFieldProps)} />
          ),
        },
        /*=========================(CHOICE INPUTS)=========================*/
        {
          when: variant === "checkbox",
          children: (
            <ChoiceInput.Checkbox {...prop} {...(rest as CheckboxProps)} />
          ),
        },
        {
          when: variant === "radio",
          children: <ChoiceInput.Radio {...prop} {...(rest as RadioProps)} />,
        },
        {
          when: variant === "switch",
          children: <ChoiceInput.Switch {...prop} {...(rest as SwitchProps)} />,
        },
        /*=========================(SELECT INPUTS (soon...))=========================*/
      ]}
      otherwise={<TextInput.TextField type="textfield" {...prop} />}
    />
  );
}
