import type { PasswordFieldProps } from "../type.ts";
import { iss } from "@in/style";
import { PasswordFieldStyle } from "./style.ts";
import { XStack } from "@in/widget/structure/stack/index.ts";

/*################################(TEXTFIELD)################################*/
export function PasswordField(props: PasswordFieldProps) {
  /***************************(Props)***************************/

  const { radius, className, required, placeholder, disabled, $ref, ...rest } =
    props;

  /***************************(Render)***************************/
  return (
    <XStack
      className={iss(
        PasswordFieldStyle.wrapper.getStyle({
          className,
          format: props.format,
          radius,
          disabled: disabled,
          ...rest,
        })
      )}
    >
      <input
        type="password"
        required={required || false}
        placeholder={placeholder || "Password..."}
        className={iss(
          PasswordFieldStyle.field.getStyle({
            className,
            format: props.format,
            size: props.size,
            disabled: disabled,
            ...rest,
          })
        )}
        disabled={disabled}
        $ref={$ref}
        {...rest}
      />
    </XStack>
  );
}
