import type { TextInputProps } from "../type.ts";
import { iss } from "@in/style";
import { TextFieldStyle } from "./style.ts";
import { XStack } from "@in/widget/structure/stack/index.ts";

/*################################(TEXTFIELD)################################*/
export function TextField(props: TextInputProps) {
  /***************************(Props)***************************/

  const { className, required, placeholder, disabled, $ref, ...rest } = props;

  /***************************(Render)***************************/
  return (
    <XStack
      className={iss(
        TextFieldStyle.wrapper.getStyle({
          className,
          format: props.format,
          size: props.size,
          disabled,
        })
      )}
    >
      <input
        type="text"
        required={required || false}
        placeholder={placeholder || "Text Value..."}
        className={iss(TextFieldStyle.field.getStyle({ className, ...rest }))}
        disabled={disabled || false}
        $ref={$ref}
        {...rest}
      />
    </XStack>
  );
}
