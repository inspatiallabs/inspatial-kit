import type { TextInputProps } from "../type.ts";
import { TextInputStyle } from "../style.ts";
import { iss } from "@in/style";
import { XStack } from "@in/widget/structure/stack/index.ts";
import { Button } from "@in/widget/ornament/button/index.ts";
import { NumberFieldStyle } from "./style.ts";

/*################################(TEXTFIELD)################################*/
export function NumberField(props: TextInputProps) {
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
      className={iss(NumberFieldStyle.wrapper.getStyle({ ...styleProps }))}
    >
      <input
        type="number"
        required={required || false}
        placeholder={placeholder || "Number Value..."}
        className={iss(TextInputStyle.getStyle({ ...styleProps }))}
        disabled={disabled || false}
        $ref={$ref}
        {...rest}
      />

      <Button
        className={iss(NumberFieldStyle.action.getStyle({ ...styleProps }))}
      >
        PX
      </Button>
    </XStack>
  );
}
