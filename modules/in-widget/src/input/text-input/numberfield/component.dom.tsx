import type { TextInputProps } from "../type.ts";
import { iss } from "@in/style";
import { XStack } from "@in/widget/structure/stack/index.ts";
import { Button, type ButtonProps } from "@in/widget/ornament/button/index.ts";
import { NumberFieldStyle } from "./style.ts";

/*################################(NUMBERFIELD ACTION)################################*/

export function NumberFieldAction(props: ButtonProps) {
  /***************************(Props)***************************/

  const { format, state, size, className, disabled, $ref, ...rest } = props;

  const styleProps = {
    format,
    state: disabled ? "disabled" : state,
    size,
    className,
  } as const;

  /***************************(Render)***************************/
  return (
    <Button
      className={iss(NumberFieldStyle.action.getStyle({ ...styleProps }))}
      title="Unit"
      {...rest}
    >
      PT
    </Button>
  );
}

/*################################(NUMBERFIELD)################################*/
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
        className={iss(NumberFieldStyle.field.getStyle({ ...styleProps }))}
        disabled={disabled || false}
        $ref={$ref}
        {...rest}
      />
      <NumberFieldAction {...props} />
    </XStack>
  );
}
