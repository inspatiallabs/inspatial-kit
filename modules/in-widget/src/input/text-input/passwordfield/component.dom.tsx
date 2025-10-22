import type { TextInputProps } from "../type.ts";
import { iss } from "@in/style";
import { PasswordFieldStyle } from "./style.ts";
import { XStack } from "@in/widget/structure/stack/index.ts";

/*################################(TEXTFIELD)################################*/
export function PasswordField(props: TextInputProps) {
  /***************************(Props)***************************/

  const {
    format,
    state,
    size,
    className,
    required,
    placeholder,
    disabled,
    $ref,
    ...rest
  } = props;

  const styleProps = {
    format,
    state: disabled ? "disabled" : state,
    size,
    className,
  } as const;

  /***************************(Render)***************************/
  return (
    <XStack
      className={iss(PasswordFieldStyle.wrapper.getStyle({ ...styleProps }))}
    >
      <input
        type="password"
        required={required || false}
        placeholder={placeholder || "Password..."}
        className={iss(PasswordFieldStyle.field.getStyle({ ...styleProps }))}
        disabled={disabled || false}
        $ref={$ref}
        {...rest}
      />
    </XStack>
  );
}
