import type { TextInputProps } from "../type.ts";
import { iss } from "@in/style";
import { EmailFieldStyle } from "./style.ts";

/*################################(TEXTFIELD)################################*/
export function EmailField(props: TextInputProps) {
  /***************************(Props)***************************/

  const { id, className, required, placeholder, disabled, $ref, ...rest } = props;

  /***************************(Render)***************************/
  return (
    <>
      <input
        id={id}
        type="email"
        required={required || false}
        placeholder={placeholder || "Email..."}
        className={iss(
          EmailFieldStyle.field.getStyle({
            className,
            format: props.format,
            size: props.size,
            disabled: disabled,
            ...rest,
          })
        )}
        disabled={disabled || false}
        $ref={$ref}
        {...rest}
      />
    </>
  );
}
