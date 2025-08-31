import type { InputFieldProps } from "../type.ts";
import { TextField } from "../textfield/textfield.native.tsx";
import { iss } from "@in/style/variant/index.ts";
import { SearchField } from "../searchfield/searchfield.native.tsx";
import { EmailField } from "../emailfield/emailfield.native.tsx";
import { PasswordField } from "../passwordfield/passwordfield.native.tsx";

/*################################(TEXTFIELD)################################*/
export function InputField(props: InputFieldProps) {
  /***************************(Props)***************************/

  const { variant, format, state, className, placeholder, ...rest } = props;

  const prop = {
    // Temporary base shadow fallback as ISS has a shadow bug at runtime
    className: iss("shadow-(--shadow-hollow)", className),
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
            return <TextField {...prop} {...rest} />;
          case "emailfield":
            return <EmailField {...prop} {...rest} />;
          case "passwordfield":
            return <PasswordField {...prop} {...rest} />;
          case "searchfield":
            return <SearchField {...prop} {...rest} />;
          default:
            return <TextField {...prop} {...rest} />;
        }
      })()}
    </>
  );
}
