import type { InputFieldProps } from "./type.ts";
import { iss } from "@in/style/variant";
import * as TextInput from "./text-input/index.ts";
import { Choose } from "@in/widget/control-flow";

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
  };

  /***************************(Render)***************************/
  return (
    <Choose
      cases={[
        {
          when: variant === "textfield",
          children: <TextInput.TextField type="textfield" {...prop} {...rest} />,
        },
        {
          when: variant === "searchfield",
          children: <TextInput.SearchField type="searchfield" {...prop} {...rest} />,
        },
        {
          when: variant === "emailfield",
          children: <TextInput.EmailField type="emailfield" {...prop} {...rest} />,
        },
        {
          when: variant === "passwordfield",
          children: <TextInput.PasswordField type="passwordfield" {...prop} {...rest} />,
        },
        {
          when: variant === "numberfield",
          children: <TextInput.NumberField type="numberfield" {...prop} {...rest} />,
        },
      ]}
      otherwise={<TextInput.TextField type="textfield" {...prop} {...rest} />}
    />
  );
}
