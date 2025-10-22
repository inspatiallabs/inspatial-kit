import type { TextInputProps } from "../type.ts";
import { iss } from "@in/style";
import { TextFieldStyle } from "./style.ts";
import { XStack } from "@in/widget/structure/stack/index.ts";

/*################################(TEXTFIELD)################################*/
export function TextField(props: TextInputProps) {
  /***************************(Props)***************************/

  const { className, required, placeholder, disabled, $ref, ...rest } = props;

  const styleProps = {
    format: props.format,
    state: disabled ? "disabled" : (props as any).state,
    size: (props as any).size,
    className,
  } as const;

  /***************************(Render)***************************/
  return (
    <XStack className={iss(TextFieldStyle.wrapper.getStyle({ ...styleProps }))}>
      <input
        type="text"
        required={required || false}
        placeholder={placeholder || "Text Value..."}
        className={iss(TextFieldStyle.field.getStyle({ ...styleProps }))}
        disabled={disabled || false}
        $ref={$ref}
        {...rest}
      />
    </XStack>
  );
}
