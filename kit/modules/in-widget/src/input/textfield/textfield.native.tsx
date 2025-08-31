import type { InputFieldProps } from "../type.ts";
import { InputFieldStyle } from "../style.ts";

/*################################(TEXTFIELD)################################*/
export function TextField(props: InputFieldProps) {
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
        type="text"
        required={required || false}
        placeholder={placeholder || "Text Value..."}
        className={InputFieldStyle.getStyle({ ...styleProps })}
        disabled={disabled || false}
        $ref={$ref}
        {...rest}
      />
    </>
  );
}
