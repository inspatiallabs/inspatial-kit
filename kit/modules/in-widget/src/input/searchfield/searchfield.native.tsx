import type { InputFieldProps } from "../type.ts";
import { InputFieldStyle } from "../style.ts";

/*################################(TEXTFIELD)################################*/
export function SearchField(props: InputFieldProps) {
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
        type="search"
        required={required || false}
        placeholder={placeholder || "Search..."}
        className={InputFieldStyle.getStyle({ ...styleProps })}
        disabled={disabled || false}
        $ref={$ref}
        {...rest}
      />
    </>
  );
}
