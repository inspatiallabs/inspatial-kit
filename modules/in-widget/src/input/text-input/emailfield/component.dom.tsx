import type { TextInputProps } from "../type.ts";
import { iss } from "@in/style";
import { EmailFieldStyle } from "./style.ts";

/*################################(TEXTFIELD)################################*/
export function EmailField(props: TextInputProps) {
  /***************************(Props)***************************/

  const {
    className,
    required,
    placeholder,
    disabled,
    $ref,
    ...rest
  } = props;

  /***************************(Render)***************************/
  return (
    <>
      <input
        type="email"
        required={required || false}
        placeholder={placeholder || "Email..."}
        className={iss(
          EmailFieldStyle.field.getStyle({
            className,
            format: props.format,
            size: (props as any).size,
            disabled,
          })
        )}
        disabled={disabled || false}
        $ref={$ref}
        {...rest}
      />
    </>
  );
}
