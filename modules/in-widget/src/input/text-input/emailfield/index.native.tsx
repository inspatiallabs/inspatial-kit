import type { TextInputProps } from "../type.ts";
import { TextInputStyle } from "../style.ts";
import { iss } from "@in/style";

/*################################(TEXTFIELD)################################*/
export function EmailField(props: TextInputProps) {
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
    <>
      <input
        type="email"
        required={required || false}
        placeholder={placeholder || "Email..."}
        className={iss(TextInputStyle.getStyle({ ...styleProps }))}
        disabled={disabled || false}
        $ref={$ref}
        {...rest}
      />
    </>
  );
}
