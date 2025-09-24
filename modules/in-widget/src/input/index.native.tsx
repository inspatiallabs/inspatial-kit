import type { InputFieldProps } from "./type.ts";
import { iss } from "@in/style/variant";
import * as TextInput from "./text-input/index.ts";

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
    <>
      {(() => {
        switch (variant) {
          case "textfield":
            return <TextInput.TextField {...prop} {...rest} />;
          case "emailfield":
            return <TextInput.EmailField {...prop} {...rest} />;
          case "passwordfield":
            return <TextInput.PasswordField {...prop} {...rest} />;
          case "searchfield":
            return <TextInput.SearchField {...prop} {...rest} />;
          default:
            return <TextInput.TextField {...prop} {...rest} />;
        }
      })()}
    </>
  );
}
